import React from 'react';
import { View, Text, SectionList, RefreshControl, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMatsedel } from '../../hooks/useMatsedel';
import { useTheme } from '../../components/ThemeContext';
import MealCard from '../../components/MealCard';
import { SkeletonBox } from '../../components/SkeletonLoader';
import { MealEntry } from '../../lib/api';

function groupByDate(meals: MealEntry[]) {
  const map: Record<string, MealEntry[]> = {};
  for (const m of meals) {
    const key = m.meal_date;
    (map[key] ??= []).push(m);
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({ title: date, data }));
}

export default function MatsedelivScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useMatsedel();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sections = groupByDate(data ?? []);
  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
        <Text style={[styles.title, { color: theme.text }]}>Matsedel</Text>
      </View>

      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[1, 2, 3].map((i) => <SkeletonBox key={i} height={72} borderRadius={14} />)}
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={{ color: theme.danger }}>Kunde inte hämta matsedeln.</Text>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="restaurant-outline" size={40} color={theme.textMuted} />
          <Text style={{ color: theme.textMuted, marginTop: 10 }}>Ingen matsedel ännu.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderItem={() => null}
          renderSectionHeader={({ section }) => {
            const isToday = section.title === today;
            return (
              <View>
                <View style={[styles.dayHeadRow, { backgroundColor: theme.background }]}>
                  <Text style={[styles.dayLabel, { color: isToday ? theme.primary : theme.textMuted }]}>
                    {new Date(section.title).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </Text>
                  {isToday && (
                    <View style={[styles.todayBadge, { backgroundColor: theme.accentBg }]}>
                      <Text style={[styles.todayText, { color: theme.primary }]}>Idag</Text>
                    </View>
                  )}
                </View>
                <View style={styles.mealsContainer}>
                  {section.data.map((item) => <MealCard key={item.id} item={item} />)}
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
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
  dayHeadRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  dayLabel: { fontSize: 14, fontWeight: '700', flex: 1 },
  todayBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  todayText: { fontSize: 11, fontWeight: '700' },
  mealsContainer: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
});
