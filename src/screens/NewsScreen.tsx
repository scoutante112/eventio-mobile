import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList, NewsItem } from '../types';
import { fetchNews } from '../api/eventio';
import { useTheme } from '../theme/ThemeContext';
import ScreenShell from '../components/ScreenShell';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'News'>;

function NewsCard({ item }: { item: NewsItem }) {
  const { colors } = useTheme();
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : null}
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.cardDate, { color: colors.subtext }]}>
          {new Date(item.published_at).toLocaleDateString('sv-SE', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={[styles.cardBody2, { color: colors.text }]}>{item.body}</Text>
      </View>
    </View>
  );
}

export default function NewsScreen({ route, navigation }: Props) {
  const { event, role } = route.params;
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, event: theme } = useTheme();

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchNews(event.api_base);
      setNews(data);
    } catch {
      setError('Kunde inte hämta nyheter.');
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
      <EventHeader event={event} role={role} />
      {news.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.subtext }}>Inga nyheter just nu.</Text>
        </View>
      ) : (
        news.map((item) => <NewsCard key={item.id} item={item} />)
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    padding: 16,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDate: {
    fontSize: 12,
  },
  cardBody2: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
});
