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
  const bg = isDark ? '#111827' : '#F9FAFB';
  const cardBg = isDark ? '#1F2937' : '#FFFFFF';
  const textColor = isDark ? '#F9FAFB' : '#111827';
  const subtextColor = isDark ? '#9CA3AF' : '#6B7280';
  const insets = useSafeAreaInsets();

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

  // If funkis is not enabled, skip role selection and go straight as deltagare
  if (!detail.features.enable_funkis) {
    selectRole('deltagare');
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.inner}>
        {event.logo_url ? (
          <Image
            source={{ uri: event.logo_url }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : null}
        <Text style={[styles.title, { color: textColor }]}>{event.name}</Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          Välj din roll för eventet
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: event.color_primary }]}
            onPress={() => selectRole('deltagare')}
            activeOpacity={0.85}
          >
            <Text style={styles.roleButtonText}>Deltagare</Text>
            <Text style={styles.roleButtonSub}>Jag deltar i eventet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              { backgroundColor: cardBg, borderWidth: 2, borderColor: event.color_primary },
            ]}
            onPress={() => selectRole('funkis')}
            activeOpacity={0.85}
          >
            <Text style={[styles.roleButtonText, { color: event.color_primary }]}>
              Funkis
            </Text>
            <Text style={[styles.roleButtonSub, { color: subtextColor }]}>
              Jag jobbar på eventet
            </Text>
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
    paddingHorizontal: 32,
    gap: 12,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttons: {
    width: '100%',
    gap: 14,
    marginTop: 12,
  },
  roleButton: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  roleButtonSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
});
