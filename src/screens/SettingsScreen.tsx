// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import {
  useNotificationSettings,
  PreAlertVakitKey,
  OnTimeVakitKey,
} from '../context/NotificationSettingsContext';
import { useCalculationSettings, CALC_METHODS, KERAHAT_OPTIONS } from '../context/CalculationSettingsContext';
import { getSoundById } from '../data/soundCatalog';
import SoundPickerModal from '../components/SoundPickerModal';
import SimplePickerModal from '../components/SimplePickerModal';

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
  const insets = useSafeAreaInsets();
  const { settings, setPreAlert, setOnTime, setFlag } = useNotificationSettings();
  const { methodId, kerahatMinutes, setMethodId, setKerahatMinutes } = useCalculationSettings();
  const [pickerFor, setPickerFor] = useState<PickerTarget | null>(null);
  const [methodPickerVisible, setMethodPickerVisible] = useState(false);
  const [kerahatPickerVisible, setKerahatPickerVisible] = useState(false);

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

  const methodLabel = CALC_METHODS.find((m) => m.id === methodId)?.label ?? 'Otomatik';

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Ayarlar</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Hesaplama</Text>
        <TouchableOpacity style={styles.card} onPress={() => setMethodPickerVisible(true)}>
          <Text style={styles.cardLabel}>Hesaplama Yöntemi</Text>
          <Text style={styles.cardSubtext}>{methodLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => setKerahatPickerVisible(true)}>
          <Text style={styles.cardLabel}>Kerahat Vakti Süresi</Text>
          <Text style={styles.cardSubtext}>{kerahatMinutes} dk</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={settings.kerahatNotifyEnabled} onValueChange={(v) => setFlag('kerahatNotifyEnabled', v)} trackColor={{ true: colors.gold, false: undefined }} />
            <Text style={styles.cardLabelInline}>Kerahat Vaktinde Uyar</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Genel</Text>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={settings.ezanDuasiEnabled} onValueChange={(v) => setFlag('ezanDuasiEnabled', v)} trackColor={{ true: colors.gold, false: undefined }} />
            <Text style={styles.cardLabelInline}>Ezan Duası</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={settings.sabahAtImsakVaktinde} onValueChange={(v) => setFlag('sabahAtImsakVaktinde', v)} trackColor={{ true: colors.gold, false: undefined }} />
            <Text style={styles.cardLabelInline}>Sabah Ezanı İmsak Vaktinde Oku</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Vakitlerden Önce Uyarılar</Text>
        {PRE_ALERT_LABELS.map(({ key, label }) => {
          const s = settings.preAlerts[key];
          return (
            <View key={key} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Switch value={s.enabled} onValueChange={(val) => setPreAlert(key, { enabled: val })} trackColor={{ true: colors.gold, false: undefined }} />
                <Text style={styles.cardLabelInline}>{label}</Text>
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
              <View style={styles.cardTopRow}>
                <Switch value={s.enabled} onValueChange={(val) => setOnTime(key, { enabled: val })} trackColor={{ true: colors.gold, false: undefined }} />
                <Text style={styles.cardLabelInline}>{label}</Text>
              </View>
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
          if (pickerFor && pickerFor.type === 'onTime') setOnTime(pickerFor.key, { soundId: id });
        }}
        onClose={() => setPickerFor(null)}
      />

      <SimplePickerModal
        visible={methodPickerVisible}
        title="Hesaplama Yöntemi"
        options={CALC_METHODS}
        selectedId={methodId}
        onSelect={(id) => setMethodId(id as any)}
        onClose={() => setMethodPickerVisible(false)}
      />

      <SimplePickerModal
        visible={kerahatPickerVisible}
        title="Kerahat Vakti (dakika)"
        options={KERAHAT_OPTIONS.map((m) => ({ id: String(m), label: `${m} dakika` }))}
        selectedId={String(kerahatMinutes)}
        onSelect={(id) => setKerahatMinutes(Number(id))}
        onClose={() => setKerahatPickerVisible(false)}
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
  sectionTitle: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 14, textTransform: 'uppercase', marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 16 },
  cardLabelInline: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 16, flex: 1 },
  cardSubtext: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 13, marginTop: 2 },
  cardOffset: { fontFamily: typography.bodyMedium, color: colors.primary, fontSize: 13 },
  soundLink: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 13, marginTop: spacing.xs },
});
