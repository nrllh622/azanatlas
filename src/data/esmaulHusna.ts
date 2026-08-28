// src/data/esmaulHusna.ts
//
// ESMÂÜ'L-HÜSNÂ — Allah'ın 99 güzel ismi
//
// Liste, Tirmizî rivayetinde geçen ve Türkiye'de Diyanet İşleri Başkanlığı
// yayınlarında yer alan yaygın tertibe göre düzenlenmiştir. "Allah" lafza-i
// celâli, isimlerin tamamını kapsayan ism-i a'zam olduğu için 99'luk listeye
// dâhil edilmemiş, ekranda ayrıca üstte gösterilmektedir.
//
// Anlamlar kısa ve sade tutuldu; Türkçe meallerde en çok kullanılan
// karşılıklar tercih edildi.

export interface EsmaItem {
  /** 1-99 arası sıra numarası */
  no: number;
  /** Arapça yazılışı */
  arabic: string;
  /** Türkçe okunuşu */
  latin: string;
  /** Kısa Türkçe anlamı */
  meaning: string;
}

export const ESMAUL_HUSNA: EsmaItem[] = [
  { no: 1, arabic: 'الرَّحْمَنُ', latin: 'Er-Rahmân', meaning: 'Dünyada bütün canlılara sonsuz merhamet eden' },
  { no: 2, arabic: 'الرَّحِيمُ', latin: 'Er-Rahîm', meaning: 'Ahirette yalnız müminlere merhamet edecek olan' },
  { no: 3, arabic: 'الْمَلِكُ', latin: 'El-Melik', meaning: 'Mülkün ve kâinatın gerçek sahibi' },
  { no: 4, arabic: 'الْقُدُّوسُ', latin: 'El-Kuddûs', meaning: 'Her türlü eksiklik ve kusurdan uzak olan' },
  { no: 5, arabic: 'السَّلاَمُ', latin: 'Es-Selâm', meaning: 'Esenlik veren, kullarını selâmete çıkaran' },
  { no: 6, arabic: 'الْمُؤْمِنُ', latin: 'El-Mü’min', meaning: 'Güven veren, vaadine güvenilen' },
  { no: 7, arabic: 'الْمُهَيْمِنُ', latin: 'El-Müheymin', meaning: 'Her şeyi gözetip koruyan' },
  { no: 8, arabic: 'الْعَزِيزُ', latin: 'El-Azîz', meaning: 'Mutlak galip, izzet ve şeref sahibi' },
  { no: 9, arabic: 'الْجَبَّارُ', latin: 'El-Cebbâr', meaning: 'İradesini her durumda yürüten, eksikleri tamamlayan' },
  { no: 10, arabic: 'الْمُتَكَبِّرُ', latin: 'El-Mütekebbir', meaning: 'Büyüklükte eşi ve benzeri olmayan' },
  { no: 11, arabic: 'الْخَالِقُ', latin: 'El-Hâlık', meaning: 'Her şeyi yoktan yaratan' },
  { no: 12, arabic: 'الْبَارِئُ', latin: 'El-Bâri’', meaning: 'Her şeyi kusursuz ve uyum içinde var eden' },
  { no: 13, arabic: 'الْمُصَوِّرُ', latin: 'El-Musavvir', meaning: 'Yarattığı her varlığa ayrı bir şekil veren' },
  { no: 14, arabic: 'الْغَفَّارُ', latin: 'El-Gaffâr', meaning: 'Günahları örten, çokça bağışlayan' },
  { no: 15, arabic: 'الْقَهَّارُ', latin: 'El-Kahhâr', meaning: 'Her şeye üstün gelen, kudretiyle boyun eğdiren' },
  { no: 16, arabic: 'الْوَهَّابُ', latin: 'El-Vehhâb', meaning: 'Karşılık beklemeden bol bol veren' },
  { no: 17, arabic: 'الرَّزَّاقُ', latin: 'Er-Rezzâk', meaning: 'Bütün canlıların rızkını veren' },
  { no: 18, arabic: 'الْفَتَّاحُ', latin: 'El-Fettâh', meaning: 'Hayır kapılarını açan, zorlukları gideren' },
  { no: 19, arabic: 'اَلْعَلِيمُ', latin: 'El-Alîm', meaning: 'Her şeyi hakkıyla bilen' },
  { no: 20, arabic: 'الْقَابِضُ', latin: 'El-Kâbıd', meaning: 'Dilediğine darlık veren, ruhları alan' },
  { no: 21, arabic: 'الْبَاسِطُ', latin: 'El-Bâsıt', meaning: 'Dilediğine bolluk veren, genişlik lütfeden' },
  { no: 22, arabic: 'الْخَافِضُ', latin: 'El-Hâfıd', meaning: 'Dilediğini alçaltan' },
  { no: 23, arabic: 'الرَّافِعُ', latin: 'Er-Râfi’', meaning: 'Dilediğini yükselten, yücelten' },
  { no: 24, arabic: 'الْمُعِزُّ', latin: 'El-Muizz', meaning: 'Dilediğine izzet ve şeref veren' },
  { no: 25, arabic: 'المُذِلُّ', latin: 'El-Müzill', meaning: 'Dilediğini zillete düşüren' },
  { no: 26, arabic: 'السَّمِيعُ', latin: 'Es-Semî’', meaning: 'Her sesi ve her duayı işiten' },
  { no: 27, arabic: 'الْبَصِيرُ', latin: 'El-Basîr', meaning: 'Her şeyi eksiksiz gören' },
  { no: 28, arabic: 'الْحَكَمُ', latin: 'El-Hakem', meaning: 'Mutlak hüküm veren, son sözü söyleyen' },
  { no: 29, arabic: 'الْعَدْلُ', latin: 'El-Adl', meaning: 'Mutlak adaletli, asla zulmetmeyen' },
  { no: 30, arabic: 'اللَّطِيفُ', latin: 'El-Latîf', meaning: 'En ince işleri bilen, kullarına lütufta bulunan' },
  { no: 31, arabic: 'الْخَبِيرُ', latin: 'El-Habîr', meaning: 'Her şeyin iç yüzünden haberdar olan' },
  { no: 32, arabic: 'الْحَلِيمُ', latin: 'El-Halîm', meaning: 'Cezada acele etmeyen, çok yumuşak davranan' },
  { no: 33, arabic: 'الْعَظِيمُ', latin: 'El-Azîm', meaning: 'Azamet ve büyüklük sahibi' },
  { no: 34, arabic: 'الْغَفُورُ', latin: 'El-Gafûr', meaning: 'Günahları çokça affeden' },
  { no: 35, arabic: 'الشَّكُورُ', latin: 'Eş-Şekûr', meaning: 'Az amele çok mükâfat veren' },
  { no: 36, arabic: 'الْعَلِيُّ', latin: 'El-Aliyy', meaning: 'Yüceler yücesi, en yüksek olan' },
  { no: 37, arabic: 'الْكَبِيرُ', latin: 'El-Kebîr', meaning: 'Büyüklüğünün sınırı olmayan' },
  { no: 38, arabic: 'الْحَفِيظُ', latin: 'El-Hafîz', meaning: 'Her şeyi koruyup gözeten' },
  { no: 39, arabic: 'المُقيِيتُ', latin: 'El-Mukît', meaning: 'Her canlıya azığını veren, güç yetiren' },
  { no: 40, arabic: 'الْحسِيبُ', latin: 'El-Hasîb', meaning: 'Hesaba çeken, kullarına kâfi gelen' },
  { no: 41, arabic: 'الْجَلِيلُ', latin: 'El-Celîl', meaning: 'Celal ve azamet sahibi' },
  { no: 42, arabic: 'الْكَرِيمُ', latin: 'El-Kerîm', meaning: 'Cömertliği ve ikramı sonsuz olan' },
  { no: 43, arabic: 'الرَّقِيبُ', latin: 'Er-Rakîb', meaning: 'Bütün varlıkları her an gözetleyen' },
  { no: 44, arabic: 'الْمُجِيبُ', latin: 'El-Mucîb', meaning: 'Kendisine yönelenlerin duasına karşılık veren' },
  { no: 45, arabic: 'الْوَاسِعُ', latin: 'El-Vâsi’', meaning: 'İlmi ve rahmeti her şeyi kuşatan' },
  { no: 46, arabic: 'الْحَكِيمُ', latin: 'El-Hakîm', meaning: 'Her işi hikmetli olan' },
  { no: 47, arabic: 'الْوَدُودُ', latin: 'El-Vedûd', meaning: 'Kullarını çok seven, sevilmeye tek layık olan' },
  { no: 48, arabic: 'الْمَجِيدُ', latin: 'El-Mecîd', meaning: 'Şanı ve şerefi çok yüce olan' },
  { no: 49, arabic: 'الْبَاعِثُ', latin: 'El-Bâis', meaning: 'Ölüleri dirilten, peygamber gönderen' },
  { no: 50, arabic: 'الشَّهِيدُ', latin: 'Eş-Şehîd', meaning: 'Her şeye şahit olan' },
  { no: 51, arabic: 'الْحَقُّ', latin: 'El-Hakk', meaning: 'Varlığı hiç değişmeyen, mutlak gerçek olan' },
  { no: 52, arabic: 'الْوَكِيلُ', latin: 'El-Vekîl', meaning: 'Kendisine güvenilip dayanılan' },
  { no: 53, arabic: 'الْقَوِيُّ', latin: 'El-Kaviyy', meaning: 'Kudreti sonsuz, karşı konulamaz olan' },
  { no: 54, arabic: 'الْمَتِينُ', latin: 'El-Metîn', meaning: 'Çok sağlam, kuvveti hiç azalmayan' },
  { no: 55, arabic: 'الْوَلِيُّ', latin: 'El-Veliyy', meaning: 'Müminlerin dostu ve yardımcısı' },
  { no: 56, arabic: 'الْحَمِيدُ', latin: 'El-Hamîd', meaning: 'Bütün övgülere tek layık olan' },
  { no: 57, arabic: 'الْمُحْصِي', latin: 'El-Muhsî', meaning: 'Her şeyi tek tek bilen ve sayan' },
  { no: 58, arabic: 'الْمُبْدِئُ', latin: 'El-Mübdi’', meaning: 'Her şeyi örneksiz, ilk defa yaratan' },
  { no: 59, arabic: 'الْمُعِيدُ', latin: 'El-Muîd', meaning: 'Yarattıklarını öldürüp tekrar dirilten' },
  { no: 60, arabic: 'الْمُحْيِي', latin: 'El-Muhyî', meaning: 'Can veren, hayat bağışlayan' },
  { no: 61, arabic: 'اَلْمُمِيتُ', latin: 'El-Mümît', meaning: 'Ölümü yaratan, eceli takdir eden' },
  { no: 62, arabic: 'الْحَيُّ', latin: 'El-Hayy', meaning: 'Ezelî ve ebedî hayat sahibi, diri olan' },
  { no: 63, arabic: 'الْقَيُّومُ', latin: 'El-Kayyûm', meaning: 'Kendi varlığı kendindendir, her şeyi ayakta tutan' },
  { no: 64, arabic: 'الْوَاجِدُ', latin: 'El-Vâcid', meaning: 'Dilediğini dilediği an bulan, hiçbir şeye muhtaç olmayan' },
  { no: 65, arabic: 'الْمَاجِدُ', latin: 'El-Mâcid', meaning: 'Kadri ve şanı büyük, keremi bol olan' },
  { no: 66, arabic: 'الْواحِدُ', latin: 'El-Vâhid', meaning: 'Zatında, sıfatlarında ve fiillerinde tek olan' },
  { no: 67, arabic: 'اَلاَحَدُ', latin: 'El-Ehad', meaning: 'Bölünmez ve parçalanmaz şekilde bir olan' },
  { no: 68, arabic: 'الصَّمَدُ', latin: 'Es-Samed', meaning: 'Hiçbir şeye muhtaç olmayan, her şeyin kendisine muhtaç olduğu' },
  { no: 69, arabic: 'الْقَادِرُ', latin: 'El-Kâdir', meaning: 'Her şeye gücü yeten' },
  { no: 70, arabic: 'الْمُقْتَدِرُ', latin: 'El-Muktedir', meaning: 'Kudretini dilediği gibi kullanan' },
  { no: 71, arabic: 'الْمُقَدِّمُ', latin: 'El-Mukaddim', meaning: 'Dilediğini öne geçiren' },
  { no: 72, arabic: 'الْمُؤَخِّرُ', latin: 'El-Muahhir', meaning: 'Dilediğini geriye bırakan' },
  { no: 73, arabic: 'الأوَّلُ', latin: 'El-Evvel', meaning: 'Başlangıcı olmayan, her şeyden önce var olan' },
  { no: 74, arabic: 'الآخِرُ', latin: 'El-Âhir', meaning: 'Sonu olmayan, her şey yok olduktan sonra da var olan' },
  { no: 75, arabic: 'الظَّاهِرُ', latin: 'Ez-Zâhir', meaning: 'Varlığı sayısız delille apaçık olan' },
  { no: 76, arabic: 'الْبَاطِنُ', latin: 'El-Bâtın', meaning: 'Gizlilikleri bilen, zatının künhü kavranamayan' },
  { no: 77, arabic: 'الْوَالِي', latin: 'El-Vâlî', meaning: 'Bütün kâinatı yöneten' },
  { no: 78, arabic: 'الْمُتَعَالِي', latin: 'El-Müteâlî', meaning: 'Eksikliklerden çok yüce olan' },
  { no: 79, arabic: 'الْبَرُّ', latin: 'El-Berr', meaning: 'İyiliği ve ihsanı bol olan' },
  { no: 80, arabic: 'التَّوَابُ', latin: 'Et-Tevvâb', meaning: 'Tövbeleri kabul edip günahları bağışlayan' },
  { no: 81, arabic: 'الْمُنْتَقِمُ', latin: 'El-Müntekim', meaning: 'Suçluları adaletiyle cezalandıran' },
  { no: 82, arabic: 'العَفُوُّ', latin: 'El-Afüvv', meaning: 'Affı çok olan, günahları silen' },
  { no: 83, arabic: 'الرَّؤُوفُ', latin: 'Er-Raûf', meaning: 'Çok şefkatli, çok esirgeyen' },
  { no: 84, arabic: 'مَالِكُ الْمُلْكِ', latin: 'Mâlikü’l-Mülk', meaning: 'Mülkün gerçek ve tek sahibi' },
  { no: 85, arabic: 'ذُوالْجَلاَلِ وَالإكْرَامِ', latin: 'Zü’l-Celâli ve’l-İkrâm', meaning: 'Celal, azamet ve ikram sahibi' },
  { no: 86, arabic: 'الْمُقْسِطُ', latin: 'El-Muksit', meaning: 'Bütün işlerini denk ve adaletli yapan' },
  { no: 87, arabic: 'الْجَامِعُ', latin: 'El-Câmi’', meaning: 'Dilediğini dilediği zaman bir araya toplayan' },
  { no: 88, arabic: 'الْغَنِيُّ', latin: 'El-Ganiyy', meaning: 'Hiçbir şeye muhtaç olmayan, sonsuz zengin' },
  { no: 89, arabic: 'الْمُغْنِي', latin: 'El-Muğnî', meaning: 'Dilediğini zengin kılan' },
  { no: 90, arabic: 'اَلْمَانِعُ', latin: 'El-Mâni’', meaning: 'Dilemediği şeyin gerçekleşmesine izin vermeyen' },
  { no: 91, arabic: 'الضَّار', latin: 'Ed-Dârr', meaning: 'Hikmeti gereği zarar ve elem verenleri yaratan' },
  { no: 92, arabic: 'النَّافِعُ', latin: 'En-Nâfi’', meaning: 'Fayda ve hayır veren' },
  { no: 93, arabic: 'النُّورُ', latin: 'En-Nûr', meaning: 'Nur olan, âlemleri ve gönülleri aydınlatan' },
  { no: 94, arabic: 'الْهَادِي', latin: 'El-Hâdî', meaning: 'Hidayet veren, doğru yola ileten' },
  { no: 95, arabic: 'الْبَدِيعُ', latin: 'El-Bedî’', meaning: 'Eşi benzeri olmayan güzellikte yaratan' },
  { no: 96, arabic: 'اَلْبَاقِي', latin: 'El-Bâkî', meaning: 'Varlığının sonu olmayan, ebedî olan' },
  { no: 97, arabic: 'الْوَارِثُ', latin: 'El-Vâris', meaning: 'Her şey yok olduktan sonra baki kalan gerçek sahip' },
  { no: 98, arabic: 'الرَّشِيدُ', latin: 'Er-Reşîd', meaning: 'Doğru yolu gösteren, irşad eden' },
  { no: 99, arabic: 'الصَّبُورُ', latin: 'Es-Sabûr', meaning: 'Çok sabırlı, cezada hiç acele etmeyen' },
];

/** Lafza-i celâl — 99 ismin tamamını kapsayan ism-i a'zam. */
export const LAFZA_I_CELAL = {
  arabic: 'اللّٰه',
  latin: 'Allah',
  meaning: 'Varlığı zorunlu olan, bütün güzel isimleri kendisinde toplayan yüce yaratıcının özel adı',
};
