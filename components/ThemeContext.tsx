import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { buildTheme, AppTheme } from '../lib/theme';
import { useEventStore } from '../stores/eventStore';

const ThemeContext = createContext<AppTheme>(buildTheme('light'));

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const eventData = useEventStore((s) => s.eventData);
  const theme = buildTheme(scheme, eventData?.color_primary, eventData?.color_secondary);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  return useContext(ThemeContext);
}
