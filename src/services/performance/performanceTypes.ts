export type PerfMetricName =
  | 'cold_start_ms'
  | 'time_to_first_interaction_ms'
  | 'memory_used_mb'
  | 'timer_fps_avg'
  | 'timer_fps_min';

export type PerfContext = Record<string, string | number | boolean | null | undefined>;

export interface PerfMetricEntry {
  metric: PerfMetricName;
  value: number;
  platform: string;
  timestamp: number;
  context?: PerfContext;
}

export interface PerfEventEntry {
  event: string;
  platform: string;
  timestamp: number;
  context?: PerfContext;
}

export interface PerfSnapshot {
  collectedAt: string;
  version: string;
  platform: string;
  metrics: Partial<Record<PerfMetricName, number>>;
}
