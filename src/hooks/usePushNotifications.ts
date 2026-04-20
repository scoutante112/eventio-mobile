import { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { EventSummary, UserRole } from '../types';
import { subscribePush, unsubscribePush } from '../api/eventio';
import { savePushEndpoint, getPushEndpoint, removePushEndpoint } from '../store/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications(event: EventSummary, role: UserRole) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPushEndpoint(event.slug).then((ep) => setSubscribed(!!ep));
  }, [event.slug]);

  const subscribe = useCallback(async () => {
    setLoading(true);
    try {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;

      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        setLoading(false);
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const token = await Notifications.getExpoPushTokenAsync();
      const endpoint = token.data;

      // Use the Expo push token as endpoint; derive pseudo p256dh/auth from it
      // so the server can store the subscription. In a web/VAPID scenario these
      // would be real ECDH keys, but for native Expo we send the token instead.
      await subscribePush(
        event.api_base,
        endpoint,
        '',
        '',
        role,
      );

      await savePushEndpoint(event.slug, endpoint);
      setSubscribed(true);
    } catch (e) {
      console.warn('Push subscribe error', e);
    } finally {
      setLoading(false);
    }
  }, [event, role]);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = await getPushEndpoint(event.slug);
      if (endpoint) {
        await unsubscribePush(event.api_base, endpoint);
        await removePushEndpoint(event.slug);
      }
      setSubscribed(false);
    } catch (e) {
      console.warn('Push unsubscribe error', e);
    } finally {
      setLoading(false);
    }
  }, [event]);

  return { subscribed, loading, subscribe, unsubscribe };
}
