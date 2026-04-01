import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../services/storage/keys';
import { DEFAULT_AUTH_SESSION, DEMO_ACCOUNT, AuthSession } from '../types/auth';

interface AuthStore extends AuthSession {
  login: (email: string, password: string) => boolean;
  loginGuest: () => void;
  logout: () => void;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...DEFAULT_AUTH_SESSION,

      login: (email, password) => {
        const matchesDemo =
          normalizeEmail(email) === normalizeEmail(DEMO_ACCOUNT.email) &&
          password === DEMO_ACCOUNT.password;

        if (!matchesDemo) {
          return false;
        }

        set({
          isAuthenticated: true,
          isGuest: false,
          userEmail: DEMO_ACCOUNT.email,
          displayName: DEMO_ACCOUNT.displayName,
        });
        return true;
      },

      loginGuest: () => {
        set({
          isAuthenticated: true,
          isGuest: true,
          userEmail: null,
          displayName: 'Convidado',
        });
      },

      logout: () => {
        set({ ...DEFAULT_AUTH_SESSION });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_SESSION,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
