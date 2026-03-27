import { useRef, useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { PHASE_ORDER, PhaseDuration } from '../../../types/session';
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
  isPhaseComplete,
} from '../../../services/timerEngine/timerMachine';
import { storageService } from '../../../services/storage/storageService';
import { STORAGE_KEYS } from '../../../services/storage/keys';

const TICK_INTERVAL = 100;

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
  let phaseIndex = PHASE_ORDER.indexOf(context.currentPhase);

  while (phaseIndex >= 0 && phaseIndex < PHASE_ORDER.length) {
    const phase = PHASE_ORDER[phaseIndex];
    const phaseDurationMs = context.phases[phase] * 1000;

    if (elapsedToConsume < phaseDurationMs) {
      return {
        ...context,
        state: phase,
        currentPhase: phase,
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
  const ctxRef = useRef(ctx);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  ctxRef.current = ctx;

  const persistState = useCallback(async (context: TimerContext) => {
    if (context.state === 'idle' || context.state === 'finished') {
      await storageService.remove(STORAGE_KEYS.TIMER_STATE);
      return;
    }

    await storageService.set(STORAGE_KEYS.TIMER_STATE, context);
  }, []);

  const stopTicking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const dispatch = useCallback((event: Parameters<typeof timerTransition>[1]) => {
    setCtx((previous) => {
      const next = timerTransition(previous, event);
      ctxRef.current = next;
      return next;
    });
  }, []);

  const startTicking = useCallback(() => {
    if (intervalRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const current = ctxRef.current;
      if (current.state === 'idle' || current.state === 'finished' || current.state === 'paused') {
        return;
      }

      if (isPhaseComplete(current)) {
        const nextContext = timerTransition(current, { type: 'NEXT_PHASE' });
        ctxRef.current = nextContext;
        setCtx(nextContext);
        void persistState(nextContext);

        if (nextContext.state === 'finished') {
          stopTicking();
        }
        return;
      }

      setCtx({ ...current });
    }, TICK_INTERVAL);
  }, [persistState, stopTicking]);

  const start = useCallback(
    (phases: PhaseDuration) => {
      dispatch({ type: 'START', phases });
      startTicking();
    },
    [dispatch, startTicking]
  );

  const pause = useCallback(() => {
    const nextContext = timerTransition(ctxRef.current, { type: 'PAUSE' });
    ctxRef.current = nextContext;
    setCtx(nextContext);
    void persistState(nextContext);
    stopTicking();
  }, [persistState, stopTicking]);

  const resume = useCallback(() => {
    const nextContext = timerTransition(ctxRef.current, { type: 'RESUME' });
    ctxRef.current = nextContext;
    setCtx(nextContext);
    void persistState(nextContext);
    startTicking();
  }, [persistState, startTicking]);

  const reset = useCallback(() => {
    stopTicking();
    dispatch({ type: 'RESET' });
    void storageService.remove(STORAGE_KEYS.TIMER_STATE);
  }, [dispatch, stopTicking]);

  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      const current = ctxRef.current;

      if (nextState === 'active') {
        if (current.state !== 'idle' && current.state !== 'finished' && current.state !== 'paused') {
          const updated = reconcileElapsedAcrossPhases(current, Date.now());
          ctxRef.current = updated;
          setCtx(updated);
          void persistState(updated);

          if (updated.state !== 'finished') {
            startTicking();
          }
        }
        return;
      }

      if (nextState === 'background') {
        stopTicking();
        void persistState(current);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppState);
    return () => subscription.remove();
  }, [persistState, startTicking, stopTicking]);

  useEffect(() => {
    void (async () => {
      const saved = await storageService.get<TimerContext>(STORAGE_KEYS.TIMER_STATE);
      if (!saved || saved.state === 'idle' || saved.state === 'finished') {
        return;
      }

      if (saved.state === 'paused') {
        ctxRef.current = saved;
        setCtx(saved);
        return;
      }

      const updated = reconcileElapsedAcrossPhases(saved, Date.now());
      ctxRef.current = updated;
      setCtx(updated);
      await persistState(updated);

      if (updated.state !== 'finished') {
        startTicking();
      }
    })();

    return () => stopTicking();
  }, [persistState, startTicking, stopTicking]);

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
