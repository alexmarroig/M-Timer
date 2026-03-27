import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MinimalText } from '../../../components/ui/MinimalText';
import { colors, spacing, borderRadius } from '../../../core/theme';

interface Props {
  sessionDates: string[]; // YYYY-MM-DD
}

const DAYS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export function CalendarView({ sessionDates }: Props) {
  const { weeks, monthLabel } = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0

    const dateSet = new Set(sessionDates);

    const weeks: ({ day: number; hasSession: boolean; isToday: boolean } | null)[][] = [];
    let week: ({ day: number; hasSession: boolean; isToday: boolean } | null)[] = [];

    // Fill leading empties
    for (let i = 0; i < startDow; i++) week.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      week.push({
        day: d,
        hasSession: dateSet.has(dateKey),
        isToday: d === today.getDate(),
      });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    const monthLabel = firstDay.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    return { weeks, monthLabel };
  }, [sessionDates]);

  return (
    <View style={styles.container}>
      <MinimalText variant="subheading" style={styles.monthLabel}>
        {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
      </MinimalText>

      <View style={styles.headerRow}>
        {DAYS.map((d, i) => (
          <View key={i} style={styles.cell}>
            <MinimalText variant="caption" align="center" color={colors.textSecondary}>
              {d}
            </MinimalText>
          </View>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={styles.row}>
          {week.map((cell, ci) => (
            <View key={ci} style={styles.cell}>
              {cell && (
                <View
                  style={[
                    styles.dayCircle,
                    cell.hasSession && styles.dayWithSession,
                    cell.isToday && styles.dayToday,
                  ]}
                >
                  <MinimalText
                    variant="caption"
                    align="center"
                    color={
                      cell.hasSession
                        ? colors.textInverse
                        : cell.isToday
                        ? colors.primary
                        : colors.textPrimary
                    }
                  >
                    {cell.day}
                  </MinimalText>
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  monthLabel: {
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayWithSession: {
    backgroundColor: colors.primary,
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
});
