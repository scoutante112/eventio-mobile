import React from 'react';
import { View, Text, SectionList, RefreshControl, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSchedule } from '../../hooks/useSchedule';
import { useTheme } from '../../components/ThemeContext';
import ScheduleItemRow from '../../components/ScheduleItem';
import { SkeletonBox } from '../../components/SkeletonLoader';
import { ScheduleEntry } from '../../lib/api';

function groupByDate(entries: ScheduleEntry[]) {
  const map: Record<string, ScheduleEntry[]> = {};
  for (const e of entries) {
    const key = e.event_date;
    (map[key] ??= []).push(e);
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({ title: date, data }));
}

function formatSectionTitle(date: string) {
  return new Date(date).toLocaleDateString('sv-SE', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

export default function SchemaScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useSchedule();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sections = groupByDate(data ?? []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
        <Text style={[styles.title, { color: theme.text }]}>Schema</Text>
      </View>

      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[1, 2, 3, 4].map((i) => <SkeletonBox key={i} height={56} borderRadius={12} />)}
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={{ color: theme.danger }}>Kunde inte hämta schemat.</Text>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={40} color={theme.textMuted} />
          <Text style={{ color: theme.textMuted, marginTop: 10 }}>Inget schema ännu.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderItem={() => null}
          renderSectionHeader={({ section }) => (
            <View>
              <Text style={[styles.sectionHeader, { color: theme.textMuted, backgroundColor: theme.background }]}>
                {formatSectionTitle(section.title)}
              </Text>
              <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {section.data.map((item) => <ScheduleItemRow key={item.id} item={item} />)}
              </View>
            </View>
          )}
          SectionSeparatorComponent={() => <View style={{ height: 4 }} />}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          stickySectionHeadersEnabled
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.primary} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sectionHeader: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 0.8, paddingHorizontal: 20, paddingVertical: 10,
  },
  sectionCard: {
    marginHorizontal: 16, borderRadius: 16, borderWidth: 1,
    overflow: 'hidden', marginBottom: 4,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
});
