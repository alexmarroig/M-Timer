import { PHASE_ORDER, SessionPhase } from '../../types/session';
import { TimerContext, TimerEvent, INITIAL_CONTEXT } from './timerTypes';

/**
 * Pure state machine for the 3-phase timer.
 * No side effects - just takes current context + event and returns new context.
 */
export function timerTransition(ctx: TimerContext, event: TimerEvent): TimerContext {
  switch (event.type) {
    case 'START': {
      const now = Date.now();
      return {
        ...ctx,
        state: 'rampUp',
        phases: event.phases,
        currentPhase: 'rampUp',
        phaseStartTimestamp: now,
        phaseElapsedBeforePause: 0,
        completedPhasesElapsed: 0,
        sessionStartTimestamp: now,
        stateBeforePause: null,
      };
    }

    case 'PAUSE': {
      if (ctx.state === 'idle' || ctx.state === 'finished' || ctx.state === 'paused') {
        return ctx;
      }
      const elapsed = Date.now() - ctx.phaseStartTimestamp;
      return {
        ...ctx,
        state: 'paused',
        stateBeforePause: ctx.state,
        phaseElapsedBeforePause: ctx.phaseElapsedBeforePause + elapsed,
        phaseStartTimestamp: 0,
      };
    }

    case 'RESUME': {
      if (ctx.state !== 'paused' || !ctx.stateBeforePause) return ctx;
      return {
        ...ctx,
        state: ctx.stateBeforePause,
        phaseStartTimestamp: Date.now(),
        stateBeforePause: null,
      };
    }

    case 'NEXT_PHASE': {
      const currentIndex = PHASE_ORDER.indexOf(ctx.currentPhase);
      if (currentIndex >= PHASE_ORDER.length - 1) {
        // Last phase done -> finished
        return {
          ...ctx,
          state: 'finished',
          completedPhasesElapsed:
            ctx.completedPhasesElapsed + ctx.phases[ctx.currentPhase] * 1000,
          phaseStartTimestamp: 0,
          phaseElapsedBeforePause: 0,
        };
      }
      const nextPhase = PHASE_ORDER[currentIndex + 1];
      return {
        ...ctx,
        state: nextPhase as 'core' | 'cooldown',
        currentPhase: nextPhase,
        phaseStartTimestamp: Date.now(),
        phaseElapsedBeforePause: 0,
        completedPhasesElapsed:
          ctx.completedPhasesElapsed + ctx.phases[ctx.currentPhase] * 1000,
      };
    }

    case 'COMPLETE': {
      return {
        ...ctx,
        state: 'finished',
        completedPhasesElapsed:
          ctx.completedPhasesElapsed + ctx.phases[ctx.currentPhase] * 1000,
        phaseStartTimestamp: 0,
        phaseElapsedBeforePause: 0,
      };
    }

    case 'RESET': {
      return { ...INITIAL_CONTEXT };
    }

    case 'TICK': {
      // Tick doesn't change state machine, just used to trigger UI updates
      return ctx;
    }

    default:
      return ctx;
  }
}

/** Get elapsed time in the current phase (ms) */
export function getPhaseElapsed(ctx: TimerContext): number {
  if (ctx.state === 'idle' || ctx.state === 'finished') return 0;
  if (ctx.state === 'paused') return ctx.phaseElapsedBeforePause;
  const activeElapsed = Date.now() - ctx.phaseStartTimestamp;
  return ctx.phaseElapsedBeforePause + activeElapsed;
}

/** Get remaining time in the current phase (seconds) */
export function getPhaseRemaining(ctx: TimerContext): number {
  const phaseDurationMs = ctx.phases[ctx.currentPhase] * 1000;
  const elapsed = getPhaseElapsed(ctx);
  return Math.max(0, Math.ceil((phaseDurationMs - elapsed) / 1000));
}

/** Get total elapsed across all phases (seconds) */
export function getTotalElapsed(ctx: TimerContext): number {
  const completed = ctx.completedPhasesElapsed;
  const current = getPhaseElapsed(ctx);
  return Math.floor((completed + current) / 1000);
}

/** Get total session duration (seconds) */
export function getTotalDuration(ctx: TimerContext): number {
  return ctx.phases.rampUp + ctx.phases.core + ctx.phases.cooldown;
}

/** Check if current phase has completed */
export function isPhaseComplete(ctx: TimerContext): boolean {
  if (ctx.state === 'idle' || ctx.state === 'finished' || ctx.state === 'paused') return false;
  const phaseDurationMs = ctx.phases[ctx.currentPhase] * 1000;
  return getPhaseElapsed(ctx) >= phaseDurationMs;
}

/** Get progress (0-1) for each phase */
export function getPhaseProgress(ctx: TimerContext): Record<SessionPhase, number> {
  const result: Record<SessionPhase, number> = { rampUp: 0, core: 0, cooldown: 0 };
  const currentIndex = PHASE_ORDER.indexOf(ctx.currentPhase);

  for (let i = 0; i < PHASE_ORDER.length; i++) {
    const phase = PHASE_ORDER[i];
    if (i < currentIndex) {
      result[phase] = 1;
    } else if (i === currentIndex && ctx.state !== 'idle') {
      const phaseDurationMs = ctx.phases[phase] * 1000;
      if (phaseDurationMs === 0) {
        result[phase] = 1;
      } else {
        result[phase] = Math.min(1, getPhaseElapsed(ctx) / phaseDurationMs);
      }
    }
  }

  if (ctx.state === 'finished') {
    result.rampUp = 1;
    result.core = 1;
    result.cooldown = 1;
  }

  return result;
}
