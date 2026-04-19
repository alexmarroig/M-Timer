import { areConsecutiveDateKeys, toDateKey } from '../core/utils/date';
import type { SessionInstance } from '../types/session';
import type { Stats } from '../types/stats';

export type EvolutionTier =
  | 'beginner'
  | 'stabilizing'
  | 'deepening'
  | 'consistent'
  | 'integrated';

export type LevelLabel =
  | 'Beginner'
  | 'Stabilizing'
  | 'Deepening'
  | 'Consistent'
  | 'Integrated';

export interface SessionXpInput {
  currentStreak: number;
  sessionsTodayBeforeCompletion: number;
}

export interface GamificationProfile {
  xpTotal: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
  progressWithinLevel: number;
  currentLevel: number;
  levelLabel: LevelLabel;
  nextLevelLabel: LevelLabel | null;
  bestStreak: number;
  streakMultiplier: number;
  evolutionTier: EvolutionTier;
  totalSessions: number;
  totalMinutes: number;
  sessionsToday: number;
}

const LEVEL_DEFINITIONS = [
  { minXp: 0, label: 'Beginner', tier: 'beginner' },
  { minXp: 100, label: 'Stabilizing', tier: 'stabilizing' },
  { minXp: 300, label: 'Deepening', tier: 'deepening' },
  { minXp: 600, label: 'Consistent', tier: 'consistent' },
  { minXp: 1000, label: 'Integrated', tier: 'integrated' },
] as const satisfies ReadonlyArray<{
  minXp: number;
  label: LevelLabel;
  tier: EvolutionTier;
}>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getStreakMultiplier(currentStreak: number): number {
  return Math.min(1.5, 1 + Math.min(currentStreak, 10) * 0.05);
}

export function calculateSessionXp({
  currentStreak,
  sessionsTodayBeforeCompletion,
}: SessionXpInput): number {
  const streakMultiplier = getStreakMultiplier(currentStreak);
  const sameDayBonus = sessionsTodayBeforeCompletion === 1 ? 5 : 0;
  return Math.round(10 * streakMultiplier) + sameDayBonus;
}

function getLevelIndexForXp(xpTotal: number): number {
  for (let index = LEVEL_DEFINITIONS.length - 1; index >= 0; index -= 1) {
    if (xpTotal >= LEVEL_DEFINITIONS[index].minXp) {
      return index;
    }
  }

  return 0;
}

export function deriveGamificationProfile({
  stats,
  xpOverride,
}: {
  sessions: SessionInstance[];
  stats: Stats;
  xpOverride?: number;
}): GamificationProfile {
  // If no override provided, we can't calculate XP from sessions easily anymore
  // because of decay logic, so we expect the caller (hook) to provide the store XP.
  const xpTotal = xpOverride ?? 0;
  const levelIndex = getLevelIndexForXp(xpTotal);
  const currentLevelDefinition = LEVEL_DEFINITIONS[levelIndex];
  const nextLevelDefinition = LEVEL_DEFINITIONS[levelIndex + 1] ?? null;
  const xpIntoLevel = xpTotal - currentLevelDefinition.minXp;
  const xpToNextLevel = nextLevelDefinition ? nextLevelDefinition.minXp - xpTotal : 0;
  const currentLevelSpan = nextLevelDefinition
    ? nextLevelDefinition.minXp - currentLevelDefinition.minXp
    : Math.max(50, xpIntoLevel || 50);

  return {
    xpTotal,
    xpIntoLevel,
    xpToNextLevel,
    progressWithinLevel: clamp(xpIntoLevel / currentLevelSpan, 0, 1),
    currentLevel: levelIndex + 1,
    levelLabel: currentLevelDefinition.label,
    nextLevelLabel: nextLevelDefinition?.label ?? null,
    bestStreak: stats.longestStreak,
    streakMultiplier: getStreakMultiplier(stats.currentStreak),
    evolutionTier: currentLevelDefinition.tier,
    totalSessions: stats.totalSessions,
    totalMinutes: stats.totalMinutes,
    sessionsToday: stats.sessionsToday,
  };
}
