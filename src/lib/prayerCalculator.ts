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

export function calculateVakitler(
  latitude: number,
  longitude: number,
  date: Date,
  countryCode: string = 'TR',
  methodOverride?: string,
  madhabId: 'Shafi' | 'Hanafi' = 'Shafi',
  highLatRuleId: 'AngleBased' | 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'None' = 'AngleBased'
): VakitEntry[] {
  const coordinates = new Coordinates(latitude, longitude);
  const overrideParams = methodOverride && methodOverride !== 'auto' ? getMethodById(methodOverride) : null;
  const params = overrideParams || getMethodForCountry(countryCode);

  params.madhab = madhabId === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

  // ÖNEMLİ: HighLatitudeRule bir fonksiyon değil, sabit string değerleri olan bir nesne — parantezsiz kullanılıyor
  if (highLatRuleId === 'AngleBased') params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  else if (highLatRuleId === 'MiddleOfTheNight') params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
  else if (highLatRuleId === 'SeventhOfTheNight') params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
  // 'None' seçiliyse kütüphanenin varsayılan davranışına dokunmuyoruz

  const prayerTimes = new PrayerTimes(coordinates, date, params);
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
