import { TimerState, SessionPhase } from './session';

export type CompanionMood = 'sleepy' | 'content' | 'happy' | 'ecstatic' | 'sad' | 'neglected';

export type SessionExpression = 'rampUp' | 'core' | 'cooldown' | 'finished' | 'paused' | 'idle';

export interface CompanionLevel {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
}

export const COMPANION_LEVELS: CompanionLevel[] = [
  { level: 1, name: 'Semente', minXp: 0, maxXp: 100 },
  { level: 2, name: 'Broto', minXp: 100, maxXp: 300 },
  { level: 3, name: 'Flor', minXp: 300, maxXp: 600 },
  { level: 4, name: 'Luz', minXp: 600, maxXp: 1000 },
  { level: 5, name: 'Transcendência', minXp: 1000, maxXp: Infinity },
];

export const XP_REWARDS = {
  SESSION_COMPLETE: 20,
  STREAK_BONUS_3: 5,
  STREAK_BONUS_7: 10,
  DOUBLE_SESSION_BONUS: 15,
  RECOVERY_BONUS: 20,
  DECAY_PENALTY: -5,
} as const;

export interface EyeStyle {
  type: 'dot' | 'closed' | 'half' | 'star' | 'side';
}

export interface MouthStyle {
  character: string;
  fontSize: number;
}

export interface FaceExpression {
  leftEye: EyeStyle;
  rightEye: EyeStyle;
  mouth: MouthStyle;
  cheekOpacity: number;
}

export function getMoodFromStreak(streak: number): CompanionMood {
  if (streak === 0) return 'sleepy';
  if (streak <= 3) return 'content';
  if (streak <= 7) return 'happy';
  return 'ecstatic';
}

export function getLevelFromXp(xp: number): CompanionLevel {
  for (let i = COMPANION_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= COMPANION_LEVELS[i].minXp) return COMPANION_LEVELS[i];
  }
  return COMPANION_LEVELS[0];
}

export function getXpProgress(xp: number): number {
  const level = getLevelFromXp(xp);
  if (level.maxXp === Infinity) return 1;
  const range = level.maxXp - level.minXp;
  return (xp - level.minXp) / range;
}

/** Map timer state to session expression */
export function getSessionExpression(
  timerState: TimerState,
  currentPhase: SessionPhase
): SessionExpression {
  if (timerState === 'idle') return 'idle';
  if (timerState === 'paused') return 'paused';
  if (timerState === 'finished') return 'finished';
  return currentPhase;
}

/** Get face expression based on mood + session state */
export function getFaceExpression(
  mood: CompanionMood,
  session: SessionExpression
): FaceExpression {
  // Session expressions override mood
  switch (session) {
    case 'rampUp':
      return {
        leftEye: { type: 'half' },
        rightEye: { type: 'half' },
        mouth: { character: '~', fontSize: 18 },
        cheekOpacity: 0.3,
      };
    case 'core':
      return {
        leftEye: { type: 'closed' },
        rightEye: { type: 'closed' },
        mouth: { character: '‿', fontSize: 16 },
        cheekOpacity: 0.4,
      };
    case 'cooldown':
      return {
        leftEye: { type: 'half' },
        rightEye: { type: 'dot' },
        mouth: { character: '◡', fontSize: 16 },
        cheekOpacity: 0.35,
      };
    case 'finished':
      return {
        leftEye: { type: 'star' },
        rightEye: { type: 'star' },
        mouth: { character: '▽', fontSize: 18 },
        cheekOpacity: 0.6,
      };
    case 'paused':
      return {
        leftEye: { type: 'dot' },
        rightEye: { type: 'side' },
        mouth: { character: '~', fontSize: 16 },
        cheekOpacity: 0.2,
      };
  }

  // Idle: use mood
  switch (mood) {
    case 'sleepy':
      return {
        leftEye: { type: 'half' },
        rightEye: { type: 'half' },
        mouth: { character: '~', fontSize: 16 },
        cheekOpacity: 0.2,
      };
    case 'sad':
      return {
        leftEye: { type: 'half' },
        rightEye: { type: 'half' },
        mouth: { character: '︵', fontSize: 16 },
        cheekOpacity: 0.1,
      };
    case 'neglected':
      return {
        leftEye: { type: 'closed' },
        rightEye: { type: 'closed' },
        mouth: { character: '—', fontSize: 14 },
        cheekOpacity: 0.05,
      };
    case 'content':
      return {
        leftEye: { type: 'dot' },
        rightEye: { type: 'dot' },
        mouth: { character: '◡', fontSize: 16 },
        cheekOpacity: 0.35,
      };
    case 'happy':
      return {
        leftEye: { type: 'dot' },
        rightEye: { type: 'dot' },
        mouth: { character: 'ω', fontSize: 18 },
        cheekOpacity: 0.45,
      };
    case 'ecstatic':
      return {
        leftEye: { type: 'star' },
        rightEye: { type: 'star' },
        mouth: { character: 'ω', fontSize: 20 },
        cheekOpacity: 0.6,
      };
    default:
      return {
        leftEye: { type: 'dot' },
        rightEye: { type: 'dot' },
        mouth: { character: '◡', fontSize: 16 },
        cheekOpacity: 0.35,
      };
  }
}
