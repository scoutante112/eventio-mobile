import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'Karta'>;

export default function KartaScreen({ route }: Props) {
  const { event } = route.params;
  const { colors, event: theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mapUrl = `${event.api_base}/karta`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <EventHeader event={event} subtitle="Karta" />
      <View style={styles.webviewContainer}>
        {loading && (
          <View style={[styles.loadingOverlay, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={{ color: colors.subtext }}>Kartan kunde inte laddas.</Text>
          </View>
        ) : (
          <WebView
            source={{ uri: mapUrl }}
            style={styles.webview}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webviewContainer: { flex: 1 },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
