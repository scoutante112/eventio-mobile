import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../components/ThemeContext';
import { useEventStore } from '../../stores/eventStore';
import { api, getApiBase, NewsItem } from '../../lib/api';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const slug = useEventStore((s) => s.slug);

  const { data: item, isLoading, isError } = useQuery<NewsItem>({
    queryKey: ['news', slug, id],
    queryFn: async () => {
      const r = await api.get<NewsItem>(`/news/${id}`, { baseURL: getApiBase(slug!) });
      return r.data;
    },
    enabled: !!slug && !!id,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color={theme.primary} />
          <Text style={[styles.backText, { color: theme.primary }]}>Tillbaka</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : isError || !item ? (
        <View style={styles.center}>
          <Text style={{ color: theme.danger }}>Kunde inte hämta nyheten.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <View style={styles.meta}>
            {item.author ? (
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{item.author}</Text>
            ) : null}
            {item.created_at ? (
              <Text style={[styles.metaText, { color: theme.textMuted }]}>
                {new Date(item.created_at).toLocaleDateString('sv-SE', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </Text>
            ) : null}
          </View>
          <Text style={[styles.body, { color: theme.textSecondary }]}>
            {stripTagsPreserveNewlines(item.body ?? '')}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

function stripTagsPreserveNewlines(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { fontSize: 16, fontWeight: '500' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.3, lineHeight: 30, marginBottom: 10 },
  meta: { flexDirection: 'row', gap: 12, marginBottom: 18, flexWrap: 'wrap' },
  metaText: { fontSize: 13 },
  body: { fontSize: 15, lineHeight: 24 },
});
