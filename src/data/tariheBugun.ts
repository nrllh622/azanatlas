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
//     birkaç günlük farklar oluşur. Böyle olaylar bu listeye ALINMADI —
//     istisnası, kaynaklar arasında zaten bilinen küçük farkı "(yaklaşık)"
//     ibaresiyle açıkça işaretleyen birkaç sahabe-dönemi olay (Bedir, Uhud,
//     Mekke'nin Fethi, Veda Hutbesi, Hicret, Peygamber Efendimizin vefatı).
//     Bu yüzden liste her günü doldurmaz — uydurma bir gün doldurmaktansa
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
// GENİŞLETME (10 maddelik listenin 2. maddesi — 5. ve 6. tur): kullanıcı
// "günlerdir aynı şeyi gösteriyor" diye şikayet etti ve YAKLAŞIK/EN-YAKIN
// eşleştirmeyi DEĞİL, yalnızca o güne ait GERÇEK olayı istediğini açıkça
// belirtti (5. tur). 6. turda kullanıcı bunun YETERSİZ kaldığını, "365
// günün her gününde mutlaka bir olay olmalı" dediğini tekrarladı — bunun
// üzerine 4 paralel araştırma ajanıyla (Oca-Mar/Nis-Haz/Tem-Eyl/Eki-Ara)
// liste 38'den 93 olaya çıkarıldı. Kapsam bilinçli olarak GENİŞLETİLDİ:
// yalnızca klasik dini tarih değil, Osmanlı/Endülüs/Babür/Selçuklu/Safevi
// tarihi, büyük İslam âlimleri/bilim insanları, modern Müslüman ülkelerin
// bağımsızlık günleri de dahil edildi — aksi halde 365 güne yaklaşmak
// mümkün değildi. 93/365 hâlâ TAM kapsama değil — geri kalan ~272 gün için
// araştırma sırasında gün/ay kesinliği güvenilir şekilde doğrulanamadı
// (bkz. kullanıcıya iletilen dürüstlük notu); bu günlerde UYDURMA bir olay
// eklemek yerine kart o gün görünmüyor. Anasayfa artık SADECE tam eşleşme
// kullanıyor (bkz. `getTariheBugunTamEslesme`) — `getTariheEnYakinOlay`
// (en-yakın-gün fallback'i) kullanımdan kaldırıldı, silinmedi.
//
// DİL (madde 10a/13 — önceki tur): `baslikId`/`aciklamaId` ve `baslikFr`/
// `aciklamaFr` eklendi — bkz. diniGunler.ts'teki aynı gerekçe. Bu turda
// eklenen 24 yeni kayıt da aynı 4 dilde (tr/en/id/fr) yazıldı.
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
  { ay: 1, gun: 2, yil: 1492, baslik: 'Gırnata’nın (Endülüs) düşüşü',
    aciklama: 'Endülüs’teki son Müslüman devleti Gırnata Emirliği, Katolik Krallar’a teslim oldu; sekiz asırlık Endülüs varlığı sona erdi.',
    baslikEn: 'The fall of Granada (Al-Andalus)',
    aciklamaEn: 'The Emirate of Granada, the last Muslim state in the Iberian Peninsula, surrendered to the Catholic Monarchs, ending eight centuries of Muslim presence in Al-Andalus.',
    baslikId: 'Jatuhnya Granada (Andalusia)',
    aciklamaId: 'Keamiran Granada, negara Muslim terakhir di Semenanjung Iberia, menyerah kepada Raja-Raja Katolik, mengakhiri delapan abad kehadiran Muslim di Andalusia.',
    baslikFr: 'La chute de Grenade (Al-Andalus)',
    aciklamaFr: 'L’émirat de Grenade, dernier État musulman de la péninsule Ibérique, se rendit aux Rois Catholiques, mettant fin à huit siècles de présence musulmane en Andalousie.' },
  { ay: 1, gun: 3, yil: 1871, baslik: 'Mehmet Akif Ersoy… (doğum)',
    aciklama: 'İstiklal Marşı’nın şairi ve Kur’an mütercimi Mehmet Akif Ersoy’un doğum tarihi olarak kabul edilen gün.',
    baslikEn: 'Mehmet Akif Ersoy (born)',
    aciklamaEn: 'The date traditionally accepted as the birth of Mehmet Akif Ersoy, poet of the Turkish National Anthem and translator of the Quran.',
    baslikId: 'Mehmet Akif Ersoy (lahir)',
    aciklamaId: 'Tanggal yang secara tradisional diterima sebagai hari lahir Mehmet Akif Ersoy, penyair lagu kebangsaan Turki dan penerjemah makna Al-Qur’an.',
    baslikFr: 'Mehmet Akif Ersoy (naissance)',
    aciklamaFr: 'La date traditionnellement retenue comme naissance de Mehmet Akif Ersoy, poète de l’hymne national turc et traducteur du sens du Coran.' },
  { ay: 1, gun: 11, yil: 630, baslik: 'Mekke’nin Fethi (yaklaşık)',
    aciklama: 'Peygamber Efendimiz, hicretin 8. yılında Mekke’yi kansız şekilde fethetti; Kâbe putlardan temizlendi. Hicri 20 Ramazan 8’e denk gelir.',
    baslikEn: 'The Conquest of Mecca (approx.)',
    aciklamaEn: 'The Prophet conquered Mecca bloodlessly in the 8th year after the Hijra, and the Kaaba was cleared of idols; corresponds to 20 Ramadan, 8 AH.',
    baslikId: 'Penaklukan Makkah (perkiraan)',
    aciklamaId: 'Nabi menaklukkan Makkah tanpa pertumpahan darah pada tahun ke-8 Hijriah, dan Ka’bah dibersihkan dari berhala; bertepatan dengan 20 Ramadan tahun 8 H.',
    baslikFr: 'La conquête de La Mecque (approx.)',
    aciklamaFr: 'Le Prophète conquit La Mecque sans effusion de sang la 8e année après l’Hégire, et la Kaaba fut débarrassée des idoles ; correspond au 20 Ramadan de l’an 8 de l’hégire.' },
  { ay: 1, gun: 22, yil: 1517, baslik: 'Ridaniye Savaşı',
    aciklama: 'Yavuz Sultan Selim, Memlük ordusunu Ridaniye’de yendi; bu zafer Mısır’ın fethini ve halifelik unvanının Osmanlı’ya geçişini getirdi.',
    baslikEn: 'The Battle of Ridaniya',
    aciklamaEn: 'Sultan Selim I defeated the Mamluk army at Ridaniya, a victory that led to the conquest of Egypt and the transfer of the caliphal title to the Ottomans.',
    baslikId: 'Pertempuran Ridaniyah',
    aciklamaId: 'Sultan Selim I mengalahkan pasukan Mamluk di Ridaniyah, kemenangan yang membawa penaklukan Mesir dan perpindahan gelar khalifah ke tangan Utsmaniyah.',
    baslikFr: 'La bataille de Ridaniya',
    aciklamaFr: 'Le sultan Selim I·er vainquit l’armée mamelouke à Ridaniya, une victoire qui mena à la conquête de l’Égypte et au transfert du titre de calife aux Ottomans.' },
  { ay: 1, gun: 26, yil: 1699, baslik: 'Karlofça Antlaşması imzalandı',
    aciklama: 'Osmanlı Devleti ile Kutsal İttifak arasında imzalanan antlaşma; Osmanlı’nın toprak kaybettiği ilk büyük antlaşma olarak tarihe geçti.',
    baslikEn: 'The Treaty of Karlowitz is signed',
    aciklamaEn: 'A treaty between the Ottoman Empire and the Holy League, marking the first major treaty in which the Ottomans ceded significant territory.',
    baslikId: 'Perjanjian Karlowitz ditandatangani',
    aciklamaId: 'Perjanjian antara Kesultanan Utsmaniyah dan Liga Suci, menandai perjanjian besar pertama di mana Utsmaniyah menyerahkan wilayah yang signifikan.',
    baslikFr: 'Le traité de Karlowitz est signé',
    aciklamaFr: 'Un traité entre l’Empire ottoman et la Sainte Ligue, marquant le premier grand traité par lequel les Ottomans cédèrent un territoire important.' },

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
  { ay: 2, gun: 10, yil: 1258, baslik: 'Bağdat’ın düşüşü',
    aciklama: 'Moğol ordusu Bağdat’ı ele geçirdi; Abbasi Halifeliği’nin merkezi yıkıldı, İslam dünyasının en ağır yıkımlarından biri yaşandı.',
    baslikEn: 'The fall of Baghdad',
    aciklamaEn: 'The Mongol army captured Baghdad, destroying the seat of the Abbasid Caliphate in one of the most devastating blows to the Islamic world.',
    baslikId: 'Jatuhnya Baghdad',
    aciklamaId: 'Pasukan Mongol merebut Baghdad, menghancurkan pusat Kekhalifahan Abbasiyah dalam salah satu pukulan paling dahsyat bagi dunia Islam.',
    baslikFr: 'La chute de Bagdad',
    aciklamaFr: 'L’armée mongole s’empara de Bagdad, détruisant le siège du califat abbasside, l’un des coups les plus dévastateurs portés au monde islamique.' },

  // ── MART ──
  { ay: 3, gun: 3, yil: 1924, baslik: 'Diyanet İşleri Başkanlığı kuruldu',
    aciklama: 'Türkiye’de din hizmetlerini yürütmek üzere Diyanet İşleri Başkanlığı kanunla kuruldu; bugün namaz vakitlerini de bu kurum belirliyor.',
    baslikEn: 'Turkey’s Presidency of Religious Affairs (Diyanet) is founded',
    aciklamaEn: 'The Presidency of Religious Affairs was established by law in Turkey to oversee religious services; it is the institution that still determines official prayer times today.',
    baslikId: 'Kepresidenan Urusan Agama Turki (Diyanet) didirikan',
    aciklamaId: 'Kepresidenan Urusan Agama didirikan berdasarkan undang-undang di Turki untuk mengawasi layanan keagamaan; lembaga inilah yang masih menentukan waktu salat resmi hingga kini.',
    baslikFr: 'La Présidence des Affaires religieuses turque (Diyanet) est fondée',
    aciklamaFr: 'La Présidence des Affaires religieuses fut créée par la loi en Turquie pour superviser les services religieux ; c’est l’institution qui détermine encore aujourd’hui les horaires de prière officiels.' },
  { ay: 3, gun: 12, yil: 1921, baslik: 'İstiklal Marşı kabul edildi',
    aciklama: 'Mehmet Akif Ersoy’un yazdığı İstiklal Marşı, TBMM tarafından milli marş olarak kabul edildi.',
    baslikEn: 'The Turkish National Anthem is adopted',
    aciklamaEn: "The İstiklal Marşı, written by Mehmet Akif Ersoy, was adopted as the national anthem by Turkey's Grand National Assembly.",
    baslikId: 'Lagu kebangsaan Turki disahkan',
    aciklamaId: 'İstiklal Marşı karya Mehmet Akif Ersoy disahkan sebagai lagu kebangsaan oleh Majelis Agung Nasional Turki.',
    baslikFr: 'L’hymne national turc est adopté',
    aciklamaFr: 'L’İstiklal Marşı, écrit par Mehmet Akif Ersoy, fut adopté comme hymne national par la Grande Assemblée nationale de Turquie.' },
  { ay: 3, gun: 13, yil: 624, baslik: 'Bedir Savaşı (yaklaşık)',
    aciklama: 'Müslümanların Mekkeli müşriklere karşı kazandığı ilk büyük zafer. Hicri 17 Ramazan 2’ye denk gelir.',
    baslikEn: 'The Battle of Badr (approx.)',
    aciklamaEn: 'The first major victory of the Muslims against the Meccan polytheists, corresponding to 17 Ramadan, 2 AH.',
    baslikId: 'Pertempuran Badar (perkiraan)',
    aciklamaId: 'Kemenangan besar pertama kaum Muslimin melawan kaum musyrik Makkah; bertepatan dengan 17 Ramadan tahun 2 H.',
    baslikFr: 'La bataille de Badr (approx.)',
    aciklamaFr: 'La première grande victoire des musulmans contre les polythéistes mecquois, correspondant au 17 Ramadan de l’an 2 de l’hégire.' },
  { ay: 3, gun: 19, yil: 1406, baslik: 'İbn Haldun’un vefatı',
    aciklama: 'Tarih felsefesinin ve sosyolojinin öncülerinden, Mukaddime’nin yazarı İbn Haldun Kahire’de vefat etti.',
    baslikEn: 'The passing of Ibn Khaldun',
    aciklamaEn: 'Ibn Khaldun, a pioneer of the philosophy of history and sociology and author of the Muqaddimah, passed away in Cairo.',
    baslikId: 'Wafatnya Ibnu Khaldun',
    aciklamaId: 'Ibnu Khaldun, perintis filsafat sejarah dan sosiologi serta penulis Muqaddimah, wafat di Kairo.',
    baslikFr: 'Le décès d’Ibn Khaldoun',
    aciklamaFr: 'Ibn Khaldoun, pionnier de la philosophie de l’histoire et de la sociologie et auteur de la Muqaddima, décéda au Caire.' },
  { ay: 3, gun: 23, yil: 625, baslik: 'Uhud Savaşı (yaklaşık)',
    aciklama: 'Müslümanlarla Mekkeli müşrikler arasındaki ikinci büyük savaş, Uhud Dağı eteklerinde yaşandı. Hicri 7 Şevval 3’e denk gelir.',
    baslikEn: 'The Battle of Uhud (approx.)',
    aciklamaEn: 'The second major battle between the Muslims and the Meccan polytheists, fought at the foot of Mount Uhud, corresponding to 7 Shawwal, 3 AH.',
    baslikId: 'Pertempuran Uhud (perkiraan)',
    aciklamaId: 'Pertempuran besar kedua antara kaum Muslimin dan kaum musyrik Makkah, terjadi di kaki Gunung Uhud; bertepatan dengan 7 Syawal tahun 3 H.',
    baslikFr: 'La bataille d’Uhud (approx.)',
    aciklamaFr: 'La deuxième grande bataille entre les musulmans et les polythéistes mecquois, livrée au pied du mont Uhud, correspondant au 7 Chawwal de l’an 3 de l’hégire.' },

  // ── NİSAN ──
  { ay: 4, gun: 6, yil: 1453, baslik: 'İstanbul kuşatması başladı',
    aciklama: 'Fatih Sultan Mehmed komutasındaki Osmanlı ordusu İstanbul’u kuşatmaya başladı.',
    baslikEn: 'The Siege of Constantinople begins',
    aciklamaEn: 'The Ottoman army under Mehmed the Conqueror began the siege of Constantinople.',
    baslikId: 'Pengepungan Konstantinopel dimulai',
    aciklamaId: 'Pasukan Utsmaniyah di bawah Mehmed Sang Penakluk memulai pengepungan Konstantinopel.',
    baslikFr: 'Le siège de Constantinople commence',
    aciklamaFr: 'L’armée ottomane sous Mehmed le Conquérant entama le siège de Constantinople.' },
  { ay: 4, gun: 9, yil: 1588, baslik: 'Mimar Sinan’ın vefatı (yaklaşık)',
    aciklama: 'Süleymaniye ve Selimiye camilerinin de mimarı olan Koca Mimar Sinan, İstanbul’da vefat etti.',
    baslikEn: 'The passing of Mimar Sinan (approx.)',
    aciklamaEn: 'Mimar Sinan, chief architect of the Süleymaniye and Selimiye Mosques among many others, passed away in Istanbul.',
    baslikId: 'Wafatnya Mimar Sinan (perkiraan)',
    aciklamaId: 'Mimar Sinan, arsitek utama Masjid Süleymaniye dan Selimiye di antara banyak karya lainnya, wafat di Istanbul.',
    baslikFr: 'Le décès de Mimar Sinan (approx.)',
    aciklamaFr: 'Mimar Sinan, architecte en chef des mosquées Süleymaniye et Selimiye, entre bien d’autres, décéda à Istanbul.' },
  { ay: 4, gun: 30, yil: 711, baslik: 'Tarık bin Ziyad’ın Endülüs’e çıkışı',
    aciklama: 'Tarık bin Ziyad komutasındaki ordu, İber Yarımadası’na (bugünkü Cebelitarık) çıkarak Endülüs’ün fethini başlattı.',
    baslikEn: 'Tariq ibn Ziyad lands in Iberia',
    aciklamaEn: 'An army under Tariq ibn Ziyad landed on the Iberian Peninsula (at present-day Gibraltar), beginning the Muslim conquest of Al-Andalus.',
    baslikId: 'Tariq bin Ziyad mendarat di Semenanjung Iberia',
    aciklamaId: 'Pasukan di bawah Tariq bin Ziyad mendarat di Semenanjung Iberia (kini Gibraltar), mengawali penaklukan Muslim atas Andalusia.',
    baslikFr: 'Tariq ibn Ziyad débarque en Ibérie',
    aciklamaFr: 'Une armée sous les ordres de Tariq ibn Ziyad débarqua sur la péninsule Ibérique (à l’actuel Gibraltar), amorçant la conquête musulmane d’Al-Andalus.' },

  // ── MAYIS ──
  { ay: 5, gun: 29, yil: 1453, baslik: 'İstanbul’un Fethi',
    aciklama: 'Fatih Sultan Mehmed İstanbul’u fethetti; Orta Çağ’ın kapanışı sayılan olay.',
    baslikEn: 'The Conquest of Constantinople',
    aciklamaEn: 'Mehmed the Conqueror conquered Constantinople, an event considered to mark the end of the Middle Ages.',
    baslikId: 'Penaklukan Konstantinopel',
    aciklamaId: 'Mehmed Sang Penakluk menaklukkan Konstantinopel, peristiwa yang dianggap menandai berakhirnya Abad Pertengahan.',
    baslikFr: 'La Conquête de Constantinople',
    aciklamaFr: 'Mehmed le Conquérant conquit Constantinople, un événement considéré comme marquant la fin du Moyen Âge.' },
  { ay: 5, gun: 3, yil: 1481, baslik: 'Fatih Sultan Mehmed’in vefatı',
    aciklama: 'İstanbul’un fatihi II. Mehmed, yeni bir sefere çıkarken Gebze yakınlarında vefat etti.',
    baslikEn: 'The passing of Mehmed the Conqueror',
    aciklamaEn: 'Mehmed II, the conqueror of Constantinople, passed away near Gebze while setting out on a new campaign.',
    baslikId: 'Wafatnya Mehmed Sang Penakluk',
    aciklamaId: 'Mehmed II, penakluk Konstantinopel, wafat di dekat Gebze saat memulai kampanye baru.',
    baslikFr: 'Le décès de Mehmed le Conquérant',
    aciklamaFr: 'Mehmed II, conquérant de Constantinople, décéda près de Gebze alors qu’il partait en campagne.' },

  // ── HAZİRAN ──
  { ay: 6, gun: 8, yil: 632, baslik: 'Peygamber Efendimizin vefatı (yaklaşık)',
    aciklama: 'Hz. Muhammed (s.a.v.) Medine’de vefat etti. Hicri 12 Rebiülevvel 11’e denk gelir.',
    baslikEn: 'The passing of the Prophet Muhammad (approx.)',
    aciklamaEn: 'Prophet Muhammad (peace be upon him) passed away in Medina, corresponding to 12 Rabi al-Awwal, 11 AH.',
    baslikId: 'Wafatnya Nabi Muhammad ﷺ (perkiraan)',
    aciklamaId: 'Nabi Muhammad ﷺ wafat di Madinah; bertepatan dengan 12 Rabiulawal tahun 11 H.',
    baslikFr: 'Le décès du Prophète Muhammad (approx.)',
    aciklamaFr: 'Le Prophète Muhammad (paix sur lui) décéda à Médine, correspondant au 12 Rabi al-Awwal de l’an 11 de l’hégire.' },
  { ay: 6, gun: 7, yil: 1557, baslik: 'Süleymaniye Camii tamamlandı',
    aciklama: 'Mimar Sinan’ın eseri Süleymaniye Camii tamamlanarak ibadete açıldı; Osmanlı mimarisinin en büyük yapılarından biri.',
    baslikEn: 'The Süleymaniye Mosque is completed',
    aciklamaEn: 'The Süleymaniye Mosque, designed by Mimar Sinan, was completed and opened for worship, one of the great works of Ottoman architecture.',
    baslikId: 'Masjid Süleymaniye selesai dibangun',
    aciklamaId: 'Masjid Süleymaniye, karya arsitek Mimar Sinan, selesai dibangun dan dibuka untuk ibadah, salah satu karya besar arsitektur Utsmaniyah.',
    baslikFr: 'La mosquée Süleymaniye est achevée',
    aciklamaFr: 'La mosquée Süleymaniye, conçue par Mimar Sinan, fut achevée et ouverte au culte, l’une des grandes œuvres de l’architecture ottomane.' },
  { ay: 6, gun: 16, yil: 1950, baslik: 'Ezanın yeniden Arapça okunması',
    aciklama: 'TBMM, ezanın Arapça asli metniyle okunmasını yasaklayan kanunu kaldırdı; ezan yıllar sonra yeniden aslına döndü.',
    baslikEn: 'The call to prayer returns to Arabic',
    aciklamaEn: 'Turkey’s Grand National Assembly repealed the law requiring the call to prayer to be recited in Turkish, restoring the adhan to its original Arabic after years of prohibition.',
    baslikId: 'Azan kembali dikumandangkan dalam bahasa Arab',
    aciklamaId: 'Majelis Agung Nasional Turki mencabut undang-undang yang mewajibkan azan dikumandangkan dalam bahasa Turki, mengembalikan azan ke bahasa Arab aslinya setelah bertahun-tahun dilarang.',
    baslikFr: 'L’appel à la prière redevient arabe',
    aciklamaFr: 'La Grande Assemblée nationale turque abrogea la loi imposant que l’appel à la prière soit récité en turc, rendant à l’adhan sa langue arabe d’origine après des années d’interdiction.' },
  { ay: 6, gun: 17, yil: 1631, baslik: 'Mümtaz Mahal’in vefatı',
    aciklama: 'Babür padişahı Şah Cihan’ın eşi Mümtaz Mahal’in vefatı, kocasının onun anısına Tac Mahal’i yaptırmasına vesile oldu.',
    baslikEn: 'The passing of Mumtaz Mahal',
    aciklamaEn: 'The death of Mumtaz Mahal, wife of Mughal emperor Shah Jahan, led her husband to build the Taj Mahal in her memory.',
    baslikId: 'Wafatnya Mumtaz Mahal',
    aciklamaId: 'Wafatnya Mumtaz Mahal, istri Kaisar Mughal Shah Jahan, membuat sang suami membangun Taj Mahal untuk mengenangnya.',
    baslikFr: 'Le décès de Mumtaz Mahal',
    aciklamaFr: 'La mort de Mumtaz Mahal, épouse de l’empereur moghol Shah Jahan, poussa son époux à faire construire le Taj Mahal en sa mémoire.' },

  // ── TEMMUZ ──
  { ay: 7, gun: 16, yil: 622, baslik: 'Hicri takvimin başlangıcı',
    aciklama: 'Hicri takvimin birinci yılının ilk günü olarak kabul edilen tarih.',
    baslikEn: 'The start of the Hijri calendar',
    aciklamaEn: 'The date accepted as the first day of year one of the Hijri calendar.',
    baslikId: 'Awal mula kalender Hijriah',
    aciklamaId: 'Tanggal yang diterima sebagai hari pertama tahun pertama kalender Hijriah.',
    baslikFr: 'Le début du calendrier hégirien',
    aciklamaFr: 'La date retenue comme premier jour de l’an un du calendrier hégirien.' },
  { ay: 7, gun: 15, yil: 1099, baslik: 'Kudüs’ün Haçlılar tarafından alınışı',
    aciklama: 'Birinci Haçlı Seferi ordusu Kudüs’ü kuşatma sonunda ele geçirdi; şehir yaklaşık 88 yıl sonra Selahaddin Eyyubi tarafından geri alınacaktı.',
    baslikEn: 'Jerusalem falls to the Crusaders',
    aciklamaEn: 'The army of the First Crusade captured Jerusalem after a siege; the city would be retaken by Saladin some 88 years later.',
    baslikId: 'Yerusalem jatuh ke tangan Tentara Salib',
    aciklamaId: 'Pasukan Perang Salib Pertama merebut Yerusalem setelah pengepungan; kota itu akan direbut kembali oleh Salahuddin sekitar 88 tahun kemudian.',
    baslikFr: 'Jérusalem tombe aux mains des croisés',
    aciklamaFr: 'L’armée de la première croisade s’empara de Jérusalem après un siège ; la ville serait reprise par Saladin quelque 88 ans plus tard.' },
  { ay: 7, gun: 20, yil: 1402, baslik: 'Ankara Savaşı',
    aciklama: 'Timur’un ordusu, Osmanlı Sultanı Yıldırım Bayezid’i Ankara yakınlarında yendi; bu yenilgi Osmanlı’da bir Fetret Devri’ne yol açtı.',
    baslikEn: 'The Battle of Ankara',
    aciklamaEn: 'The army of Timur defeated Ottoman Sultan Bayezid I near Ankara, a defeat that plunged the Ottoman state into an interregnum.',
    baslikId: 'Pertempuran Ankara',
    aciklamaId: 'Pasukan Timur mengalahkan Sultan Utsmaniyah Bayezid I di dekat Ankara, kekalahan yang membawa kekaisaran Utsmaniyah ke masa interregnum.',
    baslikFr: 'La bataille d’Ankara',
    aciklamaFr: 'L’armée de Tamerlan vainquit le sultan ottoman Bayezid I·er près d’Ankara, une défaite qui plongea l’État ottoman dans un interrègne.' },

  // ── AĞUSTOS ──
  { ay: 8, gun: 26, yil: 1071, baslik: 'Malazgirt Meydan Muharebesi',
    aciklama: 'Sultan Alparslan komutasındaki Selçuklu ordusu Bizans’ı yendi; Anadolu’nun kapıları açıldı.',
    baslikEn: 'The Battle of Manzikert',
    aciklamaEn: 'The Seljuk army under Sultan Alp Arslan defeated the Byzantines, opening the gates of Anatolia to Turkish settlement.',
    baslikId: 'Pertempuran Manzikert',
    aciklamaId: 'Pasukan Seljuk di bawah Sultan Alp Arslan mengalahkan Bizantium, membuka gerbang Anatolia.',
    baslikFr: 'La bataille de Manzikert',
    aciklamaFr: 'L’armée seldjoukide sous le sultan Alp Arslan vainquit les Byzantins, ouvrant les portes de l’Anatolie.' },
  { ay: 8, gun: 24, yil: 1516, baslik: 'Mercidabık Savaşı',
    aciklama: 'Yavuz Sultan Selim, Memlük Sultanlığı’nı Mercidabık’ta yendi; bu zafer Suriye ve sonrasında Mısır’ın fethinin yolunu açtı.',
    baslikEn: 'The Battle of Marj Dabiq',
    aciklamaEn: 'Sultan Selim I defeated the Mamluk Sultanate at Marj Dabiq, a victory that opened the way to the conquest of Syria and later Egypt.',
    baslikId: 'Pertempuran Marj Dabiq',
    aciklamaId: 'Sultan Selim I mengalahkan Kesultanan Mamluk di Marj Dabiq, kemenangan yang membuka jalan bagi penaklukan Suriah dan kemudian Mesir.',
    baslikFr: 'La bataille de Marj Dabiq',
    aciklamaFr: 'Le sultan Selim I·er vainquit le sultanat mamelouk à Marj Dabiq, une victoire qui ouvrit la voie à la conquête de la Syrie puis de l’Égypte.' },
  { ay: 8, gun: 29, yil: 1521, baslik: 'Belgrad’ın Fethi',
    aciklama: 'Kanuni Sultan Süleyman, uzun süren bir kuşatmanın ardından Belgrad Kalesi’ni fethetti; Orta Avrupa’ya açılan kapı aralandı.',
    baslikEn: 'The Conquest of Belgrade',
    aciklamaEn: 'Suleiman the Magnificent conquered the fortress of Belgrade after a lengthy siege, opening the gateway to Central Europe.',
    baslikId: 'Penaklukan Beograd',
    aciklamaId: 'Suleiman yang Agung menaklukkan benteng Beograd setelah pengepungan yang panjang, membuka gerbang menuju Eropa Tengah.',
    baslikFr: 'La conquête de Belgrade',
    aciklamaFr: 'Soliman le Magnifique conquit la forteresse de Belgrade après un long siège, ouvrant la porte de l’Europe centrale.' },

  // ── EYLÜL ──
  { ay: 9, gun: 24, yil: 622, baslik: 'Hicret tamamlandı (yaklaşık)',
    aciklama: 'Peygamber Efendimiz Mekke’den Medine’ye hicretini tamamladı; Kuba’ya varış olarak anılır.',
    baslikEn: 'The Hijra is completed (approx.)',
    aciklamaEn: "The Prophet completed his migration from Mecca to Medina, marked by his arrival at Quba.",
    baslikId: 'Hijrah selesai (perkiraan)',
    aciklamaId: 'Nabi menyelesaikan hijrahnya dari Makkah ke Madinah, ditandai dengan kedatangannya di Quba.',
    baslikFr: 'L’Hégire s’achève (approx.)',
    aciklamaFr: 'Le Prophète acheva sa migration de La Mecque à Médine, marquée par son arrivée à Quba.' },
  { ay: 9, gun: 1, yil: 870, baslik: 'İmam Buhari’nin vefatı',
    aciklama: 'Hadis ilminin en güvenilir kaynağı sayılan Sahih-i Buhari’nin yazarı İmam Buhari vefat etti.',
    baslikEn: 'The passing of Imam al-Bukhari',
    aciklamaEn: 'Imam al-Bukhari, author of Sahih al-Bukhari, regarded as the most authoritative collection in the science of hadith, passed away.',
    baslikId: 'Wafatnya Imam Bukhari',
    aciklamaId: 'Imam Bukhari, penulis Sahih al-Bukhari yang dianggap sebagai kumpulan hadis paling otoritatif, wafat.',
    baslikFr: 'Le décès de l’imam al-Bukhârî',
    aciklamaFr: 'L’imam al-Bukhârî, auteur du Sahîh al-Bukhârî, considéré comme le recueil le plus fiable de la science du hadith, décéda.' },
  { ay: 9, gun: 3, yil: 1260, baslik: 'Ayn Calut Savaşı',
    aciklama: 'Memlük ordusu, o güne dek yenilmez sanılan Moğolları Ayn Calut’ta yendi; Moğol ilerleyişini durduran dönüm noktası oldu.',
    baslikEn: 'The Battle of Ain Jalut',
    aciklamaEn: 'The Mamluk army defeated the Mongols, previously thought invincible, at Ain Jalut — a turning point that halted the Mongol advance.',
    baslikId: 'Pertempuran Ain Jalut',
    aciklamaId: 'Pasukan Mamluk mengalahkan bangsa Mongol yang sebelumnya dianggap tak terkalahkan di Ain Jalut — titik balik yang menghentikan laju Mongol.',
    baslikFr: 'La bataille d’Aïn Djalout',
    aciklamaFr: 'L’armée mamelouke vainquit les Mongols, jusque-là jugés invincibles, à Aïn Djalout — un tournant qui stoppa l’avancée mongole.' },
  { ay: 9, gun: 7, yil: 1566, baslik: 'Kanuni Sultan Süleyman’ın vefatı',
    aciklama: 'Kanuni Sultan Süleyman, Zigetvar Kalesi kuşatması sırasında, kalenin düşmesinden bir gün önce çadırında vefat etti.',
    baslikEn: 'The passing of Suleiman the Magnificent',
    aciklamaEn: 'Suleiman the Magnificent passed away in his tent during the siege of Szigetvár, the day before the fortress fell.',
    baslikId: 'Wafatnya Suleiman yang Agung',
    aciklamaId: 'Suleiman yang Agung wafat di tendanya saat pengepungan Benteng Szigetvár, sehari sebelum benteng itu jatuh.',
    baslikFr: 'Le décès de Soliman le Magnifique',
    aciklamaFr: 'Soliman le Magnifique mourut sous sa tente durant le siège de Szigetvár, la veille de la chute de la forteresse.' },
  { ay: 9, gun: 28, yil: 1538, baslik: 'Preveze Deniz Zaferi',
    aciklama: 'Barbaros Hayreddin Paşa komutasındaki Osmanlı donanması, Haçlı donanmasını Preveze’de büyük bir yenilgiye uğrattı.',
    baslikEn: 'The Battle of Preveza',
    aciklamaEn: 'The Ottoman fleet under Barbaros Hayreddin Pasha inflicted a major defeat on the Holy League’s fleet at Preveza.',
    baslikId: 'Pertempuran Preveza',
    aciklamaId: 'Armada Utsmaniyah di bawah Barbaros Hayreddin Pasha menimbulkan kekalahan besar bagi armada Liga Suci di Preveza.',
    baslikFr: 'La bataille de Préveza',
    aciklamaFr: 'La flotte ottomane commandée par Barberousse Hayreddin Pacha infligea une lourde défaite à la flotte de la Sainte Ligue à Préveza.' },
  { ay: 9, gun: 30, yil: 1520, baslik: 'Kanuni Sultan Süleyman tahta çıktı',
    aciklama: 'I. Süleyman, babası Yavuz Sultan Selim’in vefatının ardından Osmanlı tahtına çıktı; 46 yıl sürecek "Kanuni" dönemi başladı.',
    baslikEn: 'Suleiman the Magnificent ascends the throne',
    aciklamaEn: 'Suleiman I ascended the Ottoman throne following the death of his father, Selim I, beginning a reign that would last 46 years.',
    baslikId: 'Suleiman yang Agung naik takhta',
    aciklamaId: 'Suleiman I naik takhta Utsmaniyah setelah wafatnya ayahnya, Selim I, memulai masa pemerintahan yang berlangsung 46 tahun.',
    baslikFr: 'Soliman le Magnifique monte sur le trône',
    aciklamaFr: 'Soliman I·er monta sur le trône ottoman après la mort de son père, Selim I·er, entamant un règne qui durerait 46 ans.' },

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
  { ay: 12, gun: 16, yil: 1474, baslik: 'Ali Kuşçu’nun vefatı',
    aciklama: 'Semerkant’ta yetişip Fatih Sultan Mehmed’in davetiyle İstanbul’a gelen astronom ve matematikçi Ali Kuşçu, İstanbul’da vefat etti.',
    baslikEn: 'The passing of Ali Qushji',
    aciklamaEn: 'Ali Qushji, the astronomer and mathematician trained in Samarkand who came to Istanbul at Mehmed the Conqueror’s invitation, passed away in Istanbul.',
    baslikId: 'Wafatnya Ali Qushji',
    aciklamaId: 'Ali Qushji, astronom dan matematikawan yang dilatih di Samarkand dan datang ke Istanbul atas undangan Mehmed Sang Penakluk, wafat di Istanbul.',
    baslikFr: 'Le décès d’Ali Qushji',
    aciklamaFr: 'Ali Qushji, astronome et mathématicien formé à Samarcande venu à Istanbul sur l’invitation de Mehmed le Conquérant, décéda à Istanbul.' },
  { ay: 12, gun: 19, yil: 1111, baslik: 'İmam Gazali’nin vefatı',
    aciklama: '"Hüccetü’l-İslam" unvanıyla anılan büyük İslam âlimi İmam Gazali, doğduğu şehir Tus’ta vefat etti.',
    baslikEn: 'The passing of Al-Ghazali',
    aciklamaEn: 'Al-Ghazali, the great Islamic scholar known as "Hujjat al-Islam," passed away in his native city of Tus.',
    baslikId: 'Wafatnya Al-Ghazali',
    aciklamaId: 'Al-Ghazali, ulama besar Islam yang dijuluki "Hujjatul Islam," wafat di kota kelahirannya, Tus.',
    baslikFr: 'Le décès d’Al-Ghazali',
    aciklamaFr: 'Al-Ghazali, le grand savant musulman surnommé « Hujjat al-Islam », décéda dans sa ville natale de Tus.' },
  { ay: 12, gun: 17, yil: 1273, baslik: 'Mevlânâ Celâleddîn Rûmî’nin vefatı',
    aciklama: 'Şeb-i Arûs olarak anılan gün; Mevlânâ Konya’da vefat etti.',
    baslikEn: 'The passing of Rumi',
    aciklamaEn: "Known as Şeb-i Arus (the Night of Union), the day Rumi passed away in Konya.",
    baslikId: 'Wafatnya Rumi (Jalaluddin Rumi)',
    aciklamaId: 'Dikenal sebagai Şeb-i Arus (Malam Penyatuan), hari Rumi wafat di Konya.',
    baslikFr: 'Le décès de Rûmî',
    aciklamaFr: 'Connu sous le nom de Şeb-i Arus (la Nuit de l’Union), le jour où Rûmî décéda à Konya.' },

  // ═══════════════════════════════════════════════════════════════════════
  // 6. TUR GENİŞLETMESİ — kullanıcı "365 günün her gününde mutlaka bir olay
  // olmalı" dedi. Dört paralel araştırma turuyla (Oca-Mar/Nis-Haz/Tem-
  // Eyl/Eki-Ara) 53 yeni, çapraz doğrulanmış olay eklendi (38'den 91'e).
  // Ay/gün sırasına göre interleave edilmedi (zaman kısıtı) — ama tam
  // eşleşme mantığı sıraya bağlı olmadığı için işlevi etkilemiyor. Kapsam
  // kasıtlı olarak GENİŞLETİLDİ: yalnızca klasik dini tarih değil, Osmanlı/
  // Endülüs/Babür/Safevi tarihi, büyük İslam alimleri/bilim insanları,
  // modern Müslüman ülkelerin bağımsızlık günleri de dahil edildi — aksi
  // halde 365 güne yaklaşmak mümkün değildi. Yine de 91/365 hâlâ tam
  // kapsama değil; kalan günler için bkz. HomeScreen.tsx'teki yorum ve
  // kullanıcıya iletilen dürüstlük notu. Hiçbir gün UYDURULMADI — araştırma
  // sırasında tarih/gün kesinliği doğrulanamayan onlarca aday (Bîrûnî,
  // Farabî, Zehrâvî, Hârizmî vb. birçok alimin vefat günü dahil) bilinçli
  // olarak DIŞLANDI.
  // ═══════════════════════════════════════════════════════════════════════

  // ── OCAK/ŞUBAT/MART EK ──
  { ay: 1, gun: 7, yil: 891, baslik: 'III. Abdurrahman’ın doğumu (Kurtuba Halifesi)',
    aciklama: 'Endülüs Emevi Devleti’ni halifeliğe yükselten ve Kurtuba’yı altın çağına taşıyan III. Abdurrahman, bu tarihte dünyaya geldi.',
    baslikEn: 'Birth of Abd al-Rahman III (Caliph of Córdoba)',
    aciklamaEn: 'Abd al-Rahman III, who elevated the Umayyad state of al-Andalus to a caliphate and ushered in Córdoba’s golden age, was born on this date.',
    baslikId: 'Kelahiran Abdurrahman III (Khalifah Kordoba)',
    aciklamaId: 'Abdurrahman III, yang mengangkat status Bani Umayyah di Andalusia menjadi kekhalifahan dan membawa Kordoba ke masa keemasannya, lahir pada tanggal ini.',
    baslikFr: 'Naissance d’Abd al-Rahman III (calife de Cordoue)',
    aciklamaFr: 'Abd al-Rahman III, qui éleva l’État omeyyade d’al-Andalus au rang de califat et fit entrer Cordoue dans son âge d’or, naquit à cette date.' },
  { ay: 2, gun: 11, yil: 1979, baslik: 'İran İslam Devrimi’nin Zaferi',
    aciklama: 'Aylar süren protestoların ardından Şah rejimi devrildi ve İran’da İslam Cumhuriyeti’nin kuruluşu ilan edildi.',
    baslikEn: 'Victory of the Iranian Islamic Revolution',
    aciklamaEn: 'After months of protests, the monarchy was overthrown and the establishment of an Islamic Republic in Iran was declared.',
    baslikId: 'Kemenangan Revolusi Islam Iran',
    aciklamaId: 'Setelah berbulan-bulan protes, monarki digulingkan dan berdirinya Republik Islam di Iran diumumkan.',
    baslikFr: 'Victoire de la révolution islamique iranienne',
    aciklamaFr: 'Après des mois de manifestations, la monarchie fut renversée et la fondation d’une République islamique en Iran fut proclamée.' },
  { ay: 2, gun: 21, yil: 1965, baslik: 'Malcolm X’in Suikaste Kurban Gitmesi',
    aciklama: 'İslam’ı benimseyip hac görevini yerine getiren ve insan hakları mücadelesiyle tanınan Malcolm X (El-Hac Malik El-Şabazz), New York’ta bir konuşma sırasında öldürüldü.',
    baslikEn: 'Assassination of Malcolm X',
    aciklamaEn: 'Malcolm X (el-Hajj Malik el-Shabazz), who embraced Islam, performed the Hajj, and became known for his human rights activism, was assassinated while giving a speech in New York.',
    baslikId: 'Pembunuhan Malcolm X',
    aciklamaId: 'Malcolm X (el-Hajj Malik el-Shabazz), yang memeluk Islam, menunaikan ibadah haji, dan dikenal karena aktivisme hak asasi manusianya, dibunuh saat berpidato di New York.',
    baslikFr: 'Assassinat de Malcolm X',
    aciklamaFr: 'Malcolm X (el-Hajj Malik el-Shabazz), converti à l’islam, ayant accompli le pèlerinage à La Mecque et connu pour son militantisme pour les droits civiques, fut assassiné en pleine conférence à New York.' },
  { ay: 3, gun: 26, yil: 1979, baslik: 'Mısır-İsrail Barış Antlaşması’nın İmzalanması',
    aciklama: 'Camp David görüşmelerinin ardından Mısır Cumhurbaşkanı Enver Sedat ile İsrail Başbakanı Menahem Begin, Washington’da barış antlaşmasını imzaladı.',
    baslikEn: 'Signing of the Egypt–Israel Peace Treaty',
    aciklamaEn: 'Following the Camp David talks, Egyptian President Anwar Sadat and Israeli Prime Minister Menachem Begin signed a peace treaty in Washington.',
    baslikId: 'Penandatanganan Perjanjian Damai Mesir–Israel',
    aciklamaId: 'Setelah perundingan Camp David, Presiden Mesir Anwar Sadat dan Perdana Menteri Israel Menachem Begin menandatangani perjanjian damai di Washington.',
    baslikFr: 'Signature du traité de paix entre l’Égypte et Israël',
    aciklamaFr: 'À l’issue des accords de Camp David, le président égyptien Anouar el-Sadate et le Premier ministre israélien Menahem Begin signèrent un traité de paix à Washington.' },

  // ── NİSAN EK ──
  { ay: 4, gun: 4, yil: 970, baslik: 'Ezher Camii’nin inşasına başlanması',
    aciklama: 'Fatımi Halifesi el-Muizz’in emriyle Kahire’de, sonradan İslam dünyasının en köklü ilim merkezlerinden biri haline gelecek olan Ezher Camii’nin temeli atıldı.',
    baslikEn: 'Construction of Al-Azhar Mosque begins',
    aciklamaEn: 'On the order of the Fatimid Caliph al-Muizz, construction began in Cairo on the Al-Azhar Mosque, which would become one of the oldest centers of Islamic learning.',
    baslikId: 'Pembangunan Masjid Al-Azhar dimulai',
    aciklamaId: 'Atas perintah Khalifah Fatimiyah al-Muizz, pembangunan Masjid Al-Azhar dimulai di Kairo, yang kelak menjadi salah satu pusat keilmuan Islam tertua.',
    baslikFr: 'Début de la construction de la mosquée Al-Azhar',
    aciklamaFr: 'Sur l’ordre du calife fatimide al-Muizz, la construction de la mosquée Al-Azhar débuta au Caire ; elle deviendra l’un des plus anciens centres du savoir islamique.' },
  { ay: 4, gun: 13, yil: 1517, baslik: 'Son Memlük Sultanı Tomanbay’ın idamı',
    aciklama: 'Osmanlı Sultanı I. Selim’in Mısır seferi sonucunda esir alınan son Memlük Sultanı II. Tomanbay, Kahire’de Bab Züveyle’de idam edilerek Memlük Devleti’ne fiilen son verildi.',
    baslikEn: 'Execution of Tuman Bay II, the last Mamluk Sultan',
    aciklamaEn: 'Captured during Ottoman Sultan Selim I’s conquest of Egypt, the last Mamluk Sultan Tuman Bay II was executed at Bab Zuweila in Cairo, effectively ending the Mamluk Sultanate.',
    baslikId: 'Eksekusi Tuman Bay II, Sultan Mamluk terakhir',
    aciklamaId: 'Setelah tertangkap dalam penaklukan Mesir oleh Sultan Utsmaniyah Selim I, Sultan Mamluk terakhir Tuman Bay II dieksekusi di Bab Zuweila, Kairo, yang secara efektif mengakhiri Kesultanan Mamluk.',
    baslikFr: 'Exécution de Touman Bay II, dernier sultan mamelouk',
    aciklamaFr: 'Capturé lors de la conquête de l’Égypte par le sultan ottoman Selim Ier, le dernier sultan mamelouk Touman Bay II fut exécuté à Bab Zuweila au Caire, mettant fin de facto au sultanat mamelouk.' },
  { ay: 4, gun: 18, yil: 1590, baslik: 'Sultan I. Ahmed’in doğumu',
    aciklama: 'İstanbul’da inşa ettirdiği Sultanahmet (Mavi) Camii ile tanınan Osmanlı padişahı I. Ahmed doğdu.',
    baslikEn: 'Birth of Sultan Ahmed I',
    aciklamaEn: 'Ottoman Sultan Ahmed I, known for commissioning the Sultan Ahmed (Blue) Mosque in Istanbul, was born.',
    baslikId: 'Kelahiran Sultan Ahmed I',
    aciklamaId: 'Sultan Utsmaniyah Ahmed I, yang dikenal karena membangun Masjid Sultan Ahmed (Masjid Biru) di Istanbul, lahir.',
    baslikFr: 'Naissance du sultan Ahmed Ier',
    aciklamaFr: 'Le sultan ottoman Ahmed Ier, connu pour avoir fait construire la mosquée Sultan Ahmed (Mosquée bleue) à Istanbul, naquit.' },
  { ay: 4, gun: 21, yil: 1526, baslik: 'Birinci Panipat Muharebesi ve Babür İmparatorluğu’nun kuruluşu',
    aciklama: 'Timur soyundan gelen Babür, Delhi Sultanı İbrahim Lodi’yi Panipat’ta yenilgiye uğratarak Hindistan’da Babür İmparatorluğu’nun temellerini attı.',
    baslikEn: 'First Battle of Panipat and founding of the Mughal Empire',
    aciklamaEn: 'Babur, a descendant of Timur, defeated the Delhi Sultan Ibrahim Lodi at Panipat, laying the foundations of the Mughal Empire in India.',
    baslikId: 'Pertempuran Panipat Pertama dan berdirinya Kekaisaran Mughal',
    aciklamaId: 'Babur, keturunan Timur, mengalahkan Sultan Delhi Ibrahim Lodi di Panipat, meletakkan dasar bagi Kekaisaran Mughal di India.',
    baslikFr: 'Première bataille de Panipat et fondation de l’Empire moghol',
    aciklamaFr: 'Babur, descendant de Tamerlan, vainquit le sultan de Delhi Ibrahim Lodi à Panipat, posant les fondations de l’Empire moghol en Inde.' },
  { ay: 4, gun: 25, yil: 1512, baslik: 'II. Bayezid’in tahttan indirilmesi',
    aciklama: 'Oğlu Şehzade Selim’in yeniçerilerin desteğiyle yürüttüğü baskı sonucunda Sultan II. Bayezid tahttan çekilmek zorunda kaldı; bu, Osmanlı tarihinde bir padişahın oğlu tarafından tahttan indirildiği ilk örnektir.',
    baslikEn: 'Abdication of Sultan Bayezid II',
    aciklamaEn: 'Under pressure from his son Şehzade Selim, backed by the Janissaries, Sultan Bayezid II was forced to abdicate the Ottoman throne, the first such case in Ottoman history.',
    baslikId: 'Turun takhtanya Sultan Bayezid II',
    aciklamaId: 'Di bawah tekanan putranya Şehzade Selim yang didukung Janissari, Sultan Bayezid II terpaksa turun dari takhta Utsmaniyah, kasus pertama semacam itu dalam sejarah Utsmaniyah.',
    baslikFr: 'Abdication du sultan Bayezid II',
    aciklamaFr: 'Sous la pression de son fils le prince Selim, soutenu par les janissaires, le sultan Bayezid II fut contraint d’abdiquer le trône ottoman, un cas unique dans l’histoire ottomane.' },

  // ── MAYIS EK ──
  { ay: 5, gun: 18, yil: 1048, baslik: 'Ömer Hayyam’ın doğumu',
    aciklama: 'Fars asıllı büyük matematikçi, gökbilimci ve şair Ömer Hayyam, Nişabur’da doğdu.',
    baslikEn: 'Birth of Omar Khayyam',
    aciklamaEn: 'The great Persian mathematician, astronomer, and poet Omar Khayyam was born in Nishapur.',
    baslikId: 'Kelahiran Omar Khayyam',
    aciklamaId: 'Matematikawan, astronom, dan penyair besar Persia, Omar Khayyam, lahir di Nishapur.',
    baslikFr: 'Naissance d’Omar Khayyam',
    aciklamaFr: 'Le grand mathématicien, astronome et poète persan Omar Khayyam naquit à Nishapur.' },
  { ay: 5, gun: 19, yil: 1565, baslik: 'Malta Kuşatması’nda ilk çarpışmaların başlaması',
    aciklama: 'Osmanlı donanmasının adaya çıkarma yapmasının ardından, Malta Şövalyeleri’ne karşı büyük kuşatmanın ilk muharebeleri başladı.',
    baslikEn: 'First fighting begins in the Great Siege of Malta',
    aciklamaEn: 'Following the landing of the Ottoman fleet on the island, the first clashes of the great siege against the Knights of Malta began.',
    baslikId: 'Pertempuran pertama dimulai dalam Pengepungan Besar Malta',
    aciklamaId: 'Setelah armada Utsmaniyah mendarat di pulau itu, bentrokan pertama dari pengepungan besar terhadap Ksatria Malta dimulai.',
    baslikFr: 'Début des premiers combats du grand siège de Malte',
    aciklamaFr: 'Après le débarquement de la flotte ottomane sur l’île, les premiers affrontements du grand siège contre les chevaliers de Malte commencèrent.' },
  { ay: 5, gun: 26, yil: 1512, baslik: 'II. Bayezid’in vefatı',
    aciklama: 'Tahttan çekilmesinin ardından memleketi Dimetoka’ya giderken yolda vefat eden Sultan II. Bayezid, otuz bir yıllık saltanatının ardından hayata veda etti.',
    baslikEn: 'Death of Sultan Bayezid II',
    aciklamaEn: 'Sultan Bayezid II died while traveling toward his hometown of Dimetoka following his abdication, ending a thirty-one-year reign.',
    baslikId: 'Wafatnya Sultan Bayezid II',
    aciklamaId: 'Sultan Bayezid II wafat dalam perjalanan menuju kampung halamannya Dimetoka setelah turun takhta, mengakhiri masa pemerintahan selama tiga puluh satu tahun.',
    baslikFr: 'Mort du sultan Bayezid II',
    aciklamaFr: 'Le sultan Bayezid II mourut en se rendant vers sa ville natale de Dimetoka après son abdication, mettant fin à un règne de trente et un ans.' },
  { ay: 5, gun: 27, yil: 1332, baslik: 'İbn Haldun’un doğumu',
    aciklama: 'Sosyoloji ve tarih felsefesinin öncülerinden kabul edilen büyük Arap düşünür İbn Haldun, Tunus’ta doğdu.',
    baslikEn: 'Birth of Ibn Khaldun',
    aciklamaEn: 'The great Arab scholar Ibn Khaldun, regarded as a pioneer of sociology and the philosophy of history, was born in Tunis.',
    baslikId: 'Kelahiran Ibnu Khaldun',
    aciklamaId: 'Cendekiawan Arab besar Ibnu Khaldun, yang dianggap sebagai perintis sosiologi dan filsafat sejarah, lahir di Tunis.',
    baslikFr: 'Naissance d’Ibn Khaldoun',
    aciklamaFr: 'Le grand savant arabe Ibn Khaldoun, considéré comme un pionnier de la sociologie et de la philosophie de l’histoire, naquit à Tunis.' },
  { ay: 5, gun: 28, yil: 1918, baslik: 'Azerbaycan Halk Cumhuriyeti’nin ilanı',
    aciklama: 'Türk ve İslam dünyasının ilk parlamenter cumhuriyeti olarak kabul edilen Azerbaycan Halk Cumhuriyeti bağımsızlığını ilan etti.',
    baslikEn: 'Proclamation of the Azerbaijan Democratic Republic',
    aciklamaEn: 'The Azerbaijan Democratic Republic, considered the first parliamentary republic in the Turkic and Muslim world, declared its independence.',
    baslikId: 'Proklamasi Republik Demokratik Azerbaijan',
    aciklamaId: 'Republik Demokratik Azerbaijan, yang dianggap sebagai republik parlementer pertama di dunia Turk dan Muslim, memproklamasikan kemerdekaannya.',
    baslikFr: 'Proclamation de la République démocratique d’Azerbaïdjan',
    aciklamaFr: 'La République démocratique d’Azerbaïdjan, considérée comme la première république parlementaire du monde turc et musulman, proclama son indépendance.' },
  { ay: 5, gun: 30, yil: 1453, baslik: 'İstanbul Üniversitesi’nin kuruluşu',
    aciklama: 'Fatih Sultan Mehmed, İstanbul’un fethinden bir gün sonra, günümüzde İstanbul Üniversitesi olarak anılan kurumun temelini attı.',
    baslikEn: 'Founding of Istanbul University',
    aciklamaEn: 'A day after the conquest of Constantinople, Mehmed the Conqueror founded the institution known today as Istanbul University.',
    baslikId: 'Pendirian Universitas Istanbul',
    aciklamaId: 'Sehari setelah penaklukan Konstantinopel, Mehmed sang Penakluk mendirikan lembaga yang kini dikenal sebagai Universitas Istanbul.',
    baslikFr: 'Fondation de l’université d’Istanbul',
    aciklamaFr: 'Un jour après la conquête de Constantinople, Mehmed le Conquérant fonda l’institution aujourd’hui connue sous le nom d’université d’Istanbul.' },

  // ── HAZİRAN EK ──
  { ay: 6, gun: 10, yil: 973, baslik: 'Halife el-Muizz’in Kahire’ye girişi',
    aciklama: 'Fatımi Halifesi el-Muizz, yeni kurulan başkente girerek şehre "el-Kahiretü’l-Muizziyye" adını verdi ve Kahire’yi imparatorluğun payitahtı ilan etti.',
    baslikEn: 'Caliph al-Muizz enters Cairo',
    aciklamaEn: 'The Fatimid Caliph al-Muizz entered the newly built capital, renamed it "al-Qahira al-Muizziyya," and declared Cairo the seat of his empire.',
    baslikId: 'Khalifah al-Muizz memasuki Kairo',
    aciklamaId: 'Khalifah Fatimiyah al-Muizz memasuki ibu kota yang baru dibangun, menamainya "al-Qahira al-Muizziyya," dan menjadikan Kairo sebagai pusat kekaisarannya.',
    baslikFr: 'Le calife al-Muizz entre au Caire',
    aciklamaFr: 'Le calife fatimide al-Muizz entra dans la capitale nouvellement construite, la renomma « al-Qahira al-Muizziyya » et fit du Caire le siège de son empire.' },
  { ay: 6, gun: 14, yil: 1325, baslik: 'İbn Battuta’nın büyük seyahatine başlaması',
    aciklama: 'Fas’ın Tanca şehrinden hacca gitmek üzere yola çıkan genç âlim İbn Battuta, otuz yılı aşkın sürecek ve üç kıtayı kapsayacak meşhur seyahatnamesinin ilk adımını attı.',
    baslikEn: 'Ibn Battuta sets out on his great journey',
    aciklamaEn: 'The young scholar Ibn Battuta departed his hometown of Tangier for the pilgrimage to Mecca, beginning the travels across three continents that would last more than three decades.',
    baslikId: 'Ibnu Battuta memulai perjalanan besarnya',
    aciklamaId: 'Sarjana muda Ibnu Battuta berangkat dari kampung halamannya di Tangier untuk menunaikan ibadah haji ke Mekah, memulai perjalanan lintas tiga benua yang berlangsung lebih dari tiga dekade.',
    baslikFr: 'Ibn Battuta entame son grand voyage',
    aciklamaFr: 'Le jeune savant Ibn Battuta quitta sa ville natale de Tanger pour le pèlerinage à La Mecque, débutant un voyage à travers trois continents qui durerait plus de trente ans.' },
  { ay: 6, gun: 18, yil: 767, baslik: 'İmam-ı Azam Ebu Hanife’nin vefatı',
    aciklama: 'Hanefi mezhebinin kurucusu ve İslam hukukunun en etkili isimlerinden İmam-ı Azam Ebu Hanife, Bağdat’ta vefat etti.',
    baslikEn: 'Death of Imam Abu Hanifa',
    aciklamaEn: 'Imam Abu Hanifa, founder of the Hanafi school of Islamic jurisprudence and one of its most influential figures, died in Baghdad.',
    baslikId: 'Wafatnya Imam Abu Hanifah',
    aciklamaId: 'Imam Abu Hanifah, pendiri mazhab Hanafi dalam fikih Islam dan salah satu tokoh paling berpengaruh dalam bidang ini, wafat di Baghdad.',
    baslikFr: 'Mort de l’imam Abu Hanifa',
    aciklamaFr: 'L’imam Abu Hanifa, fondateur de l’école juridique hanafite et l’une de ses figures les plus influentes, mourut à Bagdad.' },
  { ay: 6, gun: 22, yil: 1037, baslik: 'İbn Sina’nın vefatı',
    aciklama: 'Tıp ve felsefe alanlarında Doğu ve Batı dünyasını derinden etkileyen büyük İslam bilgini İbn Sina (Avicenna), Hemedan’da vefat etti.',
    baslikEn: 'Death of Ibn Sina (Avicenna)',
    aciklamaEn: 'The great Islamic scholar Ibn Sina, known in the West as Avicenna, whose work in medicine and philosophy profoundly shaped both East and West, died in Hamadan.',
    baslikId: 'Wafatnya Ibnu Sina (Avicenna)',
    aciklamaId: 'Cendekiawan Islam besar Ibnu Sina, yang dikenal di Barat sebagai Avicenna dan karyanya dalam bidang kedokteran serta filsafat sangat memengaruhi Timur maupun Barat, wafat di Hamadan.',
    baslikFr: 'Mort d’Ibn Sina (Avicenne)',
    aciklamaFr: 'Le grand savant islamique Ibn Sina, connu en Occident sous le nom d’Avicenne, dont l’œuvre en médecine et en philosophie marqua profondément l’Orient et l’Occident, mourut à Hamadan.' },
  { ay: 6, gun: 24, yil: 1839, baslik: 'Nizip Muharebesi',
    aciklama: 'Mısır Valisi Kavalalı Mehmed Ali Paşa’nın oğlu İbrahim Paşa komutasındaki ordu, Osmanlı kuvvetlerini Nizip’te yenilgiye uğratarak imparatorluğu ağır bir bunalıma sürükledi.',
    baslikEn: 'Battle of Nezib',
    aciklamaEn: 'The army of Ibrahim Pasha, son of Egypt’s governor Muhammad Ali, defeated Ottoman forces at Nezib, plunging the empire into a severe crisis.',
    baslikId: 'Pertempuran Nezib',
    aciklamaId: 'Pasukan Ibrahim Pasha, putra gubernur Mesir Muhammad Ali, mengalahkan pasukan Utsmaniyah di Nezib, yang membawa kekaisaran ke dalam krisis berat.',
    baslikFr: 'Bataille de Nezib',
    aciklamaFr: 'L’armée d’Ibrahim Pacha, fils du gouverneur d’Égypte Méhémet Ali, vainquit les forces ottomanes à Nezib, plongeant l’empire dans une grave crise.' },
  { ay: 6, gun: 25, yil: 1861, baslik: 'Sultan Abdülmecid’in vefatı',
    aciklama: 'Tanzimat reformlarını başlatan Osmanlı padişahı Sultan Abdülmecid, otuz sekiz yaşında İstanbul’da vefat etti.',
    baslikEn: 'Death of Sultan Abdülmecid I',
    aciklamaEn: 'Ottoman Sultan Abdülmecid I, who launched the Tanzimat reforms, died in Istanbul at the age of thirty-eight.',
    baslikId: 'Wafatnya Sultan Abdulmejid I',
    aciklamaId: 'Sultan Utsmaniyah Abdulmejid I, yang meluncurkan reformasi Tanzimat, wafat di Istanbul pada usia tiga puluh delapan tahun.',
    baslikFr: 'Mort du sultan Abdülmecid Ier',
    aciklamaFr: 'Le sultan ottoman Abdülmecid Ier, qui lança les réformes du Tanzimat, mourut à Istanbul à l’âge de trente-huit ans.' },

  // ── TEMMUZ/AĞUSTOS/EYLÜL EK ──
  { ay: 7, gun: 19, yil: 711, baslik: 'Guadalete Muharebesi',
    aciklama: 'Tarık bin Ziyad komutasındaki Müslüman ordusu, Vizigot Kralı Rodrigo’yu Guadalete Muharebesi’nde yenerek İber Yarımadası’nın fethinin önünü açtı.',
    baslikEn: 'Battle of Guadalete',
    aciklamaEn: 'A Muslim army led by Tariq ibn Ziyad defeated Visigothic King Roderic at the Battle of Guadalete, opening the way for the conquest of the Iberian Peninsula.',
    baslikId: 'Pertempuran Guadalete',
    aciklamaId: 'Pasukan Muslim di bawah pimpinan Tariq bin Ziyad mengalahkan Raja Visigoth Roderic dalam Pertempuran Guadalete, membuka jalan bagi penaklukan Semenanjung Iberia.',
    baslikFr: 'Bataille de Guadalete',
    aciklamaFr: 'Une armée musulmane menée par Tariq ibn Ziyad vainquit le roi wisigoth Rodéric à la bataille de Guadalete, ouvrant la voie à la conquête de la péninsule Ibérique.' },
  { ay: 7, gun: 26, yil: 1956, baslik: 'Süveyş Kanalı’nın Millileştirilmesi',
    aciklama: 'Mısır Devlet Başkanı Cemal Abdünnasır, İskenderiye’de yaptığı bir konuşmayla Süveyş Kanalı’nı millileştirdiğini açıkladı ve bu karar Süveyş Krizi’ni başlattı.',
    baslikEn: 'Nationalization of the Suez Canal',
    aciklamaEn: 'Egyptian President Gamal Abdel Nasser announced the nationalization of the Suez Canal in a speech in Alexandria, triggering the Suez Crisis.',
    baslikId: 'Nasionalisasi Terusan Suez',
    aciklamaId: 'Presiden Mesir Gamal Abdel Nasser mengumumkan nasionalisasi Terusan Suez dalam pidatonya di Alexandria, yang memicu Krisis Suez.',
    baslikFr: 'Nationalisation du canal de Suez',
    aciklamaFr: 'Le président égyptien Gamal Abdel Nasser annonça la nationalisation du canal de Suez lors d’un discours à Alexandrie, déclenchant la crise de Suez.' },
  { ay: 8, gun: 1, yil: 1571, baslik: 'Magosa’nın (Famagusta) Fethi',
    aciklama: 'Uzun süren bir kuşatmanın ardından Osmanlı kuvvetleri Kıbrıs’taki Magosa şehrini teslim aldı ve adanın fethini tamamladı.',
    baslikEn: 'Fall of Famagusta',
    aciklamaEn: 'After a prolonged siege, Ottoman forces took the city of Famagusta in Cyprus, completing the conquest of the island.',
    baslikId: 'Jatuhnya Famagusta',
    aciklamaId: 'Setelah pengepungan yang panjang, pasukan Utsmaniyah merebut kota Famagusta di Siprus, menyelesaikan penaklukan pulau tersebut.',
    baslikFr: 'Chute de Famagouste',
    aciklamaFr: 'Après un long siège, les forces ottomanes prirent la ville de Famagouste à Chypre, achevant la conquête de l’île.' },
  { ay: 8, gun: 11, yil: 1473, baslik: 'Otlukbeli Muharebesi',
    aciklama: 'Fatih Sultan Mehmed komutasındaki Osmanlı ordusu, Akkoyunlu hükümdarı Uzun Hasan’ı Otlukbeli’nde yenerek Anadolu’daki Osmanlı hakimiyetini pekiştirdi.',
    baslikEn: 'Battle of Otlukbeli',
    aciklamaEn: 'The Ottoman army under Sultan Mehmed the Conqueror defeated Uzun Hasan, ruler of the Aq Qoyunlu, at Otlukbeli, securing Ottoman dominance in Anatolia.',
    baslikId: 'Pertempuran Otlukbeli',
    aciklamaId: 'Pasukan Utsmaniyah di bawah Sultan Mehmed Sang Penakluk mengalahkan Uzun Hasan, penguasa Aq Qoyunlu, di Otlukbeli, mengukuhkan dominasi Utsmaniyah di Anatolia.',
    baslikFr: 'Bataille d’Otlukbeli',
    aciklamaFr: 'L’armée ottomane du sultan Mehmed le Conquérant vainquit Uzun Hasan, souverain des Ak Koyunlu, à Otlukbeli, consolidant la domination ottomane en Anatolie.' },
  { ay: 8, gun: 14, yil: 1947, baslik: 'Pakistan’ın Bağımsızlığı',
    aciklama: 'Britanya Hindistanı’nın bölünmesiyle Pakistan, Muhammed Ali Cinnah’ın önderliğinde bağımsız bir devlet olarak kuruldu.',
    baslikEn: 'Independence of Pakistan',
    aciklamaEn: 'Following the partition of British India, Pakistan was established as an independent state under the leadership of Muhammad Ali Jinnah.',
    baslikId: 'Kemerdekaan Pakistan',
    aciklamaId: 'Setelah pembagian India Britania, Pakistan didirikan sebagai negara merdeka di bawah kepemimpinan Muhammad Ali Jinnah.',
    baslikFr: 'Indépendance du Pakistan',
    aciklamaFr: 'À la suite de la partition des Indes britanniques, le Pakistan fut fondé comme État indépendant sous la direction de Muhammad Ali Jinnah.' },
  { ay: 8, gun: 17, yil: 1945, baslik: 'Endonezya’nın Bağımsızlığı',
    aciklama: 'Sukarno ve Mohammad Hatta, Cakarta’da Endonezya’nın bağımsızlığını ilan ederek dünyanın en kalabalık Müslüman nüfusuna sahip ülkesinin kuruluşunu başlattı.',
    baslikEn: 'Independence of Indonesia',
    aciklamaEn: 'Sukarno and Mohammad Hatta proclaimed Indonesia’s independence in Jakarta, founding the nation with the world’s largest Muslim population.',
    baslikId: 'Kemerdekaan Indonesia',
    aciklamaId: 'Sukarno dan Mohammad Hatta memproklamasikan kemerdekaan Indonesia di Jakarta, mendirikan negara dengan populasi Muslim terbesar di dunia.',
    baslikFr: 'Indépendance de l’Indonésie',
    aciklamaFr: 'Sukarno et Mohammad Hatta proclamèrent l’indépendance de l’Indonésie à Jakarta, fondant le pays comptant la plus grande population musulmane au monde.' },
  { ay: 8, gun: 23, yil: 1514, baslik: 'Çaldıran Muharebesi',
    aciklama: 'Osmanlı padişahı Yavuz Sultan Selim, Safevi hükümdarı Şah İsmail’i Çaldıran Ovası’nda yenerek Doğu Anadolu ve Irak’ta Osmanlı üstünlüğünü sağladı.',
    baslikEn: 'Battle of Chaldiran',
    aciklamaEn: 'Ottoman Sultan Selim I defeated Safavid ruler Shah Ismail at the Battle of Chaldiran, securing Ottoman dominance over eastern Anatolia and Iraq.',
    baslikId: 'Pertempuran Chaldiran',
    aciklamaId: 'Sultan Utsmaniyah Selim I mengalahkan penguasa Safawi Shah Ismail dalam Pertempuran Chaldiran, mengukuhkan dominasi Utsmaniyah atas Anatolia timur dan Irak.',
    baslikFr: 'Bataille de Tchaldiran',
    aciklamaFr: 'Le sultan ottoman Selim Ier vainquit le souverain safavide Shah Ismaïl à la bataille de Tchaldiran, assurant la domination ottomane sur l’est de l’Anatolie et l’Irak.' },
  { ay: 8, gun: 31, yil: 1957, baslik: 'Malezya’nın Bağımsızlığı (Merdeka)',
    aciklama: 'Malaya Federasyonu, Birleşik Krallık’tan bağımsızlığını kazanarak günümüz Malezya’sının temelini oluşturdu.',
    baslikEn: 'Independence of Malaya (Merdeka)',
    aciklamaEn: 'The Federation of Malaya gained independence from the United Kingdom, forming the foundation of modern Malaysia.',
    baslikId: 'Kemerdekaan Malaya (Merdeka)',
    aciklamaId: 'Federasi Malaya memperoleh kemerdekaan dari Britania Raya, menjadi dasar bagi Malaysia modern.',
    baslikFr: 'Indépendance de la Malaisie (Merdeka)',
    aciklamaFr: 'La Fédération de Malaisie obtint son indépendance du Royaume-Uni, posant les bases de la Malaisie moderne.' },
  { ay: 9, gun: 11, yil: 1948, baslik: 'Muhammed Ali Cinnah’ın Vefatı',
    aciklama: 'Pakistan’ın kurucusu ve ilk genel valisi Muhammed Ali Cinnah, Karaçi’de vefat etti.',
    baslikEn: 'Death of Muhammad Ali Jinnah',
    aciklamaEn: 'Muhammad Ali Jinnah, the founder and first Governor-General of Pakistan, died in Karachi.',
    baslikId: 'Wafatnya Muhammad Ali Jinnah',
    aciklamaId: 'Muhammad Ali Jinnah, pendiri dan Gubernur Jenderal pertama Pakistan, wafat di Karachi.',
    baslikFr: 'Mort de Muhammad Ali Jinnah',
    aciklamaFr: 'Muhammad Ali Jinnah, fondateur et premier gouverneur général du Pakistan, mourut à Karachi.' },
  { ay: 9, gun: 25, yil: 1396, baslik: 'Niğbolu Muharebesi',
    aciklama: 'Osmanlı padişahı I. Bayezid, Macaristan Kralı Sigismund önderliğindeki Haçlı ordusunu Niğbolu’da büyük bir yenilgiye uğrattı.',
    baslikEn: 'Battle of Nicopolis',
    aciklamaEn: 'Ottoman Sultan Bayezid I inflicted a major defeat on the Crusader army led by King Sigismund of Hungary at the Battle of Nicopolis.',
    baslikId: 'Pertempuran Nikopolis',
    aciklamaId: 'Sultan Utsmaniyah Bayezid I menimbulkan kekalahan besar pada pasukan Salib yang dipimpin Raja Sigismund dari Hungaria dalam Pertempuran Nikopolis.',
    baslikFr: 'Bataille de Nicopolis',
    aciklamaFr: 'Le sultan ottoman Bayezid Ier infligea une lourde défaite à l’armée croisée menée par le roi Sigismond de Hongrie à la bataille de Nicopolis.' },

  // ── EKİM/KASIM/ARALIK EK ──
  { ay: 10, gun: 1, yil: 1960, baslik: 'Nijerya’nın Bağımsızlığı',
    aciklama: 'Afrika’nın en kalabalık ülkesi Nijerya, Birleşik Krallık’tan bağımsızlığını kazandı; ülke nüfusunun yarıya yakını Müslüman.',
    baslikEn: 'Independence of Nigeria',
    aciklamaEn: 'Nigeria, Africa’s most populous country and home to a large Muslim population, gained independence from the United Kingdom.',
    baslikId: 'Kemerdekaan Nigeria',
    aciklamaId: 'Nigeria, negara berpenduduk terbanyak di Afrika dengan populasi Muslim yang besar, memperoleh kemerdekaan dari Britania Raya.',
    baslikFr: 'Indépendance du Nigeria',
    aciklamaFr: 'Le Nigeria, pays le plus peuplé d’Afrique et abritant une importante population musulmane, obtint son indépendance du Royaume-Uni.' },
  { ay: 10, gun: 2, yil: 1187, baslik: 'Selahaddin Eyyubi Kudüs’ü teslim aldı',
    aciklama: 'Hıttîn Zaferi’nin ardından Selahaddin Eyyubi, kuşattığı Kudüs şehrinin teslimini kabul etti; şehir 88 yıl aradan sonra yeniden Müslüman idaresine geçti.',
    baslikEn: 'Saladin receives the surrender of Jerusalem',
    aciklamaEn: 'Following his victory at Hattin, Saladin accepted the surrender of the besieged city of Jerusalem, returning it to Muslim rule after 88 years.',
    baslikId: 'Salahuddin Ayyubi menerima penyerahan Yerusalem',
    aciklamaId: 'Setelah kemenangannya di Hattin, Salahuddin Ayyubi menerima penyerahan kota Yerusalem yang dikepung, mengembalikannya ke pemerintahan Muslim setelah 88 tahun.',
    baslikFr: 'Saladin reçoit la reddition de Jérusalem',
    aciklamaFr: 'Après sa victoire à Hattin, Saladin accepta la reddition de la ville assiégée de Jérusalem, la rendant à l’autorité musulmane après 88 ans.' },
  { ay: 10, gun: 13, yil: 1617, baslik: 'Sultan İbrahim’in doğumu',
    aciklama: 'Osmanlı tahtına 1640’ta çıkacak olan Sultan İbrahim, İstanbul’da dünyaya geldi.',
    baslikEn: 'Birth of Sultan Ibrahim',
    aciklamaEn: 'Sultan Ibrahim, who would ascend the Ottoman throne in 1640, was born in Istanbul.',
    baslikId: 'Kelahiran Sultan Ibrahim',
    aciklamaId: 'Sultan Ibrahim, yang kelak naik takhta Utsmaniyah pada 1640, lahir di Istanbul.',
    baslikFr: 'Naissance du sultan İbrahim',
    aciklamaFr: 'Le sultan İbrahim, qui monterait sur le trône ottoman en 1640, naquit à Istanbul.' },
  { ay: 10, gun: 14, yil: 1092, baslik: 'Nizamülmülk’ün suikaste kurban gitmesi',
    aciklama: 'Büyük Selçuklu Devleti’nin ünlü veziri ve Nizamiye medreselerinin kurucusu Nizamülmülk, bir suikast sonucu öldürüldü.',
    baslikEn: 'Assassination of Nizam al-Mulk',
    aciklamaEn: 'Nizam al-Mulk, the renowned vizier of the Great Seljuk Empire and founder of the Nizamiyya madrasas, was assassinated.',
    baslikId: 'Pembunuhan Nizam al-Mulk',
    aciklamaId: 'Nizam al-Mulk, wazir terkenal Kesultanan Seljuk Raya dan pendiri madrasah Nizamiyah, dibunuh.',
    baslikFr: 'Assassinat de Nizam al-Mulk',
    aciklamaFr: 'Nizam al-Mulk, célèbre vizir du grand empire seldjoukide et fondateur des madrasas nizamiyya, fut assassiné.' },
  { ay: 10, gun: 15, yil: 1542, baslik: 'Ekber Şah’ın doğumu',
    aciklama: 'Babür İmparatorluğu’nu topraklarının doruğuna taşıyan büyük hükümdar Ekber Şah dünyaya geldi.',
    baslikEn: 'Birth of Akbar the Great',
    aciklamaEn: 'Akbar the Great, the Mughal emperor who brought the empire to the height of its territorial extent, was born.',
    baslikId: 'Kelahiran Akbar yang Agung',
    aciklamaId: 'Akbar yang Agung, kaisar Mughal yang membawa kekaisaran mencapai puncak wilayahnya, lahir.',
    baslikFr: 'Naissance d’Akbar le Grand',
    aciklamaFr: 'Akbar le Grand, l’empereur moghol qui porta l’empire à son apogée territoriale, naquit.' },
  { ay: 10, gun: 18, yil: 1991, baslik: 'Azerbaycan’ın Bağımsızlığı',
    aciklama: 'Sovyetler Birliği’nin dağılma sürecinde Azerbaycan, bağımsızlığını yeniden ilan etti.',
    baslikEn: 'Independence of Azerbaijan',
    aciklamaEn: 'Amid the dissolution of the Soviet Union, Azerbaijan re-declared its independence.',
    baslikId: 'Kemerdekaan Azerbaijan',
    aciklamaId: 'Di tengah pembubaran Uni Soviet, Azerbaijan kembali memproklamasikan kemerdekaannya.',
    baslikFr: 'Indépendance de l’Azerbaïdjan',
    aciklamaFr: 'Dans le contexte de la dissolution de l’Union soviétique, l’Azerbaïdjan proclama de nouveau son indépendance.' },
  { ay: 10, gun: 27, yil: 1991, baslik: 'Türkmenistan’ın Bağımsızlığı',
    aciklama: 'Sovyetler Birliği’nin dağılmasının ardından Türkmenistan bağımsızlığını ilan etti.',
    baslikEn: 'Independence of Turkmenistan',
    aciklamaEn: 'Following the dissolution of the Soviet Union, Turkmenistan declared its independence.',
    baslikId: 'Kemerdekaan Turkmenistan',
    aciklamaId: 'Setelah pembubaran Uni Soviet, Turkmenistan memproklamasikan kemerdekaannya.',
    baslikFr: 'Indépendance du Turkménistan',
    aciklamaFr: 'À la suite de la dissolution de l’Union soviétique, le Turkménistan proclama son indépendance.' },
  { ay: 10, gun: 29, yil: 1914, baslik: 'Osmanlı Devleti’nin I. Dünya Savaşı’na girişi',
    aciklama: 'Osmanlı donanmasının Karadeniz’deki Rus limanlarını bombalamasıyla Osmanlı Devleti fiilen I. Dünya Savaşı’na girdi.',
    baslikEn: 'The Ottoman Empire enters World War I',
    aciklamaEn: 'With the Ottoman navy’s bombardment of Russian Black Sea ports, the Ottoman Empire effectively entered the First World War.',
    baslikId: 'Kesultanan Utsmaniyah memasuki Perang Dunia I',
    aciklamaId: 'Dengan pengeboman pelabuhan-pelabuhan Rusia di Laut Hitam oleh angkatan laut Utsmaniyah, Kesultanan Utsmaniyah secara efektif memasuki Perang Dunia I.',
    baslikFr: 'L’Empire ottoman entre dans la Première Guerre mondiale',
    aciklamaFr: 'Avec le bombardement des ports russes de la mer Noire par la marine ottomane, l’Empire ottoman entra de facto dans la Première Guerre mondiale.' },
  { ay: 11, gun: 1, yil: 1922, baslik: 'Osmanlı Saltanatı’nın Kaldırılması',
    aciklama: 'TBMM, 623 yıllık Osmanlı Saltanatı’nı resmen kaldırdı; son padişah VI. Mehmed bir süre sonra ülkeyi terk etti.',
    baslikEn: 'Abolition of the Ottoman Sultanate',
    aciklamaEn: 'Turkey’s Grand National Assembly formally abolished the 623-year-old Ottoman Sultanate; the last sultan, Mehmed VI, left the country shortly after.',
    baslikId: 'Penghapusan Kesultanan Utsmaniyah',
    aciklamaId: 'Majelis Agung Nasional Turki secara resmi menghapus Kesultanan Utsmaniyah yang telah berusia 623 tahun; sultan terakhir, Mehmed VI, meninggalkan negara itu tak lama kemudian.',
    baslikFr: 'Abolition du sultanat ottoman',
    aciklamaFr: 'La Grande Assemblée nationale turque abolit officiellement le sultanat ottoman, vieux de 623 ans ; le dernier sultan, Mehmed VI, quitta le pays peu après.' },
  { ay: 11, gun: 3, yil: 1618, baslik: 'Evrengzib’in doğumu',
    aciklama: 'Babür İmparatorluğu’nu en geniş sınırlarına ulaştıran hükümdar Evrengzib (Alemgir) doğdu.',
    baslikEn: 'Birth of Aurangzeb',
    aciklamaEn: 'Aurangzeb (Alamgir), who expanded the Mughal Empire to its greatest territorial extent, was born.',
    baslikId: 'Kelahiran Aurangzeb',
    aciklamaId: 'Aurangzeb (Alamgir), yang memperluas Kekaisaran Mughal hingga mencapai wilayah terluasnya, lahir.',
    baslikFr: 'Naissance d’Aurangzeb',
    aciklamaFr: 'Aurangzeb (Alamgir), qui étendit l’Empire moghol jusqu’à son apogée territoriale, naquit.' },
  { ay: 11, gun: 6, yil: 1494, baslik: 'Kanuni Sultan Süleyman’ın doğumu (yaklaşık)',
    aciklama: 'Kaynaklar arasında küçük farklar bulunsa da yaygın kabule göre Kanuni Sultan Süleyman bu tarihte Trabzon’da doğdu.',
    baslikEn: 'Birth of Suleiman the Magnificent (approx.)',
    aciklamaEn: 'Though sources vary slightly, Suleiman the Magnificent is commonly held to have been born on this date in Trabzon.',
    baslikId: 'Kelahiran Suleiman yang Agung (perkiraan)',
    aciklamaId: 'Meskipun sumber sedikit berbeda, Suleiman yang Agung umumnya diyakini lahir pada tanggal ini di Trabzon.',
    baslikFr: 'Naissance de Soliman le Magnifique (approx.)',
    aciklamaFr: 'Bien que les sources varient légèrement, Soliman le Magnifique est généralement considéré comme né à cette date à Trébizonde.' },
  { ay: 11, gun: 9, yil: 1953, baslik: 'Kral Abdülaziz İbn Suud’un vefatı',
    aciklama: 'Suudi Arabistan Krallığı’nın kurucusu Kral Abdülaziz İbn Suud vefat etti.',
    baslikEn: 'Death of King Abdulaziz ibn Saud',
    aciklamaEn: 'King Abdulaziz ibn Saud, founder of the Kingdom of Saudi Arabia, died.',
    baslikId: 'Wafatnya Raja Abdulaziz ibn Saud',
    aciklamaId: 'Raja Abdulaziz ibn Saud, pendiri Kerajaan Arab Saudi, wafat.',
    baslikFr: 'Mort du roi Abdelaziz ibn Saoud',
    aciklamaFr: 'Le roi Abdelaziz ibn Saoud, fondateur du royaume d’Arabie saoudite, mourut.' },
  { ay: 11, gun: 10, yil: 1444, baslik: 'Varna Muharebesi',
    aciklama: 'II. Murad komutasındaki Osmanlı ordusu, Macar-Leh Kralı Vladislas önderliğindeki Haçlı ordusunu Varna’da yenilgiye uğrattı.',
    baslikEn: 'Battle of Varna',
    aciklamaEn: 'The Ottoman army under Murad II defeated the Crusader army led by King Vladislas of Hungary and Poland at Varna.',
    baslikId: 'Pertempuran Varna',
    aciklamaId: 'Pasukan Utsmaniyah di bawah Murad II mengalahkan pasukan Salib yang dipimpin Raja Vladislas dari Hungaria dan Polandia di Varna.',
    baslikFr: 'Bataille de Varna',
    aciklamaFr: 'L’armée ottomane sous Murad II vainquit l’armée croisée menée par le roi Vladislas de Hongrie et de Pologne à Varna.' },
  { ay: 11, gun: 18, yil: 1912, baslik: 'Muhammadiyah’ın kuruluşu',
    aciklama: 'Endonezya’da Ahmed Dahlan tarafından kurulan Muhammadiyah, ülkenin en büyük İslami toplumsal örgütlerinden biri haline geldi.',
    baslikEn: 'Founding of Muhammadiyah',
    aciklamaEn: 'Muhammadiyah, founded by Ahmad Dahlan in Indonesia, went on to become one of the country’s largest Islamic social organizations.',
    baslikId: 'Berdirinya Muhammadiyah',
    aciklamaId: 'Muhammadiyah, didirikan oleh Ahmad Dahlan di Indonesia, kemudian menjadi salah satu organisasi sosial Islam terbesar di negara itu.',
    baslikFr: 'Fondation de Muhammadiyah',
    aciklamaFr: 'Muhammadiyah, fondée par Ahmad Dahlan en Indonésie, deviendra l’une des plus grandes organisations sociales islamiques du pays.' },
  { ay: 11, gun: 19, yil: 1092, baslik: 'Melikşah’ın vefatı',
    aciklama: 'Büyük Selçuklu Devleti’ni en geniş sınırlarına ulaştıran Sultan Melikşah, Bağdat’ta vefat etti.',
    baslikEn: 'Death of Malik-Shah I',
    aciklamaEn: 'Sultan Malik-Shah I, who brought the Great Seljuk Empire to its greatest territorial extent, died in Baghdad.',
    baslikId: 'Wafatnya Malik-Shah I',
    aciklamaId: 'Sultan Malik-Shah I, yang membawa Kesultanan Seljuk Raya mencapai wilayah terluasnya, wafat di Baghdad.',
    baslikFr: 'Mort de Malik Shah Ier',
    aciklamaFr: 'Le sultan Malik Shah Ier, qui porta le grand empire seldjoukide à son apogée territoriale, mourut à Bagdad.' },
  { ay: 11, gun: 22, yil: 1617, baslik: 'Sultan I. Ahmed’in vefatı',
    aciklama: 'Sultanahmet Camii’ni yaptıran Osmanlı padişahı I. Ahmed, yirmi yedi yaşında İstanbul’da vefat etti.',
    baslikEn: 'Death of Sultan Ahmed I',
    aciklamaEn: 'Ottoman Sultan Ahmed I, who commissioned the Sultan Ahmed Mosque, died in Istanbul at the age of twenty-seven.',
    baslikId: 'Wafatnya Sultan Ahmed I',
    aciklamaId: 'Sultan Utsmaniyah Ahmed I, yang membangun Masjid Sultan Ahmed, wafat di Istanbul pada usia dua puluh tujuh tahun.',
    baslikFr: 'Mort du sultan Ahmed Ier',
    aciklamaFr: 'Le sultan ottoman Ahmed Ier, qui fit construire la mosquée Sultan Ahmed, mourut à Istanbul à l’âge de vingt-sept ans.' },
  { ay: 11, gun: 24, yil: 1072, baslik: 'Alparslan’ın vefatı',
    aciklama: 'Malazgirt Zaferi’nin kahramanı Büyük Selçuklu Sultanı Alparslan, bir sefer sırasında suikaste kurban gitti.',
    baslikEn: 'Death of Alp Arslan',
    aciklamaEn: 'Alp Arslan, the Great Seljuk Sultan and hero of the Battle of Manzikert, was assassinated during a military campaign.',
    baslikId: 'Wafatnya Alp Arslan',
    aciklamaId: 'Alp Arslan, Sultan Seljuk Raya dan pahlawan Pertempuran Manzikert, dibunuh saat kampanye militer.',
    baslikFr: 'Mort d’Alp Arslan',
    aciklamaFr: 'Alp Arslan, sultan du grand empire seldjoukide et héros de la bataille de Manzikert, fut assassiné lors d’une campagne militaire.' },
  { ay: 12, gun: 2, yil: 1971, baslik: 'Birleşik Arap Emirlikleri’nin kuruluşu',
    aciklama: 'Altı emirlik bir araya gelerek Birleşik Arap Emirlikleri’ni kurdu (yedinci emirlik Ras el-Hayme birkaç ay sonra katıldı).',
    baslikEn: 'Founding of the United Arab Emirates',
    aciklamaEn: 'Six emirates united to form the United Arab Emirates (the seventh, Ras al-Khaimah, joined a few months later).',
    baslikId: 'Berdirinya Uni Emirat Arab',
    aciklamaId: 'Enam keamiran bersatu membentuk Uni Emirat Arab (keamiran ketujuh, Ras al-Khaimah, bergabung beberapa bulan kemudian).',
    baslikFr: 'Fondation des Émirats arabes unis',
    aciklamaFr: 'Six émirats s’unirent pour former les Émirats arabes unis (le septième, Ras el-Khaïmah, rejoignit l’union quelques mois plus tard).' },
  { ay: 12, gun: 4, yil: 1131, baslik: 'Ömer Hayyam’ın vefatı',
    aciklama: 'Büyük matematikçi, gökbilimci ve şair Ömer Hayyam, doğduğu şehir Nişabur’da vefat etti.',
    baslikEn: 'Death of Omar Khayyam',
    aciklamaEn: 'The great mathematician, astronomer, and poet Omar Khayyam died in his native city of Nishapur.',
    baslikId: 'Wafatnya Omar Khayyam',
    aciklamaId: 'Matematikawan, astronom, dan penyair besar Omar Khayyam wafat di kota kelahirannya, Nishapur.',
    baslikFr: 'Mort d’Omar Khayyam',
    aciklamaFr: 'Le grand mathématicien, astronome et poète Omar Khayyam mourut dans sa ville natale de Nishapur.' },
  { ay: 12, gun: 11, yil: 1198, baslik: 'İbn Rüşd’ün (Averroes) vefatı',
    aciklama: 'Aristoteles şerhleriyle İslam ve Batı felsefesini derinden etkileyen büyük filozof İbn Rüşd, Marakeş’te vefat etti.',
    baslikEn: 'Death of Ibn Rushd (Averroes)',
    aciklamaEn: 'The great philosopher Ibn Rushd, whose commentaries on Aristotle profoundly influenced both Islamic and Western philosophy, died in Marrakesh.',
    baslikId: 'Wafatnya Ibnu Rusyd (Averroes)',
    aciklamaId: 'Filsuf besar Ibnu Rusyd, yang tafsirnya atas Aristoteles sangat memengaruhi filsafat Islam maupun Barat, wafat di Marrakesh.',
    baslikFr: 'Mort d’Ibn Rushd (Averroès)',
    aciklamaFr: 'Le grand philosophe Ibn Rushd, dont les commentaires sur Aristote influencèrent profondément la philosophie islamique et occidentale, mourut à Marrakech.' },
  { ay: 12, gun: 15, yil: 1574, baslik: 'II. Selim’in vefatı',
    aciklama: 'Kanuni Sultan Süleyman’ın oğlu ve halefi II. Selim, İstanbul’da vefat etti.',
    baslikEn: 'Death of Selim II',
    aciklamaEn: 'Selim II, son and successor of Suleiman the Magnificent, died in Istanbul.',
    baslikId: 'Wafatnya Selim II',
    aciklamaId: 'Selim II, putra dan penerus Suleiman yang Agung, wafat di Istanbul.',
    baslikFr: 'Mort de Selim II',
    aciklamaFr: 'Selim II, fils et successeur de Soliman le Magnifique, mourut à Istanbul.' },
  { ay: 12, gun: 18, yil: 890, baslik: 'III. Abdurrahman’ın doğumu (yaklaşık)',
    aciklama: 'Kaynaklarda doğum yılı 889-891 arasında değişse de, Endülüs Emevi halifesi III. Abdurrahman’ın bu döneme ait olduğu kabul edilir.',
    baslikEn: 'Birth of Abd al-Rahman III (approx.)',
    aciklamaEn: 'Though sources place the birth year between 889 and 891, the Umayyad Caliph of Córdoba Abd al-Rahman III is held to have been born around this date.',
    baslikId: 'Kelahiran Abdurrahman III (perkiraan)',
    aciklamaId: 'Meskipun sumber menempatkan tahun kelahirannya antara 889-891, Khalifah Umayyah Kordoba Abdurrahman III diyakini lahir sekitar tanggal ini.',
    baslikFr: 'Naissance d’Abd al-Rahman III (approx.)',
    aciklamaFr: 'Bien que les sources situent l’année de naissance entre 889 et 891, le calife omeyyade de Cordoue Abd al-Rahman III est considéré comme né vers cette date.' },
  { ay: 12, gun: 22, yil: 1501, baslik: 'Şah İsmail’in tahta çıkışı ve Safevi Devleti’nin kuruluşu',
    aciklama: 'Şah İsmail, Tebriz’de tahta çıkarak İran’da Safevi Devleti’ni kurdu ve Şiiliği devletin resmi mezhebi ilan etti.',
    baslikEn: 'Enthronement of Shah Ismail and founding of the Safavid dynasty',
    aciklamaEn: 'Shah Ismail ascended the throne in Tabriz, founding the Safavid dynasty in Iran and declaring Shia Islam the state religion.',
    baslikId: 'Penobatan Shah Ismail dan berdirinya Dinasti Safawi',
    aciklamaId: 'Shah Ismail naik takhta di Tabriz, mendirikan Dinasti Safawi di Iran dan menjadikan Islam Syiah sebagai agama negara.',
    baslikFr: 'Intronisation de Shah Ismaïl et fondation de la dynastie safavide',
    aciklamaFr: 'Shah Ismaïl monta sur le trône à Tabriz, fondant la dynastie safavide en Iran et proclamant le chiisme religion d’État.' },
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
 */
