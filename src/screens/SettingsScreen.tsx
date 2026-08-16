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
import {
  useCalculationSettings,
  CALC_METHODS,
  KERAHAT_OPTIONS,
  MADHAB_OPTIONS,
  HIGH_LAT_OPTIONS,
  HIJRI_ADJUSTMENT_OPTIONS,
  DISTANCE_UNIT_OPTIONS,
} from '../context/CalculationSettingsContext';
import { useGeneralSettings } from '../context/GeneralSettingsContext';
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
  onOpenVaktindeKil: () => void;
}

type PickerTarget = { type: 'pre'; key: PreAlertVakitKey } | { type: 'onTime'; key: OnTimeVakitKey };

export default function SettingsScreen({ onClose, onOpenVaktindeKil }: Props) {
  const insets = useSafeAreaInsets();
  const { settings, setPreAlert, setOnTime, setFlag } = useNotificationSettings();
  const {
    methodId, kerahatMinutes, madhab, highLatRule, hijriAdjustmentDays, hijriSwitchAtMaghrib, distanceUnit,
    setMethodId, setKerahatMinutes, setMadhab, setHighLatRule, setHijriAdjustmentDays, setHijriSwitchAtMaghrib, setDistanceUnit,
  } = useCalculationSettings();
  const {
    vibrationEnabled, faceDownSilenceEnabled, notificationBarWidgetEnabled,
    setVibrationEnabled, setFaceDownSilenceEnabled, setNotificationBarWidgetEnabled,
  } = useGeneralSettings();

  const [pickerFor, setPickerFor] = useState<PickerTarget | null>(null);
  const [methodPickerVisible, setMethodPickerVisible] = useState(false);
  const [kerahatPickerVisible, setKerahatPickerVisible] = useState(false);
  const [madhabPickerVisible, setMadhabPickerVisible] = useState(false);
  const [highLatPickerVisible, setHighLatPickerVisible] = useState(false);
  const [hijriPickerVisible, setHijriPickerVisible] = useState(false);
  const [distanceUnitPickerVisible, setDistanceUnitPickerVisible] = useState(false);

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
  const madhabLabel = MADHAB_OPTIONS.find((m) => m.id === madhab)?.label ?? '';
  const highLatLabel = HIGH_LAT_OPTIONS.find((m) => m.id === highLatRule)?.label ?? '';
  const distanceUnitLabel = DISTANCE_UNIT_OPTIONS.find((m) => m.id === distanceUnit)?.label ?? '';

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Ayarlar</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.card} onPress={onOpenVaktindeKil}>
          <Text style={styles.cardLabel}>Vaktinde Kıl</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Hesaplama Yöntemi</Text>
        <TouchableOpacity style={styles.card} onPress={() => setMethodPickerVisible(true)}>
          <Text style={styles.cardLabel}>Hesaplama Yöntemi</Text>
          <Text style={styles.cardSubtext}>{methodLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => setMadhabPickerVisible(true)}>
          <Text style={styles.cardLabel}>İkindi Hesabı</Text>
          <Text style={styles.cardSubtext}>{madhabLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => setHighLatPickerVisible(true)}>
          <Text style={styles.cardLabel}>Yüksek Açı Hesabı</Text>
          <Text style={styles.cardSubtext}>{highLatLabel}</Text>
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

        <Text style={styles.sectionTitle}>Kişiselleştirme</Text>
        <TouchableOpacity style={styles.card} onPress={() => setHijriPickerVisible(true)}>
          <Text style={styles.cardLabel}>Hicri Gün Düzeltme</Text>
          <Text style={styles.cardSubtext}>{hijriAdjustmentDays > 0 ? `+${hijriAdjustmentDays}` : hijriAdjustmentDays} gün</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={hijriSwitchAtMaghrib} onValueChange={setHijriSwitchAtMaghrib} trackColor={{ true: colors.gold, false: undefined }} />
            <Text style={styles.cardLabelInline}>Hicri Gün Değişimini Akşam Vaktinde Yap</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.card} onPress={() => setDistanceUnitPickerVisible(true)}>
          <Text style={styles.cardLabel}>Ölçü Birimleri</Text>
          <Text style={styles.cardSubtext}>{distanceUnitLabel}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Genel</Text>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} trackColor={{ true: colors.gold, false: undefined }} />
            <Text style={styles.cardLabelInline}>Titreşim</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={faceDownSilenceEnabled} onValueChange={setFaceDownSilenceEnabled} trackColor={{ true: colors.gold, false: undefined }} />
            <Text style={styles.cardLabelInline}>Cihazı Yüzüstü Çevirdiğinde Sesi Kapat</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={notificationBarWidgetEnabled} onValueChange={setNotificationBarWidgetEnabled} trackColor={{ true: colors.gold, false: undefined }} />
            <Text style={styles.cardLabelInline}>Bildirim Çubuğu Widgeti</Text>
          </View>
        </View>
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
        visible={madhabPickerVisible}
        title="İkindi Hesabı"
        options={MADHAB_OPTIONS}
        selectedId={madhab}
        onSelect={(id) => setMadhab(id as any)}
        onClose={() => setMadhabPickerVisible(false)}
      />

      <SimplePickerModal
        visible={highLatPickerVisible}
        title="Yüksek Açı Hesabı"
        options={HIGH_LAT_OPTIONS}
        selectedId={highLatRule}
        onSelect={(id) => setHighLatRule(id as any)}
        onClose={() => setHighLatPickerVisible(false)}
      />

      <SimplePickerModal
        visible={kerahatPickerVisible}
        title="Kerahat Vakti (dakika)"
        options={KERAHAT_OPTIONS.map((m) => ({ id: String(m), label: `${m} dakika` }))}
        selectedId={String(kerahatMinutes)}
        onSelect={(id) => setKerahatMinutes(Number(id))}
        onClose={() => setKerahatPickerVisible(false)}
      />

      <SimplePickerModal
        visible={hijriPickerVisible}
        title="Hicri Gün Düzeltme"
        options={HIJRI_ADJUSTMENT_OPTIONS.map((m) => ({ id: String(m), label: `${m > 0 ? '+' + m : m} gün` }))}
        selectedId={String(hijriAdjustmentDays)}
        onSelect={(id) => setHijriAdjustmentDays(Number(id))}
        onClose={() => setHijriPickerVisible(false)}
      />

      <SimplePickerModal
        visible={distanceUnitPickerVisible}
        title="Ölçü Birimleri"
        options={DISTANCE_UNIT_OPTIONS}
        selectedId={distanceUnit}
        onSelect={(id) => setDistanceUnit(id as any)}
        onClose={() => setDistanceUnitPickerVisible(false)}
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
  card: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  cardLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 16 },
  cardLabelInline: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 16, flex: 1 },
  cardSubtext: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 13 },
  cardOffset: { fontFamily: typography.bodyMedium, color: colors.primary, fontSize: 13 },
  chevron: { color: colors.primary, fontSize: 20 },
  soundLink: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 13, marginTop: spacing.xs },
});
