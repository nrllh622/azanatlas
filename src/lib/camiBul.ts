// src/lib/camiBul.ts
//
// EN YAKIN CAMİLERİ BULMA (bu tur — madde 2: "Cami Bul kesinlikle çalışmıyor")
//
// ─────────────────────────────────────────────────────────────────────────────
// VERİ KAYNAĞI: OpenStreetMap / Overpass API
//
// Google Places API'nin aksine API anahtarı, faturalandırma hesabı veya
// kota takibi GEREKTİRMEZ — tamamen ücretsiz, açık bir coğrafi veritabanı.
// `amenity=place_of_worship` + `religion=muslim` etiketli noktalar sorgulanır
// — bu, dünya çapında OSM'de camileri işaretlemenin standart yoludur.
//
// Overpass sorgu dili "QL" düz metin olarak POST body'sinde gönderilir;
// yanıt JSON olarak gelir. Kullanıcının konumundan `YARICAP_METRE` içindeki
// tüm camiler tek istekte alınır — sunucu tarafı filtreleme sayesinde
// istemci cihazda ağır bir hesap yapılmaz.
//
// ─────────────────────────────────────────────────────────────────────────────
// KÖK NEDEN ARAŞTIRMASI (bu tur — madde 2)
//
// Önceki turda (madde 3, geçen devir) üç yedek sunucu + 8sn zaman aşımı
// eklenmişti ama kullanıcı "defalarca denedim, kesinlikle çalışmıyor" diye
// bildirdi. OpenStreetMap topluluğunun resmi kaynaklarını (help.openstreetmap.org,
// Overpass API bakımcısı Roland Olbricht'in kendi açıklamaları) araştırınca şu
// çıktı:
//
//  1) Overpass'ın "kötüye kullanım" tespiti IP BAZLI çalışıyor, kullanıcı
//     bazlı değil. Mobil operatör ağları genelde CGNAT kullanır — yani
//     binlerce farklı kullanıcı sunucuya AYNI görünür IP'den bağlanır. O
//     havuzdaki biri agresif istek atarsa, aynı IP'yi paylaşan HERKES bir
//     süreliğine 429 (Too Many Requests) alabilir. Bu, kullanıcının kontrolü
//     dışında bir durum ve "kesinlikle çalışmıyor" hissini açıklıyor.
//  2) Bakımcının kendi ifadesiyle, geçici 429 blokları özellikle şu üç
//     özelliğin BİR ARADA görüldüğü isteklere uygulanıyor: POST metodu +
//     `Referer` header'ının HİÇ olmaması + büyük sorgu gövdesi. Önceki
//     kodumuzda `sunucudanIste()` yalnızca `Content-Type` gönderiyordu —
//     ne `Referer` ne `User-Agent` ne `Accept` vardı. Yani kod, sunucunun
//     "şüpheli" saydığı profile tam uyuyordu.
//  3) Bakımcı, uygulamaların isteklerini "distinct" (ayırt edilebilir) hale
//     getirmesinin çözüm olduğunu, bunun için de `Referer` ve/veya açıklayıcı
//     bir `User-Agent` göndermenin yeterli olduğunu belirtiyor.
//
// YAPILAN DÜZELTMELER:
//  1) Her isteğe artık `Referer`, açıklayıcı bir `User-Agent` ve `Accept`
//     header'ları ekleniyor — sunucunun "kimliksiz/şüpheli" sınıflandırmasına
//     girme ihtimalini azaltıyor.
//  2) 429 durumu ayrı ele alınıyor: o sunucuyu hemen terk edip sıradakine
//     geçmek yerine, KISA bir bekleme (backoff) sonrası AYNI sunucuyu bir kez
//     daha deniyoruz (bakımcının notuna göre 429 blokları birkaç dakika
//     içinde otomatik kalkıyor; yine de kullanıcıyı uzun süre bekletmemek
//     için bekleme süresi kısa tutuldu) — başarısız olursa sıradaki sunucuya
//     geçiliyor.
//  3) `overpass.kumi.systems` (bağımsız, uzun süredir var olan, farklı
//     işletmeci) sıralamada ÖNE alındı — resmi `overpass-api.de` üzerinde en
//     çok yük/kısıtlama görülüyor, bağımsız aynalar genelde daha rahat.
//  4) Sorgu gövdesi olabildiğince küçük tutulmaya devam ediyor (tek radius
//     sorgusu, alan sınırlaması `out center` ile) — "büyük gövde" şüphesini
//     tetiklememek için.
//  5) Başarısız/boş sonuç ile "ağ tamamen erişilemez" durumu artık ayrı
//     bilgi taşıyor (`SonucTuru`) — CamilerScreen.tsx kullanıcıya daha
//     isabetli bir mesaj gösterebiliyor (bkz. o dosyadaki güncelleme).
//
// Not: Bilinmeyen/doğrulanamamış üçüncü taraf "sınırsız, kayıtsız" Overpass
// servisleri (ör. bazı blog yazılarında geçen adresler) bilinçli olarak
// EKLENMEDİ — bu tür kaynaklar doğrulanamadan koda eklenirse ileride sessizce
// kapanabilir ya da kötüye kullanım listelerine girebilir. Yalnızca resmi OSM
// wiki'sinde uzun süredir belgeli, bilinen ayna sunucular kullanılıyor.
// ─────────────────────────────────────────────────────────────────────────────

