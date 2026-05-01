import { notificationService } from './notificationService';
import {
  getEngagementState,
  getNotificationCount,
  getNotificationHours,
  getSmartMessage,
  type NotificationContext,
} from './notificationMessages';

const SMART_NOTIF_PREFIX = 'smart-notif-';

/**
 * Cancels all previously scheduled smart notifications and schedules
 * new ones based on the current engagement state.
 *
 * Call this after every completed session (in companionStore.addSessionXp)
 * and also on app foreground (to refresh after date change).
 */
export async function scheduleSmartNotifications(ctx: NotificationContext & {
  hoursSinceLastSession: number;
}): Promise<void> {
  const { hoursSinceLastSession, ...msgCtx } = ctx;

  // Cancel old smart notifications
  await cancelSmartNotifications();

  const state = getEngagementState(hoursSinceLastSession);

  // Active users: no push needed
  if (state === 'active') return;

  const count = getNotificationCount(state);
  const hours = getNotificationHours(count);

  const now = new Date();

  for (let i = 0; i < hours.length; i++) {
    const targetHour = hours[i];
    const id = `${SMART_NOTIF_PREFIX}${i}`;

    // Build next occurrence of targetHour
    const target = new Date(now);
    target.setHours(targetHour, 0, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    const secondsDelay = Math.round((target.getTime() - now.getTime()) / 1000);

    const { title, body } = getSmartMessage(state, msgCtx);

    await notificationService.scheduleIntervention(id, title, body, secondsDelay);
  }
}

export async function cancelSmartNotifications(): Promise<void> {
  // Cancel up to 3 smart slots
  for (let i = 0; i < 3; i++) {
    await notificationService.cancelReminder(`${SMART_NOTIF_PREFIX}${i}`);
  }
}
