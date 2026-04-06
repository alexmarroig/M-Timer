import type { Stats } from '../../types/stats';

export type CompanionMood = 'sleepy' | 'calm' | 'happy' | 'excited';

export interface SessionReward {
  xp: number;
  coins: number;
}

export function getMoodFromStats(stats: Stats): CompanionMood {
  if (stats.sessionsToday >= 2 || stats.currentStreak >= 7) return 'excited';
  if (stats.currentStreak >= 3) return 'happy';
  if (stats.sessionsToday >= 1) return 'calm';
  return 'sleepy';
}

export function calculateSessionReward(
  totalDurationSeconds: number,
  currentStreak: number
): SessionReward {
  const durationMinutes = Math.max(1, Math.round(totalDurationSeconds / 60));
  const streakBonus = Math.min(20, currentStreak * 2);
  const xp = 10 + durationMinutes + streakBonus;
  const coins = 2 + Math.floor(durationMinutes / 5) + Math.floor(currentStreak / 3);

  return { xp, coins };
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 30)) + 1;
}

export function moodWithRewardBoost(
  baseMood: CompanionMood,
  hasRewardToday: boolean
): CompanionMood {
  if (!hasRewardToday) return baseMood;

  if (baseMood === 'sleepy') return 'calm';
  if (baseMood === 'calm') return 'happy';

  return baseMood;
}
