// src/i18n/ceviriler.ts
//
// ÇOK DİLLİLİK — ÇEVİRİ SÖZLÜĞÜ
//
// ─────────────────────────────────────────────────────────────────────────────
// NEDEN GEREKLİ?
//
// Uygulama başta "hedef kitle global/uluslararası, Türkiye öncelikli değil"
// kararıyla tasarlandı, ama tüm ekran metinleri doğrudan Türkçe koda
// yazılmıştı. Bu dosya bunun düzeltilmesi: her ekran metni burada bir
// ANAHTARA bağlanıyor, ekranlar artık düz metin yerine `t('anahtar')`
// çağırıyor.
//
// ─────────────────────────────────────────────────────────────────────────────
// KAPSAM (bu paket)
//
// Şimdilik yalnızca ANA SAYFA (`HomeScreen.tsx`) tam olarak bu sisteme
// geçirildi — uçtan uca İngilizce dahil çalışıyor. Diğer 12 ekran hâlâ
// doğrudan Türkçe metin kullanıyor; bu dosyadaki `ORTAK` bölümü (genel
// kelimeler: "Kapat", "Kaydet" vb.) ve ekran bazlı bölümler zaten
// hazırlanmış durumda, yeni bir ekran geçirilirken önce burada o ekranın
// anahtarları var mı diye bakılmalı, yoksa eklenmeli.
//
// ─────────────────────────────────────────────────────────────────────────────
// NASIL ÇALIŞIR?
//
// `dilDeposu.ts` (bkz.) tema sistemiyle AYNI kalıbı izliyor: seçilen dil
// AsyncStorage'da saklanıyor, uygulama açılışında (App.tsx, tema ile aynı
// anda) okunuyor. Ekran içinde `useCeviri()` hook'u `t(anahtar)` fonksiyonu
// döndürüyor — bu bir React state'e bağlı, yani dil değiştiğinde (Ayarlar
// ekranından) ekranlar YENİDEN RENDER olur ve metin anında güncellenir.
//
// Bu, tema sisteminden FARKLI bir davranış: temada renkler
// `StyleSheet.create` içinde MODÜL YÜKLENİRKEN kilitlendiği için yeniden
// başlatma gerekiyordu. Metinler ise JSX içinde HER RENDER'DA okunuyor,
// dolayısıyla dil değişince anında güncellenmesi mümkün — yeniden başlatma
// GEREKMİYOR. Yine de tutarlılık için (kullanıcı hangi ekranda olursa
// olsun aynı davranışı beklemesin diye karmaşa çıkmasın) dil değişikliği
// de tema gibi görsel bir onay şeridiyle bildiriliyor, ama uygulamayı
// KAPATIP AÇMAYA gerek yok.
// ─────────────────────────────────────────────────────────────────────────────

export type DilKodu = 'tr' | 'en';

export const VARSAYILAN_DIL: DilKodu = 'tr';

export const DIL_ADLARI: Record<DilKodu, string> = {
  tr: 'Türkçe',
  en: 'English',
};

/**
 * Cihazın sistem diline göre başlangıç dilini seçer. `expo-localization`
 * kurulu değilse (bu pakette henüz eklenmedi) `VARSAYILAN_DIL`e düşer —
 * bu yüzden bu fonksiyon senkron ve bağımlılıksız tutuldu; ilerideki bir
 * pakette gerçek cihaz-dili tespiti eklenebilir.
 */
export function sistemDiliniTahminEt(): DilKodu {
  return VARSAYILAN_DIL;
}

// Her ekran kendi bölümünde ayrı bir nesne olarak tutuluyor — hem dosyanın
// okunabilir kalması hem de bir ekranı çevirirken yalnızca o bölüme
// bakılabilmesi için. Anahtar isimleri Türkçe (kod tabanındaki diğer
// isimlendirme kuralına sadık kalındı: değişken/fonksiyon adları Türkçe).

const ortak = {
  tr: {
    kapat: 'Kapat',
    geri: 'Geri',
    kaydet: 'Kaydet',
    iptal: 'Vazgeç',
    tamam: 'Tamam',
    ayarlar: 'Ayarlar',
    yukleniyor: 'Yükleniyor…',
  },
  en: {
    kapat: 'Close',
    geri: 'Back',
    kaydet: 'Save',
    iptal: 'Cancel',
    tamam: 'OK',
    ayarlar: 'Settings',
    yukleniyor: 'Loading…',
  },
};

