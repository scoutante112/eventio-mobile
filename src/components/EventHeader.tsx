import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventSummary, UserRole } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { usePushNotifications } from '../hooks/usePushNotifications';

interface Props {
  event: EventSummary;
  role?: UserRole;
  subtitle?: string;
}

export default function EventHeader({ event, role, subtitle }: Props) {
  const { event: theme } = useTheme();
  const effectiveRole: UserRole = role ?? 'deltagare';
  const { subscribed, loading, subscribe, unsubscribe } = usePushNotifications(event, effectiveRole);

  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      {event.logo_url ? (
        <Image source={{ uri: event.logo_url }} style={styles.logo} resizeMode="contain" />
      ) : null}
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>
          {event.name}
        </Text>
        {subtitle ? (
          <Text style={styles.sub} numberOfLines={1}>{subtitle}</Text>
        ) : event.tagline ? (
          <Text style={styles.sub} numberOfLines={1}>{event.tagline}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={subscribed ? unsubscribe : subscribe}
        style={styles.bellBtn}
        disabled={loading}
        accessibilityLabel={subscribed ? 'Avsluta notiser' : 'Aktivera notiser'}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Ionicons
            name={subscribed ? 'notifications' : 'notifications-outline'}
            size={22}
            color="#FFF"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  text: { flex: 1 },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 1,
  },
  bellBtn: {
    padding: 6,
  },
});
