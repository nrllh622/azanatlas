// src/context/CalculationSettingsContext.tsx
//
// DÜZELTME (bu tur — madde 4): bu dosya AsyncStorage'a hiç yazmıyordu —
// hesaplama yöntemi, mezhep, kerahat süresi gibi tüm ayarlar uygulama
// kapatılıp açıldığında sıfırlanıyordu. Kök neden ve genel çözüm için
// `src/lib/ayarDeposu.ts` başındaki yorum.
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ayarYukle, ayarKaydet } from '../lib/ayarDeposu';

const STORAGE_KEY = 'azanatlas_calculation_settings_v1';

export type CalcMethodId =
  | 'Turkey' | 'NorthAmerica' | 'MuslimWorldLeague' | 'Egyptian'
  | 'Karachi' | 'UmmAlQura' | 'Tehran' | 'Kuwait' | 'Qatar' | 'Singapore'
  | 'Dubai' | 'MoonsightingCommittee' | 'Jakim' | 'Uoif';

// Madde 7 (i18n taraması, bu tur): bu dosya React bileşeni değil, `label`
// dizileri MODÜL YÜKLENİRKEN bir kez oluşur — `useCeviri()` çağıramaz. Aynı
// bilingual VERİ deseni burada da uygulanıyor (bkz. theme.ts'teki
// `PALETLER`'in `adEn`/`aciklamaEn`'i): Türkçe `label` korunuyor, yanına
// `labelEn` ekleniyor; ekran tarafı (SettingsScreen.tsx) render sırasında
// `dil === 'en' ? o.labelEn : o.label` ile seçiyor.
export const CALC_METHODS: { id: CalcMethodId; label: string; labelEn: string }[] = [
  { id: 'Turkey', label: 'Diyanet Takvimi (Türkiye)', labelEn: 'Diyanet (Turkey)' },
  { id: 'NorthAmerica', label: 'Kuzey Amerika (ISNA)', labelEn: 'North America (ISNA)' },
  { id: 'MuslimWorldLeague', label: 'Müslim World Lig', labelEn: 'Muslim World League' },
  { id: 'Egyptian', label: 'Mısır', labelEn: 'Egyptian General Authority' },
  { id: 'Karachi', label: 'Karaçi İslami İlimler Üniversitesi', labelEn: 'University of Islamic Sciences, Karachi' },
  { id: 'UmmAlQura', label: 'Ümmül Kurra', labelEn: 'Umm al-Qura, Makkah' },
  { id: 'Tehran', label: 'Tahran Üniversitesi', labelEn: 'University of Tehran' },
  { id: 'Kuwait', label: 'Kuveyt', labelEn: 'Kuwait' },
  { id: 'Qatar', label: 'Katar', labelEn: 'Qatar' },
  { id: 'Singapore', label: 'Singapur (MUIS)', labelEn: 'Singapore (MUIS)' },
  { id: 'Dubai', label: 'Dubai', labelEn: 'Dubai' },
  { id: 'MoonsightingCommittee', label: 'Ay Gözlem Komitesi', labelEn: 'Moonsighting Committee' },
  { id: 'Jakim', label: 'JAKIM (Malezya)', labelEn: 'JAKIM (Malaysia)' },
  { id: 'Uoif', label: 'UOIF (Fransa)', labelEn: 'UOIF (France)' },
];

export const KERAHAT_OPTIONS = [15, 30, 45, 60];

export type MadhabId = 'Shafi' | 'Hanafi';
export const MADHAB_OPTIONS: { id: MadhabId; label: string; labelEn: string }[] = [
  { id: 'Shafi', label: 'Şafi, Maliki, Hanbeli', labelEn: 'Shafi, Maliki, Hanbali (standard)' },
  { id: 'Hanafi', label: 'Hanefi', labelEn: 'Hanafi' },
];

export type HighLatRuleId = 'AngleBased' | 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'None';
export const HIGH_LAT_OPTIONS: { id: HighLatRuleId; label: string; labelEn: string }[] = [
  { id: 'AngleBased', label: 'Açı Tabanlı Yöntem', labelEn: 'Angle-Based Method' },
  { id: 'MiddleOfTheNight', label: 'Gece Yarısı', labelEn: 'Middle of the Night' },
  { id: 'SeventhOfTheNight', label: 'Gecenin 1/7 si', labelEn: 'One-Seventh of the Night' },
  { id: 'None', label: 'Yok', labelEn: 'None' },
];

export type DistanceUnit = 'km' | 'mi';
export const DISTANCE_UNIT_OPTIONS: { id: DistanceUnit; label: string; labelEn: string }[] = [
  { id: 'km', label: 'Kilometre', labelEn: 'Kilometers' },
  { id: 'mi', label: 'Mil', labelEn: 'Miles' },
];

