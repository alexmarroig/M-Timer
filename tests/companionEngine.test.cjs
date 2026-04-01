const test = require('node:test');
const assert = require('node:assert/strict');

const { getCompanionState } = require('../.tmp-test/services/companionEngine.js');

test('rampUp uses stronger movement than core', () => {
  const rampUp = getCompanionState({
    streak: 2,
    sessionsCompleted: 6,
    sessionsToday: 1,
    currentPhase: 'rampUp',
    evolutionTier: 'beginner',
    placement: 'player',
  });

  const core = getCompanionState({
    streak: 2,
    sessionsCompleted: 6,
    sessionsToday: 1,
    currentPhase: 'core',
    evolutionTier: 'beginner',
    placement: 'player',
  });

  assert.ok(rampUp.breathingRange[0] < core.breathingRange[0]);
  assert.ok(rampUp.floatRange[1] > core.floatRange[1]);
  assert.ok(rampUp.glowOpacityRange[1] > core.glowOpacityRange[1]);
});

test('cooldown lowers base opacity for a soft fade', () => {
  const cooldown = getCompanionState({
    streak: 4,
    sessionsCompleted: 10,
    sessionsToday: 1,
    currentPhase: 'cooldown',
    evolutionTier: 'deepening',
    placement: 'player',
  });

  assert.equal(cooldown.baseOpacity, 0.82);
});

test('higher evolution tiers increase glow, brightness, and size smoothly', () => {
  const beginner = getCompanionState({
    streak: 5,
    sessionsCompleted: 12,
    sessionsToday: 1,
    currentPhase: 'core',
    evolutionTier: 'beginner',
    placement: 'player',
  });

  const integrated = getCompanionState({
    streak: 5,
    sessionsCompleted: 12,
    sessionsToday: 1,
    currentPhase: 'core',
    evolutionTier: 'integrated',
    placement: 'player',
  });

  assert.ok(integrated.glowOpacityRange[1] > beginner.glowOpacityRange[1]);
  assert.ok(integrated.brightness > beginner.brightness);
  assert.ok(integrated.sizeBoost > beginner.sizeBoost);
});
