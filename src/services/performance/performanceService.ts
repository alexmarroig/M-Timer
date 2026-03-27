import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../storage/keys';
import { storageService } from '../storage/storageService';
import type { PerfContext, PerfEventEntry, PerfMetricEntry, PerfSnapshot } from './performanceTypes';

const PERF_MARKS = {
  appStart: Date.now(),
  interactionLogged: false,
};

const MAX_BUFFER_ENTRIES = 250;

async function appendStorageList<T>(key: string, entry: T): Promise<void> {
  const entries = (await storageService.get<T[]>(key)) ?? [];
  const next = [...entries, entry].slice(-MAX_BUFFER_ENTRIES);
  await storageService.set(key, next);
}

function getJsMemoryUsageMb(): number | null {
  const memory = (globalThis as { performance?: { memory?: { usedJSHeapSize?: number } } }).performance?.memory;
  if (!memory?.usedJSHeapSize) {
    return null;
  }

  return Number((memory.usedJSHeapSize / (1024 * 1024)).toFixed(2));
}

export const performanceService = {
  getAppStartTimestamp(): number {
    return PERF_MARKS.appStart;
  },

  async logEvent(event: string, context?: PerfContext): Promise<void> {
    const payload: PerfEventEntry = {
      event,
      platform: Platform.OS,
      timestamp: Date.now(),
      context,
    };

    console.info('[perf:event]', payload);
    await appendStorageList(STORAGE_KEYS.PERF_EVENTS, payload);
  },

  async logMetric(metric: PerfMetricEntry['metric'], value: number, context?: PerfContext): Promise<void> {
    const payload: PerfMetricEntry = {
      metric,
      value,
      platform: Platform.OS,
      timestamp: Date.now(),
      context,
    };

    console.info('[perf:metric]', payload);
    await appendStorageList(STORAGE_KEYS.PERF_METRICS, payload);
  },

  async markColdStartReady(routeName: string): Promise<void> {
    const coldStartMs = Date.now() - PERF_MARKS.appStart;
    await this.logMetric('cold_start_ms', coldStartMs, { route: routeName });

    const memoryMb = getJsMemoryUsageMb();
    if (memoryMb !== null) {
      await this.logMetric('memory_used_mb', memoryMb, { checkpoint: 'post_navigation_ready' });
    }
  },

  async markFirstInteraction(origin: string): Promise<void> {
    if (PERF_MARKS.interactionLogged) {
      return;
    }

    PERF_MARKS.interactionLogged = true;
    const elapsed = Date.now() - PERF_MARKS.appStart;
    await this.logMetric('time_to_first_interaction_ms', elapsed, { origin });
  },

  async generateSnapshot(version: string): Promise<PerfSnapshot> {
    const metrics = (await storageService.get<PerfMetricEntry[]>(STORAGE_KEYS.PERF_METRICS)) ?? [];
    const byName = metrics.reduce<PerfSnapshot['metrics']>((acc, entry) => {
      acc[entry.metric] = entry.value;
      return acc;
    }, {});

    const snapshot: PerfSnapshot = {
      collectedAt: new Date().toISOString(),
      version,
      platform: Platform.OS,
      metrics: byName,
    };

    await storageService.set(STORAGE_KEYS.PERF_SNAPSHOT_CURRENT, snapshot);
    return snapshot;
  },
};
