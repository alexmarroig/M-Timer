import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { XP_REWARDS, getLevelFromXp, getXpProgress, CompanionLevel } from '../types/companion';

interface CompanionStore {
  xp: number;
  totalSessionsCompleted: number;

  addSessionXp: (currentStreak: number, sessionsToday: number) => void;
  getLevel: () => CompanionLevel;
  getXpProgress: () => number;
}

export const useCompanionStore = create<CompanionStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      totalSessionsCompleted: 0,

      addSessionXp: (currentStreak: number, sessionsToday: number) => {
        let earned = XP_REWARDS.SESSION_COMPLETE;

        if (currentStreak >= 7) {
          earned += XP_REWARDS.STREAK_BONUS_7;
        } else if (currentStreak >= 3) {
          earned += XP_REWARDS.STREAK_BONUS_3;
        }

        // Double session bonus: completing the 2nd session of the day
        if (sessionsToday >= 2) {
          earned += XP_REWARDS.DOUBLE_SESSION_BONUS;
        }

        set((s) => ({
          xp: s.xp + earned,
          totalSessionsCompleted: s.totalSessionsCompleted + 1,
        }));
      },

      getLevel: () => getLevelFromXp(get().xp),
      getXpProgress: () => getXpProgress(get().xp),
    }),
    {
      name: '@mtimer/companion',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
