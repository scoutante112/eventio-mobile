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
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

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
        navigation.navigate('RoleSelect', { event });
      }
    },
    [navigation],
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.appTitle, { color: colors.text }]}>Eventio</Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
            {events.length > 0 ? `${events.length} aktiva event` : 'Inga aktiva event'}
          </Text>
        </View>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => handleEventPress(item)} />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: colors.textMuted }}>Inga aktiva event hittades.</Text>
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
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  appSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  list: {
    paddingTop: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
