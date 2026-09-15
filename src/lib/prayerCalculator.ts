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

// DÜZELTME/GENİŞLETME (bu tur — madde 4): kullanıcının sorusu üzerine
// ("4 dil ekledik, TR için Diyanet çalışıyor, peki diğer diller/ülkeler için
// o ülkelerin resmi yöntemleri neden yok?") ülke→yöntem eşleştirmesi ciddi
// şekilde genişletildi. Önceki sürüm yalnızca 12 ülke/bölgeyi AÇIKÇA
// biliyordu, geri kalan TÜM dünya (100+ ülke) sessizce genel MWL'ye
// düşüyordu — bu, örneğin Endonezya/Fas/Tunus/Cezayir/Rusya gibi kendi
// resmi/yaygın kabul gören yöntemi olan ülkelerde gereksiz bir isabetsizlik
// yaratıyordu. Her yeni eklenen ülke için kaynak: AlAdhan API
// (api.aladhan.com/v1/methods, aladhan.com/calculation-methods) — geniş
// çapta kullanılan, resmi kurum adlarıyla eşleşen bir referans veritabanı;
// tahmini/uydurma açı değeri YOK.
function getMethodForCountry(countryCode: string) {
  switch (countryCode) {
    case 'TR': return CalculationMethod.Turkey();
    case 'US': case 'CA': return CalculationMethod.NorthAmerica();
    case 'SA': return CalculationMethod.UmmAlQura();
    case 'EG': return CalculationMethod.Egyptian();
    case 'PK': case 'IN': case 'BD': return CalculationMethod.Karachi();
    case 'KW': return CalculationMethod.Kuwait();
    case 'QA': return CalculationMethod.Qatar();
    case 'SG': return CalculationMethod.Singapore();
    case 'AE': return CalculationMethod.Dubai();
    case 'IR': return CalculationMethod.Tehran();
    case 'MY': case 'BN': {
      // JAKIM (Malezya resmi yöntemi) — Brunei de aynı bölgesel standardı
      // kullanıyor (kaynak: aladhan.com yöntem listesi).
      const p = CalculationMethod.Other();
      p.fajrAngle = 20;
      p.ishaAngle = 18;
      return p;
    }
    case 'FR': {
      // UOIF (Fransa) — Fecr 12°, Yatsı 12°.
      const p = CalculationMethod.Other();
      p.fajrAngle = 12;
      p.ishaAngle = 12;
      return p;
    }
    case 'ID': {
      // Kemenag (Endonezya Din İşleri Bakanlığı) — Fecr 20°, Yatsı 18°.
      const p = CalculationMethod.Other();
      p.fajrAngle = 20;
      p.ishaAngle = 18;
      return p;
    }
    case 'MA': case 'EH': {
      // Fas (Habous/Evkaf Bakanlığı) — Fecr 19°, Yatsı 17°.
      const p = CalculationMethod.Other();
      p.fajrAngle = 19;
      p.ishaAngle = 17;
      return p;
    }
    case 'TN': {
      // Tunus — Fecr 18°, Yatsı 18°.
      const p = CalculationMethod.Other();
      p.fajrAngle = 18;
      p.ishaAngle = 18;
      return p;
    }
    case 'DZ': {
      // Cezayir — Fecr 18°, Yatsı 17°.
      const p = CalculationMethod.Other();
      p.fajrAngle = 18;
      p.ishaAngle = 17;
      return p;
    }
    case 'RU': case 'KZ': case 'KG': case 'TJ': case 'UZ': case 'TM': case 'AZ': {
      // Rusya Müslümanları Ruhani İdaresi — Rusya'nın kendi resmi yöntemi;
      // yakın Orta Asya/Kafkasya ülkelerinde de yaygın referans olarak
      // kullanılıyor (kesin yerel resmi kurumları yok/doğrulanamadı,
      // bölgesel olarak en yakın doğrulanmış kaynak bu). Fecr 16°, Yatsı 15°.
      const p = CalculationMethod.Other();
      p.fajrAngle = 16;
      p.ishaAngle = 15;
      return p;
    }
    case 'BH': case 'OM': {
      // Körfez Bölgesi geneli (BAE hariç, o Dubai yöntemini kullanıyor) —
      // Fecr 19.5°, Yatsı gün batımından sabit 90 dakika sonra.
      const p = CalculationMethod.Other();
      p.fajrAngle = 19.5;
      p.ishaInterval = 90;
      return p;
    }
    // GB/AU ve MWL'nin zaten fiilen resmi/yaygın kabul gören standart olduğu
    // ülkeler (bkz. önceki tur notu — davranış değişmedi, yalnızca niyet
    // netleştirildi ve MENA/Güney Asya'nın geri kalanı da eklendi).
    case 'GB': case 'AU': case 'DE': case 'NL': case 'BE': case 'IT':
    case 'ES': case 'JO': case 'LB': case 'SY': case 'IQ': case 'YE':
    case 'SD': case 'LY': case 'PS':
      return CalculationMethod.MuslimWorldLeague();
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
    // YENİ (bu tur — madde 4): bkz. CalculationSettingsContext.tsx'teki
    // CalcMethodId üstündeki kaynak notu — tüm açılar AlAdhan API'sinden
    // doğrulandı.
    case 'Kemenag': {
      const p = CalculationMethod.Other();
      p.fajrAngle = 20;
      p.ishaAngle = 18;
      return p;
    }
    case 'Morocco': {
      const p = CalculationMethod.Other();
      p.fajrAngle = 19;
      p.ishaAngle = 17;
      return p;
    }
    case 'Tunisia': {
      const p = CalculationMethod.Other();
      p.fajrAngle = 18;
      p.ishaAngle = 18;
      return p;
    }
    case 'Algeria': {
      const p = CalculationMethod.Other();
      p.fajrAngle = 18;
      p.ishaAngle = 17;
      return p;
    }
    case 'Russia': {
      const p = CalculationMethod.Other();
      p.fajrAngle = 16;
      p.ishaAngle = 15;
      return p;
    }
    case 'Gulf': {
      const p = CalculationMethod.Other();
      p.fajrAngle = 19.5;
      p.ishaInterval = 90;
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
// Diyanet SADECE "Otomatik Yöntem" AÇIKKEN denenir (TR için zaten Turkey()
// metodunu otomatik seçen mod). Manuel moddaysa (autoMethod === false)
// Diyanet'e HİÇ başvurulmuyor — kullanıcı manuel moda geçtiği an İkindi
// Hesabı (Şafi/Hanefi) kartı Ayarlar'da tıklanabilir hale geliyor
// (SettingsScreen.tsx'teki `disabled={autoMethod}`); Diyanet'in resmi
// takvimi mezhep ayrımı YAPMAZ (tek resmi vakit yayınlar), bu yüzden
// kullanıcı manuel modda Hanefi seçse bile eskiden Diyanet verisi hâlâ
// kullanılmaya devam ediyor, seçimi sessizce görmezden geliniyordu — Madde 3
// (bu tur) kullanıcının bildirdiği "İkindi Hesabı'nı değiştirince saat
// değişmiyor" hatasının kök nedeni buydu. Artık: Otomatik açıkken → Diyanet
// (varsa) + yerel yedek; Otomatik kapalıyken → HER ZAMAN yerel `adhan`
// hesabı, kullanıcının seçtiği madhab/yöntem/yüksek-açı ayarlarıyla birebir.
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

  if (countryCode !== 'TR' || !il || !ilce || !autoMethod) {
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
