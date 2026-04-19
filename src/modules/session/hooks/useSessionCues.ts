import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { AudioPlayer, setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useUserStore } from '../../../store/userStore';
import { SessionPhase, TimerState } from '../../../types/session';

const bellSource = require('../../../../assets/audio/soft-bell.wav');
const bowlSource = require('../../../../assets/audio/session-bowl.wav');

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

  const bellPlayer = useAudioPlayer(bellSource);
  const bowlPlayer = useAudioPlayer(bowlSource);

  const previous = useRef({ currentPhase, state });

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
    }).catch(() => {});

    bellPlayer.volume = 0.72;
    bowlPlayer.volume = 0.82;
  }, [bowlPlayer, bellPlayer]);

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
      replay(bowlPlayer).catch(() => {});
      return;
    }

    // Logic for different transition sounds
    if (transitionSound === 'soft-bell' || transitionSound === 'bell') {
       replay(bellPlayer).catch(() => {});
    } else if (transitionSound === 'bowl') {
       replay(bowlPlayer).catch(() => {});
    }

  }, [bowlPlayer, currentPhase, state, bellPlayer, transitionSound]);
}
