import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../types';

const roleKey = (eventSlug: string) => `role_${eventSlug}`;
const pushEndpointKey = (eventSlug: string) => `push_endpoint_${eventSlug}`;

export async function saveRole(eventSlug: string, role: UserRole): Promise<void> {
  await AsyncStorage.setItem(roleKey(eventSlug), role);
}

export async function getRole(eventSlug: string): Promise<UserRole | null> {
  const val = await AsyncStorage.getItem(roleKey(eventSlug));
  return (val as UserRole) ?? null;
}

export async function savePushEndpoint(
  eventSlug: string,
  endpoint: string,
): Promise<void> {
  await AsyncStorage.setItem(pushEndpointKey(eventSlug), endpoint);
}

export async function getPushEndpoint(eventSlug: string): Promise<string | null> {
  return AsyncStorage.getItem(pushEndpointKey(eventSlug));
}

export async function removePushEndpoint(eventSlug: string): Promise<void> {
  await AsyncStorage.removeItem(pushEndpointKey(eventSlug));
}
