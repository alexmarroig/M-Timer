import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SessionPhase, PHASE_ORDER, PhaseDuration } from '../../../types/session';
import { colors, spacing, borderRadius } from '../../../core/theme';

interface Props {
  phases: PhaseDuration;
  progress: Record<SessionPhase, number>;
}

const PHASE_COLORS: Record<SessionPhase, string> = {
  rampUp: colors.rampUp,
  core: colors.core,
  cooldown: colors.cooldown,
};

export function TimelineProgress({ phases, progress }: Props) {
  const total = phases.rampUp + phases.core + phases.cooldown;
  if (total === 0) return null;

  return (
    <View style={styles.container}>
      {PHASE_ORDER.map((phase, index) => {
        const widthPercent = (phases[phase] / total) * 100;
        const fillPercent = progress[phase] * 100;
        const isFirst = index === 0;
        const isLast = index === PHASE_ORDER.length - 1;

        return (
          <View
            key={phase}
            style={[
              styles.segment,
              {
                flex: widthPercent,
                borderTopLeftRadius: isFirst ? borderRadius.sm : 0,
                borderBottomLeftRadius: isFirst ? borderRadius.sm : 0,
                borderTopRightRadius: isLast ? borderRadius.sm : 0,
                borderBottomRightRadius: isLast ? borderRadius.sm : 0,
              },
            ]}
          >
            <View
              style={[
                styles.fill,
                {
                  width: `${fillPercent}%`,
                  backgroundColor: PHASE_COLORS[phase],
                  borderTopLeftRadius: isFirst ? borderRadius.sm : 0,
                  borderBottomLeftRadius: isFirst ? borderRadius.sm : 0,
                  borderTopRightRadius:
                    isLast && fillPercent === 100 ? borderRadius.sm : 0,
                  borderBottomRightRadius:
                    isLast && fillPercent === 100 ? borderRadius.sm : 0,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  fill: {
    height: '100%',
  },
});
