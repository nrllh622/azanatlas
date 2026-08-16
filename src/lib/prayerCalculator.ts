// src/lib/prayerCalculator.ts
import { CalculationMethod, Coordinates, PrayerTimes, Madhab, HighLatitudeRule } from 'adhan';

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

function getMethodForCountry(countryCode: string) {
  switch (countryCode) {
    case 'TR': return CalculationMethod.Turkey();
    case 'US': case 'CA': return CalculationMethod.NorthAmerica();
    case 'SA': return CalculationMethod.UmmAlQura();
    case 'EG': return CalculationMethod.Egyptian();
    case 'PK': case 'IN': case 'BD': return CalculationMethod.Karachi();
    default: return CalculationMethod.MuslimWorldLeague();
  }
}

function getMethodById(id: string) {
  switch (id) {
    case 'Turkey': return CalculationMethod.Turkey();
    case 'NorthAmerica': return CalculationMethod.NorthAmerica();
    case 'MuslimWorldLeague': return CalculationMethod.MuslimWorldLeague();
    case 'Egyptian': return CalculationMethod.Egyptian();
    case 'Karachi': return CalculationMethod.Karachi();
    case 'UmmAlQura': return CalculationMethod.UmmAlQura();
    case 'Tehran': return CalculationMethod.Tehran();
    case 'Kuwait': return CalculationMethod.Kuwait();
    case 'Qatar': return CalculationMethod.Qatar();
    case 'Singapore': return CalculationMethod.Singapore();
    default: return null;
  }
}

// Diyanet ve diğer resmi kaynaklar dakikaya YUVARLAR (kırpmaz). adhan kütüphanesi
// saniye hassasiyetinde bir Date döndürüyor — bunu kırpmak yerine en yakın
// dakikaya yuvarlamak, resmi kaynaklarla 1 dakikalık sistematik farkı ortadan kaldırıyor.
function roundToMinute(d: Date): Date {
  return new Date(Math.round(d.getTime() / 60000) * 60000);
}

export function calculateVakitler(
  latitude: number,
  longitude: number,
  date: Date,
  countryCode: string = 'TR',
  autoMethod: boolean = true,
  methodId: string = 'Turkey',
  madhabId: 'Shafi' | 'Hanafi' = 'Shafi',
  highLatRuleId: 'AngleBased' | 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'None' = 'AngleBased'
): VakitEntry[] {
  const coordinates = new Coordinates(latitude, longitude);
  const params = autoMethod ? getMethodForCountry(countryCode) : (getMethodById(methodId) || getMethodForCountry(countryCode));

  // Otomatik moddayken madhab/yüksek açı kuralını EZMİYORUZ — ülkenin varsayılan
  // yöntemi kendi doğru ayarlarıyla çalışsın. Manuel modda kullanıcı seçimi geçerli.
  if (!autoMethod) {
    params.madhab = madhabId === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
    if (highLatRuleId === 'AngleBased') params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
    else if (highLatRuleId === 'MiddleOfTheNight') params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
    else if (highLatRuleId === 'SeventhOfTheNight') params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
  }

  const prayerTimes = new PrayerTimes(coordinates, date, params);

  const fajr = roundToMinute(prayerTimes.fajr);
  const sunrise = roundToMinute(prayerTimes.sunrise);
  const dhuhr = roundToMinute(prayerTimes.dhuhr);
  const asr = roundToMinute(prayerTimes.asr);
  const maghrib = roundToMinute(prayerTimes.maghrib);
  const isha = roundToMinute(prayerTimes.isha);
  const imsak = new Date(fajr.getTime() - 10 * 60 * 1000);

  return [
    { key: 'imsak', label: LABELS.imsak, date: imsak },
    { key: 'sabah', label: LABELS.sabah, date: fajr },
    { key: 'gunes', label: LABELS.gunes, date: sunrise },
    { key: 'ogle', label: LABELS.ogle, date: dhuhr },
    { key: 'ikindi', label: LABELS.ikindi, date: asr },
    { key: 'aksam', label: LABELS.aksam, date: maghrib },
    { key: 'yatsi', label: LABELS.yatsi, date: isha },
  ];
}
