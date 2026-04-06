import type { AudioSource } from 'expo-audio';

export type AmbientTrack = 'rain' | 'wind' | 'ambient';

export interface AmbientSound {
  setIsLoopingAsync(isLooping: boolean): Promise<void>;
  setVolumeAsync(volume: number): Promise<void>;
  playAsync(): Promise<void>;
  stopAsync(): Promise<void>;
  unloadAsync(): Promise<void>;
}

export interface AudioEngine {
  load(track: AmbientTrack, source: unknown): Promise<void>;
  playLoop(track: AmbientTrack, source: unknown): Promise<void>;
  fadeTo(targetVolume: number, durationMs: number): Promise<void>;
  stopAndUnload(options?: { fadeDurationMs?: number }): Promise<void>;
  getCurrentTrack(): AmbientTrack | null;
  getCurrentVolume(): number;
}

type CreateSound = (source: unknown) => Promise<AmbientSound>;

async function defaultCreateSound(source: unknown): Promise<AmbientSound> {
  const { createAudioPlayer } = await import('expo-audio');
  const player = createAudioPlayer(source as AudioSource, {
    keepAudioSessionActive: true,
  });

  player.loop = true;
  player.volume = 0;

  return {
    async setIsLoopingAsync(isLooping: boolean) {
      player.loop = isLooping;
    },
    async setVolumeAsync(volume: number) {
      player.volume = volume;
    },
    async playAsync() {
      player.play();
    },
    async stopAsync() {
      player.pause();
      await player.seekTo(0);
    },
    async unloadAsync() {
      player.pause();
      await player.seekTo(0);
      player.remove();
    },
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createAudioEngine(
  createSound: CreateSound = defaultCreateSound,
  fadeStepMs = 80
): AudioEngine {
  let sound: AmbientSound | null = null;
  let currentTrack: AmbientTrack | null = null;
  let currentVolume = 0;
  let fadeInterval: ReturnType<typeof setInterval> | null = null;

  const clearFade = () => {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }
  };

  const load = async (track: AmbientTrack, source: unknown) => {
    if (sound && currentTrack === track) {
      return;
    }

    if (sound) {
      await sound.stopAsync().catch(() => {});
      await sound.unloadAsync().catch(() => {});
    }

    sound = await createSound(source);
    currentTrack = track;
    currentVolume = 0;
    await sound.setIsLoopingAsync(true);
    await sound.setVolumeAsync(0);
  };

  const playLoop = async (track: AmbientTrack, source: unknown) => {
    await load(track, source);
    if (!sound) {
      return;
    }
    await sound.playAsync().catch(() => {});
  };

  const fadeTo = async (targetVolume: number, durationMs: number) => {
    const nextTarget = clamp(targetVolume, 0, 1);
    if (!sound) {
      currentVolume = nextTarget;
      return;
    }

    clearFade();

    if (durationMs <= 0) {
      currentVolume = nextTarget;
      await sound.setVolumeAsync(currentVolume).catch(() => {});
      return;
    }

    const activeSound = sound;
    const startVolume = currentVolume;
    const totalSteps = Math.max(1, Math.round(durationMs / fadeStepMs));

    await new Promise<void>((resolve) => {
      let step = 0;

      fadeInterval = setInterval(() => {
        step += 1;
        const progress = step / totalSteps;
        currentVolume = startVolume + (nextTarget - startVolume) * progress;
        void activeSound.setVolumeAsync(currentVolume).catch(() => {});

        if (step >= totalSteps) {
          clearFade();
          resolve();
        }
      }, fadeStepMs);
    });
  };

  const stopAndUnload = async ({ fadeDurationMs = 0 }: { fadeDurationMs?: number } = {}) => {
    const activeSound = sound;
    if (!activeSound) {
      currentTrack = null;
      currentVolume = 0;
      return;
    }

    if (fadeDurationMs > 0) {
      await fadeTo(0, fadeDurationMs);
    } else {
      clearFade();
      currentVolume = 0;
      await activeSound.setVolumeAsync(0).catch(() => {});
    }

    clearFade();
    await activeSound.stopAsync().catch(() => {});
    await activeSound.unloadAsync().catch(() => {});

    if (sound === activeSound) {
      sound = null;
      currentTrack = null;
      currentVolume = 0;
    }
  };

  return {
    load,
    playLoop,
    fadeTo,
    stopAndUnload,
    getCurrentTrack: () => currentTrack,
    getCurrentVolume: () => currentVolume,
  };
}
