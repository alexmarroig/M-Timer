import { SessionPhase, TimerState, PhaseDuration } from '../../types/session';

export type TimerEvent =
  | { type: 'START'; phases: PhaseDuration }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'TICK' }
  | { type: 'NEXT_PHASE' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' };

export interface TimerContext {
  state: TimerState;
  phases: PhaseDuration;
  currentPhase: SessionPhase;
  /** Timestamp (ms) when the current phase started or resumed */
  phaseStartTimestamp: number;
  /** Accumulated elapsed time (ms) in the current phase before any pause */
  phaseElapsedBeforePause: number;
  /** Total elapsed in the session (ms), excluding current phase active time */
  completedPhasesElapsed: number;
  /** When the session was first started */
  sessionStartTimestamp: number;
  /** The state before pausing (to restore on resume) */
  stateBeforePause: TimerState | null;
}

export const INITIAL_CONTEXT: TimerContext = {
  state: 'idle',
  phases: { rampUp: 0, core: 0, cooldown: 0 },
  currentPhase: 'rampUp',
  phaseStartTimestamp: 0,
  phaseElapsedBeforePause: 0,
  completedPhasesElapsed: 0,
  sessionStartTimestamp: 0,
  stateBeforePause: null,
};
