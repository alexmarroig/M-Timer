import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { AudioPlayer, setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useUserStore } from '../../../store/userStore';
import { SessionPhase, TimerState } from '../../../types/session';

const transitionSource = require('../../../../assets/audio/soft-bell.wav');
const completionSource = require('../../../../assets/audio/session-bowl.wav');

async function replay(player: AudioPlayer) {
  try {
    player.pause();
    await player.seekTo(0);
  } catch {
    // Ignore seek timing issues on first load and still try to play.
  }
  player.play();
}

export function useSessionCues(currentPhase: SessionPhase, state: TimerState) {
  const transitionSound = useUserStore((s) => s.transitionSound);
  const transitionPlayer = useAudioPlayer(transitionSource);
  const completionPlayer = useAudioPlayer(completionSource);
  const previous = useRef({ currentPhase, state });

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
    }).catch(() => {});

    transitionPlayer.volume = 0.72;
    completionPlayer.volume = 0.82;
  }, [completionPlayer, transitionPlayer]);

  useEffect(() => {
    const previousSnapshot = previous.current;
    const finishedNow = previousSnapshot.state !== 'finished' && state === 'finished';
    const phaseChanged =
      previousSnapshot.currentPhase !== currentPhase &&
      previousSnapshot.state !== 'idle' &&
      state !== 'paused' &&
      state !== 'finished';

    previous.current = { currentPhase, state };

    if (!finishedNow && !phaseChanged) {
      return;
    }

    if (transitionSound === 'none') {
      return;
    }

    if (transitionSound === 'vibration') {
      Haptics.notificationAsync(
        finishedNow
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      ).catch(() => {});
      return;
    }

    if (finishedNow) {
      replay(completionPlayer).catch(() => {});
      return;
    }

    replay(transitionPlayer).catch(() => {});
  }, [completionPlayer, currentPhase, state, transitionPlayer, transitionSound]);
}
