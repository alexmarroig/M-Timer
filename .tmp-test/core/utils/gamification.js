"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoodFromStats = getMoodFromStats;
exports.calculateSessionReward = calculateSessionReward;
exports.levelFromXp = levelFromXp;
exports.moodWithRewardBoost = moodWithRewardBoost;
function getMoodFromStats(stats) {
    if (stats.sessionsToday >= 2 || stats.currentStreak >= 7)
        return 'excited';
    if (stats.currentStreak >= 3)
        return 'happy';
    if (stats.sessionsToday >= 1)
        return 'calm';
    return 'sleepy';
}
function calculateSessionReward(totalDurationSeconds, currentStreak) {
    const durationMinutes = Math.max(1, Math.round(totalDurationSeconds / 60));
    const streakBonus = Math.min(20, currentStreak * 2);
    const xp = 10 + durationMinutes + streakBonus;
    const coins = 2 + Math.floor(durationMinutes / 5) + Math.floor(currentStreak / 3);
    return { xp, coins };
}
function levelFromXp(xp) {
    return Math.floor(Math.sqrt(Math.max(0, xp) / 30)) + 1;
}
function moodWithRewardBoost(baseMood, hasRewardToday) {
    if (!hasRewardToday)
        return baseMood;
    if (baseMood === 'sleepy')
        return 'calm';
    if (baseMood === 'calm')
        return 'happy';
    return baseMood;
}