// ── ANA SAYFA ── (bu paket: tam çevrildi)
const anaSayfa = {
  tr: {
    konumDegistirEtiketi: 'Konumu değiştir',
    bildirimAyarlariEtiketi: 'Bildirim ayarları',
    kalanSure: 'KALAN SÜRE',
    siradakiVakit: 'SIRADAKİ VAKİT',
    diyanetTakvimi: 'Diyanet Takvimi',
    yerelHesaplama: 'Yerel hesaplama',
    gunlukSeri: (n: number) => `${n} günlük seri`,
    gunlukSeriEtiketi: (n: number) => `${n} günlük seri. Takip ekranını aç`,
    mekruhVakti: (sebep: string) => `Mekruh vakti — ${sebep}`,
    iftaraKalan: (sure: string) => `İftara kalan süre: ${sure}`,
    diyanetUlasilamadi: 'Diyanet verisine ulaşılamadı, geçici olarak yerel hesaplama gösteriliyor.',
    simdi: 'Şimdi',
    kilindiOlarakIsaretle: (vakit: string) => `${vakit} namazını kıldım olarak işaretle`,
    vaktiBildirimi: (vakit: string) => `${vakit} vakti bildirimi`,
    islamTarihindeBugun: 'İslam Tarihinde Bugün',
    islamTarihinden: 'İslam Tarihinden',
    yilDonumineGunVar: (n: number) => `Yıl dönümüne ${n} gün var`,
    yilDonumuGunOnceydi: (n: number) => `Yıl dönümü ${n} gün önceydi`,
    gununAyeti: 'Günün Ayeti',
    kalanGunKaldi: (ad: string, n: number) => `${ad}'a ${n} gün kaldı`,
    oncekiKonum: 'Önceki konum',
    sonrakiKonum: 'Sonraki konum',
    // Alt navigasyon sekmeleri
    sekmeAnaSayfa: 'Ana Sayfa',
    sekmeImsakiye: 'İmsakiye',
    sekmeKesfet: 'Keşfet',
    sekmeKible: 'Kıble',
    sekmeAyarlar: 'Ayarlar',
    // Hızlı araçlar (Ana Sayfa'daki dörtlü satır)
    aracTakip: 'Takip',
    aracTesbih: 'Tesbih',
    aracEsma: 'Esmâ',
    aracKaza: 'Kaza',
    // Ay adları (Miladi)
    ocak: 'Ocak', subat: 'Şubat', mart: 'Mart', nisan: 'Nisan',
    mayis: 'Mayıs', haziran: 'Haziran', temmuz: 'Temmuz', agustos: 'Ağustos',
    eylul: 'Eylül', ekim: 'Ekim', kasim: 'Kasım', aralik: 'Aralık',
  },
  en: {
    konumDegistirEtiketi: 'Change location',
    bildirimAyarlariEtiketi: 'Notification settings',
    kalanSure: 'TIME REMAINING',
    siradakiVakit: 'NEXT PRAYER',
    diyanetTakvimi: 'Diyanet Calendar',
    yerelHesaplama: 'Local calculation',
    gunlukSeri: (n: number) => `${n}-day streak`,
    gunlukSeriEtiketi: (n: number) => `${n}-day streak. Open Tracking screen`,
    mekruhVakti: (sebep: string) => `Disliked time — ${sebep}`,
    iftaraKalan: (sure: string) => `Time to Iftar: ${sure}`,
    diyanetUlasilamadi: 'Could not reach Diyanet data, showing local calculation temporarily.',
    simdi: 'Now',
    kilindiOlarakIsaretle: (vakit: string) => `Mark ${vakit} prayer as performed`,
    vaktiBildirimi: (vakit: string) => `${vakit} prayer notification`,
    islamTarihindeBugun: 'On This Day in Islamic History',
    islamTarihinden: 'From Islamic History',
    yilDonumineGunVar: (n: number) => `${n} days to anniversary`,
    yilDonumuGunOnceydi: (n: number) => `Anniversary was ${n} days ago`,
    gununAyeti: 'Verse of the Day',
    kalanGunKaldi: (ad: string, n: number) => `${n} days until ${ad}`,
    oncekiKonum: 'Previous location',
    sonrakiKonum: 'Next location',
    sekmeAnaSayfa: 'Home',
    sekmeImsakiye: 'Prayer Times',
    sekmeKesfet: 'Explore',
    sekmeKible: 'Qibla',
    sekmeAyarlar: 'Settings',
    aracTakip: 'Tracking',
    aracTesbih: 'Tasbih',
    aracEsma: 'Names',
    aracKaza: 'Makeup',
    ocak: 'January', subat: 'February', mart: 'March', nisan: 'April',
    mayis: 'May', haziran: 'June', temmuz: 'July', agustos: 'August',
    eylul: 'September', ekim: 'October', kasim: 'November', aralik: 'December',
  },
};

// Vakit adları — pek çok ekranda ortak kullanılıyor (HomeScreen, Imsakiye,
// bildirimler vb.), bu yüzden ayrı bir bölüm.
const vakitAdlari = {
  tr: {
    imsak: 'İmsak', sabah: 'Sabah', gunes: 'Güneş', ogle: 'Öğle',
    ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı',
  },
  en: {
    imsak: 'Imsak', sabah: 'Fajr', gunes: 'Sunrise', ogle: 'Dhuhr',
    ikindi: 'Asr', aksam: 'Maghrib', yatsi: 'Isha',
  },
};

export const SOZLUK = {
  tr: { ...ortak.tr, ...anaSayfa.tr, vakit: vakitAdlari.tr },
  en: { ...ortak.en, ...anaSayfa.en, vakit: vakitAdlari.en },
};

export type CeviriAnahtari = keyof typeof SOZLUK['tr'];

/** Ay adı anahtarları, 0=Ocak/January sırasıyla — `new Date().getMonth()`
    ile doğrudan indekslenebilsin diye. `useCeviri()`'nin `t()` fonksiyonu
    ile birlikte kullanılır: `t(AY_ANAHTARLARI[now.getMonth()])`. */
export const AY_ANAHTARLARI: CeviriAnahtari[] = [
  'ocak', 'subat', 'mart', 'nisan', 'mayis', 'haziran',
  'temmuz', 'agustos', 'eylul', 'ekim', 'kasim', 'aralik',
];
