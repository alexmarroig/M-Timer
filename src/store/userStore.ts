import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserPreferences,
  DEFAULT_PREFERENCES,
  TransitionSound,
  ReminderConfig,
  AmbientTrack,
  ExperienceLevel,
  ThemeId,
} from '../types/user';
import { STORAGE_KEYS } from '../services/storage/keys';

interface UserStore extends UserPreferences {
  setTransitionSound: (sound: TransitionSound) => void;
  setShowTimer: (show: boolean) => void;
  setAmbientEnabled: (enabled: boolean) => void;
  setAmbientTrack: (track: AmbientTrack) => void;
  setAmbientVolume: (volume: number) => void;
  setAmbientMuted: (muted: boolean) => void;
  toggleAmbientMuted: (muted: boolean) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setMorningReminder: (config: ReminderConfig) => void;
  setAfternoonReminder: (config: ReminderConfig) => void;
  setDefaultTemplateId: (id: string) => void;
  completeOnboarding: () => void;
  setActiveTheme: (theme: ThemeId) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      setTransitionSound: (sound) => set({ transitionSound: sound }),
      setShowTimer: (show) => set({ showTimer: show }),
      setAmbientEnabled: (enabled) => set({ ambientEnabled: enabled }),
      setAmbientTrack: (track) => set({ ambientTrack: track }),
      setAmbientVolume: (volume) => set({ ambientVolume: Math.min(1, Math.max(0, volume)) }),
      setAmbientMuted: (muted) => set({ ambientMuted: muted }),
      toggleAmbientMuted: (muted) => set({ ambientMuted: muted }),
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      setMorningReminder: (config) => set({ morningReminder: config }),
      setAfternoonReminder: (config) => set({ afternoonReminder: config }),
      setDefaultTemplateId: (id) => set({ defaultTemplateId: id }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setActiveTheme: (theme) => set({ activeTheme: theme }),
    }),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<UserStore>),
        // Ensure new fields have defaults for existing users
        activeTheme: (persisted as Partial<UserStore>).activeTheme ?? 'natureza',
      }),
    }
  )
);
