export type TransitionSound = 'bell' | 'vibration' | 'none';

export interface ReminderConfig {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface UserPreferences {
  defaultTemplateId: string | null;
  transitionSound: TransitionSound;
  showTimer: boolean;
  morningReminder: ReminderConfig;
  afternoonReminder: ReminderConfig;
  hasCompletedOnboarding: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultTemplateId: null,
  transitionSound: 'bell',
  showTimer: true,
  morningReminder: { enabled: false, hour: 7, minute: 0 },
  afternoonReminder: { enabled: false, hour: 17, minute: 0 },
  hasCompletedOnboarding: false,
};
