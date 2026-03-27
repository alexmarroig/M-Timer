import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SessionInstance } from '../../../types/session';
import { MinimalText } from '../../../components/ui/MinimalText';
import { Card } from '../../../components/ui/Card';
import { colors, spacing } from '../../../core/theme';
import { formatDuration } from '../../../core/utils/time';

interface Props {
  session: SessionInstance;
}

export function SessionListItem({ session }: Props) {
  const date = new Date(session.completedAt);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString([], { day: 'numeric', month: 'short' });

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <MinimalText variant="body" style={styles.name}>
            {session.templateName}
          </MinimalText>
          <MinimalText variant="caption" color={colors.textSecondary}>
            {dateStr} - {timeStr}
          </MinimalText>
        </View>
        <View style={styles.right}>
          <MinimalText variant="body" color={colors.primary}>
            {formatDuration(session.totalDuration)}
          </MinimalText>
          {session.completed && (
            <MinimalText variant="caption" color={colors.success}>
              Completa
            </MinimalText>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
  name: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
});
