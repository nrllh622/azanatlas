// src/screens/SettingsScreen.tsx
//
// AYARLAR
//
// Önceden bu ekran kendi başlığını çiziyor, düz `colors.primary` zemin ve
// serbest punto/köşe değerleri kullanıyordu — uygulamanın geri kalanıyla
// (Ana Sayfa, Kıble, Tesbih...) aynı görsel dilde durmuyordu. Artık diğer
// tüm alt ekranlar gibi ortak `ScreenHeader`'ı (İslami doku + tutarlı
// başlık biçimi) ve ortak `radius`/`fontSize`/`lineHeight` ölçeğini
// kullanıyor; kartlar `elevation.card` gölgesiyle Kıble/Tesbih/Kaza
// ekranlarındaki kartlarla birebir aynı dilde.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import * as Location from 'expo-location';
import ScreenHeader from '../components/ScreenHeader';
import { colors, spacing, radius, typography, elevation, fontSize, lineHeight } from '../theme';
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
import { useCeviri } from '../i18n/DilContext';
import { DilKodu, DIL_ADLARI } from '../i18n/ceviriler';

// NOT: bu iki liste artık düz metin değil ÇEVİRİ ANAHTARI tutuyor — aynı
// HomeScreen'deki SEKMELER/HIZLI_ARACLAR deseninde: modül yüklenirken bir
// kez oluşturulan sabit diziler React hook'u (useCeviri) çağıramaz, bu
// yüzden gerçek metin render sırasında t(anahtar) ile çözülüyor.
const PRE_ALERT_LABELS: { key: PreAlertVakitKey; anahtar: 'fromImsak' | 'fromGunes' | 'fromOgle' | 'fromIkindi' | 'fromAksam' | 'fromYatsi' }[] = [
  { key: 'imsak', anahtar: 'fromImsak' },
  { key: 'gunes', anahtar: 'fromGunes' },
  { key: 'ogle', anahtar: 'fromOgle' },
  { key: 'ikindi', anahtar: 'fromIkindi' },
  { key: 'aksam', anahtar: 'fromAksam' },
  { key: 'yatsi', anahtar: 'fromYatsi' },
];

const ON_TIME_LABELS: { key: OnTimeVakitKey; anahtar: 'ezanSabah' | 'ezanOgle' | 'ezanIkindi' | 'ezanAksam' | 'ezanYatsi' }[] = [
  { key: 'sabah', anahtar: 'ezanSabah' },
  { key: 'ogle', anahtar: 'ezanOgle' },
  { key: 'ikindi', anahtar: 'ezanIkindi' },
  { key: 'aksam', anahtar: 'ezanAksam' },
  { key: 'yatsi', anahtar: 'ezanYatsi' },
];

interface Props {
  onClose: () => void;
  onOpenVaktindeKil: () => void;
  onOpenReminders: () => void;
}

type PickerTarget = { type: 'pre'; key: PreAlertVakitKey } | { type: 'onTime'; key: OnTimeVakitKey };