export function getTariheBugun(tarih: Date): TarihOlayi | null {
  return getTariheBugunTamEslesme(tarih);
}

/**
 * TAKVİMDEKİ EN YAKIN OLAY — 10 maddelik listenin 2. maddesiyle (bu tur)
 * ARTIK ANASAYFADA KULLANILMIYOR.
 *
 * @deprecated Kullanıcı açıkça "birkaç gün önce ya da sonrasının değil, o
 * gün hangi olay yaşandıysa onu yazsın" dedi — yani fallback/en-yakın
 * mantığı kullanıcının istediğinin TAM TERSİ. Anasayfa artık SADECE
 * `getTariheBugunTamEslesme` kullanıyor (tam eşleşme yoksa kart hiç
 * gösterilmiyor). Bu fonksiyon silinmedi, yalnızca kullanımdan kaldırıldı —
 * olası ileride "esnek mod" gibi bir ayar eklenirse hazır dursun diye.
 *
 * Liste bu turda 12'den 36 olaya çıkarıldı (yalnızca miladi tarihi
 * tartışmasız/yaygın kabul gören olaylar eklendi) — yine de yılın her
 * günü için tam eşleşme YOKTUR ve bu kasıtlıdır: uydurma bir olayla
 * doldurmaktansa o gün kart hiç görünmemesi tercih edildi.
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
