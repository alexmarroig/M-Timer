export interface Stats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  sessionsToday: number;
  weeklyMinutes: number;
}

export const EMPTY_STATS: Stats = {
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  sessionsToday: 0,
  weeklyMinutes: 0,
};
