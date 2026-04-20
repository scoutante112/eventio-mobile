import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Image, useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEventStore } from '../../stores/eventStore';
import { buildTheme } from '../../lib/theme';
import { api, getApiBase, EventConfig } from '../../lib/api';

export default function RollSelectScreen() {
  const { slug, setRole, setEventData, eventListing } = useEventStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get<EventConfig>('/event', { baseURL: getApiBase(slug) })
      .then((res) => { setEventConfig(res.data); setEventData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const theme = buildTheme(scheme, eventConfig?.color_primary, eventConfig?.color_secondary);

  const pick = (role: 'deltagare' | 'funkis') => {
    setRole(role);
    router.replace('/(tabs)/');
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Auto-skip if funkis not enabled
  const funkisEnabled = true; // always show role selection

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.inner}>
        {eventListing?.logo_url ? (
          <View style={[styles.logoWrap, { backgroundColor: theme.primary + '18', borderColor: theme.primary + '30' }]}>
            <Image source={{ uri: eventListing.logo_url }} style={styles.logo} resizeMode="contain" />
          </View>
        ) : null}

        <Text style={[styles.title, { color: theme.text }]}>
          {eventConfig?.name ?? eventListing?.name}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Hur deltar du?</Text>

        <View style={styles.buttons}>
          <RoleCard
            title="Deltagare"
            desc={eventConfig?.welcome_deltagare || 'Jag deltar i eventet'}
            icon="person-outline"
            color={theme.primary}
            cardBg={theme.card}
            border={theme.border}
            text={theme.text}
            textSec={theme.textSecondary}
            onPress={() => pick('deltagare')}
          />
          <RoleCard
            title="Funkis"
            desc={eventConfig?.welcome_funkis || 'Jag jobbar på eventet'}
            icon="construct-outline"
            color={theme.secondary}
            cardBg={theme.card}
            border={theme.border}
            text={theme.text}
            textSec={theme.textSecondary}
            onPress={() => pick('funkis')}
          />
        </View>
      </View>
    </View>
  );
}

function RoleCard({ title, desc, icon, color, cardBg, border, text, textSec, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.roleCard, { backgroundColor: cardBg, borderColor: border }]}
    >
      <View style={[styles.roleIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.roleText}>
        <Text style={[styles.roleTitle, { color: text }]}>{title}</Text>
        <Text style={[styles.roleDesc, { color: textSec }]} numberOfLines={2}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={textSec} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 14 },
  logoWrap: {
    width: 88, height: 88, borderRadius: 22,
    borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  logo: { width: 64, height: 64, borderRadius: 14 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 15, marginBottom: 8 },
  buttons: { width: '100%', gap: 12 },
  roleCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1, padding: 16, gap: 14,
  },
  roleIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  roleText: { flex: 1, gap: 2 },
  roleTitle: { fontSize: 17, fontWeight: '700' },
  roleDesc: { fontSize: 13, lineHeight: 18 },
});
