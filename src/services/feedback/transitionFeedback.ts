import { Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { TransitionSound } from '../../types/user';

async function playBell(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '',
        body: '',
        sound: true,
      },
      trigger: null,
    });
  } catch {
    // Silent fallback by design.
  }
}

async function triggerVibration(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    try {
      Vibration.vibrate(120);
    } catch {
      // Silent fallback by design.
    }
  }
}

export async function triggerTransitionFeedback(transitionSound: TransitionSound): Promise<void> {
  if (transitionSound === 'none') return;

  if (transitionSound === 'bell') {
    await playBell();
    return;
  }

  await triggerVibration();
}
