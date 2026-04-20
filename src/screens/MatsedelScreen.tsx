import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList, MatsedelDay } from '../types';
import { fetchMatsedel } from '../api/eventio';
import { useTheme } from '../theme/ThemeContext';
import ScreenShell from '../components/ScreenShell';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'Matsedel'>;

const ALT_ICONS: Record<string, string> = {
  vegetarian: '🌱',
  vegan: '🌿',
  'gluten-free': '🚫',
};

function MealRow({ time, name, description, alternatives }: MatsedelDay['meals'][0]) {
  const { colors, event } = useTheme();
  return (
    <View style={[styles.mealRow, { borderTopColor: colors.border }]}>
      <Text style={[styles.mealTime, { color: event.primary }]}>{time}</Text>
      <View style={styles.mealBody}>
        <Text style={[styles.mealName, { color: colors.text }]}>{name}</Text>
        {description ? (
          <Text style={[styles.mealDesc, { color: colors.textSecondary }]}>{description}</Text>
        ) : null}
        {alternatives?.map((alt, i) => (
          <Text key={i} style={[styles.altText, { color: colors.textMuted }]}>
            {ALT_ICONS[alt.type] ?? '•'} {alt.text}
          </Text>
        ))}
      </View>
    </View>
  );
}

function DayCard({ day, isToday }: { day: MatsedelDay; isToday: boolean }) {
  const { colors, event } = useTheme();
  return (
    <View
      style={[
        styles.dayCard,
        {
          backgroundColor: colors.card,
          borderColor: isToday ? event.primary : colors.border,
          borderLeftColor: event.primary,
        },
      ]}
    >
      <View style={[styles.dayHeader, { borderBottomColor: colors.border }]}>
        <Text style={[styles.dayName, { color: isToday ? event.primary : colors.text }]}>
          {day.name}
          {isToday ? '  –  Idag' : ''}
        </Text>
        {day.subtitle ? (
          <Text style={[styles.daySubtitle, { color: colors.textMuted }]}>{day.subtitle}</Text>
        ) : null}
      </View>
      {day.meals.map((meal, i) => (
        <MealRow key={i} {...meal} />
      ))}
    </View>
  );
}

export default function MatsedelScreen({ route }: Props) {
  const { event, role } = route.params;
  const [days, setDays] = useState<MatsedelDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  const today = new Date().toISOString().split('T')[0];

  const load = useCallback(async () => {
    try {
      setError(null);
      setDays(await fetchMatsedel(event.api_base));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Kunde inte hämta matsedeln.\n${msg}`);
    }
  }, [event.api_base]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <ScreenShell loading={loading} error={error} onRetry={load} onRefresh={onRefresh} refreshing={refreshing}>
      <EventHeader event={event} role={role} subtitle="Matsedel" />
      {days.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>Ingen matsedel tillgänglig.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {days.map((day, i) => (
            <DayCard key={day.date ?? i} day={day} isToday={day.date === today} />
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  dayCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dayName: { fontSize: 15, fontWeight: '700' },
  daySubtitle: { fontSize: 12 },
  mealRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  mealTime: { fontSize: 12, fontWeight: '700', width: 72, paddingTop: 2 },
  mealBody: { flex: 1, gap: 3 },
  mealName: { fontSize: 15, fontWeight: '600' },
  mealDesc: { fontSize: 13, lineHeight: 19 },
  altText: { fontSize: 12 },
  empty: { padding: 40, alignItems: 'center' },
});
