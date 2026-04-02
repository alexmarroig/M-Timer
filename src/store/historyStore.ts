import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'uuid';
import { SessionInstance, PhaseDuration } from '../types/session';
import { Stats, EMPTY_STATS } from '../types/stats';
import {
  toDateKey,
  startOfWeek,
  calculateStreak,
  areConsecutiveDateKeys,
} from '../core/utils/date';
import { STORAGE_KEYS } from '../services/storage/keys';

interface HistoryStore {
  sessions: SessionInstance[];
  addSession: (params: {
    templateId: string;
    templateName: string;
    phases: PhaseDuration;
    startedAt: number;
    completed: boolean;
  }) => void;
  getStats: () => Stats;
  getSessionDates: () => string[];
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
          countsForProgress: completed,
          progressBlockedReason: completed ? undefined : 'incomplete',
        };

        set((state) => ({
          sessions: [session, ...state.sessions],
        }));
      },

      getStats: () => {
        const { sessions } = get();
        if (sessions.length === 0) {
          return { ...EMPTY_STATS };
        }

        const countedSessions = sessions.filter((session) => session.countsForProgress);
        if (countedSessions.length === 0) {
          return {
            ...EMPTY_STATS,
            totalSessions: sessions.length,
            qualifiedSessions: 0,
          };
        }

        const today = toDateKey();
        const weekStart = startOfWeek();

        const sessionsToday = countedSessions.filter(
          (session) => toDateKey(new Date(session.completedAt)) === today
        ).length;

        const weeklyMinutes =
          countedSessions
            .filter((session) => new Date(session.completedAt) >= weekStart)
            .reduce((sum, session) => sum + session.totalDuration, 0) / 60;

        const totalMinutes =
          countedSessions.reduce((sum, session) => sum + session.totalDuration, 0) / 60;

        const uniqueDates = [...new Set(countedSessions.map((session) => toDateKey(new Date(session.completedAt))))].sort(
          (left, right) => right.localeCompare(left)
        );

        const currentStreak = calculateStreak(uniqueDates);

        let longestStreak = currentStreak;
        for (let i = 0; i < uniqueDates.length; i += 1) {
          let streak = 1;
<<<<<<< ours
          for (let j = i + 1; j < uniqueDates.length; j += 1) {
            if (areConsecutiveDateKeys(uniqueDates[j - 1], uniqueDates[j])) {
              streak += 1;
            } else {
              break;
            }
=======
          for (let j = i + 1; j < uniqueDates.length; j++) {
            if (areConsecutiveDateKeys(uniqueDates[j - 1], uniqueDates[j])) streak++;
            else break;
>>>>>>> theirs
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
          qualifiedSessions: countedSessions.length,
        };
      },

      getSessionDates: () => {
        const { sessions } = get();
        return [...new Set(sessions.map((session) => toDateKey(new Date(session.completedAt))))].sort(
          (left, right) => right.localeCompare(left)
        );
      },

      getSessionsByDate: (dateKey) => {
        const { sessions } = get();
        return sessions.filter((session) => toDateKey(new Date(session.completedAt)) === dateKey);
      },
    }),
    {
      name: STORAGE_KEYS.SESSION_HISTORY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
