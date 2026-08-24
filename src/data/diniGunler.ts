// src/data/diniGunler.ts
//
// DİNİ GÜNLER VE GECELER
//
// ─────────────────────────────────────────────────────────────────────────────
// NASIL HESAPLANIYOR
//
// Kandiller ve bayramlar HİCRİ takvime bağlıdır; miladi karşılıkları her yıl
// yaklaşık 11 gün geriye kayar. Bu yüzden sabit bir miladi tarih listesi
// tutmak yerine, uygulamadaki `toHijri()` ile bulunan hicri gün/ay üzerinden
// eşleştirme yapılıyor. Böylece liste hiç eskimiyor.
//
// ÖNEMLİ İNCELİK — GÜN, AKŞAM EZANIYLA BAŞLAR:
// İslami günler güneşin batışıyla başlar. Yani "Regaib Kandili" olarak anılan
// GECE, hicri takvimde ertesi güne aittir. Kullanıcı akşam ezanından sonra
// baktığında kandili görmeli. Uygulama bunu zaten `hijriSwitchAtMaghrib`
// ayarıyla yönetiyor; buradaki eşleştirme o ayarla uyumlu çalışır.
//
// KAYNAK: Diyanet İşleri Başkanlığı'nın yayımladığı dini günler takvimindeki
// tanımlar esas alındı. Üç kandil (Regaib, Miraç, Beraat) ve Kadir Gecesi'nin
// hicri konumları sabittir; Mevlid ise Rebiülevvel 12'dir.
// ─────────────────────────────────────────────────────────────────────────────

export type DiniGunTuru = 'kandil' | 'bayram' | 'ay' | 'gun';

export interface DiniGun {
  ad: string;
  tur: DiniGunTuru;
  /** Kısa açıklama — kartta ikinci satır olarak gösterilir. */
  aciklama: string;
}

/** Hicri ay adları — `toHijri()` bu adları döndürür. */
type HicriAy =
  | 'Muharrem' | 'Safer' | 'Rebiülevvel' | 'Rebiülahir'
  | 'Cemaziyelevvel' | 'Cemaziyelahir' | 'Recep' | 'Şaban'
  | 'Ramazan' | 'Şevval' | 'Zilkade' | 'Zilhicce';

interface Kayit extends DiniGun {
  ay: HicriAy;
  gun: number;
}

/**
 * Sabit hicri tarihli dini günler.
 *
 * Regaib Kandili bu listede YOK — çünkü sabit bir güne değil, Recep ayının
 * ilk cuma gecesine denk gelir. O, aşağıda ayrıca hesaplanıyor.
 */
const SABIT_GUNLER: Kayit[] = [
  // ── Muharrem ──
  { ay: 'Muharrem', gun: 1, ad: 'Hicri Yılbaşı', tur: 'gun',
    aciklama: 'Hicri yeni yılın ilk günü' },
  { ay: 'Muharrem', gun: 10, ad: 'Aşure Günü', tur: 'gun',
    aciklama: 'Muharrem ayının onuncu günü' },

  // ── Rebiülevvel ──
  { ay: 'Rebiülevvel', gun: 12, ad: 'Mevlid Kandili', tur: 'kandil',
    aciklama: 'Peygamber Efendimizin doğum yıldönümü' },

  // ── Recep ──
  { ay: 'Recep', gun: 1, ad: 'Üç Ayların Başlangıcı', tur: 'ay',
    aciklama: 'Recep, Şaban ve Ramazan ayları başlıyor' },
  { ay: 'Recep', gun: 27, ad: 'Miraç Kandili', tur: 'kandil',
    aciklama: 'İsrâ ve Miraç gecesi' },

  // ── Şaban ──
  { ay: 'Şaban', gun: 15, ad: 'Beraat Kandili', tur: 'kandil',
    aciklama: 'Şaban ayının on beşinci gecesi' },

  // ── Ramazan ──
  { ay: 'Ramazan', gun: 1, ad: 'Ramazan Başlangıcı', tur: 'ay',
    aciklama: 'Oruç ayının ilk günü' },
  { ay: 'Ramazan', gun: 27, ad: 'Kadir Gecesi', tur: 'kandil',
    aciklama: 'Bin aydan hayırlı gece' },

  // ── Şevval ──
  { ay: 'Şevval', gun: 1, ad: 'Ramazan Bayramı 1. Gün', tur: 'bayram',
    aciklama: 'Bayramınız mübarek olsun' },
  { ay: 'Şevval', gun: 2, ad: 'Ramazan Bayramı 2. Gün', tur: 'bayram',
    aciklama: 'Bayramın ikinci günü' },
  { ay: 'Şevval', gun: 3, ad: 'Ramazan Bayramı 3. Gün', tur: 'bayram',
    aciklama: 'Bayramın üçüncü günü' },

  // ── Zilhicce ──
  { ay: 'Zilhicce', gun: 9, ad: 'Arefe Günü', tur: 'gun',
    aciklama: 'Kurban Bayramı arefesi' },
  { ay: 'Zilhicce', gun: 10, ad: 'Kurban Bayramı 1. Gün', tur: 'bayram',
    aciklama: 'Bayramınız mübarek olsun' },
  { ay: 'Zilhicce', gun: 11, ad: 'Kurban Bayramı 2. Gün', tur: 'bayram',
    aciklama: 'Bayramın ikinci günü' },
  { ay: 'Zilhicce', gun: 12, ad: 'Kurban Bayramı 3. Gün', tur: 'bayram',
    aciklama: 'Bayramın üçüncü günü' },
  { ay: 'Zilhicce', gun: 13, ad: 'Kurban Bayramı 4. Gün', tur: 'bayram',
    aciklama: 'Bayramın dördüncü günü' },
];

