import { ColorSchemeName } from 'react-native';

export interface AppTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  danger: string;
  accentBg: string;
  tabBar: string;
  isDark: boolean;
}

export function buildTheme(
  scheme: ColorSchemeName,
  primary = '#6366F1',
  secondary = '#8B5CF6',
): AppTheme {
  const isDark = scheme === 'dark';
  return {
    primary,
    secondary,
    isDark,
    background: isDark ? '#09090B' : '#F4F4F5',
    surface: isDark ? '#18181B' : '#FFFFFF',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '#2C2C2E' : '#E4E4E7',
    text: isDark ? '#FAFAFA' : '#09090B',
    textSecondary: isDark ? '#A1A1AA' : '#52525B',
    textMuted: isDark ? '#52525B' : '#A1A1AA',
    danger: isDark ? '#F87171' : '#EF4444',
    accentBg: primary + '18',
    tabBar: isDark ? '#18181B' : '#FFFFFF',
  };
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  frukost: 'Frukost',
  lunch: 'Lunch',
  middag: 'Middag',
  fika: 'Fika',
  annat: 'Övrigt',
};

const MEAL_TYPE_COLORS: Record<string, string> = {
  frukost: '#F59E0B',
  lunch: '#10B981',
  middag: '#6366F1',
  fika: '#EC4899',
  annat: '#6B7280',
};

export function mealTypeLabel(type: string) {
  return MEAL_TYPE_LABELS[type] ?? type;
}

export function mealTypeColor(type: string) {
  return MEAL_TYPE_COLORS[type] ?? '#6B7280';
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString('sv-SE', opts ?? {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sv-SE', {
    hour: '2-digit', minute: '2-digit',
  });
}
