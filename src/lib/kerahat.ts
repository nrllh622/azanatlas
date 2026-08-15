// src/lib/kerahat.ts
import { VakitEntry } from './prayerCalculator';

export interface KerahatInfo {
  active: boolean;
  reason?: string;
}

// Mekruh vakit pencereleri: güneş doğuşundan ~45dk, zeval vaktinde (öğleden ~10dk önce),
// gün batımından ~45dk önce
export function getKerahatInfo(vakitler: VakitEntry[], now: Date): KerahatInfo {
  const gunes = vakitler.find((v) => v.key === 'gunes');
  const ogle = vakitler.find((v) => v.key === 'ogle');
  const aksam = vakitler.find((v) => v.key === 'aksam');
  const nowMs = now.getTime();

  if (gunes) {
    const start = gunes.date.getTime();
    const end = start + 45 * 60 * 1000;
    if (nowMs >= start && nowMs <= end) return { active: true, reason: 'Güneş doğarken' };
  }
  if (ogle) {
    const start = ogle.date.getTime() - 10 * 60 * 1000;
    if (nowMs >= start && nowMs <= ogle.date.getTime()) return { active: true, reason: 'Zeval vakti (öğleye yakın)' };
  }
  if (aksam) {
    const start = aksam.date.getTime() - 45 * 60 * 1000;
    if (nowMs >= start && nowMs < aksam.date.getTime()) return { active: true, reason: 'Güneş batarken' };
  }
  return { active: false };
}
