const test = require('node:test');
const assert = require('node:assert/strict');

require('./mockAsyncStorage.cjs');

const { useUserStore } = require('../.tmp-test/store/userStore.js');

// Zustand store in Node will keep state across tests in same process, so we assert and reset.

test('userStore ambient mute+volume preferences persist and update', () => {
  useUserStore.setState({ ambientEnabled: true, ambientTrack: 'ambient', ambientVolume: 0.5, ambientMuted: false });

  let state = useUserStore.getState();
  assert.equal(state.ambientVolume, 0.5);
  assert.equal(state.ambientMuted, false);

  state.setAmbientVolume(0.8);
  state.setAmbientMuted(true);

  state = useUserStore.getState();
  assert.equal(state.ambientVolume, 0.8);
  assert.equal(state.ambientMuted, true);

  // boundary
  state.setAmbientVolume(-0.1);
  assert.equal(useUserStore.getState().ambientVolume, 0);

  state.setAmbientVolume(1.5);
  assert.equal(useUserStore.getState().ambientVolume, 1);
});
