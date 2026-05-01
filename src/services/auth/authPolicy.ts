import { DEMO_ACCOUNT, type PasswordResetResult } from '../../types/auth';

const MIN_PASSWORD_LENGTH = 8;
const RECOVERY_CODE_LENGTH = 6;
export const PASSWORD_RESET_TTL_MS = 15 * 60 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isDemoEmail(email: string): boolean {
  return normalizeEmail(email) === normalizeEmail(DEMO_ACCOUNT.email);
}

export function validatePassword(password: string): PasswordResetResult {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      message: `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    };
  }

  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      ok: false,
      message: 'A senha precisa misturar letras e numeros.',
    };
  }

  return {
    ok: true,
    message: 'Senha valida.',
  };
}

export function credentialsMatch(email: string, password: string, activePassword: string): boolean {
  return isDemoEmail(email) && password === activePassword;
}

export function createRecoveryCode(random = Math.random): string {
  const max = 10 ** RECOVERY_CODE_LENGTH;
  return Math.floor(random() * max).toString().padStart(RECOVERY_CODE_LENGTH, '0');
}

export function createPasswordReset(
  email: string,
  now = Date.now(),
  random = Math.random
): { email: string; code: string; expiresAt: number } {
  return {
    email: normalizeEmail(email),
    code: createRecoveryCode(random),
    expiresAt: now + PASSWORD_RESET_TTL_MS,
  };
}

export function validateRecoveryCode({
  requestedEmail,
  requestedCode,
  submittedEmail,
  submittedCode,
  expiresAt,
  now = Date.now(),
}: {
  requestedEmail: string;
  requestedCode: string;
  submittedEmail: string;
  submittedCode: string;
  expiresAt: number;
  now?: number;
}): PasswordResetResult {
  if (normalizeEmail(requestedEmail) !== normalizeEmail(submittedEmail)) {
    return {
      ok: false,
      message: 'O email informado nao corresponde ao pedido de recuperacao.',
    };
  }

  if (now > expiresAt) {
    return {
      ok: false,
      message: 'O codigo expirou. Solicite uma nova recuperacao.',
    };
  }

  if (submittedCode.trim() !== submittedCode || submittedCode.length !== RECOVERY_CODE_LENGTH) {
    return {
      ok: false,
      message: 'Informe o codigo de 6 digitos.',
    };
  }

  if (submittedCode !== requestedCode) {
    return {
      ok: false,
      message: 'Codigo de recuperacao invalido.',
    };
  }

  return {
    ok: true,
    message: 'Codigo valido.',
  };
}
