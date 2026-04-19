import { useMemo } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { useCompanionStore } from '../store/companionStore';
import { deriveGamificationProfile } from '../services/gamificationEngine';

export function useGamification() {
  const sessions = useHistoryStore((state) => state.sessions);
  const getStats = useHistoryStore((state) => state.getStats);
  const xp = useCompanionStore((state) => state.xp);

  return useMemo(() => {
    const stats = getStats();
    const profile = deriveGamificationProfile({ sessions, stats, xpOverride: xp });
    return {
      stats,
      profile,
    };
  }, [getStats, sessions, xp]);
}
