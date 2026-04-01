export const DEMO_ACCOUNT = {
  email: 'demo@mtimer.app',
  password: 'Respira123',
  displayName: 'Praticante Demo',
} as const;

export interface AuthSession {
  isAuthenticated: boolean;
  isGuest: boolean;
  userEmail: string | null;
  displayName: string | null;
}

export const DEFAULT_AUTH_SESSION: AuthSession = {
  isAuthenticated: false,
  isGuest: false,
  userEmail: null,
  displayName: null,
};
