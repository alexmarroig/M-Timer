"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDateKey = toDateKey;
exports.isSameDay = isSameDay;
exports.startOfWeek = startOfWeek;
exports.toWeekKey = toWeekKey;
exports.calculateStreak = calculateStreak;
exports.dateFromKey = dateFromKey;
exports.areConsecutiveDateKeys = areConsecutiveDateKeys;
/** Get date string in YYYY-MM-DD format */
function toDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
/** Check if two dates are the same calendar day */
function isSameDay(a, b) {
    return toDateKey(a) === toDateKey(b);
}
/** Get the start of the current week (Monday) */
function startOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}
/** Get stable week key based on Monday start date in YYYY-MM-DD */
function toWeekKey(date = new Date()) {
    return toDateKey(startOfWeek(date));
}
/** Calculate streak from a sorted array of date keys (desc) */
function calculateStreak(dateKeys) {
    if (dateKeys.length === 0)
        return 0;
    const today = toDateKey();
    const yesterday = toDateKey(new Date(Date.now() - 86400000));
    // Streak must include today or yesterday
    if (dateKeys[0] !== today && dateKeys[0] !== yesterday)
        return 0;
    let streak = 1;
    for (let i = 1; i < dateKeys.length; i++) {
        if (areConsecutiveDateKeys(dateKeys[i - 1], dateKeys[i])) {
            streak++;
        }
        else {
            break;
        }
    }
    return streak;
}
/** Convert a YYYY-MM-DD date key into a local date at midnight */
function dateFromKey(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
}
/** Whether two YYYY-MM-DD keys represent consecutive local dates (prev > curr). */
function areConsecutiveDateKeys(prevDateKey, currDateKey) {
    const prev = dateFromKey(prevDateKey);
    const curr = dateFromKey(currDateKey);
    const nextCurr = new Date(curr);
    nextCurr.setDate(curr.getDate() + 1);
    return toDateKey(nextCurr) === toDateKey(prev);
}
