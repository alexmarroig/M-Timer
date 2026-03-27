import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../services/storage/keys';
import {
  AuthError,
  AuthenticatedUser,
  authProvider,
  isNetworkError,
} from '../modules/auth/services/authProvider';

interface AuthStore {
  user: AuthenticatedUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOffline: boolean;
  error: string | null;
  resetEmailSentTo: string | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  clearError: () => void;
  setHydrated: (value: boolean) => void;
  logout: () => void;
}

function parseAuthError(error: unknown, fallback: string): string {
  if (error instanceof AuthError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isOffline: false,
      error: null,
      resetEmailSentTo: null,
      hydrated: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null, isOffline: false });

        try {
          const session = await authProvider.login({ email, password });

          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isOffline: false,
          });

          return true;
        } catch (error) {
          set((state) => ({
            error: parseAuthError(error, 'Falha ao fazer login.'),
            isLoading: false,
            isOffline: isNetworkError(error),
            isAuthenticated: state.token ? state.isAuthenticated : false,
          }));

          return false;
        }
      },

      sendPasswordResetEmail: async (email) => {
        set({ isLoading: true, error: null, isOffline: false });

        try {
          await authProvider.sendPasswordResetEmail({ email });
          set({
            isLoading: false,
            error: null,
            isOffline: false,
            resetEmailSentTo: email.trim().toLowerCase(),
          });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: parseAuthError(
              error,
              'Não foi possível enviar o e-mail de recuperação.'
            ),
            isOffline: isNetworkError(error),
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),
      setHydrated: (value) => set({ hydrated: value }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          resetEmailSentTo: null,
          isOffline: false,
        }),
    }),
    {
      name: STORAGE_KEYS.AUTH_SESSION,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.clearError();
        state?.setHydrated(true);
      },
    }
  )
);
