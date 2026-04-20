import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { NewsItem } from '../lib/api';
import { useTheme } from './ThemeContext';
import { excerpt, stripHtml } from '../lib/htmlUtils';
import { formatTime } from '../lib/theme';

interface Props {
  item: NewsItem;
}

export default function NewsCard({ item }: Props) {
  const { card, border, text, textSecondary, textMuted, primary } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/news/${item.id}`)}
      activeOpacity={0.7}
      style={[styles.card, { backgroundColor: card, borderColor: border, borderLeftColor: primary }]}
    >
      <Text style={[styles.meta, { color: textMuted }]}>
        {item.author}  ·  {formatTime(item.created_at)}
      </Text>
      <Text style={[styles.title, { color: text }]}>{item.title}</Text>
      <Text style={[styles.body, { color: textSecondary }]} numberOfLines={3}>
        {excerpt(item.body)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: 5,
  },
  meta: { fontSize: 12 },
  title: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 14, lineHeight: 20 },
});
