import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  StyleSheet, Image, RefreshControl, useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { EVENTS_API, EventListing } from '../../lib/api';
import { useEventStore } from '../../stores/eventStore';
import { buildTheme, formatDate } from '../../lib/theme';

export default function EventSelectScreen() {
  const router = useRouter();
  const { setSlug, setEventListing } = useEventStore();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const theme = buildTheme(scheme);

  const [events, setEvents] = useState<EventListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const res = await axios.get<{ events: EventListing[] }>(EVENTS_API);
      setEvents(res.data.events ?? res.data);
    } catch (e: any) {
      setError(e.message ?? 'Nätverksfel');
    }
  };

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const pick = (event: EventListing) => {
    setSlug(event.slug);
    setEventListing(event);
    router.replace('/(onboarding)/roll');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.appName, { color: theme.text }]}>Eventio</Text>
        <Text style={[styles.appSub, { color: theme.textSecondary }]}>Välj ett event</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: theme.primary }]} onPress={load}>
            <Text style={styles.retryText}>Försök igen</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(e) => String(e.id)}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: insets.bottom + 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => pick(item)}
              activeOpacity={0.7}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, borderLeftColor: item.color_primary }]}
            >
              {item.logo_url ? (
                <View style={[styles.logoWrap, { backgroundColor: item.color_primary + '18' }]}>
                  <Image source={{ uri: item.logo_url }} style={styles.logo} resizeMode="contain" />
                </View>
              ) : (
                <View style={[styles.logoWrap, { backgroundColor: item.color_primary }]}>
                  <Text style={styles.logoLetter}>{item.name.charAt(0)}</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={[styles.cardName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.cardSub, { color: theme.textSecondary }]}>{item.tagline}</Text>
                <View style={styles.cardMeta}>
                  <View style={[styles.pill, { backgroundColor: item.color_primary + '18' }]}>
                    <Text style={[styles.pillText, { color: item.color_primary }]}>{item.location}</Text>
                  </View>
                  <Text style={[styles.dateText, { color: theme.textMuted }]}>
                    {new Date(item.start_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}
                    {' – '}
                    {new Date(item.end_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
              </View>
              <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 24 },
  header: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  appName: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  appSub: { fontSize: 14, marginTop: 2 },
  card: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 18,
    borderWidth: 1, borderLeftWidth: 4, overflow: 'hidden', gap: 0,
  },
  logoWrap: { width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 46, height: 46, borderRadius: 10 },
  logoLetter: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  cardBody: { flex: 1, paddingVertical: 14, paddingLeft: 12, gap: 3 },
  cardName: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  cardSub: { fontSize: 13 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  pillText: { fontSize: 12, fontWeight: '600' },
  dateText: { fontSize: 12 },
  arrow: { fontSize: 22, paddingHorizontal: 14, fontWeight: '300' },
  errorText: { fontSize: 14, textAlign: 'center' },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#FFF', fontWeight: '600' },
});
