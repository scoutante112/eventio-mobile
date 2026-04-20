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
    <View style={[styles.row, { backgroundColor: colors.card, borderLeftColor: event.primary }]}>
      <View style={styles.time}>
        <Text style={[styles.timeText, { color: event.primary }]}>
          {item.start_time}
        </Text>
        {item.end_time ? (
          <Text style={[styles.endTime, { color: colors.subtext }]}>{item.end_time}</Text>
        ) : null}
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
        {item.location ? (
          <Text style={[styles.rowMeta, { color: colors.subtext }]}>{item.location}</Text>
        ) : null}
        {item.description ? (
          <Text style={[styles.rowDesc, { color: colors.subtext }]}>{item.description}</Text>
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
      const data = await fetchSchedule(event.api_base, role);
      setSchedule(data);
    } catch {
      setError('Kunde inte hämta schemat.');
    }
  }, [event.api_base, role]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const days = [...new Set(schedule.map((s) => s.day).filter(Boolean))];

  return (
    <ScreenShell
      loading={loading}
      error={error}
      onRetry={load}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <EventHeader
        event={event}
        subtitle={role === 'funkis' ? 'Schema — Funkis' : 'Schema — Deltagare'}
      />
      {schedule.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.subtext }}>Inget schema finns just nu.</Text>
        </View>
      ) : days.length > 0 ? (
        days.map((day) => (
          <View key={day}>
            <Text style={[styles.dayHeader, { color: colors.subtext, backgroundColor: colors.background }]}>
              {day}
            </Text>
            {schedule
              .filter((s) => s.day === day)
              .map((item) => <ScheduleRow key={item.id} item={item} />)}
          </View>
        ))
      ) : (
        schedule.map((item) => <ScheduleRow key={item.id} item={item} />)
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: {
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  time: {
    width: 70,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: { fontSize: 13, fontWeight: '700' },
  endTime: { fontSize: 11, marginTop: 2 },
  rowContent: { flex: 1, padding: 14, gap: 3 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowMeta: { fontSize: 12 },
  rowDesc: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  dayHeader: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  empty: { padding: 32, alignItems: 'center' },
});
