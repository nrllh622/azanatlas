// src/lib/gpsKonum.ts
//
// GPS ile konum alma akışının ORTAK mantığı — hem LocationPickerScreen.tsx
// hem OnboardingEkrani.tsx tarafından kullanılır.
//
// KÖK NEDEN (madde 1, İKİNCİ TUR — "GPS/Konum ile Ekle ikinci tıklamada
// çalışıyor" hatası HÂLÂ devam ediyor): Önceki turda `hasServicesEnabledAsync`/
// `enableNetworkProviderAsync` eklenerek "izin verildi ama servis kapalı"
// senaryosu çözülmüş, ardından tek seferlik 1.2sn bekleme + tek yeniden
// deneme eklenmişti — ama kullanıcı hatanın AYNEN devam ettiğini bildirdi.
// Demek ki 1.2sn, konum sağlayıcının (GPS/Network) "warm up" süresi için
// bazı cihazlarda/OEM'lerde yetersiz — bu süre cihaza göre birkaç saniyeye
// kadar çıkabiliyor.
//
// ÇÖZÜM (bu tur): Tek sabit bekleme yerine ARTAN ARALIKLI (backoff) bir
// POLLING stratejisine geçildi — sağlayıcı erken hazır olursa erken döner,
// geç hazır olursa daha uzun aralıklarla denemeye devam eder. Ayrıca her
// denemede `accuracy: Balanced` ve `mayShowUserSettingsDialog: true` açıkça
// belirtiliyor. Hepsi başarısız olursa `Location.getLastKnownPositionAsync()`
// ile son bilinen konuma düşülür; o da yoksa çağıran taraf `basarili: false`
// alıp kullanıcıya görünür bir hata mesajı (`t('konumAlinamadi')`)
// gösterebiliyor — SESSİZCE yutulmuyor.
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

// Denemeler arası bekleme aralıkları (ms) — artan (backoff): sağlayıcı erken
// hazır olursa erken döner, geç hazır olursa daha uzun aralıklarla denemeye
// devam eder. Toplam ~8 saniye (5 deneme + aralar) — bu, kullanıcının "GPS ile
// Ekle"ye BİR KEZ basıp beklediği makul bir süre; sonrasında son bilinen
// konuma / görünür hataya düşülür.
const DENEME_ARALIKLARI_MS = [500, 1000, 1500, 2000, 2000];

async function tekDenemeGetir(): Promise<Location.LocationObject | null> {
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      mayShowUserSettingsDialog: true,
    });
  } catch {
    return null;
  }
}

async function konumTespitEt(): Promise<Location.LocationObject | null> {
  const ilk = await tekDenemeGetir();
  if (ilk) return ilk;

  for (const bekleme of DENEME_ARALIKLARI_MS) {
    await new Promise((resolve) => setTimeout(resolve, bekleme));
    const sonuc = await tekDenemeGetir();
    if (sonuc) return sonuc;
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
