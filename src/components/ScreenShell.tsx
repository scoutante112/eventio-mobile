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

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  fill: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  errorText: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: '#FFF', fontWeight: '600' },
});
