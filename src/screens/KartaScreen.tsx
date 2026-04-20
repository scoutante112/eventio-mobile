import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList } from '../types';
import { useTheme } from '../theme/ThemeContext';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'Karta'>;

export default function KartaScreen({ route }: Props) {
  const { event, role } = route.params;
  const { colors, event: theme } = useTheme();
  const [webLoading, setWebLoading] = useState(true);
  const [webError, setWebError] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <EventHeader event={event} role={role} subtitle="Karta" />
      <View style={styles.webviewWrap}>
        {webLoading && (
          <View style={[styles.overlay, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}
        {webError ? (
          <View style={[styles.overlay, { backgroundColor: colors.background }]}>
            <Text style={{ color: colors.textMuted }}>Kartan kunde inte laddas.</Text>
          </View>
        ) : (
          <WebView
            source={{ uri: `${event.api_base}/karta` }}
            style={styles.webview}
            onLoadStart={() => { setWebLoading(true); setWebError(false); }}
            onLoadEnd={() => setWebLoading(false)}
            onError={() => { setWebLoading(false); setWebError(true); }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webviewWrap: { flex: 1 },
  webview: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
