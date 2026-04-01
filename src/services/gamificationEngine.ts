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
  { minXp: 50, label: 'Stabilizing', tier: 'stabilizing' },
  { minXp: 125, label: 'Deepening', tier: 'deepening' },
  { minXp: 250, label: 'Consistent', tier: 'consistent' },
  { minXp: 400, label: 'Integrated', tier: 'integrated' },
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

function getXpTotalFromSessions(sessions: SessionInstance[]): number {
  const completedSessions = sessions
    .filter((session) => session.completed)
    .sort(
      (left, right) =>
        new Date(left.completedAt).getTime() - new Date(right.completedAt).getTime()
    );

  let xpTotal = 0;
  let previousDateKey: string | null = null;
  let currentStreak = 0;
  let sessionsToday = 0;

  for (const session of completedSessions) {
    const dateKey = toDateKey(new Date(session.completedAt));

    if (dateKey !== previousDateKey) {
      sessionsToday = 0;

      if (!previousDateKey) {
        currentStreak = 1;
      } else if (areConsecutiveDateKeys(dateKey, previousDateKey)) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    }

    xpTotal += calculateSessionXp({
      currentStreak,
      sessionsTodayBeforeCompletion: sessionsToday,
    });

    sessionsToday += 1;
    previousDateKey = dateKey;
  }

  return xpTotal;
}

export function deriveGamificationProfile({
  sessions,
  stats,
}: {
  sessions: SessionInstance[];
  stats: Stats;
}): GamificationProfile {
  const xpTotal = getXpTotalFromSessions(sessions);
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
