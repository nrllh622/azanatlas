// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { useNotificationSettings, NotificationMode } from '../context/NotificationSettingsContext';
import { VakitKey } from '../lib/prayerCalculator';

const VAKIT_ORDER: { key: VakitKey; label: string }[] = [
  { key: 'imsak', label: 'İmsak' },
  { key: 'sabah', label: 'Sabah' },
  { key: 'gunes', label: 'Güneş' },
  { key: 'ogle', label: 'Öğle' },
  { key: 'ikindi', label: 'İkindi' },
  { key: 'aksam', label: 'Akşam' },
  { key: 'yatsi', label: 'Yatsı' },
];

const MODE_LABELS: Record<NotificationMode, string> = {
  none: 'Hiçbiri',
  silent: 'Sessiz Bildirim',
  sound: 'Sesli Bildirim',
  alarm: 'Alarm Çal',
  adhan: 'Ezan Sesi Çal',
};

const MODES: NotificationMode[] = ['adhan', 'alarm', 'sound', 'silent', 'none'];

interface Props {
  onClose: () => void;
}

export default function SettingsScreen({ onClose }: Props) {
  const { settings, setVakitMode } = useNotificationSettings();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Bildirim Ayarları</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {VAKIT_ORDER.map((v) => (
          <View key={v.key} style={styles.vakitBlock}>
            <Text style={styles.vakitLabel}>{v.label}</Text>
            <View style={styles.modeRow}>
              {MODES.map((mode) => {
                const active = settings[v.key]?.mode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.modeChip, active && styles.modeChipActive]}
                    onPress={() => setVakitMode(v.key, mode)}
                  >
                    <Text style={[styles.modeChipText, active && styles.modeChipTextActive]}>
                      {MODE_LABELS[mode]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  scrollContent: { padding: spacing.lg },
  vakitBlock: { marginBottom: spacing.lg },
  vakitLabel: { fontFamily: typography.bodyBold, color: colors.textOnDark, fontSize: 17, marginBottom: spacing.sm },
  modeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  modeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.4)',
  },
  modeChipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  modeChipText: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 13 },
  modeChipTextActive: { color: colors.primaryDark },
});
