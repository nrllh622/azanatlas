// src/screens/RemindersScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { useReminders, ReminderTypeSetting } from '../context/RemindersContext';
import { getSoundById } from '../data/soundCatalog';
import SoundPickerModal from '../components/SoundPickerModal';
import SimplePickerModal from '../components/SimplePickerModal';

interface Props {
  onClose: () => void;
}

const MINUTE_OPTIONS = [15, 30, 45, 60, 90, 120, 150];

type ReminderKey = 'sahur' | 'teheccut' | 'pazartesiPersembeOrucu' | 'cumaNamazi';

export default function RemindersScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { settings, setSahur, setTeheccut, setOruc, setCuma } = useReminders();
  const [minutePickerFor, setMinutePickerFor] = useState<ReminderKey | null>(null);
  const [soundPickerFor, setSoundPickerFor] = useState<ReminderKey | null>(null);

  const setters: Record<ReminderKey, (patch: Partial<ReminderTypeSetting>) => void> = {
    sahur: setSahur,
    teheccut: setTeheccut,
    pazartesiPersembeOrucu: setOruc,
    cumaNamazi: setCuma,
  };

  const renderRow = (key: ReminderKey, title: string, baseLabel: string) => {
    const s = settings[key];
    return (
      <View key={key} style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={s.enabled} onValueChange={(v) => setters[key]({ enabled: v })} trackColor={{ true: colors.gold, false: undefined }} />
            <Text style={styles.baseLabel}>{baseLabel}</Text>
            <TouchableOpacity onPress={() => setMinutePickerFor(key)}>
              <Text style={styles.minutesLink}>{s.minutesBefore} dk. önce</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSoundPickerFor(key)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.soundIcon}>🔊</Text>
            </TouchableOpacity>
          </View>
          {key === 'pazartesiPersembeOrucu' && (
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setOruc({ remindDayBefore: !settings.pazartesiPersembeOrucu.remindDayBefore })}
            >
              <View style={[styles.checkbox, settings.pazartesiPersembeOrucu.remindDayBefore && styles.checkboxActive]}>
                {settings.pazartesiPersembeOrucu.remindDayBefore && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Bir gün önce hatırlat</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const activeMinutePicker = minutePickerFor ? settings[minutePickerFor] : null;
  const activeSoundPicker = soundPickerFor ? settings[soundPickerFor] : null;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Hatırlatıcılar</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderRow('sahur', 'Sahur Uyarısı', 'İmsaktan')}
        {renderRow('teheccut', 'Teheccüt Uyandırma', 'İmsaktan')}
        {renderRow('pazartesiPersembeOrucu', 'Pazartesi/Perşembe Orucu', 'İmsaktan')}
        {renderRow('cumaNamazi', 'Cuma Namazı Hatırlatma', 'Öğleden')}
      </ScrollView>

      <SimplePickerModal
        visible={minutePickerFor !== null}
        title="Kaç Dakika Önce"
        options={MINUTE_OPTIONS.map((m) => ({ id: String(m), label: `${m} dakika` }))}
        selectedId={activeMinutePicker ? String(activeMinutePicker.minutesBefore) : ''}
        onSelect={(id) => {
          if (minutePickerFor) setters[minutePickerFor]({ minutesBefore: Number(id) });
        }}
        onClose={() => setMinutePickerFor(null)}
      />

      <SoundPickerModal
        visible={soundPickerFor !== null}
        title="Uyarı Sesi"
        selectedId={activeSoundPicker ? activeSoundPicker.soundId : 'none'}
        onSelect={(id) => {
          if (soundPickerFor) setters[soundPickerFor]({ soundId: id });
        }}
        onClose={() => setSoundPickerFor(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  scrollContent: { padding: spacing.lg },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 14, marginBottom: spacing.xs },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  baseLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 15, flex: 1 },
  minutesLink: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 14, textDecorationLine: 'underline' },
  soundIcon: { fontSize: 20 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  checkbox: { width: 20, height: 20, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.primary },
  checkmark: { color: colors.white, fontSize: 12 },
  checkboxLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 14 },
});
