const test = require('node:test');
const assert = require('node:assert/strict');

const {
  toDateKey,
  calculateStreak,
  areConsecutiveDateKeys,
} = require('../.tmp-test/core/utils/date.js');

test('toDateKey keeps the local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
});

test('toDateKey uses local calendar date for early morning positive offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T00:30:00+05:30');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-26');
});

test('calculateStreak counts consecutive local keys including today', () => {
  const today = toDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dayBefore = new Date();
  dayBefore.setDate(dayBefore.getDate() - 2);

  assert.equal(calculateStreak([today, toDateKey(yesterday), toDateKey(dayBefore)]), 3);
});

test('calculateStreak accepts yesterday but breaks on first gap', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const fourDaysAgo = new Date();
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

  assert.equal(
    calculateStreak([toDateKey(yesterday), toDateKey(twoDaysAgo), toDateKey(fourDaysAgo)]),
    2
  );
});

test('areConsecutiveDateKeys handles month transitions', () => {
  assert.equal(areConsecutiveDateKeys('2026-04-01', '2026-03-31'), true);
});

test('areConsecutiveDateKeys returns false when keys are not consecutive', () => {
  assert.equal(areConsecutiveDateKeys('2026-03-28', '2026-03-25'), false);
});
