import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'Karta'>;

const KARTA_PATHS = [
  '/saas/deltagare/karta.html',
  '/karta',
  '/karta.html',
];

export default function KartaScreen({ route }: Props) {
  const { event, role } = route.params;
  const { colors, event: theme } = useTheme();
  const [pathIndex, setPathIndex] = useState(0);
  const [webLoading, setWebLoading] = useState(true);
  const [webError, setWebError] = useState(false);
  const webRef = useRef<WebView>(null);

  const url = `${event.api_base}${KARTA_PATHS[pathIndex]}`;

  const tryNextPath = () => {
    if (pathIndex + 1 < KARTA_PATHS.length) {
      setPathIndex(i => i + 1);
      setWebError(false);
      setWebLoading(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <EventHeader event={event} role={role} subtitle="Karta" />

      {/* URL debug strip */}
      {__DEV__ && (
        <Text style={[styles.debugUrl, { color: colors.textMuted, backgroundColor: colors.surface }]}>
          {url}
        </Text>
      )}

      <View style={styles.webviewWrap}>
        {webLoading && !webError && (
          <View style={[styles.overlay, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>Laddar karta…</Text>
          </View>
        )}

        {webError ? (
          <View style={[styles.overlay, { backgroundColor: colors.background }]}>
            <Ionicons name="map-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.errorTitle, { color: colors.text }]}>Kartan kunde inte laddas</Text>
            <Text style={[styles.errorSub, { color: colors.textMuted }]}>{url}</Text>
            {pathIndex + 1 < KARTA_PATHS.length ? (
              <TouchableOpacity
                style={[styles.retryBtn, { backgroundColor: theme.primary }]}
                onPress={tryNextPath}
              >
                <Text style={styles.retryText}>Prova alternativ URL</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.retryBtn, { backgroundColor: theme.primary }]}
                onPress={() => { setPathIndex(0); setWebError(false); setWebLoading(true); }}
              >
                <Text style={styles.retryText}>Försök igen</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <WebView
            ref={webRef}
            source={{ uri: url }}
            style={styles.webview}
            onLoadStart={() => { setWebLoading(true); setWebError(false); }}
            onLoadEnd={() => setWebLoading(false)}
            onError={() => { setWebLoading(false); setWebError(true); }}
            onHttpError={(e) => {
              if (e.nativeEvent.statusCode >= 400) {
                setWebLoading(false);
                setWebError(true);
              }
            }}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  debugUrl: { fontSize: 10, paddingHorizontal: 12, paddingVertical: 4 },
  webviewWrap: { flex: 1 },
  webview: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    zIndex: 10,
  },
  loadingText: { fontSize: 14 },
  errorTitle: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  errorSub: { fontSize: 11, textAlign: 'center', paddingHorizontal: 24 },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  retryText: { color: '#FFF', fontWeight: '600' },
});
