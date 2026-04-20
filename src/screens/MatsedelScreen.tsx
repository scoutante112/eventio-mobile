import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList, MatsedelItem } from '../types';
import { fetchMatsedel } from '../api/eventio';
import { useTheme } from '../theme/ThemeContext';
import ScreenShell from '../components/ScreenShell';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'Matsedel'>;

export default function MatsedelScreen({ route }: Props) {
  const { event, role } = route.params;
  const [items, setItems] = useState<MatsedelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, event: theme } = useTheme();

  const load = useCallback(async () => {
    try {
      setError(null);
      setItems(await fetchMatsedel(event.api_base));
    } catch {
      setError('Kunde inte hämta matsedeln.');
    }
  }, [event.api_base]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const days = [...new Set(items.map((i) => i.date).filter(Boolean))];

  return (
    <ScreenShell loading={loading} error={error} onRetry={load} onRefresh={onRefresh} refreshing={refreshing}>
      <EventHeader event={event} role={role} subtitle="Matsedel" />
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted }}>Ingen matsedel tillgänglig.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {days.length > 0
            ? days.map((day) => (
                <View key={day}>
                  <Text style={[styles.dayHeader, { color: colors.textMuted }]}>{day}</Text>
                  {items.filter((i) => i.date === day).map((item) => (
                    <MealRow key={item.id} item={item} />
                  ))}
                </View>
              ))
            : items.map((item) => <MealRow key={item.id} item={item} />)}
        </View>
      )}
    </ScreenShell>
  );
}

function MealRow({ item }: { item: MatsedelItem }) {
  const { colors, event } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.dot, { backgroundColor: event.primary }]} />
      <View style={styles.cardBody}>
        {item.time ? (
          <Text style={[styles.time, { color: event.primary }]}>{item.time}</Text>
        ) : null}
        <Text style={[styles.meal, { color: colors.text }]}>{item.meal}</Text>
        {item.description ? (
          <Text style={[styles.desc, { color: colors.textSecondary }]}>{item.description}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 8 },
  dayHeader: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  cardBody: { flex: 1, gap: 3 },
  time: { fontSize: 12, fontWeight: '600' },
  meal: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  desc: { fontSize: 13, lineHeight: 19 },
  empty: { padding: 40, alignItems: 'center' },
});
