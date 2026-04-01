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
import { STORAGE_KEYS } from '../services/storage/keys';
import type { Stats } from '../types/stats';
import {
  calculateSessionReward,
  getMoodFromStats,
  levelFromXp,
  type CompanionMood,
} from '../core/utils/gamification';
import { toDateKey } from '../core/utils/date';

interface CompanionStore {
  mood: CompanionMood;
  xp: number;
  level: number;
  coins: number;
  lastRewardXp: number;
  lastRewardCoins: number;
  lastRewardDate: string | null;
  grantSessionReward: (totalDurationSeconds: number, currentStreak: number) => void;
  syncMoodFromStats: (stats: Stats) => void;
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
    (set) => ({
      mood: 'sleepy',
      xp: 0,
      level: 1,
      coins: 0,
      lastRewardXp: 0,
      lastRewardCoins: 0,
      lastRewardDate: null,

      grantSessionReward: (totalDurationSeconds, currentStreak) => {
        const reward = calculateSessionReward(totalDurationSeconds, currentStreak);
        set((s) => {
          const nextXp = s.xp + reward.xp;
          return {
            xp: nextXp,
            level: levelFromXp(nextXp),
            coins: s.coins + reward.coins,
            mood: currentStreak >= 7 ? 'excited' : 'happy',
            lastRewardXp: reward.xp,
            lastRewardCoins: reward.coins,
            lastRewardDate: toDateKey(),
          };
        });
      },

      syncMoodFromStats: (stats) => {
        set(() => ({
          mood: getMoodFromStats(stats),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.COMPANION,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