/**
 * Regaib Kandili: Recep ayının İLK CUMA gecesi.
 *
 * "Cuma gecesi" perşembeyi cumaya bağlayan gecedir. Uygulama tarafında
 * pratik karşılık: Recep ayındaki ilk cuma gününe denk gelen tarih.
 *
 * Bu fonksiyon miladi tarihi alır ve o günün Regaib olup olmadığını söyler.
 * Hicri ay bilgisi dışarıdan verilir; böylece kullanıcının Ayarlar'daki
 * hicri düzeltmesi burada da geçerli olur.
 */
function regaibMi(miladi: Date, hicriAy: string, hicriGun: number): boolean {
  if (hicriAy !== 'Recep') return false;
  // Recep'in ilk cuması ayın 1-7'si arasında olmak zorundadır.
  if (hicriGun > 7) return false;
  return miladi.getDay() === 5; // 5 = Cuma
}

/**
 * Verilen hicri tarihe denk gelen dini günü döndürür; yoksa null.
 *
 * @param miladi   Miladi tarih (Regaib'in cuma kontrolü için gerekli)
 * @param hicriAy  Hicri ay adı (`toHijri().month`)
 * @param hicriGun Hicri gün (`toHijri().day`)
 */
export function getDiniGun(
  miladi: Date,
  hicriAy: string,
  hicriGun: number
): DiniGun | null {
  if (regaibMi(miladi, hicriAy, hicriGun)) {
    return {
      ad: 'Regaib Kandili',
      tur: 'kandil',
      aciklama: 'Recep ayının ilk cuma gecesi',
    };
  }

  const bulunan = SABIT_GUNLER.find((k) => k.ay === hicriAy && k.gun === hicriGun);
  if (!bulunan) return null;
  return { ad: bulunan.ad, tur: bulunan.tur, aciklama: bulunan.aciklama };
}

/**
 * Bugünden sonraki ilk dini günü ve kaç gün kaldığını bulur.
 *
 * Hicri ay uzunlukları değişken olduğu için ileriye doğru gün gün tarayarak
 * hesaplanıyor; 400 günlük tarama bir hicri yılı fazlasıyla kapsar.
 *
 * @param hicriCevir Miladi tarihi hicriye çeviren fonksiyon. Dışarıdan
 *                   alınıyor ki kullanıcının hicri düzeltme ayarı korunsun.
 */
export function getYaklasanDiniGun(
  bugun: Date,
  hicriCevir: (d: Date) => { day: number; month: string; year: number }
): { gun: DiniGun; kalanGun: number; tarih: Date } | null {
  const bas = new Date(bugun);
  bas.setHours(12, 0, 0, 0);

  for (let i = 1; i <= 400; i++) {
    const d = new Date(bas);
    d.setDate(d.getDate() + i);
    const h = hicriCevir(d);
    const dg = getDiniGun(d, h.month, h.day);
    if (dg) return { gun: dg, kalanGun: i, tarih: d };
  }
  return null;
}
