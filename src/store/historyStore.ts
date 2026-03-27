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
import { Stats, EMPTY_STATS, WeeklyGoal, GamificationSnapshot } from '../types/stats';
import { toDateKey, startOfWeek, calculateStreak, toWeekKey } from '../core/utils/date';
import { STORAGE_KEYS } from '../services/storage/keys';

const WEEKLY_GOAL_DEFAULT: WeeklyGoal = {
  targetSessions: 5,
  targetMinutes: 120,
};

const MIN_QUALIFIED_SECONDS = 5 * 60;
const MIN_GAP_BETWEEN_COUNTED_SESSIONS_SECONDS = 10 * 60;
const DAILY_COUNTED_SESSIONS_CAP = 6;

type BlockReason = NonNullable<SessionInstance['progressBlockedReason']>;

function buildLevelMeta(level: number): { label: string; message: string } {
  if (level >= 5) {
    return {
      label: 'Mestre da Consistência',
      message: 'Excelente! Você já superou a meta semanal e está em ritmo avançado.',
    };
  }
  if (level >= 3) {
    return {
      label: 'Praticante Focado',
      message: 'Ótimo progresso! Continue no ritmo para manter a evolução.',
    };
  }
  if (level >= 1) {
    return {
      label: 'Em Construção',
      message: 'Você começou bem. Cada sessão conta para fortalecer o hábito.',
    };
  }
  return {
    label: 'Primeiros Passos',
    message: 'Comece sua semana com uma sessão consistente para liberar progresso.',
  };
}

interface HistoryStore {
  sessions: SessionInstance[];
  weeklyGoal: WeeklyGoal;
  addSession: (params: {
    templateId: string;
    templateName: string;
    phases: PhaseDuration;
    startedAt: number; // timestamp
    completed: boolean;
  }) => void;
  setWeeklyGoal: (goal: WeeklyGoal) => void;
  getStats: () => Stats;
  getGamification: () => GamificationSnapshot;
  getSessionDates: () => string[]; // YYYY-MM-DD keys with sessions
  getSessionsByDate: (dateKey: string) => SessionInstance[];
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      weeklyGoal: WEEKLY_GOAL_DEFAULT,

      addSession: ({ templateId, templateName, phases, startedAt, completed }) => {
        const now = new Date();
        const totalDuration = phases.rampUp + phases.core + phases.cooldown;
        const completedAtKey = toDateKey(now);
        const { sessions } = get();
        const countedSessions = sessions.filter((s) => s.countsForProgress);

        let progressBlockedReason: BlockReason | undefined;
        if (!completed) {
          progressBlockedReason = 'incomplete';
        } else if (totalDuration < MIN_QUALIFIED_SECONDS) {
          progressBlockedReason = 'tooShort';
        } else {
          const countedToday = countedSessions.filter(
            (s) => toDateKey(new Date(s.completedAt)) === completedAtKey
          ).length;
          if (countedToday >= DAILY_COUNTED_SESSIONS_CAP) {
            progressBlockedReason = 'dailyLimit';
          } else {
            const latestCounted = countedSessions[0];
            if (latestCounted) {
              const latestTime = new Date(latestCounted.completedAt).getTime();
              const diffSeconds = (now.getTime() - latestTime) / 1000;
              if (
                diffSeconds < MIN_GAP_BETWEEN_COUNTED_SESSIONS_SECONDS &&
                totalDuration < MIN_GAP_BETWEEN_COUNTED_SESSIONS_SECONDS
              ) {
                progressBlockedReason = 'rapidRepeat';
              }
            }
          }
        }

        const session: SessionInstance = {
          id: uuid(),
          templateId,
          templateName,
          phases,
          startedAt: new Date(startedAt).toISOString(),
          completedAt: now.toISOString(),
          totalDuration,
          completed,
          countsForProgress: !progressBlockedReason,
          progressBlockedReason,
        };
        set((s) => ({
          sessions: [session, ...s.sessions],
        }));
      },

      setWeeklyGoal: (goal) => {
        set({
          weeklyGoal: {
            targetSessions: Math.max(1, Math.round(goal.targetSessions)),
            targetMinutes: Math.max(15, Math.round(goal.targetMinutes)),
          },
        });
      },

