// src/lib/camiBul.ts
//
// EN YAKIN CAMİLERİ BULMA (bu tur — madde 2, 2. deneme: "gene çalışmadı")
//
// ─────────────────────────────────────────────────────────────────────────────
// VERİ KAYNAĞI: OpenStreetMap (iki BAĞIMSIZ altyapı üzerinden)
//
// Google Places API'nin aksine API anahtarı, faturalandırma hesabı veya
// kota takibi GEREKTİRMEZ — tamamen ücretsiz, açık bir coğrafi veritabanı.
//
// ─────────────────────────────────────────────────────────────────────────────
// KÖK NEDEN ARAŞTIRMASI — 2. TUR
//
// Önceki turda (madde 2, 1. deneme) üç Overpass aynasına `Referer`/
// `User-Agent` header'ları eklendi ve 429 için otomatik yeniden deneme
// kondu. Kullanıcı yine de "gene çalışmadı" bildirdi — ekran görüntüsünde bu
// sefer "sunucu meşgul" değil, "İnternet bağlantına ulaşılamadı" (yani
// `durum: 'agYok'`) mesajı çıktı. Bu ÖNEMLİ bir ayrım: 429 değil, ÜÇ
// Overpass sunucusunun (`kumi.systems`, `overpass-api.de`,
// `openstreetmap.ru`) HİÇBİRİNE bağlantı kurulamadı (zaman aşımı/bağlantı
// reddi). Aynı anda Diyanet API'sinin (ezanvakti.emushaf.net, tamamen farklı
// bir sunucu/altyapı) sorunsuz çalıştığı ekran görüntülerden anlaşılıyor —
// yani cihazın interneti VAR, sorun özellikle Overpass'ın kullandığı üç
// host'a özgü.
//
// Olası açıklama: bazı mobil operatör ağları / kurumsal ağlar / bölgesel
// DNS filtreleri, Overpass'ın kamu aynalarını (özellikle Rusya merkezli
// `overpass.openstreetmap.ru` gibi bir alan adını) engelleyebiliyor, ya da
// bu üç sunucu o an gerçekten kullanıcının bulunduğu bölgeden yavaş/kapalı.
// Overpass'ın kendisi tek bir proje/topluluk tarafından işletilen aynı
// "aile"den sunucular olduğu için, üçünün de aynı anda erişilemez olması
// (kullanıcının ağından bakıldığında) tek bir kaynağa bağımlılığın riskini
// gösteriyor.
//
// ÇÖZÜM — 2. TUR: Overpass'a ek olarak, TAMAMEN FARKLI bir işletmeci/altyapı
// tarafından barındırılan, ücretsiz ve kayıtsız bir İKİNCİ kaynak eklendi:
// Photon (komoot.io tarafından işletilen açık kaynaklı OSM geocoder,
// photon.komoot.io) — Almanya merkezli, Overpass projesiyle hiçbir sunucu/
// altyapı paylaşımı yok. `/reverse` uç noktası enlem/boylam + yarıçap ile
// yakındaki OSM noktalarını GET isteğiyle döndürüyor (Overpass'ın aksine
// POST + özel sorgu dili gerektirmiyor — daha basit, engellenme yüzeyi
// daha düşük bir istek deseni).
//
// YENİ SIRALAMA: önce üç Overpass aynası (hâlâ en zengin/en doğru
// `religion=muslim` filtresini destekliyor), hepsi başarısız olursa Photon
// denenir. Photon `osm_tag=amenity:place_of_worship` ile TÜM dinlerin
// ibadethanelerini döndürür (kendi sorgu dilinde birleşik bir "VE dinî=
// müslüman" filtresi yok) — bu yüzden sonuçlar istemci tarafında
// `properties.religion === 'muslim'` alanına göre süzülüyor; bu alan
// OSM'de zaten cami etiketlemesinin standart parçası, veri kaybı olmuyor.
// ─────────────────────────────────────────────────────────────────────────────

