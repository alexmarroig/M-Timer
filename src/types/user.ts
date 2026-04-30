export type TransitionSound = 'bell' | 'bowl' | 'soft-bell' | 'vibration' | 'none';
export type AmbientTrack = 'rain' | 'wind' | 'ambient' | 'forest' | 'waves' | 'binaural_alpha';
export type ExperienceLevel = 'beginner' | 'regular' | 'experienced';

export interface ReminderConfig {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface UserPreferences {
  defaultTemplateId: string | null;
  transitionSound: TransitionSound;
  showTimer: boolean;
  ambientEnabled: boolean;
  ambientTrack: AmbientTrack;
  ambientVolume: number;
  ambientMuted: boolean;
  experienceLevel: ExperienceLevel;
  morningReminder: ReminderConfig;
  afternoonReminder: ReminderConfig;
  hasCompletedOnboarding: boolean;
}

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  beginner: 'Iniciante',
  regular: 'Regular',
  experienced: 'Experiente',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultTemplateId: null,
  transitionSound: 'bell',
  showTimer: true,
  ambientEnabled: true,
  ambientTrack: 'ambient',
  ambientVolume: 0.28,
  ambientMuted: false,
  experienceLevel: 'regular',
  morningReminder: { enabled: false, hour: 7, minute: 0 },
  afternoonReminder: { enabled: false, hour: 17, minute: 0 },
  hasCompletedOnboarding: false,
};
