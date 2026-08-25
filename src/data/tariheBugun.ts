// src/data/tariheBugun.ts
//
// İSLAM TARİHİNDE BUGÜN
//
// ─────────────────────────────────────────────────────────────────────────────
// KAYNAK VE DOĞRULUK YAKLAŞIMI
//
// Liste MİLADİ tarihe göre düzenlendi (kullanıcı tercihi). Tamamı cihazda
// tutulur; internet gerektirmez.
//
// Doğruluk konusunda üç kural gözetildi:
//
//  1) YALNIZCA MİLADİ TARİHİ YAYGIN OLARAK KABUL EDİLEN OLAYLAR alındı.
//     Erken İslam tarihindeki pek çok olayın günü/ayı hicri kaynaklarda
//     kayıtlıdır ve miladi karşılığı hesaplanırken kaynaklar arasında
//     birkaç günlük farklar oluşur. Böyle olaylar bu listeye ALINMADI.
//     Bu yüzden liste kasıtlı olarak kısadır — uydurma bir gün doldurmaktansa
//     o gün kart hiç görünmesin.
//
//  2) Tartışmalı tarihlerde "yaklaşık" ibaresi kullanıldı.
//
//  3) Siyasi/mezhepsel tartışma konusu olan olaylar, taraf tutan bir dille
//     değil, olgusal bir dille yazıldı.
//
// Her kayıt bir yıl bilgisi taşır; kart "1453 · İstanbul'un Fethi" gibi
// gösterilir.
//
// DİL (madde 10a/13 — bu tur): `baslikId`/`aciklamaId` ve `baslikFr`/
// `aciklamaFr` eklendi — bkz. diniGunler.ts'teki aynı gerekçe.
// ─────────────────────────────────────────────────────────────────────────────

export interface TarihOlayi {
  /** 1-12 */
  ay: number;
  /** 1-31 */
  gun: number;
  /** Miladi yıl */
  yil: number;
  baslik: string;
  /** Bir-iki cümlelik açıklama */
  aciklama: string;
  /** İngilizce başlık — dil İngilizce iken gösterilir */
  baslikEn: string;
  /** İngilizce açıklama — dil İngilizce iken gösterilir */
  aciklamaEn: string;
  /** Endonezce başlık/açıklama */
  baslikId: string;
  aciklamaId: string;
  /** Fransızca başlık/açıklama */
  baslikFr: string;
  aciklamaFr: string;
}

