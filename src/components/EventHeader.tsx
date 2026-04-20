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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventSummary, UserRole } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { usePushNotifications } from '../hooks/usePushNotifications';

interface Props {
  event: EventSummary;
  role?: UserRole;
  subtitle?: string;
}

export default function EventHeader({ event, role, subtitle }: Props) {
  const { colors, event: theme } = useTheme();
  const insets = useSafeAreaInsets();
  const effectiveRole: UserRole = role ?? 'deltagare';
  const { subscribed, loading, subscribe, unsubscribe } = usePushNotifications(
    event,
    effectiveRole,
  );

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingTop: insets.top + 12,
        },
      ]}
    >
      {event.logo_url ? (
        <View style={[styles.logoWrap, { backgroundColor: theme.primary + '15' }]}>
          <Image source={{ uri: event.logo_url }} style={styles.logo} resizeMode="contain" />
        </View>
      ) : (
        <View style={[styles.logoWrap, { backgroundColor: theme.primary }]}>
          <Text style={styles.logoFallback}>{event.name.charAt(0)}</Text>
        </View>
      )}

      <View style={styles.textBlock}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {event.name}
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]} numberOfLines={1}>
          {subtitle ?? event.tagline ?? event.location}
        </Text>
      </View>

      <TouchableOpacity
        onPress={subscribed ? unsubscribe : subscribe}
        disabled={loading}
        style={[
          styles.bellBtn,
          {
            backgroundColor: subscribed ? theme.primary + '18' : colors.surface,
            borderColor: subscribed ? theme.primary : colors.border,
          },
        ]}
        accessibilityLabel={subscribed ? 'Stäng av notiser' : 'Aktivera notiser'}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <Ionicons
            name={subscribed ? 'notifications' : 'notifications-outline'}
            size={18}
            color={subscribed ? theme.primary : colors.textSecondary}
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
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  logoFallback: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: 12,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
