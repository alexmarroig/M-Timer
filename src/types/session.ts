export type SessionPhase = 'rampUp' | 'core' | 'cooldown';

export type TimerState = 'idle' | 'rampUp' | 'core' | 'cooldown' | 'paused' | 'finished';

export interface PhaseDuration {
  rampUp: number;
  core: number;
  cooldown: number;
}

export interface SessionTemplate {
  id: string;
  name: string;
  phases: PhaseDuration;
  isDefault: boolean;
  createdAt: string;
}

export interface SessionInstance {
  id: string;
  templateId: string;
  templateName: string;
  phases: PhaseDuration;
  startedAt: string;
  completedAt: string;
  totalDuration: number;
  completed: boolean;
  countsForProgress: boolean;
  progressBlockedReason?: 'incomplete' | 'tooShort' | 'rapidRepeat' | 'dailyLimit';
}

export const PHASE_LABELS: Record<SessionPhase, string> = {
  rampUp: 'Entrada',
  core: 'Meditação',
  cooldown: 'Saída',
};

export const PHASE_ORDER: SessionPhase[] = ['rampUp', 'core', 'cooldown'];

export const DEFAULT_PHASES: PhaseDuration = {
  rampUp: 120,
  core: 1200,
  cooldown: 180,
};
