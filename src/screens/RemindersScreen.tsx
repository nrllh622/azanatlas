// src/screens/RemindersScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { useReminders } from '../context/RemindersContext';

interface Props {
  onClose: () => void;
}

const QUICK_OPTIONS: { label: string; getDate: () => Date }[] = [
  { label: '30 dakika sonra', getDate: () => new Date(Date.now() + 30 * 60 * 1000) },
  { label: '1 saat sonra', getDate: () => new Date(Date.now() + 60 * 60 * 1000) },
  {
    label: 'Yarın sabah 08:00',
    getDate: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(8, 0, 0, 0);
      return d;
    },
  },
  { label: '3 gün sonra', getDate: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
];

export default function RemindersScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { reminders, addReminder, removeReminder } = useReminders();
  const [title, setTitle] = useState('');
  const [selectedOption, setSelectedOption] = useState(0);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addReminder(title.trim(), QUICK_OPTIONS[selectedOption].getDate());
    setTitle('');
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Hatırlatıcılar</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.addCard}>
          <TextInput
            style={styles.input}
            placeholder="Hatırlatıcı başlığı"
            placeholderTextColor={colors.primary}
            value={title}
            onChangeText={setTitle}
          />
          <View style={styles.optionsRow}>
            {QUICK_OPTIONS.map((opt, idx) => (
              <TouchableOpacity
                key={opt.label}
                style={[styles.optionChip, selectedOption === idx && styles.optionChipActive]}
                onPress={() => setSelectedOption(idx)}
              >
                <Text style={[styles.optionChipText, selectedOption === idx && styles.optionChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>+ Hatırlatıcı Ekle</Text>
          </TouchableOpacity>
        </View>

        {reminders.length === 0 && <Text style={styles.emptyText}>Henüz hatırlatıcı eklemedin.</Text>}

        {reminders
          .slice()
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((r) => {
            const d = new Date(r.date);
            return (
              <View key={r.id} style={styles.reminderCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reminderTitle}>{r.title}</Text>
                  <Text style={styles.reminderDate}>
                    {d.getDate().toString().padStart(2, '0')}.{(d.getMonth() + 1).toString().padStart(2, '0')}.{d.getFullYear()} ·{' '}
                    {d.getHours().toString().padStart(2, '0')}:{d.getMinutes().toString().padStart(2, '0')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeReminder(r.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.deleteText}>Sil</Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  scrollContent: { padding: spacing.lg },
  addCard: { backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.sand, borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 15, marginBottom: spacing.sm,
  },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  optionChip: { paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.primary },
  optionChipActive: { backgroundColor: colors.primary },
  optionChipText: { fontFamily: typography.bodyMedium, color: colors.primary, fontSize: 12 },
  optionChipTextActive: { color: colors.white },
  addBtn: { backgroundColor: colors.gold, borderRadius: radius.pill, paddingVertical: spacing.sm, alignItems: 'center' },
  addBtnText: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: 14 },
  emptyText: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 14, textAlign: 'center', marginTop: spacing.lg },
  reminderCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  reminderTitle: { fontFamily: typography.bodyBold, color: colors.textOnLight, fontSize: 15 },
  reminderDate: { fontFamily: typography.bodyMedium, color: colors.primary, fontSize: 12, marginTop: 2 },
  deleteText: { fontFamily: typography.bodyMedium, color: colors.danger, fontSize: 13 },
});