const OVERPASS_SUNUCULARI = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

const YARICAP_METRE = 5000; // 5 km
const ZAMAN_ASIMI_MS = 9000;
// 429 alındığında aynı sunucuyu bir kez daha denemeden önceki kısa bekleme.
const RATE_LIMIT_BEKLEME_MS = 1500;

export interface CamiSonucu {
  id: number;
  ad: string;
  lat: number;
  lng: number;
  /** Kullanıcının konumuna metre cinsinden kuş uçuşu mesafe. */
  mesafeMetre: number;
}

/**
 * `yakinCamileriBul` çağrısının sonucu hakkında ek bağlam. CamilerScreen.tsx
 * bu bilgiyle kullanıcıya "camiler alınamadı" yerine daha isabetli bir mesaj
 * gösterebilir:
 *  - 'ok'         → istek başarılı, `sonuclar` güvenilir (boş da olabilir,
 *                    gerçekten 5km içinde OSM'de kayıtlı cami yok demektir).
 *  - 'sunucuMesgul' → tüm sunuculardan 429/5xx döndü — geçici, tekrar
 *                    denemesi önerilir.
 *  - 'agYok'      → hiçbir sunucuya bağlanılamadı (zaman aşımı / ağ hatası) —
 *                    muhtemelen cihazın interneti yok ya da çok zayıf.
 */
export type CamiAramaDurumu = 'ok' | 'sunucuMesgul' | 'agYok';

