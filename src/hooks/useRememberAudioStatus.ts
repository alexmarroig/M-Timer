import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../store/userStore';

const AUDIO_STATUS_KEY = '@mtimer/audio_status';

export function useRememberAudioStatus() {
  const {
    ambientMuted,
    ambientVolume,
    setAmbientMuted,
    setAmbientVolume,
  } = useUserStore();

  useEffect(() => {
    void (async () => {
      try {
        const json = await AsyncStorage.getItem(AUDIO_STATUS_KEY);
        if (!json) return;

        const data = JSON.parse(json);
        if (typeof data.ambientMuted === 'boolean') {
          setAmbientMuted(data.ambientMuted);
        }
        if (typeof data.ambientVolume === 'number') {
          setAmbientVolume(Math.max(0, Math.min(1, data.ambientVolume)));
        }
      } catch {
        // ignore parse errors
      }
    })();
  }, [setAmbientMuted, setAmbientVolume]);

  useEffect(() => {
    void (async () => {
      try {
        await AsyncStorage.setItem(
          AUDIO_STATUS_KEY,
          JSON.stringify({ ambientMuted, ambientVolume })
        );
      } catch {
        // no-op
      }
    })();
  }, [ambientMuted, ambientVolume]);
}
