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
  const { event } = route.params;
  const [sections, setSections] = useState<InfoSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, event: theme } = useTheme();

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchInfo(event.api_base);
      setSections(data);
    } catch {
      setError('Kunde inte hämta informationen.');
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
      <EventHeader event={event} subtitle="Info" />
      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.subtext }}>Ingen info tillgänglig.</Text>
        </View>
      ) : (
        sections.map((section) => (
          <View key={section.id} style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={[styles.titleBar, { backgroundColor: theme.primary }]}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={[styles.sectionText, { color: colors.text }]}>
                {section.body}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  titleBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionBody: {
    padding: 16,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  empty: { padding: 32, alignItems: 'center' },
});
