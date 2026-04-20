import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useInfo } from '../../hooks/useInfo';
import { useTheme } from '../../components/ThemeContext';
import { useEventStore } from '../../stores/eventStore';
import PushToggle from '../../components/PushToggle';
import FeedbackModal from '../../components/FeedbackModal';
import { stripHtml } from '../../lib/htmlUtils';
import { useQueryClient } from '@tanstack/react-query';

export default function MerScreen() {
  const { data: infoPages, isLoading } = useInfo();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { reset, eventData, role } = useEventStore();
  const queryClient = useQueryClient();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState<number | null>(null);

  const handleReset = () => {
    Alert.alert('Byt event', 'Vill du välja ett annat event eller roll?', [
      { text: 'Avbryt', style: 'cancel' },
      {
        text: 'Ja, byt',
        style: 'destructive',
        onPress: () => {
          queryClient.clear();
          reset();
          router.replace('/(onboarding)/');
        },
      },
    ]);
  };

  return (
    <>
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border, paddingTop: insets.top + 12 }]}>
          <Text style={[styles.title, { color: theme.text }]}>Mer</Text>
        </View>

        {/* Event info pill */}
        <View style={[styles.eventPill, { backgroundColor: theme.accentBg }]}>
          <Text style={[styles.eventPillText, { color: theme.primary }]}>
            {eventData?.name}  ·  {role === 'deltagare' ? 'Deltagare' : 'Funkis'}
          </Text>
        </View>

        {/* Push toggle */}
        <Section title="Notiser" theme={theme}>
          <PushToggle />
        </Section>

        {/* Info pages */}
        {(infoPages?.length ?? 0) > 0 && (
          <Section title="Information" theme={theme}>
            {infoPages!.map((page, i) => (
              <View key={i}>
                <TouchableOpacity
                  onPress={() => setExpandedInfo(expandedInfo === i ? null : i)}
                  style={[styles.infoRow, { borderBottomColor: theme.border }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.infoTitle, { color: theme.text }]}>{page.title}</Text>
                  <Ionicons
                    name={expandedInfo === i ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
                {expandedInfo === i && (
                  <Text style={[styles.infoBody, { color: theme.textSecondary }]}>
                    {stripHtml(page.content)}
                  </Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Actions */}
        <Section title="Inställningar" theme={theme}>
          <ActionRow
            icon="chatbubble-outline"
            label="Skicka feedback"
            color={theme.primary}
            theme={theme}
            onPress={() => setFeedbackOpen(true)}
          />
          <ActionRow
            icon="swap-horizontal-outline"
            label="Byt event / roll"
            color={theme.textSecondary}
            theme={theme}
            onPress={handleReset}
            last
          />
        </Section>
      </ScrollView>

      <FeedbackModal visible={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}

function Section({ title, theme, children }: { title: string; theme: any; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title.toUpperCase()}</Text>
      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {children}
      </View>
    </View>
  );
}

function ActionRow({ icon, label, color, theme, onPress, last }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.actionRow, !last && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.actionLabel, { color: theme.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  eventPill: {
    alignSelf: 'center', marginTop: 14, marginBottom: 4,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  eventPillText: { fontSize: 13, fontWeight: '600' },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.8,
    marginBottom: 8, paddingHorizontal: 4,
  },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 16, gap: 10 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoTitle: { flex: 1, fontSize: 15, fontWeight: '600' },
  infoBody: { fontSize: 14, lineHeight: 21, paddingVertical: 10 },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12,
  },
  iconWrap: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
});
