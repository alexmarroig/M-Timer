const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateSessionXp,
  deriveGamificationProfile,
} = require('../.tmp-test/services/gamificationEngine.js');

const {
  calculateSessionReward,
  getMoodFromStats,
  levelFromXp,
  moodWithRewardBoost,
} = require('../.tmp-test/core/utils/gamification.js');

function createSession(id, completedAt) {
  return {
    id,
    templateId: 'preset',
    templateName: 'Padrao',
    phases: { rampUp: 60, core: 1200, cooldown: 120 },
    startedAt: completedAt,
    completedAt,
    totalDuration: 1380,
    completed: true,
    countsForProgress: true,
  };
}

test('calculateSessionXp applies the base formula for a normal session', () => {
  assert.equal(
    calculateSessionXp({ currentStreak: 1, sessionsTodayBeforeCompletion: 0 }),
    11
  );
});

test('calculateSessionXp grants the second-session same-day bonus', () => {
  assert.equal(
    calculateSessionXp({ currentStreak: 3, sessionsTodayBeforeCompletion: 1 }),
    17
  );
});

test('calculateSessionXp caps the streak multiplier at 1.5x', () => {
  assert.equal(
    calculateSessionXp({ currentStreak: 99, sessionsTodayBeforeCompletion: 0 }),
    15
  );
});

test('deriveGamificationProfile returns the beginner baseline with no sessions', () => {
  const profile = deriveGamificationProfile({
    sessions: [],
    stats: {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      sessionsToday: 0,
      weeklyMinutes: 0,
      qualifiedSessions: 0,
    },
    xpOverride: 0
  });

  assert.equal(profile.currentLevel, 1);
  assert.equal(profile.levelLabel, 'Beginner');
  assert.equal(profile.xpTotal, 0);
  assert.equal(profile.xpToNextLevel, 100);
});

test('deriveGamificationProfile crosses into stabilizing when XP passes 100', () => {
  const profile = deriveGamificationProfile({
    sessions: [],
    stats: {
      totalSessions: 5,
      totalMinutes: 115,
      currentStreak: 4,
      longestStreak: 4,
      sessionsToday: 1,
      weeklyMinutes: 115,
      qualifiedSessions: 5,
    },
    xpOverride: 110
  });

  assert.equal(profile.currentLevel, 2);
  assert.equal(profile.levelLabel, 'Stabilizing');
  assert.equal(profile.xpTotal, 110);
  assert.equal(profile.xpIntoLevel, 10);
});

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
    qualifiedSessions: 10,
  });

  assert.equal(mood, 'excited');
});

test('levelFromXp starts at level 1 and grows with xp', () => {
  assert.equal(levelFromXp(0), 1);
  assert.equal(levelFromXp(120), 3);
});

test('moodWithRewardBoost raises low moods gradually on reward day', () => {
  assert.equal(moodWithRewardBoost('sleepy', true), 'calm');
  assert.equal(moodWithRewardBoost('calm', true), 'happy');
  assert.equal(moodWithRewardBoost('excited', true), 'excited');
});
