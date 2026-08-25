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
//
// DİL (madde 10a/13 — bu tur): önceden yalnızca `ad`/`aciklama` (tr) ve
// `adEn`/`aciklamaEn` vardı; Endonezce/Fransızca kullanıcılar bu içeriği
// İngilizce görüyordu. Şimdi `adId`/`aciklamaId` ve `adFr`/`aciklamaFr` da
// eklendi — tüm 4 dil de tam kapsanıyor.
// ─────────────────────────────────────────────────────────────────────────────

export type DiniGunTuru = 'kandil' | 'bayram' | 'ay' | 'gun';

export interface DiniGun {
  ad: string;
  tur: DiniGunTuru;
  /** Kısa açıklama — kartta ikinci satır olarak gösterilir. */
  aciklama: string;
  /** İngilizce ad — bilingual VERİ deseni (bkz. ayetler.ts/tariheBugun.ts):
   *  ekran `veriSec(dil, x.ad, x.adEn, x.adId, x.adFr)` ile seçer. */
  adEn: string;
  /** İngilizce açıklama — aynı desen. */
  aciklamaEn: string;
  /** Endonezce ad/açıklama. */
  adId: string;
  aciklamaId: string;
  /** Fransızca ad/açıklama. */
  adFr: string;
  aciklamaFr: string;
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
    aciklama: 'Hicri yeni yılın ilk günü',
    adEn: 'Islamic New Year', aciklamaEn: 'The first day of the new Hijri year',
    adId: 'Tahun Baru Hijriah', aciklamaId: 'Hari pertama tahun Hijriah yang baru',
    adFr: 'Nouvel An Hégirien', aciklamaFr: 'Le premier jour de la nouvelle année hégirienne' },
  { ay: 'Muharrem', gun: 10, ad: 'Aşure Günü', tur: 'gun',
    aciklama: 'Muharrem ayının onuncu günü',
    adEn: 'Day of Ashura', aciklamaEn: 'The tenth day of Muharram',
    adId: 'Hari Asyura', aciklamaId: 'Hari kesepuluh bulan Muharram',
    adFr: 'Jour de l\'Achoura', aciklamaFr: 'Le dixième jour de Muharram' },

  // ── Rebiülevvel ──
  { ay: 'Rebiülevvel', gun: 12, ad: 'Mevlid Kandili', tur: 'kandil',
    aciklama: 'Peygamber Efendimizin doğum yıldönümü',
    adEn: 'Mawlid al-Nabi', aciklamaEn: "The anniversary of the Prophet's birth",
    adId: 'Maulid Nabi', aciklamaId: 'Peringatan hari kelahiran Nabi Muhammad',
    adFr: 'Mawlid an-Nabi', aciklamaFr: 'Anniversaire de la naissance du Prophète' },

  // ── Recep ──
  { ay: 'Recep', gun: 1, ad: 'Üç Ayların Başlangıcı', tur: 'ay',
    aciklama: 'Recep, Şaban ve Ramazan ayları başlıyor',
    adEn: 'Start of the Three Holy Months', aciklamaEn: 'Rajab, Sha’ban and Ramadan begin',
    adId: 'Awal Tiga Bulan Mulia', aciklamaId: 'Bulan Rajab, Sya\'ban, dan Ramadan dimulai',
    adFr: 'Début des Trois Mois Sacrés', aciklamaFr: 'Rajab, Cha’ban et Ramadan commencent' },
  { ay: 'Recep', gun: 27, ad: 'Miraç Kandili', tur: 'kandil',
    aciklama: 'İsrâ ve Miraç gecesi',
    adEn: 'Laylat al-Mi’raj', aciklamaEn: 'The Night Journey and Ascension',
    adId: 'Isra Mikraj', aciklamaId: 'Malam Perjalanan dan Kenaikan Nabi Muhammad',
    adFr: 'Nuit du Miraj', aciklamaFr: 'Le Voyage Nocturne et l’Ascension' },

  // ── Şaban ──
  { ay: 'Şaban', gun: 15, ad: 'Beraat Kandili', tur: 'kandil',
    aciklama: 'Şaban ayının on beşinci gecesi',
    adEn: 'Laylat al-Bara’ah', aciklamaEn: 'The fifteenth night of Sha’ban',
    adId: 'Nisfu Sya\'ban', aciklamaId: 'Malam kelima belas bulan Sya\'ban',
    adFr: 'Nuit du Bara’ah', aciklamaFr: 'La quinzième nuit de Cha’ban' },

  // ── Ramazan ──
  { ay: 'Ramazan', gun: 1, ad: 'Ramazan Başlangıcı', tur: 'ay',
    aciklama: 'Oruç ayının ilk günü',
    adEn: 'Start of Ramadan', aciklamaEn: 'The first day of the fasting month',
    adId: 'Awal Ramadan', aciklamaId: 'Hari pertama bulan puasa',
    adFr: 'Début du Ramadan', aciklamaFr: 'Le premier jour du mois de jeûne' },
  { ay: 'Ramazan', gun: 27, ad: 'Kadir Gecesi', tur: 'kandil',
    aciklama: 'Bin aydan hayırlı gece',
    adEn: 'Laylat al-Qadr', aciklamaEn: 'The Night of Decree, better than a thousand months',
    adId: 'Malam Lailatul Qadar', aciklamaId: 'Malam yang lebih baik dari seribu bulan',
    adFr: 'Nuit du Destin', aciklamaFr: 'La nuit meilleure que mille mois' },

  // ── Şevval ──
  { ay: 'Şevval', gun: 1, ad: 'Ramazan Bayramı 1. Gün', tur: 'bayram',
    aciklama: 'Bayramınız mübarek olsun',
    adEn: 'Eid al-Fitr, Day 1', aciklamaEn: 'Blessed Eid to you',
    adId: 'Idulfitri, Hari ke-1', aciklamaId: 'Selamat Hari Raya',
    adFr: 'Aïd el-Fitr, 1er jour', aciklamaFr: 'Joyeux Aïd à vous' },
  { ay: 'Şevval', gun: 2, ad: 'Ramazan Bayramı 2. Gün', tur: 'bayram',
    aciklama: 'Bayramın ikinci günü',
    adEn: 'Eid al-Fitr, Day 2', aciklamaEn: 'The second day of Eid',
    adId: 'Idulfitri, Hari ke-2', aciklamaId: 'Hari kedua Idulfitri',
    adFr: 'Aïd el-Fitr, 2e jour', aciklamaFr: 'Le deuxième jour de l’Aïd' },
  { ay: 'Şevval', gun: 3, ad: 'Ramazan Bayramı 3. Gün', tur: 'bayram',
    aciklama: 'Bayramın üçüncü günü',
    adEn: 'Eid al-Fitr, Day 3', aciklamaEn: 'The third day of Eid',
    adId: 'Idulfitri, Hari ke-3', aciklamaId: 'Hari ketiga Idulfitri',
    adFr: 'Aïd el-Fitr, 3e jour', aciklamaFr: 'Le troisième jour de l’Aïd' },

  // ── Zilhicce ──
  { ay: 'Zilhicce', gun: 9, ad: 'Arefe Günü', tur: 'gun',
    aciklama: 'Kurban Bayramı arefesi',
    adEn: 'Day of Arafah', aciklamaEn: 'The eve of Eid al-Adha',
    adId: 'Hari Arafah', aciklamaId: 'Malam menjelang Iduladha',
    adFr: 'Jour d’Arafat', aciklamaFr: 'La veille de l’Aïd el-Adha' },
  { ay: 'Zilhicce', gun: 10, ad: 'Kurban Bayramı 1. Gün', tur: 'bayram',
    aciklama: 'Bayramınız mübarek olsun',
    adEn: 'Eid al-Adha, Day 1', aciklamaEn: 'Blessed Eid to you',
    adId: 'Iduladha, Hari ke-1', aciklamaId: 'Selamat Hari Raya',
    adFr: 'Aïd el-Adha, 1er jour', aciklamaFr: 'Joyeux Aïd à vous' },
  { ay: 'Zilhicce', gun: 11, ad: 'Kurban Bayramı 2. Gün', tur: 'bayram',
    aciklama: 'Bayramın ikinci günü',
    adEn: 'Eid al-Adha, Day 2', aciklamaEn: 'The second day of Eid',
    adId: 'Iduladha, Hari ke-2', aciklamaId: 'Hari kedua Iduladha',
    adFr: 'Aïd el-Adha, 2e jour', aciklamaFr: 'Le deuxième jour de l’Aïd' },
  { ay: 'Zilhicce', gun: 12, ad: 'Kurban Bayramı 3. Gün', tur: 'bayram',
    aciklama: 'Bayramın üçüncü günü',
    adEn: 'Eid al-Adha, Day 3', aciklamaEn: 'The third day of Eid',
    adId: 'Iduladha, Hari ke-3', aciklamaId: 'Hari ketiga Iduladha',
    adFr: 'Aïd el-Adha, 3e jour', aciklamaFr: 'Le troisième jour de l’Aïd' },
  { ay: 'Zilhicce', gun: 13, ad: 'Kurban Bayramı 4. Gün', tur: 'bayram',
    aciklama: 'Bayramın dördüncü günü',
    adEn: 'Eid al-Adha, Day 4', aciklamaEn: 'The fourth day of Eid',
    adId: 'Iduladha, Hari ke-4', aciklamaId: 'Hari keempat Iduladha',
    adFr: 'Aïd el-Adha, 4e jour', aciklamaFr: 'Le quatrième jour de l’Aïd' },
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
      adEn: 'Laylat al-Raghaib',
      aciklamaEn: 'The first Friday night of Rajab',
      adId: 'Malam Raghaib',
      aciklamaId: 'Malam Jumat pertama bulan Rajab',
      adFr: 'Nuit du Raghaib',
      aciklamaFr: 'La première nuit du vendredi de Rajab',
    };
  }

  const bulunan = SABIT_GUNLER.find((k) => k.ay === hicriAy && k.gun === hicriGun);
  if (!bulunan) return null;
  return {
    ad: bulunan.ad, tur: bulunan.tur, aciklama: bulunan.aciklama,
    adEn: bulunan.adEn, aciklamaEn: bulunan.aciklamaEn,
    adId: bulunan.adId, aciklamaId: bulunan.aciklamaId,
    adFr: bulunan.adFr, aciklamaFr: bulunan.aciklamaFr,
  };
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
