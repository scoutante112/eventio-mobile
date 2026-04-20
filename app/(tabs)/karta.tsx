import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useTheme } from '../../components/ThemeContext';
import { useEventStore } from '../../stores/eventStore';
import { api, getApiBase } from '../../lib/api';
import { Ionicons } from '@expo/vector-icons';

interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  description?: string;
  image?: string;
}

export default function KartaScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const slug = useEventStore((s) => s.slug);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [MapView, setMapView] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid crashes if maps isn't available
    try {
      const maps = require('react-native-maps');
      setMapView(() => maps.default);
      setMarker(() => maps.Marker);
    } catch (e) {
      console.warn('react-native-maps not available:', e);
    }
  }, []);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        Location.getCurrentPositionAsync({}).then((loc) => {
          setUserPos({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    api.get<MapLocation[]>('/karta', { baseURL: getApiBase(slug) })
      .then((r) => setLocations(r.data))
      .catch(() => setLocations([]))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!MapView) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
          <Text style={[styles.title, { color: theme.text }]}>Karta</Text>
        </View>
        <View style={styles.center}>
          <Ionicons name="map-outline" size={48} color={theme.textMuted} />
          <Text style={[styles.unavailText, { color: theme.textMuted }]}>Karta ej tillgänglig i Expo Go på iOS.{'\n'}Använd Android-enheten.</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
          <Text style={[styles.title, { color: theme.text }]}>Karta</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  const center = userPos
    ?? (locations.length ? { lat: locations[0].lat, lng: locations[0].lng } : { lat: 59.33, lng: 18.07 });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
        <Text style={[styles.title, { color: theme.text }]}>Karta</Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]}>{locations.length} platser</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={!!userPos}
        showsMyLocationButton
      >
        {locations.map((loc, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: loc.lat, longitude: loc.lng }}
            title={loc.name}
            description={loc.description}
            onPress={() => setSelected(loc)}
            pinColor={theme.primary}
          />
        ))}
      </MapView>

      {selected && (
        <View style={[styles.popup, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.popupRow}>
            <Text style={[styles.popupTitle, { color: theme.text }]}>{selected.name}</Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Ionicons name="close" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
          {selected.description ? (
            <Text style={[styles.popupDesc, { color: theme.textSecondary }]}>{selected.description}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  sub: { fontSize: 13, marginTop: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  unavailText: { fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 32 },
  popup: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    borderRadius: 16, borderWidth: 1, padding: 16, gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
  },
  popupRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  popupTitle: { fontSize: 16, fontWeight: '700' },
  popupDesc: { fontSize: 13, lineHeight: 19 },
});