export const TARIH_OLAYLARI: TarihOlayi[] = [
  // ── OCAK ──
  { ay: 1, gun: 3, yil: 1871, baslik: 'Mehmet Akif Ersoy… (doğum)',
    aciklama: 'İstiklal Marşı’nın şairi ve Kur’an mütercimi Mehmet Akif Ersoy’un doğum tarihi olarak kabul edilen gün.',
    baslikEn: 'Mehmet Akif Ersoy (born)',
    aciklamaEn: 'The date traditionally accepted as the birth of Mehmet Akif Ersoy, poet of the Turkish National Anthem and translator of the Quran.',
    baslikId: 'Mehmet Akif Ersoy (lahir)',
    aciklamaId: 'Tanggal yang secara tradisional diterima sebagai hari lahir Mehmet Akif Ersoy, penyair lagu kebangsaan Turki dan penerjemah makna Al-Qur’an.',
    baslikFr: 'Mehmet Akif Ersoy (naissance)',
    aciklamaFr: 'La date traditionnellement retenue comme naissance de Mehmet Akif Ersoy, poète de l’hymne national turc et traducteur du sens du Coran.' },

  // ── ŞUBAT ──
  { ay: 2, gun: 3, yil: 1451, baslik: 'Fatih Sultan Mehmed tahta çıktı',
    aciklama: 'II. Mehmed ikinci kez Osmanlı tahtına geçti; iki yıl sonra İstanbul’u fethedecekti.',
    baslikEn: 'Mehmed the Conqueror ascends the throne',
    aciklamaEn: 'Mehmed II took the Ottoman throne for the second time; two years later he would conquer Constantinople.',
    baslikId: 'Sultan Mehmed II naik takhta',
    aciklamaId: 'Mehmed II naik takhta Utsmaniyah untuk kedua kalinya; dua tahun kemudian ia menaklukkan Konstantinopel.',
    baslikFr: 'Mehmed le Conquérant monte sur le trône',
    aciklamaFr: 'Mehmed II accéda au trône ottoman pour la seconde fois ; deux ans plus tard, il conquerrait Constantinople.' },
  { ay: 2, gun: 22, yil: 632, baslik: 'Veda Hutbesi (yaklaşık)',
    aciklama: 'Peygamber Efendimizin Veda Haccı sırasında Arafat’ta irad ettiği hutbe. Hicri 9 Zilhicce 10’a denk gelir.',
    baslikEn: 'The Farewell Sermon (approx.)',
    aciklamaEn: 'The sermon delivered by the Prophet on Mount Arafat during his Farewell Pilgrimage, corresponding to 9 Dhul-Hijjah, 10 AH.',
    baslikId: 'Khotbah Perpisahan (perkiraan)',
    aciklamaId: 'Khotbah yang disampaikan Nabi di Gunung Arafah saat Haji Wada’; bertepatan dengan 9 Zulhijah tahun 10 H.',
    baslikFr: 'Le Sermon d’Adieu (approx.)',
    aciklamaFr: 'Le sermon prononcé par le Prophète sur le mont Arafat lors de son pèlerinage d’adieu, correspondant au 9 Dhou al-Hijja de l’an 10 de l’hégire.' },

  // ── MART ──
  { ay: 3, gun: 12, yil: 1921, baslik: 'İstiklal Marşı kabul edildi',
    aciklama: 'Mehmet Akif Ersoy’un yazdığı İstiklal Marşı, TBMM tarafından milli marş olarak kabul edildi.',
    baslikEn: 'The Turkish National Anthem is adopted',
    aciklamaEn: "The İstiklal Marşı, written by Mehmet Akif Ersoy, was adopted as the national anthem by Turkey's Grand National Assembly.",
    baslikId: 'Lagu kebangsaan Turki disahkan',
    aciklamaId: 'İstiklal Marşı karya Mehmet Akif Ersoy disahkan sebagai lagu kebangsaan oleh Majelis Agung Nasional Turki.',
    baslikFr: 'L’hymne national turc est adopté',
    aciklamaFr: 'L’İstiklal Marşı, écrit par Mehmet Akif Ersoy, fut adopté comme hymne national par la Grande Assemblée nationale de Turquie.' },

  // ── NİSAN ──
  { ay: 4, gun: 6, yil: 1453, baslik: 'İstanbul kuşatması başladı',
    aciklama: 'Fatih Sultan Mehmed komutasındaki Osmanlı ordusu İstanbul’u kuşatmaya başladı.',
    baslikEn: 'The Siege of Constantinople begins',
    aciklamaEn: 'The Ottoman army under Mehmed the Conqueror began the siege of Constantinople.',
    baslikId: 'Pengepungan Konstantinopel dimulai',
    aciklamaId: 'Pasukan Utsmaniyah di bawah Mehmed Sang Penakluk memulai pengepungan Konstantinopel.',
    baslikFr: 'Le siège de Constantinople commence',
    aciklamaFr: 'L’armée ottomane sous Mehmed le Conquérant entama le siège de Constantinople.' },

  // ── MAYIS ──
  { ay: 5, gun: 29, yil: 1453, baslik: 'İstanbul’un Fethi',
    aciklama: 'Fatih Sultan Mehmed İstanbul’u fethetti; Orta Çağ’ın kapanışı sayılan olay.',
    baslikEn: 'The Conquest of Constantinople',
    aciklamaEn: 'Mehmed the Conqueror conquered Constantinople, an event considered to mark the end of the Middle Ages.',
    baslikId: 'Penaklukan Konstantinopel',
    aciklamaId: 'Mehmed Sang Penakluk menaklukkan Konstantinopel, peristiwa yang dianggap menandai berakhirnya Abad Pertengahan.',
    baslikFr: 'La Conquête de Constantinople',
    aciklamaFr: 'Mehmed le Conquérant conquit Constantinople, un événement considéré comme marquant la fin du Moyen Âge.' },

  // ── HAZİRAN ──
  { ay: 6, gun: 8, yil: 632, baslik: 'Peygamber Efendimizin vefatı (yaklaşık)',
    aciklama: 'Hz. Muhammed (s.a.v.) Medine’de vefat etti. Hicri 12 Rebiülevvel 11’e denk gelir.',
    baslikEn: 'The passing of the Prophet Muhammad (approx.)',
    aciklamaEn: 'Prophet Muhammad (peace be upon him) passed away in Medina, corresponding to 12 Rabi al-Awwal, 11 AH.',
    baslikId: 'Wafatnya Nabi Muhammad ﷺ (perkiraan)',
    aciklamaId: 'Nabi Muhammad ﷺ wafat di Madinah; bertepatan dengan 12 Rabiulawal tahun 11 H.',
    baslikFr: 'Le décès du Prophète Muhammad (approx.)',
    aciklamaFr: 'Le Prophète Muhammad (paix sur lui) décéda à Médine, correspondant au 12 Rabi al-Awwal de l’an 11 de l’hégire.' },

  // ── TEMMUZ ──
  { ay: 7, gun: 16, yil: 622, baslik: 'Hicri takvimin başlangıcı',
    aciklama: 'Hicri takvimin birinci yılının ilk günü olarak kabul edilen tarih.',
    baslikEn: 'The start of the Hijri calendar',
    aciklamaEn: 'The date accepted as the first day of year one of the Hijri calendar.',
    baslikId: 'Awal mula kalender Hijriah',
    aciklamaId: 'Tanggal yang diterima sebagai hari pertama tahun pertama kalender Hijriah.',
    baslikFr: 'Le début du calendrier hégirien',
    aciklamaFr: 'La date retenue comme premier jour de l’an un du calendrier hégirien.' },

  // ── AĞUSTOS ──
  { ay: 8, gun: 26, yil: 1071, baslik: 'Malazgirt Meydan Muharebesi',
    aciklama: 'Sultan Alparslan komutasındaki Selçuklu ordusu Bizans’ı yendi; Anadolu’nun kapıları açıldı.',
    baslikEn: 'The Battle of Manzikert',
    aciklamaEn: 'The Seljuk army under Sultan Alp Arslan defeated the Byzantines, opening the gates of Anatolia to Turkish settlement.',
    baslikId: 'Pertempuran Manzikert',
    aciklamaId: 'Pasukan Seljuk di bawah Sultan Alp Arslan mengalahkan Bizantium, membuka gerbang Anatolia.',
    baslikFr: 'La bataille de Manzikert',
    aciklamaFr: 'L’armée seldjoukide sous le sultan Alp Arslan vainquit les Byzantins, ouvrant les portes de l’Anatolie.' },

  // ── EYLÜL ──
  { ay: 9, gun: 24, yil: 622, baslik: 'Hicret tamamlandı (yaklaşık)',
    aciklama: 'Peygamber Efendimiz Mekke’den Medine’ye hicretini tamamladı; Kuba’ya varış olarak anılır.',
    baslikEn: 'The Hijra is completed (approx.)',
    aciklamaEn: "The Prophet completed his migration from Mecca to Medina, marked by his arrival at Quba.",
    baslikId: 'Hijrah selesai (perkiraan)',
    aciklamaId: 'Nabi menyelesaikan hijrahnya dari Makkah ke Madinah, ditandai dengan kedatangannya di Quba.',
    baslikFr: 'L’Hégire s’achève (approx.)',
    aciklamaFr: 'Le Prophète acheva sa migration de La Mecque à Médine, marquée par son arrivée à Quba.' },

  // ── EKİM ──
  { ay: 10, gun: 7, yil: 1571, baslik: 'İnebahtı Deniz Savaşı',
    aciklama: 'Osmanlı donanması ile Haçlı donanması arasındaki büyük deniz muharebesi.',
    baslikEn: 'The Battle of Lepanto',
    aciklamaEn: 'A major naval battle between the Ottoman fleet and the fleet of the Holy League.',
    baslikId: 'Pertempuran Lepanto',
    aciklamaId: 'Pertempuran laut besar antara armada Utsmaniyah dan armada Liga Suci.',
    baslikFr: 'La bataille de Lépante',
    aciklamaFr: 'Une grande bataille navale entre la flotte ottomane et celle de la Sainte Ligue.' },

  // ── KASIM ──
  { ay: 11, gun: 20, yil: 1187, baslik: 'Selahaddin Eyyubi Kudüs’ü aldı (yaklaşık)',
    aciklama: 'Hıttîn Zaferi’nin ardından Selahaddin Eyyubi Kudüs’ü teslim aldı.',
    baslikEn: 'Saladin retakes Jerusalem (approx.)',
    aciklamaEn: 'Following the victory at the Battle of Hattin, Saladin received the surrender of Jerusalem.',
    baslikId: 'Salahuddin Ayyubi merebut kembali Yerusalem (perkiraan)',
    aciklamaId: 'Setelah kemenangan dalam Pertempuran Hattin, Salahuddin Ayyubi menerima penyerahan Yerusalem.',
    baslikFr: 'Saladin reprend Jérusalem (approx.)',
    aciklamaFr: 'Après la victoire à la bataille de Hattin, Saladin reçut la reddition de Jérusalem.' },

  // ── ARALIK ──
  { ay: 12, gun: 17, yil: 1273, baslik: 'Mevlânâ Celâleddîn Rûmî’nin vefatı',
    aciklama: 'Şeb-i Arûs olarak anılan gün; Mevlânâ Konya’da vefat etti.',
    baslikEn: 'The passing of Rumi',
    aciklamaEn: "Known as Şeb-i Arus (the Night of Union), the day Rumi passed away in Konya.",
    baslikId: 'Wafatnya Rumi (Jalaluddin Rumi)',
    aciklamaId: 'Dikenal sebagai Şeb-i Arus (Malam Penyatuan), hari Rumi wafat di Konya.',
    baslikFr: 'Le décès de Rûmî',
    aciklamaFr: 'Connu sous le nom de Şeb-i Arus (la Nuit de l’Union), le jour où Rûmî décéda à Konya.' },
];

