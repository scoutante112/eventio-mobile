import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList, InfoSection } from '../types';
import { fetchInfo } from '../api/eventio';
import { useTheme } from '../theme/ThemeContext';
import ScreenShell from '../components/ScreenShell';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'Info'>;

export default function InfoScreen({ route }: Props) {
  const { event, role } = route.params;
  const [sections, setSections] = useState<InfoSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, event: theme } = useTheme();

  const load = useCallback(async () => {
    try {
      setError(null);
      setSections(await fetchInfo(event.api_base));
    } catch {
      setError('Kunde inte hämta informationen.');
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
      <EventHeader event={event} role={role} subtitle="Info" />
      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted }}>Ingen info tillgänglig.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {sections.map((section) => (
            <View key={section.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>{section.title}</Text>
              </View>
              <Text style={[styles.cardBody, { color: colors.textSecondary }]}>{section.body}</Text>
            </View>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardBody: { padding: 14, fontSize: 14, lineHeight: 22 },
  empty: { padding: 40, alignItems: 'center' },
});
