import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  children: React.ReactNode;
  scrollable?: boolean;
}

export default function ScreenShell({
  loading,
  error,
  onRetry,
  onRefresh,
  refreshing = false,
  children,
  scrollable = true,
}: Props) {
  const { event, colors } = useTheme();

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={event.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.errorBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="warning-outline" size={28} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          {onRetry && (
            <TouchableOpacity
              style={[styles.retryBtn, { backgroundColor: event.primary }]}
              onPress={onRetry}
            >
              <Text style={styles.retryText}>Försök igen</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (!scrollable) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={event.primary}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  fill: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  errorBox: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  errorText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  retryText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});
