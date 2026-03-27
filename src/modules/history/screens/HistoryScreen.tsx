import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { MinimalText } from '../../../components/ui/MinimalText';
import { SessionListItem } from '../components/SessionListItem';
import { CalendarView } from '../components/CalendarView';
import { StatsCard } from '../components/StatsCard';
import { useHistoryStore } from '../../../store/historyStore';
import { colors, spacing } from '../../../core/theme';

export function HistoryScreen() {
  const sessions = useHistoryStore((s) => s.sessions);
  const getStats = useHistoryStore((s) => s.getStats);
  const getSessionDates = useHistoryStore((s) => s.getSessionDates);

  const stats = getStats();
  const sessionDates = getSessionDates();

  const renderHeader = () => (
    <View>
      <MinimalText variant="heading" style={styles.title}>
        Histórico
      </MinimalText>

      <View style={styles.section}>
        <CalendarView sessionDates={sessionDates} />
      </View>

      <View style={styles.section}>
        <StatsCard stats={stats} />
      </View>

      {sessions.length > 0 && (
        <MinimalText variant="subheading" style={styles.sectionTitle}>
          Sessões recentes
        </MinimalText>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <MinimalText variant="body" color={colors.textSecondary} align="center">
        Nenhuma sessão registrada ainda.
      </MinimalText>
      <MinimalText variant="caption" color={colors.textSecondary} align="center">
        Complete sua primeira sessão para ver seu progresso.
      </MinimalText>
    </View>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SessionListItem session={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  empty: {
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
});
