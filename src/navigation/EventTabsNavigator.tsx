import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, EventTabParamList, EventDetail, EventSummary, UserRole } from '../types';
import { fetchEventDetail } from '../api/eventio';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import NewsScreen from '../screens/NewsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MatsedelScreen from '../screens/MatsedelScreen';
import KartaScreen from '../screens/KartaScreen';
import InfoScreen from '../screens/InfoScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'EventTabs'>;

const Tab = createBottomTabNavigator<EventTabParamList>();

function TabsContent({
  event,
  role,
  detail,
}: {
  event: EventSummary;
  role: UserRole;
  detail: EventDetail;
}) {
  const { event: theme, isDark, colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginBottom: 2 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            News: 'newspaper-outline',
            Schedule: 'calendar-outline',
            Matsedel: 'restaurant-outline',
            Karta: 'map-outline',
            Info: 'information-circle-outline',
          };
          return (
            <Ionicons
              name={icons[route.name] ?? 'ellipse-outline'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="News"
        component={NewsScreen}
        initialParams={{ event, role }}
        options={{ title: 'Nyheter' }}
      />
      {detail.features.show_schema && (
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          initialParams={{ event, role }}
          options={{ title: 'Schema' }}
        />
      )}
      {detail.features.show_matsedel && (
        <Tab.Screen
          name="Matsedel"
          component={MatsedelScreen}
          initialParams={{ event, role }}
          options={{ title: 'Matsedel' }}
        />
      )}
      {detail.features.show_karta && (
        <Tab.Screen
          name="Karta"
          component={KartaScreen}
          initialParams={{ event, role }}
          options={{ title: 'Karta' }}
        />
      )}
      {detail.features.show_info && (
        <Tab.Screen
          name="Info"
          component={InfoScreen}
          initialParams={{ event, role }}
          options={{ title: 'Info' }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function EventTabsNavigator({ route }: Props) {
  const { event, role } = route.params;
  const [detail, setDetail] = useState<EventDetail | null>(null);

  useEffect(() => {
    fetchEventDetail(event.api_base).then(setDetail).catch(console.error);
  }, [event.api_base]);

  if (!detail) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={event.color_primary} />
      </View>
    );
  }

  return (
    <ThemeProvider primary={event.color_primary} secondary={event.color_secondary}>
      <TabsContent event={event} role={role} detail={detail} />
    </ThemeProvider>
  );
}
