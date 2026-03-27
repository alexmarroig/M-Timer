import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, DEFAULT_PREFERENCES, TransitionSound, ReminderConfig } from '../types/user';
import { STORAGE_KEYS } from '../services/storage/keys';

interface UserStore extends UserPreferences {
  setTransitionSound: (sound: TransitionSound) => void;
  setShowTimer: (show: boolean) => void;
  setMorningReminder: (config: ReminderConfig) => void;
  setAfternoonReminder: (config: ReminderConfig) => void;
  setDefaultTemplateId: (id: string) => void;
  completeOnboarding: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      setTransitionSound: (sound) => set({ transitionSound: sound }),
      setShowTimer: (show) => set({ showTimer: show }),
      setMorningReminder: (config) => set({ morningReminder: config }),
      setAfternoonReminder: (config) => set({ afternoonReminder: config }),
      setDefaultTemplateId: (id) => set({ defaultTemplateId: id }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
