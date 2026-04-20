import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MealEntry } from '../lib/api';
import { useTheme } from './ThemeContext';
import { mealTypeLabel, mealTypeColor } from '../lib/theme';

export default function MealCard({ item }: { item: MealEntry }) {
  const { card, border, text, textSecondary, textMuted } = useTheme();
  const typeColor = mealTypeColor(item.meal_type);

  return (
    <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
      <View style={[styles.badge, { backgroundColor: typeColor + '20' }]}>
        <Text style={[styles.badgeText, { color: typeColor }]}>
          {mealTypeLabel(item.meal_type)}
        </Text>
      </View>
      <Text style={[styles.title, { color: text }]}>{item.title}</Text>
      {item.description ? (
        <Text style={[styles.desc, { color: textSecondary }]}>{item.description}</Text>
      ) : null}
      {item.allergens ? (
        <Text style={[styles.allergens, { color: textMuted }]}>⚠️ {item.allergens}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 5,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 15, fontWeight: '600' },
  desc: { fontSize: 13, lineHeight: 19 },
  allergens: { fontSize: 12 },
});
