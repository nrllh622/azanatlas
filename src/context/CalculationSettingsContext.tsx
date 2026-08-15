// src/context/CalculationSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CalcMethodId =
  | 'auto' | 'Turkey' | 'NorthAmerica' | 'MuslimWorldLeague' | 'Egyptian'
  | 'Karachi' | 'UmmAlQura' | 'Tehran' | 'Kuwait' | 'Qatar' | 'Singapore';

export const CALC_METHODS: { id: CalcMethodId; label: string }[] = [
  { id: 'auto', label: 'Otomatik (Konuma Göre)' },
  { id: 'Turkey', label: 'Diyanet Takvimi (Türkiye)' },
  { id: 'NorthAmerica', label: 'Kuzey Amerika (ISNA)' },
  { id: 'MuslimWorldLeague', label: 'Müslim World Lig' },
  { id: 'Egyptian', label: 'Mısır' },
  { id: 'Karachi', label: 'Karaçi İslami İlimler Üniversitesi' },
  { id: 'UmmAlQura', label: 'Ümmül Kurra' },
  { id: 'Tehran', label: 'Tahran Üniversitesi' },
  { id: 'Kuwait', label: 'Kuveyt' },
  { id: 'Qatar', label: 'Katar' },
  { id: 'Singapore', label: 'Singapur' },
];

export const KERAHAT_OPTIONS = [15, 30, 45, 60];

interface Ctx {
  methodId: CalcMethodId;
  kerahatMinutes: number;
  setMethodId: (id: CalcMethodId) => void;
  setKerahatMinutes: (m: number) => void;
}

const CalculationSettingsContext = createContext<Ctx | undefined>(undefined);

export function CalculationSettingsProvider({ children }: { children: ReactNode }) {
  const [methodId, setMethodId] = useState<CalcMethodId>('auto');
  const [kerahatMinutes, setKerahatMinutes] = useState(45);
  return (
    <CalculationSettingsContext.Provider value={{ methodId, kerahatMinutes, setMethodId, setKerahatMinutes }}>
      {children}
    </CalculationSettingsContext.Provider>
  );
}

export function useCalculationSettings() {
  const ctx = useContext(CalculationSettingsContext);
  if (!ctx) throw new Error('useCalculationSettings, CalculationSettingsProvider içinde kullanılmalı');
  return ctx;
}
