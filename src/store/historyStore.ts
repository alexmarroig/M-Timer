import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'uuid';
import { SessionInstance, PhaseDuration } from '../types/session';
import { Stats, EMPTY_STATS } from '../types/stats';
import { toDateKey, startOfWeek, calculateStreak } from '../core/utils/date';
import { STORAGE_KEYS } from '../services/storage/keys';

interface HistoryStore {
  sessions: SessionInstance[];
  addSession: (params: {
    templateId: string;
    templateName: string;
    phases: PhaseDuration;
    startedAt: number; // timestamp
    completed: boolean;
  }) => void;
  getStats: () => Stats;
  getSessionDates: () => string[]; // YYYY-MM-DD keys with sessions
  getSessionsByDate: (dateKey: string) => SessionInstance[];
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: ({ templateId, templateName, phases, startedAt, completed }) => {
        const now = new Date();
        const totalDuration = phases.rampUp + phases.core + phases.cooldown;
        const session: SessionInstance = {
          id: uuid(),
          templateId,
          templateName,
          phases,
          startedAt: new Date(startedAt).toISOString(),
          completedAt: now.toISOString(),
          totalDuration,
          completed,
        };
        set((s) => ({
          sessions: [session, ...s.sessions],
        }));
      },

      getStats: () => {
        const { sessions } = get();
        if (sessions.length === 0) return { ...EMPTY_STATS };

        const today = toDateKey();
        const weekStart = startOfWeek();

        const sessionsToday = sessions.filter(
          (s) => toDateKey(new Date(s.completedAt)) === today
        ).length;

        const weeklyMinutes = sessions
          .filter((s) => new Date(s.completedAt) >= weekStart)
          .reduce((sum, s) => sum + s.totalDuration, 0) / 60;

        const totalMinutes = sessions.reduce((sum, s) => sum + s.totalDuration, 0) / 60;

        // Get unique dates sorted descending
        const uniqueDates = [...new Set(
          sessions.map((s) => toDateKey(new Date(s.completedAt)))
        )].sort((a, b) => b.localeCompare(a));

        const currentStreak = calculateStreak(uniqueDates);

        // Calculate longest streak by trying all starting positions
        let longestStreak = currentStreak;
        for (let i = 0; i < uniqueDates.length; i++) {
          let streak = 1;
          for (let j = i + 1; j < uniqueDates.length; j++) {
            const prev = new Date(uniqueDates[j - 1]);
            const curr = new Date(uniqueDates[j]);
            const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
            if (diff === 1) streak++;
            else break;
          }
          longestStreak = Math.max(longestStreak, streak);
        }

        return {
          totalSessions: sessions.length,
          totalMinutes: Math.round(totalMinutes),
          currentStreak,
          longestStreak,
          sessionsToday,
          weeklyMinutes: Math.round(weeklyMinutes),
        };
      },

      getSessionDates: () => {
        const { sessions } = get();
        return [...new Set(
          sessions.map((s) => toDateKey(new Date(s.completedAt)))
        )].sort((a, b) => b.localeCompare(a));
      },

      getSessionsByDate: (dateKey) => {
        const { sessions } = get();
        return sessions.filter(
          (s) => toDateKey(new Date(s.completedAt)) === dateKey
        );
      },
    }),
    {
      name: STORAGE_KEYS.SESSION_HISTORY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
