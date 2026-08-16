// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
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
  DISTANCE_UNIT_OPTIONS,
} from '../context/CalculationSettingsContext';
import { useGeneralSettings } from '../context/GeneralSettingsContext';
import { useLocationContext } from '../context/LocationContext';
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
  onOpenReminders: () => void;
}

type PickerTarget = { type: 'pre'; key: PreAlertVakitKey } | { type: 'onTime'; key: OnTimeVakitKey };

export default function SettingsScreen({ onClose, onOpenVaktindeKil, onOpenReminders }: Props) {
  const insets = useSafeAreaInsets();
  const { settings, setPreAlert, setOnTime, setFlag } = useNotificationSettings();
  const {
    autoMethod, methodId, kerahatMinutes, madhab, highLatRule, hijriAdjustmentDays, hijriSwitchAtMaghrib, distanceUnit,
    setAutoMethod, setMethodId, setKerahatMinutes, setMadhab, setHighLatRule, setHijriAdjustmentDays, setHijriSwitchAtMaghrib, setDistanceUnit,
  } = useCalculationSettings();
  const {
    vibrationEnabled, faceDownSilenceEnabled, notificationBarWidgetEnabled,
    setVibrationEnabled, setFaceDownSilenceEnabled, setNotificationBarWidgetEnabled,
  } = useGeneralSettings();
  const { addLocation } = useLocationContext();

  const [pickerFor, setPickerFor] = useState<PickerTarget | null>(null);
  const [methodPickerVisible, setMethodPickerVisible] = useState(false);
  const [kerahatPickerVisible, setKerahatPickerVisible] = useState(false);
  const [madhabPickerVisible, setMadhabPickerVisible] = useState(false);
  const [highLatPickerVisible, setHighLatPickerVisible] = useState(false);
  const [distanceUnitPickerVisible, setDistanceUnitPickerVisible] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

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

  const methodLabel = CALC_METHODS.find((m) => m.id === methodId)?.label ?? '';
  const madhabLabel = MADHAB_OPTIONS.find((m) => m.id === madhab)?.label ?? '';
  const highLatLabel = HIGH_LAT_OPTIONS.find((m) => m.id === highLatRule)?.label ?? '';
  const distanceUnitLabel = DISTANCE_UNIT_OPTIONS.find((m) => m.id === distanceUnit)?.label ?? '';

  const fetchGpsForAuto = async () => {
    setGpsLoading(true);
    setGpsStatus(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsStatus('Konum izni verilmedi. Telefon Ayarları > Uygulamalar > AzanAtlas > İzinler üzerinden konum iznini elle açabilirsin.');
        setGpsLoading(false);
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      addLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        il: place?.region || place?.city || 'GPS Konumu',
        ilce: place?.subregion || place?.district || place?.city || '',
        countryCode: place?.isoCountryCode || 'TR',
        isGps: true,
      });
      setGpsStatus('Konum başarıyla alındı ve eklendi.');
    } catch (e) {
      setGpsStatus('Konum alınamadı. GPS açık mı ve konum servisleri etkin mi kontrol et.');
    } finally {
      setGpsLoading(false);
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backArrow}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Ayarlar</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.card} onPress={onOpenVaktindeKil}>
          <Text style={styles.cardLabel}>Vaktinde Kıl</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={onOpenReminders}>
          <Text style={styles.cardLabel}>Hatırlatıcılar</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Hesaplama Yöntemi</Text>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch
              value={autoMethod}
              onValueChange={(v) => {
                setAutoMethod(v);
                if (v) fetchGpsForAuto();
                else setGpsStatus(null);
              }}
              trackColor={{ true: colors.gold, false: undefined }}
            />
            <Text style={styles.cardLabelInline}>Otomatik</Text>
          </View>
        </View>
        {autoMethod && gpsLoading && <Text style={styles.gpsHint}>Konum alınıyor…</Text>}
        {autoMethod && !gpsLoading && gpsStatus && <Text style={styles.gpsStatusText}>{gpsStatus}</Text>}
        {autoMethod && !gpsLoading && (
          <TouchableOpacity onPress={fetchGpsForAuto}>
            <Text style={styles.retryLink}>Konumu tekrar dene</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.card, autoMethod && styles.cardDisabled]}
          onPress={() => !autoMethod && setMethodPickerVisible(true)}
          disabled={autoMethod}
        >
          <Text style={[styles.cardLabel, autoMethod && styles.textDisabled]}>Hesaplama Yöntemi</Text>
          <Text style={[styles.cardSubtext, autoMethod && styles.textDisabled]}>{autoMethod ? 'Konuma göre' : methodLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, autoMethod && styles.cardDisabled]}
          onPress={() => !autoMethod && setMadhabPickerVisible(true)}
          disabled={autoMethod}
        >
          <Text style={[styles.cardLabel, autoMethod && styles.textDisabled]}>İkindi Hesabı</Text>
          <Text style={[styles.cardSubtext, autoMethod && styles.textDisabled]}>{madhabLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, autoMethod && styles.cardDisabled]}
          onPress={() => !autoMethod && setHighLatPickerVisible(true)}
          disabled={autoMethod}
        >
          <Text style={[styles.cardLabel, autoMethod && styles.textDisabled]}>Yüksek Açı Hesabı</Text>
          <Text style={[styles.cardSubtext, autoMethod && styles.textDisabled]}>{highLatLabel}</Text>
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
        <View style={styles.stepperCard}>
          <Text style={styles.cardLabel}>Hicri Gün Düzeltme</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setHijriAdjustmentDays(hijriAdjustmentDays - 1)}>
              <Text style={styles.stepperBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{hijriAdjustmentDays > 0 ? `+${hijriAdjustmentDays}` : hijriAdjustmentDays}</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setHijriAdjustmentDays(hijriAdjustmentDays + 1)}>
              <Text style={styles.stepperBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
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
              </View>
              <Text style={styles.offsetLine}>{s.minutesBefore} dakika önce</Text>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backArrow: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 15 },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  scrollContent: { padding: spacing.lg },
  sectionTitle: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 14, textTransform: 'uppercase', marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm, position: 'relative' },
  cardDisabled: { opacity: 0.45 },
  textDisabled: { color: colors.primary },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 16 },
  cardLabelInline: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 16, flex: 1 },
  cardSubtext: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 13, marginTop: 2 },
  chevron: { color: colors.primary, fontSize: 20, position: 'absolute', right: spacing.md, top: spacing.md },
  offsetLine: { fontFamily: typography.bodyMedium, color: colors.primary, fontSize: 13, marginTop: spacing.xs },
  soundLink: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 13, marginTop: spacing.xs },
  gpsHint: { fontFamily: typography.bodyMedium, color: colors.gold, fontSize: 12, marginBottom: spacing.sm },
  gpsStatusText: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 12, marginBottom: spacing.xs, lineHeight: 17 },
  retryLink: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 12, marginBottom: spacing.sm, textDecorationLine: 'underline' },
  stepperCard: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepperBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepperBtnText: { color: colors.white, fontSize: 18, fontFamily: typography.bodyBold },
  stepperValue: { fontFamily: typography.displaySemibold, color: colors.primaryDark, fontSize: 18, minWidth: 30, textAlign: 'center' },
});
