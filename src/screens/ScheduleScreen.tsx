import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList, ScheduleItem } from '../types';
import { fetchSchedule } from '../api/eventio';
import { useTheme } from '../theme/ThemeContext';
import ScreenShell from '../components/ScreenShell';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'Schedule'>;

function ScheduleRow({
  item,
  onPress,
}: {
  item: ScheduleItem;
  onPress: () => void;
}) {
  const { colors, event } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.row, { borderBottomColor: colors.border }]}
    >
      <View style={styles.timeCol}>
        <Text style={[styles.startTime, { color: event.primary }]}>{item.start_time}</Text>
        {item.end_time ? (
          <Text style={[styles.endTime, { color: colors.textMuted }]}>{item.end_time}</Text>
        ) : null}
      </View>
      <View style={[styles.timeBar, { backgroundColor: event.primary }]} />
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        {item.location ? (
          <Text style={[styles.rowLocation, { color: colors.textMuted }]}>
            <Ionicons name="location-outline" size={11} /> {item.location}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={styles.rowArrow} />
    </TouchableOpacity>
  );
}

function DetailModal({
  item,
  onClose,
}: {
  item: ScheduleItem | null;
  onClose: () => void;
}) {
  const { colors, event } = useTheme();
  if (!item) return null;

  return (
    <Modal
      visible={!!item}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.card }]}>
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

        <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>{item.title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sheetBody} contentContainerStyle={{ gap: 14 }}>
          <View style={[styles.sheetMeta, { backgroundColor: colors.accentLight, borderRadius: 12 }]}>
            <View style={styles.sheetMetaRow}>
              <Ionicons name="time-outline" size={16} color={event.primary} />
              <Text style={[styles.sheetMetaText, { color: colors.text }]}>
                {item.start_time}{item.end_time ? ` – ${item.end_time}` : ''}
              </Text>
            </View>
            {item.day ? (
              <View style={styles.sheetMetaRow}>
                <Ionicons name="calendar-outline" size={16} color={event.primary} />
                <Text style={[styles.sheetMetaText, { color: colors.text }]}>{item.day}</Text>
              </View>
            ) : null}
            {item.location ? (
              <View style={styles.sheetMetaRow}>
                <Ionicons name="location-outline" size={16} color={event.primary} />
                <Text style={[styles.sheetMetaText, { color: colors.text }]}>{item.location}</Text>
              </View>
            ) : null}
          </View>

          {item.description ? (
            <Text style={[styles.sheetDesc, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ScheduleScreen({ route }: Props) {
  const { event, role } = route.params;
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ScheduleItem | null>(null);
  const { colors } = useTheme();

  const load = useCallback(async () => {
    try {
      setError(null);
      setSchedule(await fetchSchedule(event.api_base, role));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Kunde inte hämta schemat.\n${msg}`);
    }
  }, [event.api_base, role]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const days = [...new Set(schedule.map((s) => s.day).filter(Boolean))] as string[];
  const ungrouped = !days.length;

  return (
    <>
      <ScreenShell
        loading={loading}
        error={error}
        onRetry={load}
        onRefresh={onRefresh}
        refreshing={refreshing}
      >
        <EventHeader
          event={event}
          role={role}
          subtitle={role === 'funkis' ? 'Schema – Funkis' : 'Schema – Deltagare'}
        />

        {schedule.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={36} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Inget schema finns just nu.
            </Text>
          </View>
        ) : ungrouped ? (
          <View style={[styles.daySection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {schedule.map((item) => (
              <ScheduleRow key={item.id} item={item} onPress={() => setSelected(item)} />
            ))}
          </View>
        ) : (
          <View style={styles.content}>
            {days.map((day) => {
              const items = schedule.filter((s) => s.day === day);
              return (
                <View key={day}>
                  <Text style={[styles.dayLabel, { color: colors.textMuted }]}>{day}</Text>
                  <View style={[styles.daySection, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {items.map((item, i) => (
                      <ScheduleRow key={item.id} item={item} onPress={() => setSelected(item)} />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScreenShell>

      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 4 },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  daySection: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  timeCol: { width: 54, alignItems: 'flex-end', gap: 2 },
  startTime: { fontSize: 13, fontWeight: '700' },
  endTime: { fontSize: 11 },
  timeBar: { width: 3, height: 36, borderRadius: 2 },
  rowContent: { flex: 1, gap: 3 },
  rowTitle: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  rowLocation: { fontSize: 12 },
  rowArrow: { marginLeft: 4 },
  empty: { padding: 48, alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 14 },
  // Modal
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  sheetTitle: { flex: 1, fontSize: 17, fontWeight: '700', lineHeight: 22 },
  sheetBody: { padding: 20 },
  sheetMeta: { padding: 14, gap: 10 },
  sheetMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetMetaText: { fontSize: 14 },
  sheetDesc: { fontSize: 14, lineHeight: 22 },
});
