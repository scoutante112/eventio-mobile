import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

interface EventTheme {
  primary: string;
  secondary: string;
}

interface ThemeContextValue {
  event: EventTheme;
  isDark: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    surface: string;
  };
}

const defaultEvent: EventTheme = { primary: '#4F46E5', secondary: '#7C3AED' };

const ThemeContext = createContext<ThemeContextValue>({
  event: defaultEvent,
  isDark: false,
  colors: {
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    subtext: '#6B7280',
    border: '#E5E7EB',
    surface: '#FFFFFF',
  },
});

interface Props {
  children: React.ReactNode;
  primary?: string;
  secondary?: string;
}

export function ThemeProvider({ children, primary, secondary }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const event: EventTheme = {
    primary: primary ?? defaultEvent.primary,
    secondary: secondary ?? defaultEvent.secondary,
  };

  const colors = isDark
    ? {
        background: '#111827',
        card: '#1F2937',
        text: '#F9FAFB',
        subtext: '#9CA3AF',
        border: '#374151',
        surface: '#1F2937',
      }
    : {
        background: '#F9FAFB',
        card: '#FFFFFF',
        text: '#111827',
        subtext: '#6B7280',
        border: '#E5E7EB',
        surface: '#FFFFFF',
      };

  return (
    <ThemeContext.Provider value={{ event, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
