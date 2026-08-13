// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors, spacing, typography } from '../theme';
import {
  useNotificationSettings,
  PreAlertVakitKey,
  OnTimeVakitKey,
} from '../context/NotificationSettingsContext';
import { getSoundById } from '../data/soundCatalog';
import SoundPickerModal from '../components/SoundPickerModal';

const PRE_ALERT_LABELS: { key: PreAlertVakitKey; label: string }[] = [
  { key: 'imsak', label: 'İmsaktan' },
  { key: 'gunes', label: 'Güneşten' },
  { key: 'ogle', label: 'Öğleden' },
  { key: 'ikindi', label: 'İkindiden' },
  { key: 'aksam', label: 'Akşamdan' },
  { key: 'yatsi', label: 'Yatsıdan' },
];

const ON_TIME_LABELS: { key: OnTimeVakitKey; label: string }[] = [
  { key: 'sabah', label: 'Sabah Ezanı' },
  { key: 'ogle', label: 'Öğle Ezanı' },
  { key: 'ikindi', label: 'İkindi Ezanı' },
  { key: 'aksam', label: 'Akşam Ezanı' },
  { key: 'yatsi', label: 'Yatsı Ezanı' },
];

interface Props {
  onClose: () => void;
}

type PickerTarget = { type: 'pre'; key: PreAlertVakitKey } | { type: 'onTime'; key: OnTimeVakitKey };

export default function SettingsScreen({ onClose }: Props) {
  const { settings, setPreAlert, setOnTimeSound } = useNotificationSettings();
  const [pickerFor, setPickerFor] = useState<PickerTarget | null>(null);

  let currentSelectedId = 'none';
  let pickerTitle = '';

  if (pickerFor && pickerFor.type === 'pre') {
    currentSelectedId = settings.preAlerts[pickerFor.key].soundId;
    const found = PRE_ALERT_LABELS.find((x) => x.key === pickerFor.key);
    pickerTitle = (found ? found.label : '') + ' Uyarı Sesi';
  } else if (pickerFor && pickerFor.type === 'onTime') {
    currentSelectedId = settings.onTimeAlerts[pickerFor.key].soundId;
    const found = ON_TIME_LABELS.find((x) => x.key === pickerFor.key);
    pickerTitle = (found ? found.label : '') + ' Uyarı Sesi';
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Ayarlar</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Vakitlerden Önce Uyarılar</Text>
        {PRE_ALERT_LABELS.map(({ key, label }) => {
          const s = settings.preAlerts[key];
          return (
            <View key={key} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Switch
                  value={s.enabled}
                  onValueChange={(val) => setPreAlert(key, { enabled: val })}
                  trackColor={{ true: colors.gold, false: undefined }}
                />
                <Text style={styles.cardLabel}>{label}</Text>
                <Text style={styles.cardOffset}>{s.minutesBefore}dk. önce</Text>
              </View>
              <TouchableOpacity onPress={() => setPickerFor({ type: 'pre', key: key })}>
                <Text style={styles.soundLink}>Sesi Değiştir · {getSoundById(s.soundId).label}</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Vakit Zamanında Uyarılar</Text>
        {ON_TIME_LABELS.map(({ key, label }) => {
          const s = settings.onTimeAlerts[key];
          return (
            <View key={key} style={styles.card}>
              <Text style={styles.cardLabel}>{label}</Text>
              <TouchableOpacity onPress={() => setPickerFor({ type: 'onTime', key: key })}>
                <Text style={styles.soundLink}>Sesi Değiştir · {getSoundById(s.soundId).label}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <SoundPickerModal
        visible={pickerFor !== null}
        title={pickerTitle}
        selectedId={currentSelectedId}
        onSelect={(id) => {
          if (pickerFor && pickerFor.type === 'pre') setPreAlert(pickerFor.key, { soundId: id });
          if (pickerFor && pickerFor.type === 'onTime') setOnTimeSound(pickerFor.key, id);
        }}
        onClose={() => setPickerFor(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  scrollContent: { padding: spacing.lg },
  sectionTitle: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 14, textTransform: 'uppercase', marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { backgroundColor: 'rgba(250,246,236,0.08)', borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardLabel: { fontFamily: typography.bodyMedium, color: colors.textOnDark, fontSize: 16, flex: 1 },
  cardOffset: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 13 },
  soundLink: { fontFamily: typography.bodyMedium, color: colors.gold, fontSize: 13, marginTop: spacing.xs },
});
