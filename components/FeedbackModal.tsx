import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, getApiBase } from '../lib/api';
import { useEventStore } from '../stores/eventStore';
import { useTheme } from './ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type FeedbackType = 'bug' | 'feature' | 'compliment';

const TYPES: { key: FeedbackType; label: string; icon: string }[] = [
  { key: 'bug', label: 'Bugg', icon: '🐛' },
  { key: 'feature', label: 'Förslag', icon: '💡' },
  { key: 'compliment', label: 'Beröm', icon: '⭐' },
];

export default function FeedbackModal({ visible, onClose }: Props) {
  const { card, border, text, textSecondary, background, primary, surface } = useTheme();
  const { slug, role } = useEventStore();
  const [type, setType] = useState<FeedbackType>('feature');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.post('/feedback', { type, message, email, role }, { baseURL: getApiBase(slug!) });
      Alert.alert('Tack!', 'Din feedback har skickats.');
      setMessage(''); setEmail('');
      onClose();
    } catch {
      Alert.alert('Fel', 'Kunde inte skicka feedback. Försök igen.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: surface }]}>
          <View style={[styles.header, { borderBottomColor: border }]}>
            <Text style={[styles.title, { color: text }]}>Skicka feedback</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {/* Type selector */}
            <View style={styles.typeRow}>
              {TYPES.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setType(t.key)}
                  style={[
                    styles.typeBtn,
                    { borderColor: type === t.key ? primary : border, backgroundColor: type === t.key ? primary + '18' : card },
                  ]}
                >
                  <Text style={styles.typeIcon}>{t.icon}</Text>
                  <Text style={[styles.typeLabel, { color: type === t.key ? primary : textSecondary }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Beskriv din feedback…"
              placeholderTextColor={textSecondary}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textarea, { backgroundColor: card, borderColor: border, color: text }]}
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Din e-post (valfritt)"
              placeholderTextColor={textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { backgroundColor: card, borderColor: border, color: text }]}
            />

            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: primary, opacity: sending ? 0.6 : 1 }]}
              onPress={send}
              disabled={sending || !message.trim()}
            >
              <Text style={styles.sendText}>{sending ? 'Skickar…' : 'Skicka feedback'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: 40, maxHeight: '85%',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 17, fontWeight: '700' },
  body: { padding: 18, gap: 14 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1, alignItems: 'center', padding: 12,
    borderRadius: 12, borderWidth: 1, gap: 4,
  },
  typeIcon: { fontSize: 20 },
  typeLabel: { fontSize: 12, fontWeight: '600' },
  input: {
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15,
  },
  textarea: { height: 110, textAlignVertical: 'top' },
  sendBtn: { borderRadius: 14, padding: 16, alignItems: 'center' },
  sendText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
