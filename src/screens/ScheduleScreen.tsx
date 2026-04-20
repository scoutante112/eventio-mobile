import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EventTabParamList, ScheduleItem } from '../types';
import { fetchSchedule } from '../api/eventio';
import { useTheme } from '../theme/ThemeContext';
import ScreenShell from '../components/ScreenShell';
import EventHeader from '../components/EventHeader';

type Props = BottomTabScreenProps<EventTabParamList, 'Schedule'>;

function ScheduleRow({ item }: { item: ScheduleItem }) {
  const { colors, event } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.timePill, { backgroundColor: colors.accentLight }]}>
        <Text style={[styles.timeText, { color: event.primary }]}>{item.start_time}</Text>
        {item.end_time ? (
          <Text style={[styles.endTime, { color: event.primary + 'AA' }]}>{item.end_time}</Text>
        ) : null}
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
        {item.location ? (
          <Text style={[styles.rowMeta, { color: colors.textMuted }]}>📍 {item.location}</Text>
        ) : null}
        {item.description ? (
          <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{item.description}</Text>
        ) : null}
      </View>
    </View>
  );
}

export default function ScheduleScreen({ route }: Props) {
  const { event, role } = route.params;
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  const load = useCallback(async () => {
    try {
      setError(null);
      setSchedule(await fetchSchedule(event.api_base, role));
    } catch {
      setError('Kunde inte hämta schemat.');
    }
  }, [event.api_base, role]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const days = [...new Set(schedule.map((s) => s.day).filter(Boolean))];

  return (
    <ScreenShell loading={loading} error={error} onRetry={load} onRefresh={onRefresh} refreshing={refreshing}>
      <EventHeader event={event} role={role} subtitle={role === 'funkis' ? 'Schema – Funkis' : 'Schema – Deltagare'} />
      {schedule.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted }}>Inget schema finns just nu.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {days.length > 0
            ? days.map((day) => (
                <View key={day}>
                  <Text style={[styles.dayHeader, { color: colors.textMuted, backgroundColor: colors.background }]}>
                    {day}
                  </Text>
                  {schedule.filter((s) => s.day === day).map((item) => (
                    <ScheduleRow key={item.id} item={item} />
                  ))}
                </View>
              ))
            : schedule.map((item) => <ScheduleRow key={item.id} item={item} />)}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 8 },
  row: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 0,
  },
  timePill: {
    width: 68,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  timeText: { fontSize: 13, fontWeight: '700' },
  endTime: { fontSize: 11 },
  rowBody: { flex: 1, padding: 12, gap: 3 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowMeta: { fontSize: 12 },
  rowDesc: { fontSize: 13, lineHeight: 18 },
  dayHeader: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  empty: { padding: 40, alignItems: 'center' },
});