/**
 * Verilen güne ait tarihi olayı döndürür; o gün için TAM eşleşen bir kayıt
 * yoksa null. `getTariheBugun` yalnızca gün/ay birebir eşleştiğinde sonuç
 * verir — "bugün" ibaresi doğru kalsın diye.
 */
export function getTariheBugunTamEslesme(tarih: Date): TarihOlayi | null {
  const ay = tarih.getMonth() + 1;
  const gun = tarih.getDate();
  return TARIH_OLAYLARI.find((o) => o.ay === ay && o.gun === gun) ?? null;
}

/**
 * Geriye dönük uyumluluk için: `getTariheBugunTamEslesme` ile aynı.
 * @deprecated Anasayfa artık `getTariheEnYakinOlay` (fallback'li sürüm) kullanıyor.
 */
export function getTariheBugun(tarih: Date): TarihOlayi | null {
  return getTariheBugunTamEslesme(tarih);
}

/**
 * TAKVİMDEKİ EN YAKIN OLAY (madde 3, devir dosyası — kullanıcı ısrarla
 * "her gün gösterilsin" istedi).
 *
 * Liste kasıtlı olarak seyrek (yalnızca miladi tarihi tartışmasız olan ~12
 * olay) — bu yüzden çoğu günde tam eşleşme yok. Her günü UYDURMA bir olayla
 * doldurmak yerine, o güne göre takvimde EN YAKIN olan gerçek olayı, kendi
 * gerçek tarihiyle birlikte gösteriyoruz ("26 Ağustos'ta yaşandı" gibi) —
 * yani "bugün" değil "en yakın" olarak sunuluyor; doğruluk feda edilmiyor.
 *
 * Eşit uzaklıkta iki olay varsa yıl döngüsünde SIRADAKİ (ileri) olan seçilir.
 */