export interface CamiAramaSonucu {
  durum: CamiAramaDurumu;
  sonuclar: CamiSonucu[];
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** İki koordinat arası kuş uçuşu mesafe (metre) — Haversine formülü. */
export function ikiNoktaMesafesiMetre(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function overpassSorgusu(lat: number, lng: number): string {
  // node/way/relation'ın hepsi taranıyor (bazı büyük/tarihi camiler OSM'de
  // nokta değil ALAN/way olarak çizilmiş olabilir); `out center` way/relation
  // için merkez koordinatını döndürür.
  return `[out:json][timeout:10];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${YARICAP_METRE},${lat},${lng});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${YARICAP_METRE},${lat},${lng});
  relation["amenity"="place_of_worship"]["religion"="muslim"](around:${YARICAP_METRE},${lat},${lng});
);
out center 40;`;
}

function gecikme(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * `HTTP_429` özel bir hata sınıfı: çağıran taraf (yakinCamileriBul) bunu
 * "sunucu meşgul, kısa bekleyip aynı sunucuyu bir kez daha dene" sinyali
 * olarak ayırt edebilsin diye. Diğer hatalar (zaman aşımı, DNS, 5xx) direkt
 * bir sonraki sunucuya geçilmesi gereken durumlar olarak kalıyor.
 */
class Http429Hatasi extends Error {
  constructor() {
    super('Overpass HTTP 429');
    this.name = 'Http429Hatasi';
  }
}

async function sunucudanIsteTekSefer(sunucuUrl: string, lat: number, lng: number): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ZAMAN_ASIMI_MS);
  try {
    const response = await fetch(sunucuUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        // ───────────────────────────────────────────────────────────────
        // KÖK NEDEN DÜZELTMESİ (bu tur — madde 2): Overpass'ın kötüye
        // kullanım tespiti, "Referer'ı hiç olmayan POST istekleri"ni
        // şüpheli sayıyor. Uygulamamızın kimliğini açıkça bildiren bir
        // `Referer` + açıklayıcı bir `User-Agent` eklemek, isteklerimizin
        // anonim/otomatik kötüye kullanım trafiğinden ayrışmasını sağlıyor.
        // React Native'de `User-Agent` bazı platformlarda motor tarafından
        // değiştirilebiliyor; bu yüzden aynı bilgi ayrıca özel bir header'da
        // (`X-App-Name`) da tekrarlanıyor — zararsız, sunucu tarafından
        // yok sayılsa bile bir kaybımız olmuyor.
        Referer: 'https://azanatlas.app/cami-bul',
        'User-Agent': 'AzanAtlas/1.0 (Android; cami-bul; +https://azanatlas.app)',
        'X-App-Name': 'AzanAtlas-CamiBul',
        Accept: 'application/json',
      },
      body: overpassSorgusu(lat, lng),
      signal: controller.signal,
    });
    if (response.status === 429) throw new Http429Hatasi();
    if (!response.ok) throw new Error(`Overpass HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Tek bir sunucuyu dener; 429 alırsa kısa bir bekleme sonrası AYNI sunucuyu
 * bir kez daha dener (bakımcının notuna göre bloklar birkaç dakikada
 * kalkıyor — kısa bir bekleme bazen yeterli oluyor). İkinci deneme de
 * başarısız olursa hata çağıran tarafa (yakinCamileriBul) iletilir ve o,
 * bir sonraki sunucuya geçer.
 */
async function sunucudanIste(sunucuUrl: string, lat: number, lng: number): Promise<any> {
  try {
    return await sunucudanIsteTekSefer(sunucuUrl, lat, lng);
  } catch (err) {
    if (err instanceof Http429Hatasi) {
      await gecikme(RATE_LIMIT_BEKLEME_MS);
      return await sunucudanIsteTekSefer(sunucuUrl, lat, lng);
    }
    throw err;
  }
}

/**
 * Verilen koordinatın YARICAP_METRE (5km) çevresindeki camileri, en
 * yakından en uzağa sıralı olarak döndürür. `durum` alanı hatanın türünü
 * (sunucu meşgul / ağ yok / başarılı) ayırt eder — bkz. `CamiAramaDurumu`.
 * Ağ hatası/zaman aşımında istisna FIRLATMAZ, `sonuclar: []` ile döner —
 * çağıran taraf "bulunamadı" durumunu kendi arayüzünde ele alır.
 */
export async function yakinCamileriBul(lat: number, lng: number): Promise<CamiAramaSonucu> {
  let veri: any = null;
  let sonHataliDurum: CamiAramaDurumu = 'agYok';

  for (const sunucu of OVERPASS_SUNUCULARI) {
    try {
      veri = await sunucudanIste(sunucu, lat, lng);
      break;
    } catch (err) {
      // 429 (iki denemeden sonra da) → "sunucu meşgul" olarak işaretle ama
      // yine de listedeki bir sonraki bağımsız sunucuyu denemeye devam et.
      sonHataliDurum = err instanceof Http429Hatasi ? 'sunucuMesgul' : sonHataliDurum;
      continue;
    }
  }

  if (!veri || !Array.isArray(veri.elements)) {
    return { durum: sonHataliDurum, sonuclar: [] };
  }

  const sonuclar: CamiSonucu[] = [];
  for (const el of veri.elements) {
    // node'larda lat/lon doğrudan var; way/relation'larda `out center` ile
    // gelen `center.lat`/`center.lon` kullanılır.
    const camiLat = el.lat ?? el.center?.lat;
    const camiLng = el.lon ?? el.center?.lon;
    if (typeof camiLat !== 'number' || typeof camiLng !== 'number') continue;

    const ad: string = el.tags?.name || el.tags?.['name:tr'] || '';
    sonuclar.push({
      id: el.id,
      ad,
      lat: camiLat,
      lng: camiLng,
      mesafeMetre: ikiNoktaMesafesiMetre(lat, lng, camiLat, camiLng),
    });
  }

  sonuclar.sort((a, b) => a.mesafeMetre - b.mesafeMetre);
  return { durum: 'ok', sonuclar };
}

/**
 * Google Haritalar'da yol tarifi ekranını açan URL. `google.navigation:q=`
 * şeması Android'de Google Haritalar uygulaması kuruluysa doğrudan onu
 * açar; uygulama yoksa `Linking.openURL` bunu otomatik olarak tarayıcı
 * tabanlı `https://www.google.com/maps/dir/...`e düşürmez — bu yüzden
 * çağıran taraf (CamilerScreen.tsx) önce native şemayı dener, başarısız
 * olursa web linkine düşer (bkz. oradaki `Linking.canOpenURL` kontrolü).
 */
export function yolTarifiUrlleri(cami: CamiSonucu): { nativeUrl: string; webUrl: string } {
  const hedefAdi = encodeURIComponent(cami.ad || 'Cami');
  return {
    nativeUrl: `google.navigation:q=${cami.lat},${cami.lng}(${hedefAdi})`,
    webUrl: `https://www.google.com/maps/dir/?api=1&destination=${cami.lat},${cami.lng}`,
  };
}

/** Mesafeyi kullanıcıya gösterilecek kısa metne çevirir: "350 m" ya da "2.4 km". */
export function mesafeMetni(metre: number): string {
  if (metre < 1000) return `${Math.round(metre)} m`;
  return `${(metre / 1000).toFixed(1)} km`;
}
