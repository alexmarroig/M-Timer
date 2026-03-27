import { STORAGE_KEYS } from '../storage/keys';
import { storageService } from '../storage/storageService';
import { TimerContext } from './timerTypes';

let hydratedTimerState: TimerContext | null = null;

export async function restoreTimerState(): Promise<void> {
  const saved = await storageService.get<TimerContext>(STORAGE_KEYS.TIMER_STATE);

  if (!saved || saved.state === 'idle' || saved.state === 'finished') {
    hydratedTimerState = null;
    return;
  }

  hydratedTimerState = saved;
}

export function consumeRestoredTimerState(): TimerContext | null {
  return hydratedTimerState;
}
