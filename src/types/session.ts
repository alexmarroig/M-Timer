export type SessionPhase = 'rampUp' | 'core' | 'cooldown';

export type TimerState = 'idle' | 'rampUp' | 'core' | 'cooldown' | 'paused' | 'finished';

export interface PhaseDuration {
  rampUp: number;   // seconds
  core: number;     // seconds
  cooldown: number; // seconds
}

export interface SessionTemplate {
  id: string;
  name: string;
  phases: PhaseDuration;
  isDefault: boolean;
  createdAt: string; // ISO
}

export interface SessionInstance {
  id: string;
  templateId: string;
  templateName: string;
  phases: PhaseDuration;
  startedAt: string;  // ISO
  completedAt: string; // ISO
  totalDuration: number; // seconds
  completed: boolean;
}

export const PHASE_LABELS: Record<SessionPhase, string> = {
  rampUp: 'Entrada',
  core: 'Meditação',
  cooldown: 'Saída',
};

export const PHASE_ORDER: SessionPhase[] = ['rampUp', 'core', 'cooldown'];

export const DEFAULT_PHASES: PhaseDuration = {
  rampUp: 120,    // 2 min
  core: 1200,     // 20 min
  cooldown: 180,  // 3 min
};
