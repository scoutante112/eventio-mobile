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
  const { event } = route.params;
  const [items, setItems] = useState<MatsedelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, event: theme } = useTheme();

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchMatsedel(event.api_base);
      setItems(data);
    } catch {
      setError('Kunde inte hämta matsedeln.');
    }
  }, [event.api_base]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <ScreenShell
      loading={loading}
      error={error}
      onRetry={load}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <EventHeader event={event} subtitle="Matsedel" />
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.subtext }}>Ingen matsedel tillgänglig.</Text>
        </View>
      ) : (
        items.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: colors.card }]}
          >
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={styles.content}>
              {(item.date || item.time) ? (
                <Text style={[styles.meta, { color: colors.subtext }]}>
                  {[item.date, item.time].filter(Boolean).join('  ·  ')}
                </Text>
              ) : null}
              <Text style={[styles.meal, { color: colors.text }]}>{item.meal}</Text>
              {item.description ? (
                <Text style={[styles.desc, { color: colors.subtext }]}>{item.description}</Text>
              ) : null}
            </View>
          </View>
        ))
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  content: { flex: 1, gap: 4 },
  meta: { fontSize: 12 },
  meal: { fontSize: 16, fontWeight: '700' },
  desc: { fontSize: 13, lineHeight: 19 },
  empty: { padding: 32, alignItems: 'center' },
});
