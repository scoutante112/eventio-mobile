import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList, NewsItem } from '../types';
import { fetchNews } from '../api/eventio';
import { useTheme } from '../theme/ThemeContext';
import ScreenShell from '../components/ScreenShell';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'News'>;

function NewsCard({ item }: { item: NewsItem }) {
  const { colors, event } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
      ) : null}
      <View style={styles.cardContent}>
        <Text style={[styles.cardDate, { color: colors.textMuted }]}>
          {new Date(item.published_at).toLocaleDateString('sv-SE', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.cardBody, { color: colors.textSecondary }]}>{item.body}</Text>
      </View>
    </View>
  );
}

export default function NewsScreen({ route }: Props) {
  const { event, role } = route.params;
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  const load = useCallback(async () => {
    try {
      setError(null);
      setNews(await fetchNews(event.api_base));
    } catch {
      setError('Kunde inte hämta nyheter.');
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
      <EventHeader event={event} role={role} />
      {news.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted }}>Inga nyheter just nu.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {news.map((item) => <NewsCard key={item.id} item={item} />)}
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
  cardImage: { width: '100%', height: 180 },
  cardContent: { padding: 16, gap: 6 },
  cardDate: { fontSize: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  cardBody: { fontSize: 14, lineHeight: 21 },
  empty: { padding: 40, alignItems: 'center' },
});
