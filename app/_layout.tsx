import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '../components/ThemeContext';
import { useEventStore } from '../stores/eventStore';
import OfflineBanner from '../components/OfflineBanner';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2 },
  },
});

function RootLayoutNav() {
  const { slug, role } = useEventStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inOnboarding = segments[0] === '(onboarding)';
    const ready = !!slug && !!role;

    if (!ready && !inOnboarding) {
      router.replace('/(onboarding)/');
    } else if (ready && inOnboarding) {
      router.replace('/(tabs)/');
    }
  }, [slug, role, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="news/[id]"
        options={{ headerShown: true, title: 'Nyhet', presentation: 'card' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          <OfflineBanner />
          <RootLayoutNav />
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
