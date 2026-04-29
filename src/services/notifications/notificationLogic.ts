import type { ReminderConfig } from '../../types/user';

export function normalizeReminderConfig(config: ReminderConfig): ReminderConfig {
  return {
    enabled: Boolean(config.enabled),
    hour: Math.min(23, Math.max(0, Math.trunc(config.hour))),
    minute: Math.min(59, Math.max(0, Math.trunc(config.minute))),
  };
}

export function shouldScheduleReminder(config: ReminderConfig): boolean {
  const normalized = normalizeReminderConfig(config);
  return normalized.enabled;
}
