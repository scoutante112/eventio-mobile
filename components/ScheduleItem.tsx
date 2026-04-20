import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleEntry } from '../lib/api';
import { useTheme } from './ThemeContext';

interface Props {
  item: ScheduleEntry;
}

const CATEGORY_COLORS: Record<string, string> = {
  aktivitet: '#10B981',
  mat: '#F59E0B',
  info: '#6366F1',
  möte: '#EC4899',
  sport: '#EF4444',
  default: '#6B7280',
};

export default function ScheduleItemRow({ item }: Props) {
  const { card, border, text, textSecondary, textMuted, primary, accentBg, surface } = useTheme();
  const [open, setOpen] = useState(false);
  const catColor = CATEGORY_COLORS[item.category?.toLowerCase()] ?? CATEGORY_COLORS.default;

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        style={[styles.row, { borderBottomColor: border }]}
      >
        <View style={styles.timeCol}>
          <Text style={[styles.start, { color: primary }]}>{item.start_time}</Text>
          <Text style={[styles.end, { color: textMuted }]}>{item.end_time}</Text>
        </View>
        <View style={[styles.bar, { backgroundColor: primary }]} />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: text }]} numberOfLines={2}>{item.title}</Text>
            {item.category ? (
              <View style={[styles.badge, { backgroundColor: catColor + '20' }]}>
                <Text style={[styles.badgeText, { color: catColor }]}>{item.category}</Text>
              </View>
            ) : null}
          </View>
          {item.location ? (
            <Text style={[styles.location, { color: textMuted }]}>
              <Ionicons name="location-outline" size={11} /> {item.location}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={14} color={textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={[styles.sheet, { backgroundColor: surface }]}>
          <View style={[styles.handle, { backgroundColor: border }]} />
          <View style={[styles.sheetHeader, { borderBottomColor: border }]}>
            <Text style={[styles.sheetTitle, { color: text }]}>{item.title}</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons name="close" size={22} color={textMuted} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.sheetBody}>
            <View style={[styles.metaBlock, { backgroundColor: accentBg, borderRadius: 12 }]}>
              <MetaRow icon="time-outline" label={`${item.start_time} – ${item.end_time}`} color={primary} textColor={text} />
              {item.location ? <MetaRow icon="location-outline" label={item.location} color={primary} textColor={text} /> : null}
              {item.category ? <MetaRow icon="pricetag-outline" label={item.category} color={primary} textColor={text} /> : null}
            </View>
            {item.description ? (
              <Text style={[styles.desc, { color: textSecondary }]}>{item.description}</Text>
            ) : null}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function MetaRow({ icon, label, color, textColor }: { icon: any; label: string; color: string; textColor: string }) {
  return (
    <View style={styles.metaRow}>
      <Ionicons name={icon} size={15} color={color} />
      <Text style={[styles.metaText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  timeCol: { width: 50, alignItems: 'flex-end', gap: 1 },
  start: { fontSize: 13, fontWeight: '700' },
  end: { fontSize: 11 },
  bar: { width: 3, height: 34, borderRadius: 2 },
  content: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' },
  title: { flex: 1, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  location: { fontSize: 12 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '65%', paddingBottom: 34,
  },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12 },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', padding: 18,
    borderBottomWidth: StyleSheet.hairlineWidth, gap: 12,
  },
  sheetTitle: { flex: 1, fontSize: 17, fontWeight: '700' },
  sheetBody: { padding: 18, gap: 14 },
  metaBlock: { padding: 14, gap: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaText: { fontSize: 14 },
  desc: { fontSize: 14, lineHeight: 22 },
});
