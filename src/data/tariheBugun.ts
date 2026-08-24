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
}

export const TARIH_OLAYLARI: TarihOlayi[] = [
  // ── OCAK ──
  { ay: 1, gun: 3, yil: 1871, baslik: 'Mehmet Akif Ersoy… (doğum)',
    aciklama: 'İstiklal Marşı’nın şairi ve Kur’an mütercimi Mehmet Akif Ersoy’un doğum tarihi olarak kabul edilen gün.' },

  // ── ŞUBAT ──
  { ay: 2, gun: 3, yil: 1451, baslik: 'Fatih Sultan Mehmed tahta çıktı',
    aciklama: 'II. Mehmed ikinci kez Osmanlı tahtına geçti; iki yıl sonra İstanbul’u fethedecekti.' },
  { ay: 2, gun: 22, yil: 632, baslik: 'Veda Hutbesi (yaklaşık)',
    aciklama: 'Peygamber Efendimizin Veda Haccı sırasında Arafat’ta irad ettiği hutbe. Hicri 9 Zilhicce 10’a denk gelir.' },

  // ── MART ──
  { ay: 3, gun: 12, yil: 1921, baslik: 'İstiklal Marşı kabul edildi',
    aciklama: 'Mehmet Akif Ersoy’un yazdığı İstiklal Marşı, TBMM tarafından milli marş olarak kabul edildi.' },

  // ── NİSAN ──
  { ay: 4, gun: 6, yil: 1453, baslik: 'İstanbul kuşatması başladı',
    aciklama: 'Fatih Sultan Mehmed komutasındaki Osmanlı ordusu İstanbul’u kuşatmaya başladı.' },

  // ── MAYIS ──
  { ay: 5, gun: 29, yil: 1453, baslik: 'İstanbul’un Fethi',
    aciklama: 'Fatih Sultan Mehmed İstanbul’u fethetti; Orta Çağ’ın kapanışı sayılan olay.' },

  // ── HAZİRAN ──
  { ay: 6, gun: 8, yil: 632, baslik: 'Peygamber Efendimizin vefatı (yaklaşık)',
    aciklama: 'Hz. Muhammed (s.a.v.) Medine’de vefat etti. Hicri 12 Rebiülevvel 11’e denk gelir.' },

  // ── TEMMUZ ──
  { ay: 7, gun: 16, yil: 622, baslik: 'Hicri takvimin başlangıcı',
    aciklama: 'Hicri takvimin birinci yılının ilk günü olarak kabul edilen tarih.' },

  // ── AĞUSTOS ──
  { ay: 8, gun: 26, yil: 1071, baslik: 'Malazgirt Meydan Muharebesi',
    aciklama: 'Sultan Alparslan komutasındaki Selçuklu ordusu Bizans’ı yendi; Anadolu’nun kapıları açıldı.' },

  // ── EYLÜL ──
  { ay: 9, gun: 24, yil: 622, baslik: 'Hicret tamamlandı (yaklaşık)',
    aciklama: 'Peygamber Efendimiz Mekke’den Medine’ye hicretini tamamladı; Kuba’ya varış olarak anılır.' },

  // ── EKİM ──
  { ay: 10, gun: 7, yil: 1571, baslik: 'İnebahtı Deniz Savaşı',
    aciklama: 'Osmanlı donanması ile Haçlı donanması arasındaki büyük deniz muharebesi.' },

  // ── KASIM ──
  { ay: 11, gun: 20, yil: 1187, baslik: 'Selahaddin Eyyubi Kudüs’ü aldı (yaklaşık)',
    aciklama: 'Hıttîn Zaferi’nin ardından Selahaddin Eyyubi Kudüs’ü teslim aldı.' },

  // ── ARALIK ──
  { ay: 12, gun: 17, yil: 1273, baslik: 'Mevlânâ Celâleddîn Rûmî’nin vefatı',
    aciklama: 'Şeb-i Arûs olarak anılan gün; Mevlânâ Konya’da vefat etti.' },
];

/**
 * Verilen güne ait tarihi olayı döndürür; o gün için kayıt yoksa null.
 *
 * Bilinçli olarak boş dönebilir: uydurma ya da tarihi tartışmalı bir olayla
 * her günü doldurmaktansa, kartın hiç görünmemesi tercih edildi.
 */
export function getTariheBugun(tarih: Date): TarihOlayi | null {
  const ay = tarih.getMonth() + 1;
  const gun = tarih.getDate();
  return TARIH_OLAYLARI.find((o) => o.ay === ay && o.gun === gun) ?? null;
}