interface StoredSettings {
  autoMethod: boolean;
  methodId: CalcMethodId;
  kerahatMinutes: number;
  madhab: MadhabId;
  highLatRule: HighLatRuleId;
  hijriAdjustmentDays: number;
  hijriSwitchAtMaghrib: boolean;
  distanceUnit: DistanceUnit;
}

const DEFAULT_SETTINGS: StoredSettings = {
  autoMethod: true,
  methodId: 'Turkey',
  kerahatMinutes: 45,
  madhab: 'Shafi',
  highLatRule: 'AngleBased',
  hijriAdjustmentDays: 0,
  hijriSwitchAtMaghrib: false,
  distanceUnit: 'km',
};

interface Ctx {
  autoMethod: boolean;
  methodId: CalcMethodId;
  kerahatMinutes: number;
  madhab: MadhabId;
  highLatRule: HighLatRuleId;
  hijriAdjustmentDays: number;
  hijriSwitchAtMaghrib: boolean;
  distanceUnit: DistanceUnit;
  setAutoMethod: (v: boolean) => void;
  setMethodId: (id: CalcMethodId) => void;
  setKerahatMinutes: (m: number) => void;
  setMadhab: (m: MadhabId) => void;
  setHighLatRule: (r: HighLatRuleId) => void;
  setHijriAdjustmentDays: (d: number) => void;
  setHijriSwitchAtMaghrib: (v: boolean) => void;
  setDistanceUnit: (u: DistanceUnit) => void;
}

const CalculationSettingsContext = createContext<Ctx | undefined>(undefined);

export function CalculationSettingsProvider({ children }: { children: ReactNode }) {
  const [autoMethod, setAutoMethod] = useState(DEFAULT_SETTINGS.autoMethod);
  const [methodId, setMethodId] = useState<CalcMethodId>(DEFAULT_SETTINGS.methodId);
  const [kerahatMinutes, setKerahatMinutes] = useState(DEFAULT_SETTINGS.kerahatMinutes);
  const [madhab, setMadhab] = useState<MadhabId>(DEFAULT_SETTINGS.madhab);
  const [highLatRule, setHighLatRule] = useState<HighLatRuleId>(DEFAULT_SETTINGS.highLatRule);
  const [hijriAdjustmentDays, setHijriAdjustmentDays] = useState(DEFAULT_SETTINGS.hijriAdjustmentDays);
  const [hijriSwitchAtMaghrib, setHijriSwitchAtMaghrib] = useState(DEFAULT_SETTINGS.hijriSwitchAtMaghrib);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(DEFAULT_SETTINGS.distanceUnit);

  useEffect(() => {
    ayarYukle(STORAGE_KEY, DEFAULT_SETTINGS).then((s) => {
      setAutoMethod(s.autoMethod);
      setMethodId(s.methodId);
      setKerahatMinutes(s.kerahatMinutes);
      setMadhab(s.madhab);
      setHighLatRule(s.highLatRule);
      setHijriAdjustmentDays(s.hijriAdjustmentDays);
      setHijriSwitchAtMaghrib(s.hijriSwitchAtMaghrib);
      setDistanceUnit(s.distanceUnit);
    });
  }, []);

  const hazirRef = useRef(false);
  useEffect(() => {
    if (!hazirRef.current) {
      hazirRef.current = true;
      return;
    }
    ayarKaydet(STORAGE_KEY, {
      autoMethod, methodId, kerahatMinutes, madhab, highLatRule, hijriAdjustmentDays, hijriSwitchAtMaghrib, distanceUnit,
    } as StoredSettings);
  }, [autoMethod, methodId, kerahatMinutes, madhab, highLatRule, hijriAdjustmentDays, hijriSwitchAtMaghrib, distanceUnit]);

  return (
    <CalculationSettingsContext.Provider
      value={{
        autoMethod, methodId, kerahatMinutes, madhab, highLatRule, hijriAdjustmentDays, hijriSwitchAtMaghrib, distanceUnit,
        setAutoMethod, setMethodId, setKerahatMinutes, setMadhab, setHighLatRule, setHijriAdjustmentDays, setHijriSwitchAtMaghrib, setDistanceUnit,
      }}
    >
      {children}
    </CalculationSettingsContext.Provider>
  );
}

export function useCalculationSettings() {
  const ctx = useContext(CalculationSettingsContext);
  if (!ctx) throw new Error('useCalculationSettings, CalculationSettingsProvider içinde kullanılmalı');
  return ctx;
}
