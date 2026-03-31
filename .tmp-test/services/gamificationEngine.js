"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreakMultiplier = getStreakMultiplier;
exports.calculateSessionXp = calculateSessionXp;
exports.deriveGamificationProfile = deriveGamificationProfile;
const date_1 = require("../core/utils/date");
const LEVEL_DEFINITIONS = [
    { minXp: 0, label: 'Beginner', tier: 'beginner' },
    { minXp: 50, label: 'Stabilizing', tier: 'stabilizing' },
    { minXp: 125, label: 'Deepening', tier: 'deepening' },
    { minXp: 250, label: 'Consistent', tier: 'consistent' },
    { minXp: 400, label: 'Integrated', tier: 'integrated' },
];
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function getStreakMultiplier(currentStreak) {
    return Math.min(1.5, 1 + Math.min(currentStreak, 10) * 0.05);
}
function calculateSessionXp({ currentStreak, sessionsTodayBeforeCompletion, }) {
    const streakMultiplier = getStreakMultiplier(currentStreak);
    const sameDayBonus = sessionsTodayBeforeCompletion === 1 ? 5 : 0;
    return Math.round(10 * streakMultiplier) + sameDayBonus;
}
function getLevelIndexForXp(xpTotal) {
    for (let index = LEVEL_DEFINITIONS.length - 1; index >= 0; index -= 1) {
        if (xpTotal >= LEVEL_DEFINITIONS[index].minXp) {
            return index;
        }
    }
    return 0;
}
function getXpTotalFromSessions(sessions) {
    const completedSessions = sessions
        .filter((session) => session.completed)
        .sort((left, right) => new Date(left.completedAt).getTime() - new Date(right.completedAt).getTime());
    let xpTotal = 0;
    let previousDateKey = null;
    let currentStreak = 0;
    let sessionsToday = 0;
    for (const session of completedSessions) {
        const dateKey = (0, date_1.toDateKey)(new Date(session.completedAt));
        if (dateKey !== previousDateKey) {
            sessionsToday = 0;
            if (!previousDateKey) {
                currentStreak = 1;
            }
            else if ((0, date_1.areConsecutiveDateKeys)(dateKey, previousDateKey)) {
                currentStreak += 1;
            }
            else {
                currentStreak = 1;
            }
        }
        xpTotal += calculateSessionXp({
            currentStreak,
            sessionsTodayBeforeCompletion: sessionsToday,
        });
        sessionsToday += 1;
        previousDateKey = dateKey;
    }
    return xpTotal;
}
function deriveGamificationProfile({ sessions, stats, }) {
    const xpTotal = getXpTotalFromSessions(sessions);
    const levelIndex = getLevelIndexForXp(xpTotal);
    const currentLevelDefinition = LEVEL_DEFINITIONS[levelIndex];
    const nextLevelDefinition = LEVEL_DEFINITIONS[levelIndex + 1] ?? null;
    const xpIntoLevel = xpTotal - currentLevelDefinition.minXp;
    const xpToNextLevel = nextLevelDefinition ? nextLevelDefinition.minXp - xpTotal : 0;
    const currentLevelSpan = nextLevelDefinition
        ? nextLevelDefinition.minXp - currentLevelDefinition.minXp
        : Math.max(50, xpIntoLevel || 50);
    return {
        xpTotal,
        xpIntoLevel,
        xpToNextLevel,
        progressWithinLevel: clamp(xpIntoLevel / currentLevelSpan, 0, 1),
        currentLevel: levelIndex + 1,
        levelLabel: currentLevelDefinition.label,
        nextLevelLabel: nextLevelDefinition?.label ?? null,
        bestStreak: stats.longestStreak,
        streakMultiplier: getStreakMultiplier(stats.currentStreak),
        evolutionTier: currentLevelDefinition.tier,
        totalSessions: stats.totalSessions,
        totalMinutes: stats.totalMinutes,
        sessionsToday: stats.sessionsToday,
    };
}
