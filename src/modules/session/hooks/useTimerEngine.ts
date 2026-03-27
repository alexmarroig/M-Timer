import { useRef, useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { PHASE_ORDER } from '../../../types/session';
import { PhaseDuration } from '../../../types/session';
import {
  TimerContext,
  INITIAL_CONTEXT,
} from '../../../services/timerEngine/timerTypes';
import {
  timerTransition,
  getPhaseRemaining,
  getTotalElapsed,
  getTotalDuration,
  getPhaseProgress,
} from '../../../services/timerEngine/timerMachine';
import { storageService } from '../../../services/storage/storageService';
import { STORAGE_KEYS } from '../../../services/storage/keys';
import { useUserStore } from '../../../store/userStore';
import { triggerTransitionFeedback } from '../../../services/feedback/transitionFeedback';

const TICK_INTERVAL = 100; // ms - only for UI refresh, not for time calculation

function reconcileElapsedAcrossPhases(context: TimerContext, now: number): TimerContext {
  if (
    context.state === 'idle' ||
    context.state === 'finished' ||
    context.state === 'paused' ||
    context.phaseStartTimestamp <= 0
  ) {
    return context;
  }

  const activeElapsed = Math.max(0, now - context.phaseStartTimestamp);
  let elapsedToConsume = context.phaseElapsedBeforePause + activeElapsed;
  let completedPhasesElapsed = context.completedPhasesElapsed;
  let currentPhase = context.currentPhase;
  let phaseIndex = PHASE_ORDER.indexOf(currentPhase);

  while (phaseIndex >= 0 && phaseIndex < PHASE_ORDER.length) {
    const phase = PHASE_ORDER[phaseIndex];
    const phaseDurationMs = context.phases[phase] * 1000;

    if (elapsedToConsume < phaseDurationMs) {
      currentPhase = phase;
      return {
        ...context,
        state: phase as TimerContext['state'],
        currentPhase,
        completedPhasesElapsed,
        phaseStartTimestamp: now - elapsedToConsume,
        phaseElapsedBeforePause: 0,
        stateBeforePause: null,
      };
    }

    elapsedToConsume -= phaseDurationMs;
    completedPhasesElapsed += phaseDurationMs;
    phaseIndex += 1;
  }

  return {
    ...context,
    state: 'finished',
    currentPhase: PHASE_ORDER[PHASE_ORDER.length - 1],
    completedPhasesElapsed,
    phaseStartTimestamp: 0,
    phaseElapsedBeforePause: 0,
    stateBeforePause: null,
  };
}

export function useTimerEngine() {
  const [ctx, setCtx] = useState<TimerContext>({ ...INITIAL_CONTEXT });
  const transitionSound = useUserStore((state) => state.transitionSound);
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

  const transitionToNextPhase = useCallback((context: TimerContext): TimerContext => {
    const next = timerTransition(context, { type: 'NEXT_PHASE' });
    void triggerTransitionFeedback(transitionSound);
    return next;
  }, [transitionSound]);

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

      const reconciled = reconcileElapsedAcrossPhases(current, Date.now());
      const hasStateChange =
        reconciled.state !== current.state ||
        reconciled.currentPhase !== current.currentPhase ||
        reconciled.completedPhasesElapsed !== current.completedPhasesElapsed;

      if (hasStateChange) {
        ctxRef.current = reconciled;
        setCtx(reconciled);
        persistState(reconciled);
        if (reconciled.state === 'finished') {
      // Check if current phase completed
      if (isPhaseComplete(current)) {
        const nextCtx = transitionToNextPhase(current);
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
  }, [persistState, transitionToNextPhase]);

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
          const updated = reconcileElapsedAcrossPhases(current, Date.now());
          ctxRef.current = updated;
          setCtx(updated);
          persistState(updated);
          if (updated.state !== 'finished') {
          // Check if phase(s) completed while in background
          if (isPhaseComplete(current)) {
            let updated = current;
            while (isPhaseComplete(updated) && updated.state !== 'finished') {
              updated = transitionToNextPhase(updated);
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
  }, [startTicking, stopTicking, persistState, transitionToNextPhase]);

  // Restore state on mount
  useEffect(() => {
    (async () => {
      const saved = await storageService.get<TimerContext>(STORAGE_KEYS.TIMER_STATE);
      if (saved && saved.state !== 'idle' && saved.state !== 'finished') {
        if (saved.state !== 'paused') {
          // Reconcile elapsed real time since persisted phaseStartTimestamp
          const updated = reconcileElapsedAcrossPhases(saved, Date.now());
          // Recalculate - phases may have completed while app was closed
          let updated = saved;
          while (isPhaseComplete(updated) && updated.state !== 'finished') {
            updated = transitionToNextPhase(updated);
          }
          ctxRef.current = updated;
          setCtx(updated);
          persistState(updated);
          if (updated.state !== 'finished') {
            startTicking();
          }
        } else {
          ctxRef.current = saved;
          setCtx(saved);
        }
      }
    })();

    return () => stopTicking();
  }, [startTicking, stopTicking, transitionToNextPhase]);

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
