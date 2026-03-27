export interface LoginInput {
  email: string;
  password: string;
}

export interface PasswordResetInput {
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  token: string;
  user: AuthenticatedUser;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_CREDENTIALS' | 'NOT_FOUND' | 'NETWORK' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

const MOCK_USER: AuthenticatedUser = {
  id: 'user-1',
  name: 'Usuário M-Timer',
  email: 'demo@mtimer.app',
};

function delay(ms = 900) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function shouldSimulateOffline() {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine === false;
  }

  return false;
}

export const authProvider = {
  async login({ email, password }: LoginInput): Promise<AuthSession> {
    await delay();

    if (shouldSimulateOffline()) {
      throw new AuthError('Você está offline. Conecte-se para fazer login.', 'NETWORK');
    }

    const normalizedEmail = normalizeEmail(email);

    if (normalizedEmail !== MOCK_USER.email || password !== '123456') {
      throw new AuthError('Credenciais inválidas. Verifique e tente novamente.', 'INVALID_CREDENTIALS');
    }

    return {
      token: `token-${Date.now()}`,
      user: MOCK_USER,
    };
  },

  async sendPasswordResetEmail({ email }: PasswordResetInput): Promise<void> {
    await delay();

    if (shouldSimulateOffline()) {
      throw new AuthError(
        'Sem internet no momento. Não foi possível enviar o e-mail de recuperação.',
        'NETWORK'
      );
    }

    const normalizedEmail = normalizeEmail(email);

    if (normalizedEmail !== MOCK_USER.email) {
      throw new AuthError('Nenhuma conta encontrada para este e-mail.', 'NOT_FOUND');
    }
  },
};

export function isNetworkError(error: unknown) {
  return error instanceof AuthError && error.code === 'NETWORK';
}
