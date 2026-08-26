// src/lib/gpsKonum.ts
//
// GPS ile konum alma akışının ORTAK mantığı — hem LocationPickerScreen.tsx
// hem OnboardingEkrani.tsx tarafından kullanılır.
//
// KÖK NEDEN (bu tur, madde 1 — "GPS/Konum ile Ekle ikinci tıklamada
// çalışıyor" hatası): Önceki turda `hasServicesEnabledAsync`/
// `enableNetworkProviderAsync` eklenerek "izin verildi ama servis kapalı"
// senaryosu çözülmüştü — ama gerçek cihazda hata DEVAM ediyordu. Kök neden
// farklıymış: Android'de kullanıcı native "Konumu Etkinleştir" diyaloğunu
// onayladığı AN, konum sağlayıcı (GPS/Network) donanımsal olarak henüz "warm
// up" aşamasındadır — `enableNetworkProviderAsync()` promise'i resolve olur
// olmaz hemen ardından çağrılan `getCurrentPositionAsync({})` çoğu zaman
// birkaç saniye içinde ilk konum tespitini (fix) alamaz ve reddedilir/timeout
// olur. Önceki kod bu hatayı `catch` bloğunda SESSİZCE yutuyordu — kullanıcı
// hiçbir şey görmüyor, "GPS ile Ekle"ye tekrar bastığında (bu kez sağlayıcı
// ısınmış olduğu için) çalışıyordu. Bu da "ikinci tıklamada çalışıyor" hissi
// yaratıyordu.
//
// ÇÖZÜM: (1) `getCurrentPositionAsync` başarısız olursa, kısa bir bekleme
// (1.2sn) sonrasında YENİDEN denenir (toplam 2 deneme) — sağlayıcının ısınması
// için zaman tanır. (2) İkinci deneme de başarısız olursa, `Location.
// getLastKnownPositionAsync()` ile cihazın en son bilinen konumuna (varsa)
// düşülür — bu, "hiç sonuç yok"tan iyidir ve genelde birkaç dakika/saat
// içindeki gerçek konumdur. (3) Hepsi başarısız olursa artık SESSİZCE
// yutulmuyor — çağıran taraf `basarili: false` alıp kullanıcıya görünür bir
// hata mesajı (`t('konumAlinamadi')`) gösterebiliyor.
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { TURKEY_PROVINCES } from '../data/turkeyLocations';

function normalizeTrForMatch(s: string): string {
  return s
    .toLocaleUpperCase('tr-TR')
    .replace(/İ/g, 'I')
    .replace(/Ş/g, 'S')
    .replace(/Ğ/g, 'G')
    .replace(/Ü/g, 'U')
    .replace(/Ö/g, 'O')
    .replace(/Ç/g, 'C')
    .replace(/[^A-Z0-9]/g, '');
}

export function resolveKnownIl(rawIl: string): string {
  const norm = normalizeTrForMatch(rawIl);
  const found = TURKEY_PROVINCES.find((p) => normalizeTrForMatch(p.name) === norm);
  if (found) return found.name;
  const partial = TURKEY_PROVINCES.find(
    (p) => norm.includes(normalizeTrForMatch(p.name)) && p.name.length >= 3
  );
  return partial ? partial.name : rawIl;
}

export function resolveKnownIlce(resolvedIl: string, rawIlce: string): string {
  const province = TURKEY_PROVINCES.find((p) => p.name === resolvedIl);
  if (!province || !rawIlce) return rawIlce;
  const norm = normalizeTrForMatch(rawIlce);
  const found = province.districts.find((d) => normalizeTrForMatch(d.name) === norm);
  return found ? found.name : rawIlce;
}

export interface GpsKonumSonucu {
  basarili: boolean;
  // 'izinYok' → uygulama izni reddedildi (kullanıcıya izin metni gösterilebilir)
  // 'konumAlinamadi' → izin var ama konum hiçbir şekilde alınamadı (görünür hata)
  hataTuru?: 'izinYok' | 'konumAlinamadi';
  latitude?: number;
  longitude?: number;
  il?: string;
  ilce?: string;
  countryCode?: string;
}

const YENIDEN_DENEME_BEKLEME_MS = 1200;

async function konumTespitEt(): Promise<Location.LocationObject | null> {
  // 1. deneme
  try {
    return await Location.getCurrentPositionAsync({});
  } catch {
    // sağlayıcı henüz ısınıyor olabilir — kısa bekleme sonrası tekrar dene
  }

  await new Promise((resolve) => setTimeout(resolve, YENIDEN_DENEME_BEKLEME_MS));

  // 2. deneme
  try {
    return await Location.getCurrentPositionAsync({});
  } catch {
    // yine olmadıysa son bilinen konuma düş
  }

  try {
    const son = await Location.getLastKnownPositionAsync({});
    if (son) return son;
  } catch {
    // yok sayılır, aşağıda null dönülecek
  }

  return null;
}

// GPS ile konum alma akışının tamamı: izin → servis kontrolü/etkinleştirme →
// konum tespiti (retry'lı) → reverse-geocode → bilinen il/ilçeye onarım.
// `varsayilanIlAdi`, reverseGeocode hiçbir il/şehir bulamazsa yerine
// yazılacak metin (ör. t('gpsKonumu')) — dosya hook çağıramadığı için
// çağıran taraftan parametre olarak alınıyor.
export async function konumAl(varsayilanIlAdi: string): Promise<GpsKonumSonucu> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return { basarili: false, hataTuru: 'izinYok' };
  }

  if (Platform.OS === 'android') {
    try {
      const hizmetAcik = await Location.hasServicesEnabledAsync();
      if (!hizmetAcik) {
        await Location.enableNetworkProviderAsync();
      }
    } catch {
      // kullanıcı diyalogdan "Hayır" dediyse buraya düşer — yine de konum
      // tespiti denenir (bazı cihazlarda servis zaten açık olabilir)
    }
  }

  const position = await konumTespitEt();
  if (!position) {
    return { basarili: false, hataTuru: 'konumAlinamadi' };
  }

  let place: Location.LocationGeocodedAddress | undefined;
  try {
    const sonuc = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    place = sonuc[0];
  } catch {
    // reverse-geocode başarısız olsa bile konumun kendisi (lat/lng) geçerli —
    // il/ilçe adı olmadan devam edilir, aşağıda varsayılan ada düşülür
  }

  const countryCode = place?.isoCountryCode || 'TR';
  const rawIl = place?.region || place?.city || varsayilanIlAdi;
  const rawIlce = place?.subregion || place?.district || place?.city || '';
  const il = countryCode === 'TR' ? resolveKnownIl(rawIl) : rawIl;
  const ilce = countryCode === 'TR' ? resolveKnownIlce(il, rawIlce) : rawIlce;

  return {
    basarili: true,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    il,
    ilce,
    countryCode,
  };
}
