import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../services/storage/keys';
import { notificationService } from '../services/notifications/notificationService';
import type { Stats } from '../types/stats';
import {
  XP_REWARDS,
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

const INTERVENTION_IDS = {
  H48: 'intervention-48h',
  H72: 'intervention-72h',
  D5: 'intervention-5d',
};

export const useCompanionStore = create<CompanionStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      totalSessionsCompleted: 0,
      mood: 'sleepy',
      lastMeditationAt: null,

      addSessionXp: (currentStreak, sessionsToday) => {
        const { lastMeditationAt } = get();
        let earned = XP_REWARDS.SESSION_COMPLETE;

        // Recovery Bonus
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

        set((state) => ({
          xp: Math.max(0, state.xp + earned),
          totalSessionsCompleted: state.totalSessionsCompleted + 1,
          lastMeditationAt: new Date().toISOString(),
          mood: 'happy', // Instant mood reset on meditation
        }));

        // Reset interventions
        void notificationService.cancelReminder(INTERVENTION_IDS.H48);
        void notificationService.cancelReminder(INTERVENTION_IDS.H72);
        void notificationService.cancelReminder(INTERVENTION_IDS.D5);

        // Schedule new ones
        void notificationService.scheduleIntervention(
          INTERVENTION_IDS.H48,
          'Estou começando a sentir sono...',
          'Vamos meditar um pouco?',
          48 * 3600
        );
        void notificationService.scheduleIntervention(
          INTERVENTION_IDS.H72,
          'Me sinto um pouco triste hoje.',
          'Sinto falta da nossa prática.',
          72 * 3600
        );
        void notificationService.scheduleIntervention(
          INTERVENTION_IDS.D5,
          'Onde você está?',
          'Minha luz está enfraquecendo...',
          5 * 24 * 3600
        );
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
          // Decay -5 XP for every 24h past the 72h threshold
          const daysOver = Math.floor((hoursSince - 72) / 24) + 1;
          const penalty = daysOver * Math.abs(XP_REWARDS.DECAY_PENALTY);

          set({
            xp: Math.max(0, xp - penalty),
            mood: hoursSince >= 120 ? 'neglected' : 'sad'
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
