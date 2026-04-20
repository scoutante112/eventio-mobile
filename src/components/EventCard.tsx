import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { EventSummary } from '../types';

interface Props {
  event: EventSummary;
  onPress: () => void;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  if (s.getFullYear() !== e.getFullYear()) {
    return `${s.toLocaleDateString('sv-SE', { ...opts, year: 'numeric' })} – ${e.toLocaleDateString('sv-SE', { ...opts, year: 'numeric' })}`;
  }
  return `${s.toLocaleDateString('sv-SE', opts)} – ${e.toLocaleDateString('sv-SE', { ...opts, year: 'numeric' })}`;
}

export default function EventCard({ event, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
    >
      <View
        style={[styles.accent, { backgroundColor: event.color_primary }]}
      />
      <View style={styles.content}>
        {event.logo_url ? (
          <Image
            source={{ uri: event.logo_url }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[styles.logoPlaceholder, { backgroundColor: event.color_primary }]}
          />
        )}
        <View style={styles.info}>
          <Text
            style={[styles.name, { color: isDark ? '#F9FAFB' : '#111827' }]}
            numberOfLines={1}
          >
            {event.name}
          </Text>
          {event.tagline ? (
            <Text
              style={[styles.tagline, { color: isDark ? '#9CA3AF' : '#6B7280' }]}
              numberOfLines={1}
            >
              {event.tagline}
            </Text>
          ) : null}
          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: event.color_primary }]}>
              {event.location}
            </Text>
            <Text style={[styles.metaDot, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
              {'  ·  '}
            </Text>
            <Text style={[styles.metaText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {formatDateRange(event.start_date, event.end_date)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  accent: {
    width: 6,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 13,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 12,
  },
});
