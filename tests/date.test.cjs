const test = require('node:test');
const assert = require('node:assert/strict');

const {
  toDateKey,
  calculateStreak,
  areConsecutiveDateKeys,
} = require('../.tmp-test/date.js');

test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
});

test('toDateKey uses local calendar date for early morning positive offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T00:30:00+05:30');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-26');
});

test('calculateStreak counts consecutive local keys including today', () => {
  const realDateNow = Date.now;
  Date.now = () => new Date('2026-03-27T12:00:00Z').getTime();
  try {
    assert.equal(calculateStreak(['2026-03-27', '2026-03-26', '2026-03-25']), 3);
  } finally {
    Date.now = realDateNow;
  }
});

test('calculateStreak accepts yesterday but breaks on first gap', () => {
  const realDateNow = Date.now;
  Date.now = () => new Date('2026-03-27T12:00:00Z').getTime();
  try {
    assert.equal(calculateStreak(['2026-03-26', '2026-03-24', '2026-03-23']), 1);
  } finally {
    Date.now = realDateNow;
  }
});

test('areConsecutiveDateKeys handles month transitions', () => {
  assert.equal(areConsecutiveDateKeys('2026-04-01', '2026-03-31'), true);
});

test('areConsecutiveDateKeys returns false when keys are not consecutive', () => {
  assert.equal(areConsecutiveDateKeys('2026-03-27', '2026-03-25'), false);
});
