import { useRef, useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { PhaseDuration } from '../../../types/session';
import {
  TimerContext,
  INITIAL_CONTEXT,
} from '../../../services/timerEngine/timerTypes';
import {
  timerTransition,
  isPhaseComplete,
  getPhaseRemaining,
  getTotalElapsed,
  getTotalDuration,
  getPhaseProgress,
} from '../../../services/timerEngine/timerMachine';
import { storageService } from '../../../services/storage/storageService';
import { STORAGE_KEYS } from '../../../services/storage/keys';
import { consumeRestoredTimerState } from '../../../services/timerEngine/timerBootstrap';

const TICK_INTERVAL = 100; // ms - only for UI refresh, not for time calculation

export function useTimerEngine() {
  const [ctx, setCtx] = useState<TimerContext>({ ...INITIAL_CONTEXT });
  const ctxRef = useRef(ctx);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep ref in sync
  ctxRef.current = ctx;

  const dispatch = useCallback((event: Parameters<typeof timerTransition>[1]) => {
    setCtx((prev) => {
      const next = timerTransition(prev, event);
      ctxRef.current = next;
      return next;
    });
  }, []);

  // Persist timer state on phase transitions
  const persistState = useCallback(async (context: TimerContext) => {
    if (context.state === 'idle' || context.state === 'finished') {
      await storageService.remove(STORAGE_KEYS.TIMER_STATE);
    } else {
      await storageService.set(STORAGE_KEYS.TIMER_STATE, context);
    }
  }, []);

  // Start the tick interval
  const startTicking = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      const current = ctxRef.current;
      if (current.state === 'idle' || current.state === 'finished' || current.state === 'paused') {
        return;
      }

      // Check if current phase completed
      if (isPhaseComplete(current)) {
        const nextCtx = timerTransition(current, { type: 'NEXT_PHASE' });
        ctxRef.current = nextCtx;
        setCtx(nextCtx);
        persistState(nextCtx);

        if (nextCtx.state === 'finished') {
          stopTicking();
        }
        return;
      }

      // Force re-render to update displayed time
      setCtx({ ...current });
    }, TICK_INTERVAL);
  }, [persistState]);

  const stopTicking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Public actions
  const start = useCallback((phases: PhaseDuration) => {
    dispatch({ type: 'START', phases });
    startTicking();
  }, [dispatch, startTicking]);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
    persistState(timerTransition(ctxRef.current, { type: 'PAUSE' }));
  }, [dispatch, persistState]);

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' });
    startTicking();
  }, [dispatch, startTicking]);

  const reset = useCallback(() => {
    stopTicking();
    dispatch({ type: 'RESET' });
    storageService.remove(STORAGE_KEYS.TIMER_STATE);
  }, [dispatch, stopTicking]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      const current = ctxRef.current;
      if (nextState === 'active') {
        // Coming back to foreground - timer uses timestamps so no drift
        if (current.state !== 'idle' && current.state !== 'finished' && current.state !== 'paused') {
          // Check if phase(s) completed while in background
          if (isPhaseComplete(current)) {
            let updated = current;
            while (isPhaseComplete(updated) && updated.state !== 'finished') {
              updated = timerTransition(updated, { type: 'NEXT_PHASE' });
            }
            ctxRef.current = updated;
            setCtx(updated);
            persistState(updated);
            if (updated.state !== 'finished') {
              startTicking();
            }
          } else {
            startTicking();
          }
        }
      } else if (nextState === 'background') {
        stopTicking();
        persistState(current);
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [startTicking, stopTicking, persistState]);

  // Restore state on mount
  useEffect(() => {
    (async () => {
      const fromBootstrap = consumeRestoredTimerState();
      const saved = fromBootstrap ?? await storageService.get<TimerContext>(STORAGE_KEYS.TIMER_STATE);

      if (saved && saved.state !== 'idle' && saved.state !== 'finished') {
        ctxRef.current = saved;
        setCtx(saved);
        if (saved.state !== 'paused') {
          // Recalculate - phases may have completed while app was closed
          let updated = saved;
          while (isPhaseComplete(updated) && updated.state !== 'finished') {
            updated = timerTransition(updated, { type: 'NEXT_PHASE' });
          }
          ctxRef.current = updated;
          setCtx(updated);
          if (updated.state !== 'finished') {
            startTicking();
          }
        }
      }
    })();

    return () => stopTicking();
  }, [startTicking, stopTicking]);

  // Derived values
  const phaseRemaining = getPhaseRemaining(ctx);
  const totalElapsed = getTotalElapsed(ctx);
  const totalDuration = getTotalDuration(ctx);
  const phaseProgress = getPhaseProgress(ctx);
  const isActive = ctx.state !== 'idle' && ctx.state !== 'finished';
  const isPaused = ctx.state === 'paused';
  const isFinished = ctx.state === 'finished';

  return {
    state: ctx.state,
    currentPhase: ctx.currentPhase,
    phases: ctx.phases,
    phaseRemaining,
    totalElapsed,
    totalDuration,
    phaseProgress,
    isActive,
    isPaused,
    isFinished,
    sessionStartTimestamp: ctx.sessionStartTimestamp,
    start,
    pause,
    resume,
    reset,
  };
}
