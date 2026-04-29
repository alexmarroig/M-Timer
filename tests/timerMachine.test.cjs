const test = require('node:test');
const assert = require('node:assert/strict');

const {
  timerTransition,
  getPhaseRemaining,
  getTotalElapsed,
  getPhaseProgress,
} = require('../.tmp-test/services/timerEngine/timerMachine.js');
const { INITIAL_CONTEXT } = require('../.tmp-test/services/timerEngine/timerTypes.js');

function withNow(now, run) {
  const original = Date.now;
  Date.now = () => now;
  try {
    return run();
  } finally {
    Date.now = original;
  }
}

test('timer machine starts, advances phases and finishes', () => {
  const phases = { rampUp: 2, core: 3, cooldown: 1 };

  const started = withNow(1000, () =>
    timerTransition(INITIAL_CONTEXT, { type: 'START', phases })
  );

  assert.equal(started.state, 'rampUp');
  assert.equal(started.currentPhase, 'rampUp');

  const inRamp = withNow(2500, () => ({
    remaining: getPhaseRemaining(started),
    elapsed: getTotalElapsed(started),
    progress: getPhaseProgress(started),
  }));

  assert.equal(inRamp.remaining, 1);
  assert.equal(inRamp.elapsed, 1);
  assert.ok(inRamp.progress.rampUp > 0.7);

  const core = withNow(3000, () => timerTransition(started, { type: 'NEXT_PHASE' }));
  assert.equal(core.state, 'core');
  assert.equal(core.completedPhasesElapsed, 2000);

  const cooldown = withNow(6000, () => timerTransition(core, { type: 'NEXT_PHASE' }));
  assert.equal(cooldown.state, 'cooldown');
  assert.equal(cooldown.completedPhasesElapsed, 5000);

  const finished = timerTransition(cooldown, { type: 'NEXT_PHASE' });
  assert.equal(finished.state, 'finished');
  assert.deepEqual(getPhaseProgress(finished), { rampUp: 1, core: 1, cooldown: 1 });
});

test('timer machine pauses and resumes without losing elapsed time', () => {
  const phases = { rampUp: 10, core: 10, cooldown: 10 };
  const started = withNow(1000, () =>
    timerTransition(INITIAL_CONTEXT, { type: 'START', phases })
  );
  const paused = withNow(4000, () => timerTransition(started, { type: 'PAUSE' }));

  assert.equal(paused.state, 'paused');
  assert.equal(paused.phaseElapsedBeforePause, 3000);

  const resumed = withNow(9000, () => timerTransition(paused, { type: 'RESUME' }));
  const elapsed = withNow(11000, () => getTotalElapsed(resumed));

  assert.equal(resumed.state, 'rampUp');
  assert.equal(elapsed, 5);
});