export default function SettingsScreen({ onClose, onOpenVaktindeKil, onOpenReminders }: Props) {
  // i18n paketi: dil seçici ekranın en üstünde ("Vaktinde Kıl" linkinden
  // önce) — kullanıcının en çok arayacağı yer. Ekranın GERİ KALANI da
  // (hesaplama yöntemi, kişiselleştirme, genel, uyarılar bölümleri)
  // çevrildi. Hesaplama Yöntemi/Mezhep/Yüksek Açı/Ölçü Birimi
  // SEÇENEKLERİNİN etiketleri (CalculationSettingsContext.tsx'ten geliyor)
  // artık `labelEn` de taşıyor — bkz. `methodLabel`/`madhabLabel`/
  // `highLatLabel`/`distanceUnitLabel` hesaplamaları ve aşağıdaki
  // `SimplePickerModal` çağrılarındaki `.map(...)` dönüşümleri (madde 7,
  // bu tur).
  const { dil, diliDegistir, t, sesAdi } = useCeviri();
  // Hesaplama yöntemi/mezhep/yüksek açı/ölçü birimi etiketleri yalnızca
  // tr/label ve en/labelEn olarak yazılı (CalculationSettingsContext.tsx).
  // Önceden `dil === 'en'` kontrolü kullanılıyordu — bu, id/fr seçiliyken
  // İngilizce'ye DEĞİL, yanlışlıkla Türkçe'ye düşüyordu (`dil === 'en'`
  // false olduğu için hep `label`, yani Türkçe seçiliyordu). Diğer veri
  // içerikleriyle (ayet/tarih/zikir/tema/dini gün) aynı `veriDili` deseni
  // kullanılarak düzeltildi: Türkçe DIŞINDAKİ her dilde İngilizce'ye düşer.
  const veriDili = dil === 'tr' ? 'tr' : 'en';
  const { settings, setPreAlert, setOnTime, setFlag } = useNotificationSettings();
  const {
    autoMethod, methodId, kerahatMinutes, madhab, highLatRule, hijriAdjustmentDays, hijriSwitchAtMaghrib, distanceUnit,
    setAutoMethod, setMethodId, setKerahatMinutes, setMadhab, setHighLatRule, setHijriAdjustmentDays, setHijriSwitchAtMaghrib, setDistanceUnit,
  } = useCalculationSettings();
  const {
    vibrationEnabled, faceDownSilenceEnabled, notificationBarWidgetEnabled, otomatikGuncellemeEnabled,
    setVibrationEnabled, setFaceDownSilenceEnabled, setNotificationBarWidgetEnabled, setOtomatikGuncellemeEnabled,
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
    pickerTitle = t('uyariSesi', found ? t(found.anahtar) : '');
  } else if (pickerFor && pickerFor.type === 'onTime') {
    currentSelectedId = settings.onTimeAlerts[pickerFor.key].soundId;
    const found = ON_TIME_LABELS.find((x) => x.key === pickerFor.key);
    pickerTitle = t('uyariSesi', found ? t(found.anahtar) : '');
  }

  // Madde 7 (i18n taraması, bu tur): CALC_METHODS/MADHAB_OPTIONS/
  // HIGH_LAT_OPTIONS/DISTANCE_UNIT_OPTIONS artık `labelEn` de taşıyor
  // (bkz. CalculationSettingsContext.tsx) — dile göre seçiliyor.
  const methodLabel = (veriDili === 'en'
    ? CALC_METHODS.find((m) => m.id === methodId)?.labelEn
    : CALC_METHODS.find((m) => m.id === methodId)?.label) ?? '';
  const madhabLabel = (veriDili === 'en'
    ? MADHAB_OPTIONS.find((m) => m.id === madhab)?.labelEn
    : MADHAB_OPTIONS.find((m) => m.id === madhab)?.label) ?? '';
  const highLatLabel = (veriDili === 'en'
    ? HIGH_LAT_OPTIONS.find((m) => m.id === highLatRule)?.labelEn
    : HIGH_LAT_OPTIONS.find((m) => m.id === highLatRule)?.label) ?? '';
  const distanceUnitLabel = (veriDili === 'en'
    ? DISTANCE_UNIT_OPTIONS.find((m) => m.id === distanceUnit)?.labelEn
    : DISTANCE_UNIT_OPTIONS.find((m) => m.id === distanceUnit)?.label) ?? '';

  // ÖNEMLİ: "Otomatik" anahtarı GPS gerçekten başarılı olana kadar AÇIK duruma
  // GEÇMİYOR — kullanıcının bildirdiği hata buydu (izin reddedilse bile
  // anahtar açık kalıyordu). Şimdi anahtarın görsel durumu her zaman gerçeği yansıtıyor.
  const attemptEnableAuto = async () => {
    setGpsLoading(true);
    setGpsStatus(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAutoMethod(false);
        setGpsStatus(t('konumIzniVerilmedi'));
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
        il: place?.region || place?.city || t('gpsKonumu'),
        ilce: place?.subregion || place?.district || place?.city || '',
        countryCode: place?.isoCountryCode || 'TR',
        isGps: true,
      });
      setAutoMethod(true);
      setGpsStatus(t('konumBasariylaAlindi'));
    } catch (e) {
      setAutoMethod(false);
      setGpsStatus(t('konumAlinamadi'));
    } finally {
      setGpsLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title={t('ayarlar')} subtitle={t('ayarlarAltBaslik')} icon="ayarlar" onClose={onClose} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── DİL / LANGUAGE ──
            i18n paketi: uygulama artık Türkçe + İngilizce destekliyor.
            Değişiklik ANINDA uygulanır (tema gibi yeniden başlatma
            GEREKMİYOR) çünkü metinler StyleSheet'e değil, render'a
            kilitli — bkz. DilContext.tsx'teki açıklama. */}
        <Text style={styles.sectionTitle}>{t('dilBolumBasligi')}</Text>
        <View style={styles.dilKart}>
          {(Object.keys(DIL_ADLARI) as DilKodu[]).map((kod) => {
            const aktif = kod === dil;
            return (
              <TouchableOpacity
                key={kod}
                style={[styles.dilSecenek, aktif && styles.dilSecenekAktif]}
                onPress={() => diliDegistir(kod)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ selected: aktif }}
              >
                <Text style={[styles.dilSecenekYazi, aktif && styles.dilSecenekYaziAktif]}>
                  {DIL_ADLARI[kod]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.linkCard} onPress={onOpenVaktindeKil} activeOpacity={0.85}>
          <Text style={styles.cardLabel}>{t('vaktindeKil')}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkCard} onPress={onOpenReminders} activeOpacity={0.85}>
          <Text style={styles.cardLabel}>{t('hatirlaticilar')}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('hesaplamaYontemiBaslik')}</Text>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch
              value={autoMethod}
              disabled={gpsLoading}
              onValueChange={(v) => {
                if (v) {
                  attemptEnableAuto();
                } else {
                  setAutoMethod(false);
                  setGpsStatus(null);
                }
              }}
              trackColor={{ true: colors.primaryBright, false: undefined }}
              thumbColor={colors.white}
            />
            <Text style={styles.cardLabelInline}>{t('otomatik')}</Text>
          </View>
        </View>
        {gpsLoading && <Text style={styles.gpsHint}>{t('konumAliniyor')}</Text>}
        {!gpsLoading && gpsStatus && <Text style={styles.gpsStatusText}>{gpsStatus}</Text>}
        {!gpsLoading && !autoMethod && gpsStatus && (
          <TouchableOpacity onPress={attemptEnableAuto}>
            <Text style={styles.retryLink}>{t('konumTekrarDene')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.card, autoMethod && styles.cardDisabled]}
          onPress={() => !autoMethod && setMethodPickerVisible(true)}
          disabled={autoMethod}
          activeOpacity={0.85}
        >
          <Text style={[styles.cardLabel, autoMethod && styles.textDisabled]}>{t('hesaplamaYontemiBaslik')}</Text>
          <Text style={[styles.cardSubtext, autoMethod && styles.textDisabled]}>{autoMethod ? t('konumaGore') : methodLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, autoMethod && styles.cardDisabled]}
          onPress={() => !autoMethod && setMadhabPickerVisible(true)}
          disabled={autoMethod}
          activeOpacity={0.85}
        >
          <Text style={[styles.cardLabel, autoMethod && styles.textDisabled]}>{t('ikindiHesabi')}</Text>
          <Text style={[styles.cardSubtext, autoMethod && styles.textDisabled]}>{madhabLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, autoMethod && styles.cardDisabled]}
          onPress={() => !autoMethod && setHighLatPickerVisible(true)}
          disabled={autoMethod}
          activeOpacity={0.85}
        >
          <Text style={[styles.cardLabel, autoMethod && styles.textDisabled]}>{t('yuksekAciHesabi')}</Text>
          <Text style={[styles.cardSubtext, autoMethod && styles.textDisabled]}>{highLatLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setKerahatPickerVisible(true)} activeOpacity={0.85}>
          <Text style={styles.cardLabel}>{t('kerahatVaktiSuresi')}</Text>
          <Text style={styles.cardSubtext}>{t('dk', kerahatMinutes)}</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={settings.kerahatNotifyEnabled} onValueChange={(v) => setFlag('kerahatNotifyEnabled', v)} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
            <Text style={styles.cardLabelInline}>{t('kerahatVaktindeUyar')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('kisisellestirmeBaslik')}</Text>
        <View style={styles.stepperCard}>
          <Text style={styles.cardLabel}>{t('hicriGunDuzeltme')}</Text>
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
            <Switch value={hijriSwitchAtMaghrib} onValueChange={setHijriSwitchAtMaghrib} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
            <Text style={styles.cardLabelInline}>{t('hicriGunDegisimiAksam')}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.card} onPress={() => setDistanceUnitPickerVisible(true)} activeOpacity={0.85}>
          <Text style={styles.cardLabel}>{t('olcuBirimleri')}</Text>
          <Text style={styles.cardSubtext}>{distanceUnitLabel}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('genelBaslik')}</Text>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
            <Text style={styles.cardLabelInline}>{t('titresim')}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={faceDownSilenceEnabled} onValueChange={setFaceDownSilenceEnabled} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
            <Text style={styles.cardLabelInline}>{t('yuzustuSesKapat')}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={notificationBarWidgetEnabled} onValueChange={setNotificationBarWidgetEnabled} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
            <Text style={styles.cardLabelInline}>{t('bildirimCubuguWidgeti')}</Text>
          </View>
        </View>
        {/* 7. tur — madde 7: otomatik güncelleme tercihi. Açıklama satırı
            diğer aç/kapat kartlarında yok ama bu ayarın davranışı (soru
            sormadan indirme) yeterince farklı — kısa bir açıklama gerekli
            görüldü. */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={otomatikGuncellemeEnabled} onValueChange={setOtomatikGuncellemeEnabled} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
            <Text style={styles.cardLabelInline}>{t('otomatikGuncelleme')}</Text>
          </View>
          <Text style={styles.cardSubtext}>{t('otomatikGuncellemeAciklama')}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={settings.ezanDuasiEnabled} onValueChange={(v) => setFlag('ezanDuasiEnabled', v)} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
            <Text style={styles.cardLabelInline}>{t('ezanDuasi')}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch value={settings.sabahAtImsakVaktinde} onValueChange={(v) => setFlag('sabahAtImsakVaktinde', v)} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
            <Text style={styles.cardLabelInline}>{t('sabahEzaniImsakVaktinde')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('vakitlerdenOnceUyarilar')}</Text>
        {PRE_ALERT_LABELS.map(({ key, anahtar }) => {
          const s = settings.preAlerts[key];
          return (
            <View key={key} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Switch value={s.enabled} onValueChange={(val) => setPreAlert(key, { enabled: val })} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
                <Text style={styles.cardLabelInline}>{t(anahtar)}</Text>
              </View>
              <Text style={styles.offsetLine}>{t('dakikaOnce', s.minutesBefore)}</Text>
              <TouchableOpacity onPress={() => setPickerFor({ type: 'pre', key: key })}>
                <Text style={styles.soundLink}>{t('sesiDegistir', sesAdi(s.soundId, getSoundById(s.soundId).label))}</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>{t('vakitZamanindaUyarilar')}</Text>
        {ON_TIME_LABELS.map(({ key, anahtar }) => {
          const s = settings.onTimeAlerts[key];
          return (
            <View key={key} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Switch value={s.enabled} onValueChange={(val) => setOnTime(key, { enabled: val })} trackColor={{ true: colors.primaryBright, false: undefined }} thumbColor={colors.white} />
                <Text style={styles.cardLabelInline}>{t(anahtar)}</Text>
              </View>
              <TouchableOpacity onPress={() => setPickerFor({ type: 'onTime', key: key })}>
                <Text style={styles.soundLink}>{t('sesiDegistir', sesAdi(s.soundId, getSoundById(s.soundId).label))}</Text>
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

      {/* Madde 7 (i18n taraması, bu tur): seçenek listeleri artık `dil`'e
          göre map'lenip `label` alanı EN/TR arasında seçiliyor —
          `SimplePickerModal`'ın kendisi yalnızca `{id, label}` bekliyor,
          hangi dilde olduğunu bilmiyor. */}
      <SimplePickerModal
        visible={methodPickerVisible}
        title={t('hesaplamaYontemiBaslik')}
        options={CALC_METHODS.map((m) => ({ id: m.id, label: veriDili === 'en' ? m.labelEn : m.label }))}
        selectedId={methodId}
        onSelect={(id) => setMethodId(id as any)}
        onClose={() => setMethodPickerVisible(false)}
      />

      <SimplePickerModal
        visible={madhabPickerVisible}
        title={t('ikindiHesabi')}
        options={MADHAB_OPTIONS.map((m) => ({ id: m.id, label: veriDili === 'en' ? m.labelEn : m.label }))}
        selectedId={madhab}
        onSelect={(id) => setMadhab(id as any)}
        onClose={() => setMadhabPickerVisible(false)}
      />

      <SimplePickerModal
        visible={highLatPickerVisible}
        title={t('yuksekAciHesabi')}
        options={HIGH_LAT_OPTIONS.map((m) => ({ id: m.id, label: veriDili === 'en' ? m.labelEn : m.label }))}
        selectedId={highLatRule}
        onSelect={(id) => setHighLatRule(id as any)}
        onClose={() => setHighLatPickerVisible(false)}
      />

      <SimplePickerModal
        visible={kerahatPickerVisible}
        title={t('kerahatVaktiDakika')}
        options={KERAHAT_OPTIONS.map((m) => ({ id: String(m), label: t('dakika', m) }))}
        selectedId={String(kerahatMinutes)}
        onSelect={(id) => setKerahatMinutes(Number(id))}
        onClose={() => setKerahatPickerVisible(false)}
      />

      <SimplePickerModal
        visible={distanceUnitPickerVisible}
        title={t('olcuBirimleri')}
        options={DISTANCE_UNIT_OPTIONS.map((m) => ({ id: m.id, label: veriDili === 'en' ? m.labelEn : m.label }))}
        selectedId={distanceUnit}
        onSelect={(id) => setDistanceUnit(id as any)}
        onClose={() => setDistanceUnitPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scrollContent: { padding: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xl },

  sectionTitle: {
    fontFamily: typography.bodyBold,
    color: colors.primaryDark,
    fontSize: fontSize.tiny,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  linkCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...elevation.card,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ---------- DİL / LANGUAGE (i18n paketi) ----------
  dilKart: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  dilSecenek: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  dilSecenekAktif: { backgroundColor: colors.primary },
  dilSecenekYazi: { fontFamily: typography.bodyBold, color: colors.textOnLight, fontSize: fontSize.body },
  dilSecenekYaziAktif: { color: colors.textOnDark },
  cardDisabled: { opacity: 0.45 },
  textDisabled: { color: colors.primary },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: fontSize.body },
  cardLabelInline: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: fontSize.body, flex: 1 },
  cardSubtext: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: fontSize.small, marginTop: 2 },
  chevron: { color: colors.primary, fontSize: 22, fontFamily: typography.bodyBold },
  offsetLine: { fontFamily: typography.bodyMedium, color: colors.textMuted, fontSize: fontSize.small, marginTop: spacing.xs },
  soundLink: { fontFamily: typography.bodyBold, color: colors.copper, fontSize: fontSize.small, marginTop: spacing.xs },
  gpsHint: { fontFamily: typography.bodyMedium, color: colors.copper, fontSize: fontSize.tiny, marginBottom: spacing.sm, paddingHorizontal: spacing.xs },
  gpsStatusText: { fontFamily: typography.bodyMedium, color: colors.textMuted, fontSize: fontSize.tiny, marginBottom: spacing.xs, lineHeight: lineHeight.tiny, paddingHorizontal: spacing.xs },
  retryLink: { fontFamily: typography.bodyBold, color: colors.copper, fontSize: fontSize.tiny, marginBottom: spacing.sm, textDecorationLine: 'underline', paddingHorizontal: spacing.xs },

  stepperCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepperBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepperBtnText: { color: colors.white, fontSize: fontSize.title, fontFamily: typography.bodyBold },
  stepperValue: { fontFamily: typography.displaySemibold, color: colors.primaryDark, fontSize: fontSize.title, minWidth: 32, textAlign: 'center' },
});
