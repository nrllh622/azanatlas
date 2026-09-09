// src/lib/camiBul.ts
//
// EN YAKIN CAMİLERİ BULMA (bu tur — madde 3)
//
// ─────────────────────────────────────────────────────────────────────────────
// VERİ KAYNAĞI: OpenStreetMap / Overpass API
//
// Google Places API'nin aksine API anahtarı, faturalandırma hesabı veya
// kota takibi GEREKTİRMEZ — tamamen ücretsiz, açık bir coğrafi veritabanı.
// `overpass-api.de` (OSM'in resmi kamu Overpass sunucusu) üzerinden
// `amenity=place_of_worship` + `religion=muslim` etiketli noktalar sorgulanır
// — bu, dünya çapında OSM'de camileri işaretlemenin standart yoludur.
//
// Overpass sorgu dili "QL" düz metin olarak POST body'sinde gönderilir;
// yanıt JSON olarak gelir. Kullanıcının konumundan `YARICAP_METRE` içindeki
// tüm camiler tek istekte alınır — sunucu tarafı filtreleme sayesinde
// istemci cihazda ağır bir hesap yapılmaz.
//
// GÜVENİLİRLİK: kamu sunucusu bazen yavaş/aşırı yüklü olabilir — bu yüzden
// 12 saniyelik bir zaman aşımı ve TEK bir yedek sunucu (`kumi.systems`)
// deneniyor. İkisi de başarısız olursa çağıran taraf boş liste alır ve
// kullanıcıya "şu an camiler alınamadı, Google Haritalar'da aramayı dene"
// gibi bir mesaj + doğrudan harita linki gösterebilir (bkz. CamilerScreen.tsx).
// ─────────────────────────────────────────────────────────────────────────────

const OVERPASS_SUNUCULARI = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const YARICAP_METRE = 5000; // 5 km
const ZAMAN_ASIMI_MS = 12000;

export interface CamiSonucu {
  id: number;
  ad: string;
  lat: number;
  lng: number;
  /** Kullanıcının konumuna metre cinsinden kuş uçuşu mesafe. */
  mesafeMetre: number;
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

async function sunucudanIste(sunucuUrl: string, lat: number, lng: number): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ZAMAN_ASIMI_MS);
  try {
    const response = await fetch(sunucuUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: overpassSorgusu(lat, lng),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Overpass HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Verilen koordinatın YARICAP_METRE (5km) çevresindeki camileri, en
 * yakından en uzağa sıralı olarak döndürür. Ağ hatası/zaman aşımında boş
 * dizi döner (istisna fırlatmaz) — çağıran taraf "bulunamadı" durumunu
 * kendi arayüzünde ele alır.
 */
export async function yakinCamileriBul(lat: number, lng: number): Promise<CamiSonucu[]> {
  let veri: any = null;
  for (const sunucu of OVERPASS_SUNUCULARI) {
    try {
      veri = await sunucudanIste(sunucu, lat, lng);
      break;
    } catch {
      // bu sunucu başarısız oldu, listedeki bir sonrakini dene.
      continue;
    }
  }
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

  sonuclar.sort((a, b) => a.mesafeMetre - b.mesafeMetre);
  return sonuclar;
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
