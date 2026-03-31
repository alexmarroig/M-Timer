const test = require('node:test');
const assert = require('node:assert/strict');

const { getAmbientTargetVolume } = require('../.tmp-test/hooks/useMeditationAudio.js');

test('getAmbientTargetVolume returns 0 when ambient is disabled', () => {
  assert.equal(
    getAmbientTargetVolume({ ambientEnabled: false, ambientMuted: false, ambientVolume: 0.5, isMeditating: true }),
    0
  );
});

test('getAmbientTargetVolume returns 0 when muted', () => {
  assert.equal(
    getAmbientTargetVolume({ ambientEnabled: true, ambientMuted: true, ambientVolume: 0.5, isMeditating: true }),
    0
  );
});

test('getAmbientTargetVolume returns 0 when not meditating', () => {
  assert.equal(
    getAmbientTargetVolume({ ambientEnabled: true, ambientMuted: false, ambientVolume: 0.5, isMeditating: false }),
    0
  );
});

test('getAmbientTargetVolume respects volume range', () => {
  assert.equal(
    getAmbientTargetVolume({ ambientEnabled: true, ambientMuted: false, ambientVolume: 1.2, isMeditating: true }),
    1
  );
  assert.equal(
    getAmbientTargetVolume({ ambientEnabled: true, ambientMuted: false, ambientVolume: -0.1, isMeditating: true }),
    0
  );
});
