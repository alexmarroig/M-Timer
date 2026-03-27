/** Format seconds into MM:SS */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/** Format seconds into a human-readable duration like "20 min" or "1h 5min" */
export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  if (remainMins === 0) return `${hours}h`;
  return `${hours}h ${remainMins}min`;
}

/** Get total duration from phase durations */
export function totalPhaseDuration(phases: { rampUp: number; core: number; cooldown: number }): number {
  return phases.rampUp + phases.core + phases.cooldown;
}

/** Format a phase duration as a short label like "2-20-3" */
export function phaseShortLabel(phases: { rampUp: number; core: number; cooldown: number }): string {
  return `${Math.round(phases.rampUp / 60)}-${Math.round(phases.core / 60)}-${Math.round(phases.cooldown / 60)}`;
}
