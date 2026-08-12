// src/lib/prayerCalculator.ts
import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';

export type VakitKey = 'imsak' | 'sabah' | 'gunes' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi';

export interface VakitEntry {
  key: VakitKey;
  label: string;
  date: Date;
}

const LABELS: Record<VakitKey, string> = {
  imsak: 'İmsak',
  sabah: 'Sabah',
  gunes: 'Güneş',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam',
  yatsi: 'Yatsı',
};

// Ülke -> hesaplama yöntemi eşlemesi (ilerleyen adımlarda daha fazla ülke eklenecek)
function getMethodForCountry(countryCode: string) {
  switch (countryCode) {
    case 'TR':
      return CalculationMethod.Turkey();
    case 'US':
    case 'CA':
      return CalculationMethod.NorthAmerica();
    case 'SA':
      return CalculationMethod.UmmAlQura();
    case 'EG':
      return CalculationMethod.Egyptian();
    case 'PK':
    case 'IN':
    case 'BD':
      return CalculationMethod.Karachi();
    default:
      return CalculationMethod.MuslimWorldLeague();
  }
}

export function calculateVakitler(
  latitude: number,
  longitude: number,
  date: Date,
  countryCode: string = 'TR'
): VakitEntry[] {
  const coordinates = new Coordinates(latitude, longitude);
  const params = getMethodForCountry(countryCode);
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  // adhan kütüphanesi Sabah (Fajr) ile İmsak'ı ayırmıyor.
  // Diyanet geleneğinde İmsak, Fajr'dan ~10 dakika önce kabul edilir.
  const imsak = new Date(prayerTimes.fajr.getTime() - 10 * 60 * 1000);

  return [
    { key: 'imsak', label: LABELS.imsak, date: imsak },
    { key: 'sabah', label: LABELS.sabah, date: prayerTimes.fajr },
    { key: 'gunes', label: LABELS.gunes, date: prayerTimes.sunrise },
    { key: 'ogle', label: LABELS.ogle, date: prayerTimes.dhuhr },
    { key: 'ikindi', label: LABELS.ikindi, date: prayerTimes.asr },
    { key: 'aksam', label: LABELS.aksam, date: prayerTimes.maghrib },
    { key: 'yatsi', label: LABELS.yatsi, date: prayerTimes.isha },
  ];
}
