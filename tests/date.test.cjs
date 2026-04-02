const test = require('node:test');
const assert = require('node:assert/strict');

const {
  toDateKey,
  calculateStreak,
  areConsecutiveDateKeys,
} = require('../.tmp-test/core/utils/date.js');

<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
test('toDateKey keeps the local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-27');
=======
test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
>>>>>>> theirs
=======
test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
>>>>>>> theirs
=======
test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
>>>>>>> theirs
=======
test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
>>>>>>> theirs
=======
test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
>>>>>>> theirs
=======
test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
>>>>>>> theirs
=======
test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
>>>>>>> theirs
=======
test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
>>>>>>> theirs
=======
test('toDateKey uses local calendar date for late night negative offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T23:30:00-03:00');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-28');
>>>>>>> theirs
});

test('toDateKey uses local calendar date for early morning positive offset sessions', () => {
  const sessionNearMidnight = new Date('2026-03-27T00:30:00+05:30');
  assert.equal(toDateKey(sessionNearMidnight), '2026-03-26');
});

test('calculateStreak counts consecutive local keys including today', () => {
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
  const today = toDateKey(new Date());
  const yesterday = toDateKey(new Date(Date.now() - 86400000));
  const dayBefore = toDateKey(new Date(Date.now() - 86400000 * 2));

  assert.equal(calculateStreak([today, yesterday, dayBefore]), 3);
});

test('calculateStreak accepts yesterday but breaks on first gap', () => {
  const yesterday = toDateKey(new Date(Date.now() - 86400000));
  const twoDaysAgo = toDateKey(new Date(Date.now() - 86400000 * 2));
  const fourDaysAgo = toDateKey(new Date(Date.now() - 86400000 * 4));

  assert.equal(calculateStreak([yesterday, twoDaysAgo, fourDaysAgo]), 2);
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
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
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
  const today = toDateKey(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  assert.equal(calculateStreak([today, toDateKey(yesterdayDate), toDateKey(twoDaysAgo)]), 3);
});

test('calculateStreak accepts yesterday but breaks on first gap', () => {
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const fourDaysAgo = new Date();
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
  assert.equal(calculateStreak([toDateKey(yesterdayDate), toDateKey(threeDaysAgo), toDateKey(fourDaysAgo)]), 1);
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
});

test('areConsecutiveDateKeys handles month transitions', () => {
  assert.equal(areConsecutiveDateKeys('2026-04-01', '2026-03-31'), true);
});

test('areConsecutiveDateKeys returns false when keys are not consecutive', () => {
  assert.equal(areConsecutiveDateKeys('2026-03-27', '2026-03-25'), false);
});
