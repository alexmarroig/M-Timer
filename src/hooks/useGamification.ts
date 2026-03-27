import { useMemo } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { deriveGamificationProfile } from '../services/gamificationEngine';

export function useGamification() {
  const sessions = useHistoryStore((state) => state.sessions);
  const getStats = useHistoryStore((state) => state.getStats);

  return useMemo(() => {
    const stats = getStats();
    const profile = deriveGamificationProfile({ sessions, stats });
    return {
      stats,
      profile,
    };
  }, [getStats, sessions]);
}
