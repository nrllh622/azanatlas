// src/lib/prayerCalculator.ts
import { CalculationMethod, Coordinates, PrayerTimes, Madhab, HighLatitudeRule } from 'adhan';
import { getDiyanetMonthlyVakitler, parseDiyanetGunSaat, findGunlukVakit } from './diyanetApi';

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
    case 'Dubai': return CalculationMethod.Dubai();
    case 'MoonsightingCommittee': return CalculationMethod.MoonsightingCommittee();
    case 'Jakim': {
      // JAKIM (Malezya) — doğrulanmış açılar: Fajr 20°, Isha 18°
      const p = CalculationMethod.Other();
      p.fajrAngle = 20;
      p.ishaAngle = 18;
      return p;
    }
    case 'Uoif': {
      // UOIF (Fransa) — doğrulanmış açılar: Fajr 12°, Isha 12°
      const p = CalculationMethod.Other();
      p.fajrAngle = 12;
      p.ishaAngle = 12;
      return p;
    }
    default: return null;
  }
}

// Diyanet ve diğer resmi kaynaklar dakikaya YUVARLAR (kırpmaz).
function roundToMinute(d: Date): Date {
  return new Date(Math.round(d.getTime() / 60000) * 60000);
}

// YEREL HESAPLAMA (adhan kütüphanesi) — her zaman senkron ve anında sonuç
// verir, internet gerektirmez. Diyanet verisi çekilemediğinde (internet yok,
// il/ilçe eşleşmedi, ağ hatası vb.) bu fonksiyon güvenilir yedek olarak kalır.
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

  // İMSAK = astronomik Fecr-i Sadık (Fajr) anı — dini olarak sabah namazının
  // GERÇEK giriş vaktiyle aynıdır (Diyanet fetvası). "-10 dakika" gibi eski
  // icat edilmiş güvenlik payı kaldırıldı.
  const imsak = fajr;

  // SABAH: Ezan Vakti Pro'nun ANA EKRANINDA gösterdiği "Sabah" değeri, gerçek
  // Fecr-i Sadık (İmsak) değil — gerçek verilerle doğrulandı: 21 Ağustos 2026,
  // İstanbul/Küçükçekmece için Ezan Vakti Pro İmsak=04:39, Sabah=05:13,
  // Güneş=06:13 gösteriyor; 05:13 tam olarak Güneş-60dk. Bu, Türkiye'de
  // "sabah ezanı güneş doğuşundan bir saat önce okunur" şeklinde bilinen,
  // Diyanet'in kesin açı hesabından bağımsız, pratik/geleneksel bir
  // gösterim kuralı. SADECE Türkiye/Diyanet konvansiyonu kullanılırken
  // uygulanıyor — başka ülke/yöntemlerde (ör. ISNA, MWL) "Sabah" evrensel
  // fıkıh kuralına göre yine Fecr-i Sadık'ın (İmsak/Fajr) kendisidir.
  const turkiyeKonvansiyonu = countryCode === 'TR' && (autoMethod || methodId === 'Turkey');
  const sabah = turkiyeKonvansiyonu
    ? new Date(Math.max(fajr.getTime(), sunrise.getTime() - 60 * 60 * 1000))
    : fajr;

  return [
    { key: 'imsak', label: LABELS.imsak, date: imsak },
    { key: 'sabah', label: LABELS.sabah, date: sabah },
    { key: 'gunes', label: LABELS.gunes, date: sunrise },
    { key: 'ogle', label: LABELS.ogle, date: dhuhr },
    { key: 'ikindi', label: LABELS.ikindi, date: asr },
    { key: 'aksam', label: LABELS.aksam, date: maghrib },
    { key: 'yatsi', label: LABELS.yatsi, date: isha },
  ];
}

export type VakitKaynak = 'diyanet' | 'yerel';

export interface VakitSonucu {
  vakitler: VakitEntry[];
  kaynak: VakitKaynak;
}

