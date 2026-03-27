/** Get date string in YYYY-MM-DD format */
export function toDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
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
    const prev = new Date(dateKeys[i - 1]);
    const curr = new Date(dateKeys[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