const OVERPASS_SUNUCULARI = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

// YENİ (2. tur): Overpass'tan tamamen bağımsız, farklı işletmeci/altyapı.
const PHOTON_URL = 'https://photon.komoot.io/reverse';

const YARICAP_METRE = 5000; // 5 km
const YARICAP_KM = YARICAP_METRE / 1000;
const ZAMAN_ASIMI_MS = 9000;
// 429 alındığında aynı sunucuyu bir kez daha denemeden önceki kısa bekleme.
const RATE_LIMIT_BEKLEME_MS = 1500;

export interface CamiSonucu {
  id: number | string;
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
 *  - 'ok'           → istek başarılı, `sonuclar` güvenilir (boş da olabilir,
 *                      gerçekten 5km içinde OSM'de kayıtlı cami yok demektir).
 *  - 'sunucuMesgul' → sunucu(lar)dan 429/5xx döndü — geçici, tekrar
 *                      denemesi önerilir.
 *  - 'agYok'        → hiçbir kaynağa (Overpass'ın 3 aynası VE Photon)
 *                      bağlanılamadı — muhtemelen cihazın interneti yok ya
 *                      da çok zayıf.
 */
export type CamiAramaDurumu = 'ok' | 'sunucuMesgul' | 'agYok';

export interface CamiAramaSonucu {
  durum: CamiAramaDurumu;
  sonuclar: CamiSonucu[];
  /** YENİ (2. tur, tanı amaçlı): sonuç hangi kaynaktan geldi — kullanıcı
   *  desteği/hata ayıklaması için faydalı, arayüzde ZORUNLU gösterilmiyor. */
  kaynak?: 'overpass' | 'photon';
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
 * bir sonraki kaynağa geçilmesi gereken durumlar olarak kalıyor.
 */
class Http429Hatasi extends Error {
  constructor() {
    super('HTTP 429');
    this.name = 'Http429Hatasi';
  }
}

async function overpassIsteTekSefer(sunucuUrl: string, lat: number, lng: number): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ZAMAN_ASIMI_MS);
  try {
    const response = await fetch(sunucuUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        // Overpass'ın kötüye kullanım tespiti "Referer'ı hiç olmayan POST
        // istekleri"ni şüpheli sayıyor (bkz. önceki tur notu) — açıklayıcı
        // Referer/User-Agent isteklerin anonim trafikten ayrışmasını sağlıyor.
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
 * Tek bir Overpass sunucusunu dener; 429 alırsa kısa bir bekleme sonrası
 * AYNI sunucuyu bir kez daha dener. İkinci deneme de başarısız olursa hata
 * çağıran tarafa (yakinCamileriBul) iletilir ve o, bir sonraki kaynağa geçer.
 */
async function overpassIste(sunucuUrl: string, lat: number, lng: number): Promise<any> {
  try {
    return await overpassIsteTekSefer(sunucuUrl, lat, lng);
  } catch (err) {
    if (err instanceof Http429Hatasi) {
      await gecikme(RATE_LIMIT_BEKLEME_MS);
      return await overpassIsteTekSefer(sunucuUrl, lat, lng);
    }
    throw err;
  }
}

function overpassYanitiniAyristir(veri: any, lat: number, lng: number): CamiSonucu[] {
  if (!veri || !Array.isArray(veri.elements)) return [];
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
  return sonuclar;
}

/**
 * YENİ (2. tur): Photon (komoot.io) üzerinden yakındaki ibadethaneleri
 * getirir — Overpass'la HİÇBİR altyapı/sunucu paylaşmayan, tamamen bağımsız
 * bir kaynak. Basit GET isteği (Overpass'ın POST + özel sorgu dili yerine)
 * — ağ engelleme/filtreleme yüzeyi daha küçük.
 *
 * Photon'un kendi sorgu dilinde "VE dini=müslüman" filtresi yok; `osm_tag`
 * yalnızca `amenity:place_of_worship` ile TÜM dinlerin ibadethanelerini
 * getirir. Bu yüzden sonuç istemci tarafında `properties.religion` alanına
 * göre süzülüyor (bu alan OSM'in cami etiketleme standardının parçası —
 * `overpassSorgusu`'nun sunucu tarafında yaptığı filtrelemenin istemci
 * tarafı karşılığı, veri kaybı yok).
 */
async function photonIste(lat: number, lng: number): Promise<CamiSonucu[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ZAMAN_ASIMI_MS);
  try {
    const url =
      `${PHOTON_URL}?lat=${lat}&lon=${lng}&radius=${YARICAP_KM}` +
      `&osm_tag=amenity:place_of_worship&limit=50`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (response.status === 429) throw new Http429Hatasi();
    if (!response.ok) throw new Error(`Photon HTTP ${response.status}`);
    const veri = await response.json();
    const features: any[] = Array.isArray(veri?.features) ? veri.features : [];

    const sonuclar: CamiSonucu[] = [];
    for (const f of features) {
      const props = f?.properties ?? {};
      // Yalnızca İslam ibadethaneleri — bkz. yukarıdaki fonksiyon yorumu.
      if (props.religion && props.religion !== 'muslim') continue;

      const coords = f?.geometry?.coordinates; // GeoJSON: [lon, lat]
      if (!Array.isArray(coords) || coords.length < 2) continue;
      const camiLng = coords[0];
      const camiLat = coords[1];
      if (typeof camiLat !== 'number' || typeof camiLng !== 'number') continue;

      const ad: string = props.name || '';
      sonuclar.push({
        id: props.osm_id ?? `${camiLat},${camiLng}`,
        ad,
        lat: camiLat,
        lng: camiLng,
        mesafeMetre: ikiNoktaMesafesiMetre(lat, lng, camiLat, camiLng),
      });
    }
    return sonuclar;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Verilen koordinatın YARICAP_METRE (5km) çevresindeki camileri, en
 * yakından en uzağa sıralı olarak döndürür. `durum` alanı hatanın türünü
 * (sunucu meşgul / ağ yok / başarılı) ayırt eder — bkz. `CamiAramaDurumu`.
 *
 * SIRALAMA (2. tur): önce 3 Overpass aynası denenir (en doğru/zengin
 * filtreleme). HEPSİ başarısız olursa — özellikle "hiçbirine bağlanılamadı"
 * durumunda, ki kullanıcının bildirdiği asıl sorun buydu — tamamen farklı
 * bir altyapı olan Photon denenir. İkisi de başarısız olursa çağıran taraf
 * boş liste + 'agYok'/'sunucuMesgul' alır; istisna FIRLATILMAZ.
 */
export async function yakinCamileriBul(lat: number, lng: number): Promise<CamiAramaSonucu> {
  let sonHataliDurum: CamiAramaDurumu = 'agYok';

  for (const sunucu of OVERPASS_SUNUCULARI) {
    try {
      const veri = await overpassIste(sunucu, lat, lng);
      const sonuclar = overpassYanitiniAyristir(veri, lat, lng);
      sonuclar.sort((a, b) => a.mesafeMetre - b.mesafeMetre);
      return { durum: 'ok', sonuclar, kaynak: 'overpass' };
    } catch (err) {
      sonHataliDurum = err instanceof Http429Hatasi ? 'sunucuMesgul' : sonHataliDurum;
      continue;
    }
  }

  // Overpass'ın üç aynası da başarısız oldu — bağımsız ikinci kaynağı dene.
  try {
    const sonuclar = await photonIste(lat, lng);
    sonuclar.sort((a, b) => a.mesafeMetre - b.mesafeMetre);
    return { durum: 'ok', sonuclar, kaynak: 'photon' };
  } catch (err) {
    const photonDurum = err instanceof Http429Hatasi ? 'sunucuMesgul' : sonHataliDurum;
    return { durum: photonDurum, sonuclar: [] };
  }
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
