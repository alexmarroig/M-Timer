const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateSessionXp,
  deriveGamificationProfile,
} = require('../.tmp-test/services/gamificationEngine.js');

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
    },
  });

  assert.equal(profile.currentLevel, 1);
  assert.equal(profile.levelLabel, 'Beginner');
  assert.equal(profile.xpTotal, 0);
  assert.equal(profile.xpToNextLevel, 50);
});

test('deriveGamificationProfile crosses into stabilizing when XP passes 50', () => {
  const sessions = [
    createSession('1', '2026-03-24T07:00:00-03:00'),
    createSession('2', '2026-03-25T07:00:00-03:00'),
    createSession('3', '2026-03-26T07:00:00-03:00'),
    createSession('4', '2026-03-26T18:30:00-03:00'),
    createSession('5', '2026-03-27T07:00:00-03:00'),
  ];

  const profile = deriveGamificationProfile({
    sessions,
    stats: {
      totalSessions: 5,
      totalMinutes: 115,
      currentStreak: 4,
      longestStreak: 4,
      sessionsToday: 1,
      weeklyMinutes: 115,
    },
  });

  assert.equal(profile.currentLevel, 2);
  assert.equal(profile.levelLabel, 'Stabilizing');
  assert.equal(profile.xpTotal, 63);
  assert.equal(profile.xpIntoLevel, 13);
});

test('deriveGamificationProfile uses stats.longestStreak as bestStreak', () => {
  const profile = deriveGamificationProfile({
    sessions: [createSession('1', '2026-03-24T07:00:00-03:00')],
    stats: {
      totalSessions: 1,
      totalMinutes: 23,
      currentStreak: 1,
      longestStreak: 7,
      sessionsToday: 1,
      weeklyMinutes: 23,
    },
  });

  assert.equal(profile.bestStreak, 7);
});