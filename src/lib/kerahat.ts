// src/lib/kerahat.ts
import { VakitEntry } from './prayerCalculator';

export interface KerahatInfo {
  active: boolean;
  reason?: string;
}

/** Zeval (istiva) penceresi — öğle vaktinin hemen öncesi. Sabit kabul edilir. */
const ZEVAL_DAKIKA = 10;

/**
 * İçinde bulunulan anın mekruh (kerahat) vakitlerinden birine denk gelip
 * gelmediğini döndürür. Üç klasik kerahat vakti:
 *
 *   1) Güneş doğarken   — doğuştan itibaren `kerahatMinutes` kadar
 *   2) Zeval vakti      — öğle vaktine ~10 dakika kala
 *   3) Güneş batarken   — akşam vaktinden `kerahatMinutes` kadar önce
 *
 * `kerahatMinutes` kullanıcının Ayarlar'dan seçtiği süredir (varsayılan 45 dk).
 * Daha önce bu değer burada SABİT 45 olarak yazılıydı; kullanıcı ayarı yalnızca
 * bildirimlere yansıyor, ekrandaki uyarı şeridine yansımıyordu. Artık ikisi de
 * aynı ayarı kullanıyor.
 */
export function getKerahatInfo(
  vakitler: VakitEntry[],
  now: Date,
  kerahatMinutes: number = 45
): KerahatInfo {
  const gunes = vakitler.find((v) => v.key === 'gunes');
  const ogle = vakitler.find((v) => v.key === 'ogle');
  const aksam = vakitler.find((v) => v.key === 'aksam');
  const nowMs = now.getTime();

  // Ayar bozuk/eksik gelirse makul bir değere düş.
  const dakika = Number.isFinite(kerahatMinutes) && kerahatMinutes > 0 ? kerahatMinutes : 45;
  const pencereMs = dakika * 60 * 1000;

  if (gunes) {
    const bas = gunes.date.getTime();
    const son = bas + pencereMs;
    if (nowMs >= bas && nowMs <= son) return { active: true, reason: 'Güneş doğarken' };
  }

  if (ogle) {
    const bas = ogle.date.getTime() - ZEVAL_DAKIKA * 60 * 1000;
    if (nowMs >= bas && nowMs <= ogle.date.getTime()) {
      return { active: true, reason: 'Zeval vakti (öğleye yakın)' };
    }
  }

  if (aksam) {
    const bas = aksam.date.getTime() - pencereMs;
    if (nowMs >= bas && nowMs < aksam.date.getTime()) {
      return { active: true, reason: 'Güneş batarken' };
    }
  }

  return { active: false };
}
