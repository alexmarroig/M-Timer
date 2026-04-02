import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../services/storage/keys';
import type { Stats } from '../types/stats';
import {
  calculateSessionReward,
  getMoodFromStats,
  levelFromXp,
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
=======
  moodWithRewardBoost,
>>>>>>> theirs
=======
  moodWithRewardBoost,
>>>>>>> theirs
=======
  moodWithRewardBoost,
>>>>>>> theirs
=======
  moodWithRewardBoost,
>>>>>>> theirs
=======
  moodWithRewardBoost,
>>>>>>> theirs
=======
  moodWithRewardBoost,
>>>>>>> theirs
=======
  moodWithRewardBoost,
>>>>>>> theirs
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
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
        set(() => ({
          mood: getMoodFromStats(stats),
        }));
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
        set((s) => {
          const today = toDateKey();
          const baseMood = getMoodFromStats(stats);
          const hasRewardToday =
            s.lastRewardDate === today &&
            (s.lastRewardXp > 0 || s.lastRewardCoins > 0);

          return {
            mood: moodWithRewardBoost(baseMood, hasRewardToday),
          };
        });
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
      },
    }),
    {
      name: STORAGE_KEYS.COMPANION,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
