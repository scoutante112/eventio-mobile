'use client';
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

export interface AppColors {
  background: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentText: string;
  tabBar: string;
  tabBarBorder: string;
  danger: string;
}

export interface AppTheme {
  isDark: boolean;
  colors: AppColors;
  event: {
    primary: string;
    secondary: string;
  };
}

const DEFAULT_PRIMARY = '#6366F1';
const DEFAULT_SECONDARY = '#8B5CF6';

function buildColors(isDark: boolean, primary: string): AppColors {
  if (isDark) {
    return {
      background: '#09090B',
      surface: '#18181B',
      card: '#1C1C1E',
      border: '#2C2C2E',
      text: '#FAFAFA',
      textSecondary: '#A1A1AA',
      textMuted: '#52525B',
      accent: primary,
      accentLight: primary + '22',
      accentText: '#FFFFFF',
      tabBar: '#18181B',
      tabBarBorder: '#2C2C2E',
      danger: '#F87171',
    };
  }
  return {
    background: '#F4F4F5',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E4E4E7',
    text: '#09090B',
    textSecondary: '#52525B',
    textMuted: '#A1A1AA',
    accent: primary,
    accentLight: primary + '18',
    accentText: '#FFFFFF',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E4E4E7',
    danger: '#EF4444',
  };
}

const ThemeContext = createContext<AppTheme>({
  isDark: false,
  colors: buildColors(false, DEFAULT_PRIMARY),
  event: { primary: DEFAULT_PRIMARY, secondary: DEFAULT_SECONDARY },
});

interface Props {
  children: React.ReactNode;
  primary?: string;
  secondary?: string;
}

export function ThemeProvider({ children, primary, secondary }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const p = primary ?? DEFAULT_PRIMARY;
  const s = secondary ?? DEFAULT_SECONDARY;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors: buildColors(isDark, p),
        event: { primary: p, secondary: s },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
