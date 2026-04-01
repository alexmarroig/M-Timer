const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateSessionReward,
  getMoodFromStats,
  levelFromXp,
  moodWithRewardBoost,
} = require('../.tmp-test/core/utils/gamification.js');

test('calculateSessionReward increases with duration and streak', () => {
  const reward = calculateSessionReward(30 * 60, 5);
  assert.equal(reward.xp, 50);
  assert.equal(reward.coins, 9);
});

test('getMoodFromStats returns excited with high streak', () => {
  const mood = getMoodFromStats({
    totalSessions: 10,
    totalMinutes: 200,
    currentStreak: 7,
    longestStreak: 8,
    sessionsToday: 0,
    weeklyMinutes: 80,
  });
  assert.equal(mood, 'excited');
});

test('levelFromXp starts at level 1 and grows with xp', () => {
  assert.equal(levelFromXp(0), 1);
  assert.equal(levelFromXp(120), 3);
});

test('moodWithRewardBoost keeps companion happy on reward day for low base mood', () => {
  assert.equal(moodWithRewardBoost('sleepy', true), 'happy');
  assert.equal(moodWithRewardBoost('calm', true), 'happy');
  assert.equal(moodWithRewardBoost('excited', true), 'excited');
});
