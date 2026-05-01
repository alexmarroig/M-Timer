const test = require('node:test');
const assert = require('node:assert/strict');

require('./mockAsyncStorage.cjs');

const { useAuthStore } = require('../.tmp-test/store/authStore.js');
const { DEFAULT_AUTH_SESSION, DEMO_ACCOUNT } = require('../.tmp-test/types/auth.js');

function resetStore() {
  useAuthStore.setState({
    ...DEFAULT_AUTH_SESSION,
    demoPassword: DEMO_ACCOUNT.password,
    passwordReset: null,
  });
}

test('authStore accepts demo login and rejects wrong password', () => {
  resetStore();

  assert.equal(useAuthStore.getState().login('demo@mtimer.app', 'wrong'), false);
  assert.equal(useAuthStore.getState().isAuthenticated, false);

  assert.equal(useAuthStore.getState().login('DEMO@MTIMER.APP', DEMO_ACCOUNT.password), true);

  const state = useAuthStore.getState();
  assert.equal(state.isAuthenticated, true);
  assert.equal(state.provider, 'demo');
  assert.equal(state.userEmail, DEMO_ACCOUNT.email);
});

test('authStore supports guest and google sessions', () => {
  resetStore();

  useAuthStore.getState().loginGuest();
  assert.equal(useAuthStore.getState().provider, 'guest');
  assert.equal(useAuthStore.getState().isGuest, true);

  useAuthStore.getState().loginWithGoogle({
    id: 'google-id',
    email: 'USER@EXAMPLE.COM',
    name: 'User Example',
    photoUrl: 'https://example.com/photo.png',
  });

  const state = useAuthStore.getState();
  assert.equal(state.provider, 'google');
  assert.equal(state.userEmail, 'user@example.com');
  assert.equal(state.displayName, 'User Example');
  assert.equal(state.avatarUrl, 'https://example.com/photo.png');
});

test('authStore resets demo password with recovery code', () => {
  resetStore();

  const request = useAuthStore.getState().requestPasswordReset(DEMO_ACCOUNT.email);
  assert.equal(request.ok, true);
  assert.equal(Boolean(request.recoveryCode), true);

  const reset = useAuthStore
    .getState()
    .resetPassword(DEMO_ACCOUNT.email, request.recoveryCode, 'SenhaNova123');

  assert.equal(reset.ok, true);
  assert.equal(useAuthStore.getState().login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password), false);
  assert.equal(useAuthStore.getState().login(DEMO_ACCOUNT.email, 'SenhaNova123'), true);
});