      getStats: () => {
        const { sessions } = get();
        if (sessions.length === 0) return { ...EMPTY_STATS };
        const validSessions = sessions.filter((s) => s.countsForProgress);
        if (validSessions.length === 0) {
          return {
            ...EMPTY_STATS,
            totalSessions: sessions.length,
          };
        }

        const today = toDateKey();
        const weekStart = startOfWeek();

        const sessionsToday = validSessions.filter(
          (s) => toDateKey(new Date(s.completedAt)) === today
        ).length;

        const weeklyMinutes = validSessions
          .filter((s) => new Date(s.completedAt) >= weekStart)
          .reduce((sum, s) => sum + s.totalDuration, 0) / 60;

        const totalMinutes = validSessions.reduce((sum, s) => sum + s.totalDuration, 0) / 60;

        // Get unique dates sorted descending
        const uniqueDates = [...new Set(
          validSessions.map((s) => toDateKey(new Date(s.completedAt)))
        )].sort((a, b) => b.localeCompare(a));

        const currentStreak = calculateStreak(uniqueDates);

        // Calculate longest streak by trying all starting positions
        let longestStreak = currentStreak;
        for (let i = 0; i < uniqueDates.length; i++) {
          let streak = 1;
          for (let j = i + 1; j < uniqueDates.length; j++) {
            if (areConsecutiveDateKeys(uniqueDates[j - 1], uniqueDates[j])) streak++;
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
          qualifiedSessions: validSessions.length,
        };
      },

      getGamification: () => {
        const { sessions, weeklyGoal } = get();
        const validSessions = sessions.filter((s) => s.countsForProgress);
        const now = new Date();
        const currentWeekKey = toWeekKey(now);

        const currentWeekSessions = validSessions.filter(
          (s) => toWeekKey(new Date(s.completedAt)) === currentWeekKey
        );
        const sessionsCompleted = currentWeekSessions.length;
        const minutesCompleted = Math.round(
          currentWeekSessions.reduce((sum, s) => sum + s.totalDuration, 0) / 60
        );
        const sessionsProgress = Math.min(sessionsCompleted / weeklyGoal.targetSessions, 1);
        const minutesProgress = Math.min(minutesCompleted / weeklyGoal.targetMinutes, 1);
        const averageProgress = (sessionsProgress + minutesProgress) / 2;
        const level = Math.max(0, Math.min(5, Math.round(averageProgress * 5)));
        const { label: levelLabel, message: motivationalMessage } = buildLevelMeta(level);

        const validUniqueDates = [...new Set(
          validSessions.map((s) => toDateKey(new Date(s.completedAt)))
        )].sort((a, b) => b.localeCompare(a));
        const longestStreak = (() => {
          let longest = 0;
          for (let i = 0; i < validUniqueDates.length; i++) {
            let streak = 1;
            for (let j = i + 1; j < validUniqueDates.length; j++) {
              const prev = new Date(validUniqueDates[j - 1]);
              const curr = new Date(validUniqueDates[j]);
              const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
              if (diff !== 1) break;
              streak++;
            }
            longest = Math.max(longest, streak);
          }
          return longest;
        })();

        const sessionsByWeek = validSessions.reduce<Record<string, SessionInstance[]>>((acc, session) => {
          const weekKey = toWeekKey(new Date(session.completedAt));
          if (!acc[weekKey]) acc[weekKey] = [];
          acc[weekKey].push(session);
          return acc;
        }, {});

        const completedWeeks = Object.values(sessionsByWeek).filter((weekSessions) => {
          const weekMinutes = weekSessions.reduce((sum, s) => sum + s.totalDuration, 0) / 60;
          return (
            weekSessions.length >= weeklyGoal.targetSessions &&
            weekMinutes >= weeklyGoal.targetMinutes
          );
        });
        const firstCompletedWeek = completedWeeks[0];

        const blockedSessions = sessions.filter((s) => !s.countsForProgress);
        const lastBlocked = blockedSessions[0];
        const blockedReasonMap: Record<BlockReason, string> = {
          incomplete: 'Sessão incompleta não conta para progresso.',
          tooShort: 'Sessões abaixo de 5 min não contam para gamificação.',
          rapidRepeat: 'Sessões curtas em sequência rápida foram ignoradas.',
          dailyLimit: 'Limite diário de sessões válidas atingido.',
        };

        return {
          weeklyGoal: {
            goal: weeklyGoal,
            sessionsCompleted,
            minutesCompleted,
            sessionsProgress,
            minutesProgress,
            level,
            levelLabel,
            motivationalMessage,
          },
          achievements: [
            {
              id: 'firstSession',
              title: 'Primeira sessão válida',
              description: 'Conclua sua primeira sessão qualificada.',
              unlocked: validSessions.length >= 1,
              unlockedAt: validSessions[validSessions.length - 1]?.completedAt,
              current: validSessions.length,
              target: 1,
              progress: Math.min(validSessions.length / 1, 1),
            },
            {
              id: 'firstWeekComplete',
              title: 'Primeira semana completa',
              description: 'Bata a meta semanal de sessões e minutos.',
              unlocked: completedWeeks.length >= 1,
              unlockedAt: firstCompletedWeek?.[0]?.completedAt,
              current: completedWeeks.length,
              target: 1,
              progress: Math.min(completedWeeks.length / 1, 1),
            },
            {
              id: 'streak30Days',
              title: '30 dias de consistência',
              description: 'Mantenha um streak de 30 dias.',
              unlocked: longestStreak >= 30,
              current: longestStreak,
              target: 30,
              progress: Math.min(longestStreak / 30, 1),
            },
            {
              id: 'sessions100',
              title: '100 sessões qualificadas',
              description: 'Complete 100 sessões válidas ao longo da jornada.',
              unlocked: validSessions.length >= 100,
              current: validSessions.length,
              target: 100,
              progress: Math.min(validSessions.length / 100, 1),
            },
            {
              id: 'weeks4Complete',
              title: '4 semanas de meta',
              description: 'Complete a meta semanal por 4 semanas.',
              unlocked: completedWeeks.length >= 4,
              current: completedWeeks.length,
              target: 4,
              progress: Math.min(completedWeeks.length / 4, 1),
            },
          ],
          antiFraud: {
            countedSessions: validSessions.length,
            blockedSessions: blockedSessions.length,
            lastBlockedReason: lastBlocked?.progressBlockedReason
              ? blockedReasonMap[lastBlocked.progressBlockedReason]
              : undefined,
          },
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
