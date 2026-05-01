export const DEMO_ACCOUNT = {
  email: 'demo@mtimer.app',
  password: 'Respira123',
  displayName: 'Praticante Demo',
} as const;

export type AuthProvider = 'demo' | 'guest' | 'google';

export interface AuthSession {
  isAuthenticated: boolean;
  isGuest: boolean;
  userEmail: string | null;
  displayName: string | null;
  provider: AuthProvider | null;
  avatarUrl: string | null;
}

export interface GoogleAuthProfile {
  id: string;
  email: string;
  name: string;
  photoUrl?: string | null;
}

export interface PasswordResetResult {
  ok: boolean;
  message: string;
  recoveryCode?: string;
}

export const DEFAULT_AUTH_SESSION: AuthSession = {
  isAuthenticated: false,
  isGuest: false,
  userEmail: null,
  displayName: null,
  provider: null,
  avatarUrl: null,
};
