const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeReminderConfig,
  shouldScheduleReminder,
} = require('../.tmp-test/services/notifications/notificationLogic.js');

test('notification logic normalizes invalid reminder time safely', () => {
  assert.deepEqual(
    normalizeReminderConfig({ enabled: true, hour: 99.8, minute: -2 }),
    { enabled: true, hour: 23, minute: 0 }
  );
});

test('notification logic skips disabled reminders', () => {
  assert.equal(shouldScheduleReminder({ enabled: false, hour: 7, minute: 30 }), false);
  assert.equal(shouldScheduleReminder({ enabled: true, hour: 7, minute: 30 }), true);
});
