import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, getApiBase } from '../lib/api';
import { useEventStore } from '../stores/eventStore';
import { useTheme } from './ThemeContext';

const ENDPOINT_KEY = (slug: string) => `push_endpoint_${slug}`;

export default function PushToggle() {
  const { slug, role } = useEventStore();
  const { text, textSecondary, primary } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) AsyncStorage.getItem(ENDPOINT_KEY(slug)).then((ep) => setEnabled(!!ep));
  }, [slug]);

  const toggle = async (value: boolean) => {
    if (!slug) return;
    setLoading(true);
    try {
      if (value) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Tillåt notiser', 'Aktivera notiser i Inställningar för att få pushmeddelanden.');
          setLoading(false);
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await api.post(
          '/subscribe',
          { endpoint: token, keys: { p256dh: '', auth: '' }, role },
          { baseURL: getApiBase(slug) },
        );
        await AsyncStorage.setItem(ENDPOINT_KEY(slug), token);
        setEnabled(true);
      } else {
        const endpoint = await AsyncStorage.getItem(ENDPOINT_KEY(slug));
        if (endpoint) {
          await api.post('/unsubscribe', { endpoint }, { baseURL: getApiBase(slug) });
          await AsyncStorage.removeItem(ENDPOINT_KEY(slug));
        }
        setEnabled(false);
      }
    } catch {
      Alert.alert('Fel', 'Kunde inte ändra notis-inställningen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.label}>
        <Text style={[styles.title, { color: text }]}>Push-notiser</Text>
        <Text style={[styles.sub, { color: textSecondary }]}>
          Få notiser om nyheter och ändringar
        </Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={toggle}
        disabled={loading}
        trackColor={{ true: primary }}
        thumbColor="#FFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 13 },
});
