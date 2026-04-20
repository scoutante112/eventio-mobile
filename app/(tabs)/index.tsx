import React from 'react';
import {
  View, Text, FlatList, RefreshControl, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNews } from '../../hooks/useNews';
import { useEventStore } from '../../stores/eventStore';
import { useTheme } from '../../components/ThemeContext';
import NewsCard from '../../components/NewsCard';
import { NewsCardSkeleton } from '../../components/SkeletonLoader';

export default function HemScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useNews();
  const eventData = useEventStore((s) => s.eventData);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
        <Text style={[styles.eventName, { color: theme.text }]}>
          {eventData?.name ?? 'Eventio'}
        </Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          {eventData?.tagline ?? 'Nyheter'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.skeletons}>
          {[1, 2, 3].map((i) => <NewsCardSkeleton key={i} />)}
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={{ color: theme.danger, textAlign: 'center' }}>
            Kunde inte hämta nyheter.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <NewsCard item={item} />}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: insets.bottom + 24 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.primary} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: theme.textMuted }}>Inga nyheter just nu.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  eventName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { fontSize: 14, marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  skeletons: { paddingTop: 12 },
});
