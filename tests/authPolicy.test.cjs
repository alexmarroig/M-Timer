const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createPasswordReset,
  credentialsMatch,
  normalizeEmail,
  validatePassword,
  validateRecoveryCode,
  PASSWORD_RESET_TTL_MS,
} = require('../.tmp-test/services/auth/authPolicy.js');

test('auth policy normalizes email and validates demo credentials', () => {
  assert.equal(normalizeEmail('  DEMO@MTIMER.APP '), 'demo@mtimer.app');
  assert.equal(credentialsMatch('demo@mtimer.app', 'Respira123', 'Respira123'), true);
  assert.equal(credentialsMatch('demo@mtimer.app', 'wrong', 'Respira123'), false);
});

test('password policy requires length and mixed letters and numbers', () => {
  assert.equal(validatePassword('short1').ok, false);
  assert.equal(validatePassword('longpassword').ok, false);
  assert.equal(validatePassword('SenhaNova123').ok, true);
});

test('password reset code validates email, code and expiration', () => {
  const now = 1000;
  const reset = createPasswordReset('demo@mtimer.app', now, () => 0.123456);

  assert.equal(reset.code, '123456');
  assert.equal(reset.expiresAt, now + PASSWORD_RESET_TTL_MS);

  assert.equal(
    validateRecoveryCode({
      requestedEmail: reset.email,
      requestedCode: reset.code,
      submittedEmail: 'demo@mtimer.app',
      submittedCode: '123456',
      expiresAt: reset.expiresAt,
      now,
    }).ok,
    true
  );

  assert.equal(
    validateRecoveryCode({
      requestedEmail: reset.email,
      requestedCode: reset.code,
      submittedEmail: 'demo@mtimer.app',
      submittedCode: '000000',
      expiresAt: reset.expiresAt,
      now,
    }).ok,
    false
  );

  assert.equal(
    validateRecoveryCode({
      requestedEmail: reset.email,
      requestedCode: reset.code,
      submittedEmail: 'demo@mtimer.app',
      submittedCode: '123456',
      expiresAt: reset.expiresAt,
      now: reset.expiresAt + 1,
    }).ok,
    false
  );
});
