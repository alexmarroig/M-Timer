import { useEffect, useRef } from 'react';
import {
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
  type AVPlaybackSource,
} from 'expo-av';
import type { SessionPhase, TimerState } from '../types/session';
import { useUserStore } from '../store/userStore';
import { createAudioEngine, type AmbientTrack } from '../services/audioEngine';

const AMBIENT_SOURCES: Record<AmbientTrack, AVPlaybackSource> = {
  rain: require('../../assets/audio/rain.mp3'),
  wind: require('../../assets/audio/wind.mp3'),
  ambient: require('../../assets/audio/ambient.mp3'),
};

export function useMeditationAudio({
  currentPhase,
  state,
}: {
  currentPhase: SessionPhase;
  state: TimerState;
}) {
  const ambientEnabled = useUserStore((store) => store.ambientEnabled);
  const ambientTrack = useUserStore((store) => store.ambientTrack);
  const engineRef = useRef(createAudioEngine());

  useEffect(() => {
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    const isMeditating =
      state !== 'idle' && state !== 'paused' && state !== 'finished';

    if (!ambientEnabled || !isMeditating) {
      void engine.stopAndUnload({ fadeDurationMs: state === 'paused' ? 400 : 0 });
      return;
    }

    const source = AMBIENT_SOURCES[ambientTrack];

    if (currentPhase === 'rampUp') {
      void (async () => {
        await engine.playLoop(ambientTrack, source);
        await engine.fadeTo(0.28, 1600);
      })();
      return;
    }

    if (currentPhase === 'core') {
      void (async () => {
        await engine.playLoop(ambientTrack, source);
        await engine.fadeTo(0.28, 800);
      })();
      return;
    }

    void (async () => {
      await engine.playLoop(ambientTrack, source);
      await engine.fadeTo(0, 2200);
    })();
  }, [ambientEnabled, ambientTrack, currentPhase, state]);

  useEffect(
    () => () => {
      void engineRef.current.stopAndUnload();
    },
    []
  );
}
