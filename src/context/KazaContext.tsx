// src/context/KazaContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { calculateVakitler, VakitKey } from '../lib/prayerCalculator';
import { loadKazaMap, setKazaStatus, makeKey, KazaMap } from '../lib/kazaStorage';
import { useLocationContext } from './LocationContext';
import { useCalculationSettings } from './CalculationSettingsContext';

const TRACKED_VAKITLER: VakitKey[] = ['sabah', 'ogle', 'ikindi', 'aksam', 'yatsi'];
const GOSTERILECEK_GUN_SAYISI = 14;

export interface MissedEntry {
  key: string;
  date: Date;
  vakitKey: VakitKey;
  vakitLabel: string;
}

interface Ctx {
  missed: MissedEntry[];
  markCompensated: (key: string) => void;
}

const KazaContext = createContext<Ctx | undefined>(undefined);

export function KazaProvider({ children }: { children: ReactNode }) {
  const { location } = useLocationContext();
  const { methodId } = useCalculationSettings();
  const [kazaMap, setKazaMap] = useState<KazaMap>({});
  const [missed, setMissed] = useState<MissedEntry[]>([]);

  useEffect(() => {
    loadKazaMap().then(setKazaMap);
  }, []);

  useEffect(() => {
    const now = new Date();
    const result: MissedEntry[] = [];

    for (let i = 0; i < GOSTERILECEK_GUN_SAYISI; i++) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const vakitler = calculateVakitler(location.latitude, location.longitude, day, location.countryCode, methodId);
      const nextDayFirstVakit = calculateVakitler(
        location.latitude, location.longitude,
        new Date(day.getTime() + 86400000), location.countryCode, methodId
      )[0];

      TRACKED_VAKITLER.forEach((vk, idx) => {
        const vakit = vakitler.find((v) => v.key === vk);
        if (!vakit) return;
        const nextVakit = vakitler[vakitler.findIndex((v) => v.key === vk) + 1] ?? nextDayFirstVakit;
        const windowEnd = nextVakit.date;
        if (windowEnd.getTime() > now.getTime()) return; // henüz vakit dolmamış

        const key = makeKey(day, vk);
        if (kazaMap[key] === 'prayed' || kazaMap[key] === 'compensated') return;

        result.push({ key, date: day, vakitKey: vk, vakitLabel: vakit.label });
      });
    }

    setMissed(result.sort((a, b) => b.date.getTime() - a.date.getTime()));
  }, [kazaMap, location, methodId]);

  const markCompensated = async (key: string) => {
    const updated = await setKazaStatus(key, 'compensated');
    setKazaMap({ ...updated });
  };

  return <KazaContext.Provider value={{ missed, markCompensated }}>{children}</KazaContext.Provider>;
}

export function useKaza() {
  const ctx = useContext(KazaContext);
  if (!ctx) throw new Error('useKaza, KazaProvider içinde kullanılmalı');
  return ctx;
}
