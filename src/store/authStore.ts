import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../services/storage/keys';
import {
  createPasswordReset,
  credentialsMatch,
  isDemoEmail,
  normalizeEmail,
  validatePassword,
  validateRecoveryCode,
} from '../services/auth/authPolicy';
import {
  DEFAULT_AUTH_SESSION,
  DEMO_ACCOUNT,
  AuthSession,
  GoogleAuthProfile,
  PasswordResetResult,
} from '../types/auth';

interface AuthStore extends AuthSession {
  demoPassword: string;
  passwordReset: {
    email: string;
    code: string;
    expiresAt: number;
  } | null;
  login: (email: string, password: string) => boolean;
  loginGuest: () => void;
  loginWithGoogle: (profile: GoogleAuthProfile) => void;
  requestPasswordReset: (email: string) => PasswordResetResult;
  resetPassword: (email: string, code: string, newPassword: string) => PasswordResetResult;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_AUTH_SESSION,
      demoPassword: DEMO_ACCOUNT.password,
      passwordReset: null,

      login: (email, password) => {
        if (!credentialsMatch(email, password, get().demoPassword)) {
          return false;
        }

        set({
          isAuthenticated: true,
          isGuest: false,
          userEmail: DEMO_ACCOUNT.email,
          displayName: DEMO_ACCOUNT.displayName,
          provider: 'demo',
          avatarUrl: null,
        });
        return true;
      },

      loginGuest: () => {
        set({
          isAuthenticated: true,
          isGuest: true,
          userEmail: null,
          displayName: 'Convidado',
          provider: 'guest',
          avatarUrl: null,
        });
      },

      loginWithGoogle: (profile) => {
        set({
          isAuthenticated: true,
          isGuest: false,
          userEmail: normalizeEmail(profile.email),
          displayName: profile.name,
          provider: 'google',
          avatarUrl: profile.photoUrl || null,
        });
      },

      requestPasswordReset: (email) => {
        if (!isDemoEmail(email)) {
          return {
            ok: false,
            message: 'Este app demo so recupera a senha da conta demo@mtimer.app.',
          };
        }

        const reset = createPasswordReset(email);
        set({ passwordReset: reset });

        return {
          ok: true,
          message: 'Codigo de recuperacao gerado.',
          recoveryCode: reset.code,
        };
      },

      resetPassword: (email, code, newPassword) => {
        const pending = get().passwordReset;
        if (!pending) {
          return {
            ok: false,
            message: 'Solicite primeiro um codigo de recuperacao.',
          };
        }

        const recoveryResult = validateRecoveryCode({
          requestedEmail: pending.email,
          requestedCode: pending.code,
          submittedEmail: email,
          submittedCode: code,
          expiresAt: pending.expiresAt,
        });

        if (!recoveryResult.ok) {
          return recoveryResult;
        }

        const passwordResult = validatePassword(newPassword);
        if (!passwordResult.ok) {
          return passwordResult;
        }

        set({
          demoPassword: newPassword,
          passwordReset: null,
        });

        return {
          ok: true,
          message: 'Senha atualizada. Use a nova senha para entrar.',
        };
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
