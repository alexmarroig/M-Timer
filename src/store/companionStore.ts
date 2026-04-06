import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../services/storage/keys';
import type { Stats } from '../types/stats';
import {
  getMoodFromStats,
  type CompanionMood,
} from '../core/utils/gamification';
import {
  XP_REWARDS,
  getLevelFromXp,
  getXpProgress,
  type CompanionLevel,
} from '../types/companion';

interface CompanionStore {
  xp: number;
  totalSessionsCompleted: number;
  mood: CompanionMood;
  addSessionXp: (currentStreak: number, sessionsToday: number) => void;
  syncMoodFromStats: (stats: Stats) => void;
  getLevel: () => CompanionLevel;
  getXpProgress: () => number;
}

export const useCompanionStore = create<CompanionStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      totalSessionsCompleted: 0,
      mood: 'sleepy',

      addSessionXp: (currentStreak, sessionsToday) => {
        let earned = XP_REWARDS.SESSION_COMPLETE;

        if (currentStreak >= 7) {
          earned += XP_REWARDS.STREAK_BONUS_7;
        } else if (currentStreak >= 3) {
          earned += XP_REWARDS.STREAK_BONUS_3;
        }

        if (sessionsToday >= 2) {
          earned += XP_REWARDS.DOUBLE_SESSION_BONUS;
        }

        set((state) => ({
          xp: state.xp + earned,
          totalSessionsCompleted: state.totalSessionsCompleted + 1,
        }));
      },

      syncMoodFromStats: (stats) => {
        set({
          mood: getMoodFromStats(stats),
        });
      },

      getLevel: () => getLevelFromXp(get().xp),
      getXpProgress: () => getXpProgress(get().xp),
    }),
    {
      name: STORAGE_KEYS.COMPANION,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
