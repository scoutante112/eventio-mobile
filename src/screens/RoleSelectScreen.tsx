import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, UserRole, EventDetail } from '../types';
import { fetchEventDetail } from '../api/eventio';
import { saveRole } from '../store/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelect'>;

export default function RoleSelectScreen({ route, navigation }: Props) {
  const { event } = route.params;
  const [detail, setDetail] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const bg = isDark ? '#09090B' : '#F4F4F5';
  const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FAFAFA' : '#09090B';
  const subtextColor = isDark ? '#A1A1AA' : '#52525B';
  const borderColor = isDark ? '#2C2C2E' : '#E4E4E7';

  useEffect(() => {
    fetchEventDetail(event.api_base)
      .then(setDetail)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [event.api_base]);

  const selectRole = async (role: UserRole) => {
    await saveRole(event.slug, role);
    navigation.replace('EventTabs', { event, role });
  };

  if (loading || !detail) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={event.color_primary} />
      </View>
    );
  }

  if (!detail.features.enable_funkis) {
    selectRole('deltagare');
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.inner}>
        {/* Logo */}
        {event.logo_url ? (
          <View style={[styles.logoWrap, { backgroundColor: event.color_primary + '18', borderColor: event.color_primary + '30' }]}>
            <Image source={{ uri: event.logo_url }} style={styles.logo} resizeMode="contain" />
          </View>
        ) : (
          <View style={[styles.logoWrap, { backgroundColor: event.color_primary }]}>
            <Text style={styles.logoFallback}>{event.name.charAt(0)}</Text>
          </View>
        )}

        <Text style={[styles.title, { color: textColor }]}>{event.name}</Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>Välj hur du deltar</Text>

        {/* Role buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.roleCard, { backgroundColor: cardBg, borderColor: borderColor }]}
            onPress={() => selectRole('deltagare')}
            activeOpacity={0.7}
          >
            <View style={[styles.roleIcon, { backgroundColor: event.color_primary + '18' }]}>
              <Ionicons name="person-outline" size={22} color={event.color_primary} />
            </View>
            <View style={styles.roleText}>
              <Text style={[styles.roleTitle, { color: textColor }]}>Deltagare</Text>
              <Text style={[styles.roleDesc, { color: subtextColor }]}>Jag deltar i eventet</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={subtextColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, { backgroundColor: cardBg, borderColor: borderColor }]}
            onPress={() => selectRole('funkis')}
            activeOpacity={0.7}
          >
            <View style={[styles.roleIcon, { backgroundColor: event.color_secondary + '18' }]}>
              <Ionicons name="construct-outline" size={22} color={event.color_secondary} />
            </View>
            <View style={styles.roleText}>
              <Text style={[styles.roleTitle, { color: textColor }]}>Funkis</Text>
              <Text style={[styles.roleDesc, { color: subtextColor }]}>Jag jobbar på eventet</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={subtextColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 14,
  },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  logo: { width: 64, height: 64, borderRadius: 14 },
  logoFallback: { color: '#FFF', fontSize: 32, fontWeight: '800' },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 15, marginBottom: 8 },
  buttons: { width: '100%', gap: 12 },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  roleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleText: { flex: 1, gap: 2 },
  roleTitle: { fontSize: 16, fontWeight: '600' },
  roleDesc: { fontSize: 13 },
});
