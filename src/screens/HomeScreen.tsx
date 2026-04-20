import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, EventSummary, UserRole } from '../types';
import { fetchEvents } from '../api/eventio';
import { getRole } from '../store/storage';
import EventCard from '../components/EventCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDark = useColorScheme() === 'dark';
  const bg = isDark ? '#111827' : '#F9FAFB';
  const insets = useSafeAreaInsets();

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchEvents();
      setEvents(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('fetchEvents error:', msg);
      setError(`Kunde inte hämta event.\n${msg}`);
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleEventPress = useCallback(
    async (event: EventSummary) => {
      const savedRole = await getRole(event.slug);
      if (savedRole) {
        navigation.navigate('EventTabs', { event, role: savedRole });
      } else {
        // fetchEventDetail to check if funkis is enabled would be ideal
        // but we navigate to RoleSelect which handles that check
        navigation.navigate('RoleSelect', { event });
      }
    },
    [navigation],
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={[styles.appTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
          Eventio
        </Text>
        <Text style={[styles.appSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Välj ett event för att komma igång
        </Text>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: isDark ? '#F87171' : '#EF4444' }]}>
            {error}
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => handleEventPress(item)} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                Inga aktiva event hittades.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  list: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
  },
});
