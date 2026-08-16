// src/lib/hijri.ts
const HIJRI_MONTHS = [
  'Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir',
  'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce',
];

// Diyanet/Ümmül Kurra gibi resmi takvimlerle hizalamak için SABİT temel düzeltme
const BASE_ADJUSTMENT = 1;

function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function jdnToHijri(jdn: number) {
  let l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day, month, year };
}

// extraAdjustment: kullanıcının Ayarlar'dan +/- ile eklediği EK gün — sabit +1 temel
// düzeltmenin ÜZERİNE eklenir, üzerine yazmaz. Varsayılan 0 (sadece temel düzeltme geçerli).
export function toHijri(date: Date, extraAdjustment: number = 0): { day: number; month: string; year: number } {
  const jdn = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate()) + BASE_ADJUSTMENT + extraAdjustment;
  const { day, month, year } = jdnToHijri(jdn);
  return { day, month: HIJRI_MONTHS[month - 1] ?? '', year };
}
