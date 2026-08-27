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
// GENİŞLETME (10 maddelik listenin 2. maddesi — bu tur): kullanıcı "günlerdir
// aynı şeyi gösteriyor" diye şikayet etti ve YAKLAŞIK/EN-YAKIN eşleştirmeyi
// DEĞİL, yalnızca o güne ait GERÇEK olayı istediğini açıkça belirtti. Bunun
// için liste 12 olaydan 36 olaya çıkarıldı (Osmanlı tarihi, önemli İslam
// âlimlerinin vefatı, Endülüs/Haçlı Seferleri gibi miladi tarihi sağlam
// kaynaklarla doğrulanabilen olaylar eklendi) ve anasayfa artık SADECE tam
// eşleşme kullanıyor (bkz. `getTariheBugunTamEslesme`) — `getTariheEnYakinOlay`
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
