import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { EventSummary } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  event: EventSummary;
  onPress: () => void;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sStr = s.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
  const eStr = e.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${sStr} – ${eStr}`;
}

export default function EventCard({ event, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      {/* Logo / color strip */}
      <View style={[styles.logoContainer, { backgroundColor: event.color_primary + '15' }]}>
        {event.logo_url ? (
          <Image source={{ uri: event.logo_url }} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={[styles.logoFallback, { backgroundColor: event.color_primary }]}>
            <Text style={styles.logoFallbackText}>
              {event.name.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.body}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {event.name}
        </Text>
        {event.tagline ? (
          <Text style={[styles.tagline, { color: colors.textSecondary }]} numberOfLines={1}>
            {event.tagline}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: event.color_primary + '18' }]}>
            <Text style={[styles.badgeText, { color: event.color_primary }]}>
              {event.location}
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {formatDateRange(event.start_date, event.end_date)}
          </Text>
        </View>
      </View>

      {/* Right arrow */}
      <Text style={[styles.arrow, { color: colors.textMuted }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoContainer: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  logoFallback: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoFallbackText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  body: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 4,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  tagline: {
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
  },
  arrow: {
    fontSize: 22,
    paddingHorizontal: 14,
    fontWeight: '300',
  },
});
