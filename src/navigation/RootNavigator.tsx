import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { RootStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import RoleSelectScreen from '../screens/RoleSelectScreen';
import EventTabsNavigator from './EventTabsNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: '#4F46E5',
          background: isDark ? '#111827' : '#F9FAFB',
          card: isDark ? '#1F2937' : '#FFFFFF',
          text: isDark ? '#F9FAFB' : '#111827',
          border: isDark ? '#374151' : '#E5E7EB',
          notification: '#4F46E5',
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="EventTabs" component={EventTabsNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
