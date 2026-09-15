// src/lib/ulkeTespiti.ts
//
// KONUM İZNİ REDDEDİLİRSE ÜLKE TESPİTİ (bu tur — madde 4)
//
// ─────────────────────────────────────────────────────────────────────────────
// SORU VE GEREKÇE
//
// Kullanıcının sorusu: "Kullanıcının konumun açılmasına izin vermemesi
// durumunda kullanıcının bulunduğu ülkeyi bulup doğru hesaplama için başka
// hangi yöntemler kullanılabilir?"
//
// Konum izni reddedildiğinde uygulama GPS koordinatına erişemez, bu yüzden
// `getMethodForCountry()` (prayerCalculator.ts) çağrılamaz — o fonksiyon
// bir ülke kodu bekler, koordinat değil. Coğrafi konum olmadan "doğru"
// bir ülke tespiti YAPILAMAZ (VPN kullanan biri farklı bir ülkede
// görünebilir, bu KESİN değil YAKLAŞIK bir tahmindir) — bu yüzden bu
// yalnızca bir "en iyi tahmin" katmanı, kesin GPS'in yerini TUTMAZ.
//
// ÇÖZÜM: cihazın herkese açık IP adresinden ülke tahmini yapan, ücretsiz,
// API anahtarı GEREKTİRMEYEN bir servis (`api.country.is`) kullanılıyor.
// Bu servis:
//  - HTTPS destekliyor, kota YOK (yalnızca saniyede 10 istek sınırı var —
//    bu uygulamanın kullanım deseni için sorun teşkil etmez).
//  - Tek bir alan döndürüyor: { "ip": "...", "country": "XX" } (ISO 3166-1
//    alpha-2 ülke kodu) — ekstra veri işlemeye gerek yok.
//  - İnternet GEREKTİRİR (IP tabanlı olduğu için kaçınılmaz) — internet de
//    yoksa bu fonksiyon da başarısız olur, çağıran taraf mevcut/varsayılan
//    yönteme (MWL) düşer.
//
// GİZLİLİK NOTU: bu istek yalnızca cihazın genel IP'sini karşı sunucuya
// gönderir (herhangi bir web sitesi ziyaretinde zaten olan durum) — hassas
// konum/GPS koordinatı KESİNLİKLE gönderilmiyor. Gizlilik politikasına
// (privacy-policy-en.html) bu davranış eklenmelidir (bkz. proje kökündeki
// dosya — kullanıcı ayrı isterse güncellenir).
// ─────────────────────────────────────────────────────────────────────────────

const ZAMAN_ASIMI_MS = 5000;

/**
 * Cihazın herkese açık IP'sinden ülke kodunu (ISO 3166-1 alpha-2) tahmin
 * eder. Başarısız olursa (internet yok, servis erişilemez, zaman aşımı)
 * `null` döner — çağıran taraf bu durumda varsayılan/genel bir yönteme
 * (MuslimWorldLeague) düşmelidir; bu fonksiyon ASLA istisna fırlatmaz.
 */
export async function ipdenUlkeTahminiYap(): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ZAMAN_ASIMI_MS);
  try {
    const response = await fetch('https://api.country.is/', { signal: controller.signal });
    if (!response.ok) return null;
    const veri = await response.json();
    const kod = veri?.country;
    return typeof kod === 'string' && kod.length === 2 ? kod.toUpperCase() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