export function getTariheEnYakinOlay(tarih: Date): { olay: TarihOlayi; gunFarki: number; bugunMu: boolean } {
  const ay = tarih.getMonth() + 1;
  const gun = tarih.getDate();

  const tam = getTariheBugunTamEslesme(tarih);
  if (tam) return { olay: tam, gunFarki: 0, bugunMu: true };

  // Yıl içindeki gün sırasına göre "bugünden kaç gün sonra/önce" hesapla.
  // Basit bir yaklaşım: her olayı o yılki gün sayısına çevirip dairesel
  // (365 gün) en kısa mesafeyi bul.
  const gunSayisi = (a: number, g: number) => {
    const kumulatif = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    return kumulatif[a - 1] + g;
  };
  const bugunNo = gunSayisi(ay, gun);

  let enYakin = TARIH_OLAYLARI[0];
  let enKisaFark = Infinity;
  for (const o of TARIH_OLAYLARI) {
    const olayNo = gunSayisi(o.ay, o.gun);
    let fark = olayNo - bugunNo;
    // Dairesel mesafe: ileri veya geri, hangisi kısaysa
    if (fark > 182) fark -= 365;
    if (fark < -182) fark += 365;
    if (Math.abs(fark) < Math.abs(enKisaFark)) {
      enKisaFark = fark;
      enYakin = o;
    }
  }

  return { olay: enYakin, gunFarki: enKisaFark, bugunMu: false };
}
