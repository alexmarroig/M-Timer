import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../services/storage/keys';
import { scheduleSmartNotifications } from '../services/notifications/engagementEngine';
import type { Stats } from '../types/stats';
import {
  XP_REWARDS,
  COMPANION_LEVELS,
  getLevelFromXp,
  getXpProgress,
  type CompanionLevel,
  type CompanionMood,
} from '../types/companion';

interface CompanionStore {
  xp: number;
  totalSessionsCompleted: number;
  mood: CompanionMood;
  lastMeditationAt: string | null;
  addSessionXp: (currentStreak: number, sessionsToday: number) => void;
  syncMoodFromStats: (stats: Stats) => void;
  getLevel: () => CompanionLevel;
  getXpProgress: () => number;
  applyDecay: () => void;
}

export const useCompanionStore = create<CompanionStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      totalSessionsCompleted: 0,
      mood: 'sleepy',
      lastMeditationAt: null,

      addSessionXp: (currentStreak, sessionsToday) => {
        const { lastMeditationAt, xp } = get();
        let earned = XP_REWARDS.SESSION_COMPLETE;

        if (lastMeditationAt) {
          const hoursSince = (Date.now() - new Date(lastMeditationAt).getTime()) / (1000 * 60 * 60);
          if (hoursSince >= 72) {
            earned += XP_REWARDS.RECOVERY_BONUS;
          }
        }

        if (currentStreak >= 7) {
          earned += XP_REWARDS.STREAK_BONUS_7;
        } else if (currentStreak >= 3) {
          earned += XP_REWARDS.STREAK_BONUS_3;
        }

        if (sessionsToday >= 2) {
          earned += XP_REWARDS.DOUBLE_SESSION_BONUS;
        }

        const newXp = Math.max(0, xp + earned);
        const newLevel = getLevelFromXp(newXp);
        const nextLevelDef = COMPANION_LEVELS.find((l) => l.level === newLevel.level + 1) ?? null;

        set({
          xp: newXp,
          totalSessionsCompleted: get().totalSessionsCompleted + 1,
          lastMeditationAt: new Date().toISOString(),
          mood: 'happy',
        });

        // Schedule smart re-engagement notifications
        // Right after a session the user is active → notifications fire when they become at_risk
        void scheduleSmartNotifications({
          hoursSinceLastSession: 0,
          daysSince: 0,
          currentStreak,
          bestStreak: currentStreak,
          totalMinutes: Math.round(newXp * 2),
          xpToNextLevel: nextLevelDef ? nextLevelDef.minXp - newXp : 0,
          nextLevelLabel: nextLevelDef ? nextLevelDef.name : null,
        });
      },

      syncMoodFromStats: (stats) => {
        const { lastMeditationAt } = get();

        if (lastMeditationAt) {
          const hoursSince = (Date.now() - new Date(lastMeditationAt).getTime()) / (1000 * 60 * 60);
          if (hoursSince >= 72) {
            set({ mood: 'neglected' });
            return;
          }
          if (hoursSince >= 48) {
            set({ mood: 'sad' });
            return;
          }
        }

        if (stats.sessionsToday >= 2 || stats.currentStreak >= 7) {
          set({ mood: 'ecstatic' });
        } else if (stats.currentStreak >= 3) {
          set({ mood: 'happy' });
        } else if (stats.sessionsToday >= 1) {
          set({ mood: 'content' });
        } else {
          set({ mood: 'sleepy' });
        }
      },

      applyDecay: () => {
        const { lastMeditationAt, xp } = get();
        if (!lastMeditationAt) return;

        const hoursSince = (Date.now() - new Date(lastMeditationAt).getTime()) / (1000 * 60 * 60);

        if (hoursSince >= 72) {
          const daysOver = Math.floor((hoursSince - 72) / 24) + 1;
          const penalty = daysOver * Math.abs(XP_REWARDS.DECAY_PENALTY);

          set({
            xp: Math.max(0, xp - penalty),
            mood: hoursSince >= 120 ? 'neglected' : 'sad',
          });
        }
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
