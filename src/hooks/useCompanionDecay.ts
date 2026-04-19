import { useEffect } from 'react';
import { useCompanionStore } from '../store/companionStore';
import { useHistoryStore } from '../store/historyStore';

export function useCompanionDecay() {
  const applyDecay = useCompanionStore((s) => s.applyDecay);
  const syncMoodFromStats = useCompanionStore((s) => s.syncMoodFromStats);
  const getStats = useHistoryStore((s) => s.getStats);

  useEffect(() => {
    // Initial check on boot
    applyDecay();
    syncMoodFromStats(getStats());

    // Optional: Set up an interval to check every few hours if app stays open
    const interval = setInterval(() => {
      applyDecay();
      syncMoodFromStats(getStats());
    }, 1000 * 60 * 60 * 4); // Every 4 hours

    return () => clearInterval(interval);
  }, [applyDecay, syncMoodFromStats, getStats]);
}
