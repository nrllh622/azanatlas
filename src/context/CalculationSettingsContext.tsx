// src/context/CalculationSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CalcMethodId =
  | 'Turkey' | 'NorthAmerica' | 'MuslimWorldLeague' | 'Egyptian'
  | 'Karachi' | 'UmmAlQura' | 'Tehran' | 'Kuwait' | 'Qatar' | 'Singapore'
  | 'Dubai' | 'MoonsightingCommittee' | 'Jakim' | 'Uoif';

export const CALC_METHODS: { id: CalcMethodId; label: string }[] = [
  { id: 'Turkey', label: 'Diyanet Takvimi (Türkiye)' },
  { id: 'NorthAmerica', label: 'Kuzey Amerika (ISNA)' },
  { id: 'MuslimWorldLeague', label: 'Müslim World Lig' },
  { id: 'Egyptian', label: 'Mısır' },
  { id: 'Karachi', label: 'Karaçi İslami İlimler Üniversitesi' },
  { id: 'UmmAlQura', label: 'Ümmül Kurra' },
  { id: 'Tehran', label: 'Tahran Üniversitesi' },
  { id: 'Kuwait', label: 'Kuveyt' },
  { id: 'Qatar', label: 'Katar' },
  { id: 'Singapore', label: 'Singapur (MUIS)' },
  { id: 'Dubai', label: 'Dubai' },
  { id: 'MoonsightingCommittee', label: 'Ay Gözlem Komitesi' },
  { id: 'Jakim', label: 'JAKIM (Malezya)' },
  { id: 'Uoif', label: 'UOIF (Fransa)' },
];

export const KERAHAT_OPTIONS = [15, 30, 45, 60];

export type MadhabId = 'Shafi' | 'Hanafi';
export const MADHAB_OPTIONS: { id: MadhabId; label: string }[] = [
  { id: 'Shafi', label: 'Şafi, Maliki, Hanbeli, Türkiye' },
  { id: 'Hanafi', label: 'Hanefi' },
];

export type HighLatRuleId = 'AngleBased' | 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'None';
export const HIGH_LAT_OPTIONS: { id: HighLatRuleId; label: string }[] = [
  { id: 'AngleBased', label: 'Açı Tabanlı Yöntem' },
  { id: 'MiddleOfTheNight', label: 'Gece Yarısı' },
  { id: 'SeventhOfTheNight', label: 'Gecenin 1/7 si' },
  { id: 'None', label: 'Yok' },
];

export type DistanceUnit = 'km' | 'mi';
export const DISTANCE_UNIT_OPTIONS: { id: DistanceUnit; label: string }[] = [
  { id: 'km', label: 'Kilometre' },
  { id: 'mi', label: 'Mil' },
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
