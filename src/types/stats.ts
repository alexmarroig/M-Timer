export interface Stats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  sessionsToday: number;
  weeklyMinutes: number;
  qualifiedSessions: number;
}

export const EMPTY_STATS: Stats = {
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  sessionsToday: 0,
  weeklyMinutes: 0,
  qualifiedSessions: 0,
};

export interface WeeklyGoal {
  targetSessions: number;
  targetMinutes: number;
}

export interface WeeklyGoalProgress {
  goal: WeeklyGoal;
  sessionsCompleted: number;
  minutesCompleted: number;
  sessionsProgress: number; // 0..1
  minutesProgress: number; // 0..1
  level: number;
  levelLabel: string;
  motivationalMessage: string;
}

export interface AchievementProgress {
  id: 'firstSession' | 'firstWeekComplete' | 'streak30Days' | 'sessions100' | 'weeks4Complete';
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  current: number;
  target: number;
  progress: number; // 0..1
}

export interface AntiFraudSummary {
  countedSessions: number;
  blockedSessions: number;
  lastBlockedReason?: string;
}

export interface GamificationSnapshot {
  weeklyGoal: WeeklyGoalProgress;
  achievements: AchievementProgress[];
  antiFraud: AntiFraudSummary;
}
