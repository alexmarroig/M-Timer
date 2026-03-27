import { useEffect } from 'react';
import { performanceService } from '../../../services/performance/performanceService';

interface UseFpsProbeProps {
  enabled: boolean;
  sampleWindowMs?: number;
}

export function useFpsProbe({ enabled, sampleWindowMs = 4000 }: UseFpsProbeProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let rafId = 0;
    let frameCount = 0;
    let minFps = Number.POSITIVE_INFINITY;
    let lastFrameTime = 0;
    const start = Date.now();

    const loop = (now: number) => {
      frameCount += 1;

      if (lastFrameTime > 0) {
        const delta = now - lastFrameTime;
        if (delta > 0) {
          const currentFps = 1000 / delta;
          minFps = Math.min(minFps, currentFps);
        }
      }

      lastFrameTime = now;

      if (Date.now() - start >= sampleWindowMs) {
        const elapsedSeconds = Math.max((Date.now() - start) / 1000, 0.001);
        const avgFps = frameCount / elapsedSeconds;

        void performanceService.logMetric('timer_fps_avg', Number(avgFps.toFixed(2)), {
          window_ms: sampleWindowMs,
        });

        if (Number.isFinite(minFps)) {
          void performanceService.logMetric('timer_fps_min', Number(minFps.toFixed(2)), {
            window_ms: sampleWindowMs,
          });
        }

        return;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [enabled, sampleWindowMs]);
}