// Diyanet'in resmi verisini denemeye çalışan, olmazsa yerel hesaba (adhan)
// sessizce düşen ASENKRON fonksiyon.
//
// Diyanet SADECE şu durumda denenir: ülke Türkiye, il/ilçe bilgisi mevcut,
// VE kullanıcı fiilen "Diyanet Takvimi (Türkiye)" yöntemini kullanıyor —
// ya "Otomatik Yöntem" açıksa (bu zaten TR için Turkey() metodunu seçiyor)
// ya da manuel modda kendisi "Turkey" yöntemini seçtiyse. Kullanıcı bilerek
// başka bir yöntem seçtiyse (ör. Ümmül Kurra, Karaçi) — Türkiye'deyken bile —
// o tercihi ASLA Diyanet verisiyle ezmiyoruz; bu onun açık seçimidir.
export async function getVakitlerWithDiyanetFallback(
  latitude: number,
  longitude: number,
  date: Date,
  countryCode: string,
  il: string,
  ilce: string,
  autoMethod: boolean,
  methodId: string,
  madhabId: 'Shafi' | 'Hanafi',
  highLatRuleId: 'AngleBased' | 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'None'
): Promise<VakitSonucu> {
  const yerel = calculateVakitler(latitude, longitude, date, countryCode, autoMethod, methodId, madhabId, highLatRuleId);

  const kullaniciDiyanetIstiyor = autoMethod || methodId === 'Turkey';
  if (countryCode !== 'TR' || !il || !ilce || !kullaniciDiyanetIstiyor) {
    return { vakitler: yerel, kaynak: 'yerel' };
  }

  try {
    const gunler = await getDiyanetMonthlyVakitler(il, ilce, date);
    if (!gunler) return { vakitler: yerel, kaynak: 'yerel' };

    const gun = findGunlukVakit(gunler, date);
    if (!gun) return { vakitler: yerel, kaynak: 'yerel' };

    // İMSAK: Diyanet'in resmi/gerçek yayınladığı değer (Fecr-i Sadık).
    // SABAH: Ezan Vakti Pro'nun ana ekranında gösterdiği ayrı, daha geç değer
    // — gerçek verilerle doğrulandı: Güneş - 60 dakika (bkz. calculateVakitler
    // içindeki ayrıntılı not). Diyanet'in kendisi ayrı bir "Sabah" alanı
    // yayınlamıyor; bu değeri referans uygulamanın gösterim kuralına göre
    // türetiyoruz.
    const imsak = parseDiyanetGunSaat(gun.tarih, gun.imsak);
    const sunrise = parseDiyanetGunSaat(gun.tarih, gun.gunes);
    const dhuhr = parseDiyanetGunSaat(gun.tarih, gun.ogle);
    const asr = parseDiyanetGunSaat(gun.tarih, gun.ikindi);
    const maghrib = parseDiyanetGunSaat(gun.tarih, gun.aksam);
    const isha = parseDiyanetGunSaat(gun.tarih, gun.yatsi);

    if (!imsak || !sunrise || !dhuhr || !asr || !maghrib || !isha) {
      return { vakitler: yerel, kaynak: 'yerel' };
    }

    const sabah = new Date(Math.max(imsak.getTime(), sunrise.getTime() - 60 * 60 * 1000));

    return {
      vakitler: [
        { key: 'imsak', label: LABELS.imsak, date: imsak },
        { key: 'sabah', label: LABELS.sabah, date: sabah },
        { key: 'gunes', label: LABELS.gunes, date: sunrise },
        { key: 'ogle', label: LABELS.ogle, date: dhuhr },
        { key: 'ikindi', label: LABELS.ikindi, date: asr },
        { key: 'aksam', label: LABELS.aksam, date: maghrib },
        { key: 'yatsi', label: LABELS.yatsi, date: isha },
      ],
      kaynak: 'diyanet',
    };
  } catch {
    return { vakitler: yerel, kaynak: 'yerel' };
  }
}
