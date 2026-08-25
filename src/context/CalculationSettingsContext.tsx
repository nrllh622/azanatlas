// src/context/CalculationSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  { id: 'Shafi', label: 'Şafi, Maliki, Hanbeli, Türkiye', labelEn: 'Shafi, Maliki, Hanbali (standard)' },
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
  const [autoMethod, setAutoMethod] = useState(true);
  const [methodId, setMethodId] = useState<CalcMethodId>('Turkey');
  const [kerahatMinutes, setKerahatMinutes] = useState(45);
  const [madhab, setMadhab] = useState<MadhabId>('Shafi');
  const [highLatRule, setHighLatRule] = useState<HighLatRuleId>('AngleBased');
  const [hijriAdjustmentDays, setHijriAdjustmentDays] = useState(0);
  const [hijriSwitchAtMaghrib, setHijriSwitchAtMaghrib] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('km');

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
