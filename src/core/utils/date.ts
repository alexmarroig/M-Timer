/** Get date string in YYYY-MM-DD format */
export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Check if two dates are the same calendar day */
export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

/** Get the start of the current week (Monday) */
export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Get stable week key based on Monday start date in YYYY-MM-DD */
export function toWeekKey(date: Date = new Date()): string {
  return toDateKey(startOfWeek(date));
}

/** Calculate streak from a sorted array of date keys (desc) */
export function calculateStreak(dateKeys: string[]): number {
  if (dateKeys.length === 0) return 0;

  const today = toDateKey();
  const yesterday = toDateKey(new Date(Date.now() - 86400000));

  // Streak must include today or yesterday
  if (dateKeys[0] !== today && dateKeys[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dateKeys.length; i++) {
    if (areConsecutiveDateKeys(dateKeys[i - 1], dateKeys[i])) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** Convert a YYYY-MM-DD date key into a local date at midnight */
export function dateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Whether two YYYY-MM-DD keys represent consecutive local dates (prev > curr). */
export function areConsecutiveDateKeys(prevDateKey: string, currDateKey: string): boolean {
  const prev = dateFromKey(prevDateKey);
  const curr = dateFromKey(currDateKey);
  const nextCurr = new Date(curr);
  nextCurr.setDate(curr.getDate() + 1);
  return toDateKey(nextCurr) === toDateKey(prev);
}
