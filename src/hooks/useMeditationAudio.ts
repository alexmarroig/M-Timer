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

export interface AmbientAudioControl {
  ambientEnabled: boolean;
  ambientTrack: AmbientTrack;
  ambientVolume: number;
  ambientMuted: boolean;
  isMeditating: boolean;
}

export function getAmbientTargetVolume({
  ambientEnabled,
  ambientMuted,
  ambientVolume,
  isMeditating,
}: AmbientAudioControl): number {
  if (!ambientEnabled || ambientMuted || !isMeditating) return 0;
  return Math.max(0, Math.min(1, ambientVolume));
}


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
  const ambientVolume = useUserStore((store) => store.ambientVolume);
  const ambientMuted = useUserStore((store) => store.ambientMuted);
  const engineRef = useRef(createAudioEngine());

  const targetVolume = getAmbientTargetVolume({
    ambientEnabled,
    ambientMuted,
    ambientVolume,
    isMeditating: state !== 'idle' && state !== 'paused' && state !== 'finished',
  });


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

    if (!ambientEnabled || ambientMuted || !isMeditating) {
      void engine.stopAndUnload({ fadeDurationMs: state === 'paused' ? 400 : 0 });
      return;
    }

    const source = AMBIENT_SOURCES[ambientTrack];
    const targetVolume = getAmbientTargetVolume({
      ambientEnabled,
      ambientMuted,
      ambientVolume,
      isMeditating,
    });

    if (currentPhase === 'rampUp') {
      void (async () => {
        await engine.playLoop(ambientTrack, source);
        await engine.fadeTo(targetVolume, 1600);
      })();
      return;
    }

    if (currentPhase === 'core') {
      void (async () => {
        await engine.playLoop(ambientTrack, source);
        await engine.fadeTo(targetVolume, 800);
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
