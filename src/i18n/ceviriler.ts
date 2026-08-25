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

// ÖNEMLİ: Bu sözlük KASITLI OLARAK aktif dile göre değişmez — her dil
// seçeneği HER ZAMAN KENDİ DİLİNDE yazılı görünmeli ("Türkçe" ve "English"
// sabit kalır, uygulamanın o an hangi dilde olduğu fark etmez). Kullanıcı
// "uygulama Türkçe iken İngilizce butonu 'English' yazıyor" diye şikayet
// ettiğinde bu ZATEN doğru/istenen davranıştır — SettingsScreen.tsx'teki
// `DIL_ADLARI[kod]` render'ı `dil` state'ine hiç bakmaz, yalnızca `kod`'a
// (yani hangi buton olduğuna) bakar. Bu satırları `dil`'e göre çeviren bir
// mantığa ASLA çevirme — o zaman kullanıcı hedef dili göremez.
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
    kapatBuyuk: 'KAPAT',
    vazgecBuyuk: 'VAZGEÇ',
    tamamBuyuk: 'TAMAM',
    // Madde 7 (i18n taraması, bu tur): Ayarlar'daki dil seçimi bölüm başlığı
    // daha önce SettingsScreen.tsx'te literal string olarak yazılıydı —
    // t()'ye alındı. Metin bilinçli olarak HER İKİ dilde de aynı (kendi
    // adını iki dilde birden gösteren tek bölüm başlığı).
    dilBolumBasligi: 'Dil / Language',
  },
  en: {
    kapat: 'Close',
    geri: 'Back',
    kaydet: 'Save',
    iptal: 'Cancel',
    tamam: 'OK',
    ayarlar: 'Settings',
    yukleniyor: 'Loading…',
    kapatBuyuk: 'CLOSE',
    vazgecBuyuk: 'CANCEL',
    tamamBuyuk: 'OK',
    dilBolumBasligi: 'Dil / Language',
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
    // Madde 1 (bu tur): kerahat şeridi geri getirildiğinde `kerahat.reason`
    // (kerahat.ts içinde SABİT Türkçe string) yerine bunlar kullanılıyor —
    // böylece İngilizce modda da doğru dilde gösterilir. Zeval kasıtlı
    // olarak burada YOK: kullanıcı isteğiyle yalnızca Zeval'de şerit hiç
    // gösterilmiyor (bkz. HomeScreen.tsx, `kerahat.tur !== 'zeval'`).
    // DİKKAT: isim `bildirimler` bölümündeki `kerahatGunesDoarken`/
    // `kerahatGunesBatarken` (bildirim metinleri, tam cümle) ile
    // KASITLI OLARAK FARKLI — `SOZLUK` birleşiminde `bildirimler`,
    // `anaSayfa`'dan SONRA spread edildiği için aynı isim burada aynı
    // anahtarı sessizce ezerdi (bu hata bir kere yapılıp fark edildi).
    kerahatSeritGunesDogarken: 'Güneş doğarken',
    kerahatSeritGunesBatarken: 'Güneş batarken',
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
    kerahatSeritGunesDogarken: 'While the sun is rising',
    kerahatSeritGunesBatarken: 'While the sun is setting',
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
    aracEsma: 'Names of Allah',
    aracKaza: 'Makeup',
    ocak: 'January', subat: 'February', mart: 'March', nisan: 'April',
    mayis: 'May', haziran: 'June', temmuz: 'July', agustos: 'August',
    eylul: 'September', ekim: 'October', kasim: 'November', aralik: 'December',
  },
};

// ── AYARLAR ── (bu paket: dil seçici dışındaki tüm bölüm de çevrildi)
// NOT: Hesaplama Yöntemi / Mezhep / Yüksek Açı / Ölçü Birimi SEÇENEKLERİNİN
// kendi etiketleri (ör. "Şafi", "Hanefi", "Açı Bazlı") bu ekranda değil,
// `context/CalculationSettingsContext.tsx` içindeki paylaşılan listelerde
// tanımlı — o dosya henüz i18n'e geçirilmedi, kapsamı bu ekrandan daha
// geniş (birkaç ekran/bildirim tarafından da kullanılıyor), bir sonraki
// çeviri turunda ele alınacak.
const ayarlar = {
  tr: {
    ayarlarAltBaslik: 'Tüm tercihler tek yerde',
    vaktindeKil: 'Vaktinde Kıl',
    hatirlaticilar: 'Hatırlatıcılar',
    hesaplamaYontemiBaslik: 'Hesaplama Yöntemi',
    otomatik: 'Otomatik',
    konumAliniyor: 'Konum alınıyor…',
    konumTekrarDene: 'Konumu tekrar dene',
    konumaGore: 'Konuma göre',
    ikindiHesabi: 'İkindi Hesabı',
    yuksekAciHesabi: 'Yüksek Açı Hesabı',
    kerahatVaktiSuresi: 'Kerahat Vakti Süresi',
    dk: (n: number) => `${n} dk`,
    kerahatVaktindeUyar: 'Kerahat Vaktinde Uyar',
    kisisellestirmeBaslik: 'Kişiselleştirme',
    hicriGunDuzeltme: 'Hicri Gün Düzeltme',
    hicriGunDegisimiAksam: 'Hicri Gün Değişimini Akşam Vaktinde Yap',
    olcuBirimleri: 'Ölçü Birimleri',
    genelBaslik: 'Genel',
    titresim: 'Titreşim',
    yuzustuSesKapat: 'Cihazı Yüzüstü Çevirdiğinde Sesi Kapat',
    bildirimCubuguWidgeti: 'Bildirim Çubuğu Widgeti',
    ezanDuasi: 'Ezan Duası',
    sabahEzaniImsakVaktinde: 'Sabah Ezanı İmsak Vaktinde Oku',
    vakitlerdenOnceUyarilar: 'Vakitlerden Önce Uyarılar',
    dakikaOnce: (n: number) => `${n} dakika önce`,
    sesiDegistir: (etiket: string) => `Sesi Değiştir · ${etiket}`,
    vakitZamanindaUyarilar: 'Vakit Zamanında Uyarılar',
    kerahatVaktiDakika: 'Kerahat Vakti (dakika)',
    dakika: (n: number) => `${n} dakika`,
    uyariSesi: (etiket: string) => `${etiket} Uyarı Sesi`,
    konumIzniVerilmedi: 'Konum izni verilmedi. Telefon Ayarları > Uygulamalar > AzanAtlas > İzinler üzerinden konum iznini elle açabilirsin.',
    konumBasariylaAlindi: 'Konum başarıyla alındı — Otomatik mod aktif.',
    konumAlinamadi: 'Konum alınamadı. GPS açık mı ve konum servisleri etkin mi kontrol et.',
    gpsKonumu: 'GPS Konumu',
    fromImsak: 'İmsaktan', fromGunes: 'Güneşten', fromOgle: 'Öğleden',
    fromIkindi: 'İkindiden', fromAksam: 'Akşamdan', fromYatsi: 'Yatsıdan',
    ezanSabah: 'Sabah Ezanı', ezanOgle: 'Öğle Ezanı', ezanIkindi: 'İkindi Ezanı',
    ezanAksam: 'Akşam Ezanı', ezanYatsi: 'Yatsı Ezanı',
  },
  en: {
    ayarlarAltBaslik: 'All preferences in one place',
    vaktindeKil: 'Pray on Time',
    hatirlaticilar: 'Reminders',
    hesaplamaYontemiBaslik: 'Calculation Method',
    otomatik: 'Automatic',
    konumAliniyor: 'Getting location…',
    konumTekrarDene: 'Retry location',
    konumaGore: 'Based on location',
    ikindiHesabi: 'Asr Calculation',
    yuksekAciHesabi: 'High Latitude Rule',
    kerahatVaktiSuresi: 'Disliked Time Duration',
    dk: (n: number) => `${n} min`,
    kerahatVaktindeUyar: 'Warn During Disliked Time',
    kisisellestirmeBaslik: 'Personalization',
    hicriGunDuzeltme: 'Hijri Day Adjustment',
    hicriGunDegisimiAksam: 'Change Hijri Day at Maghrib',
    olcuBirimleri: 'Units',
    genelBaslik: 'General',
    titresim: 'Vibration',
    yuzustuSesKapat: 'Mute When Face Down',
    bildirimCubuguWidgeti: 'Notification Bar Widget',
    ezanDuasi: 'Post-Adhan Supplication',
    sabahEzaniImsakVaktinde: 'Play Fajr Adhan at Imsak Time',
    vakitlerdenOnceUyarilar: 'Alerts Before Prayer Times',
    dakikaOnce: (n: number) => `${n} minutes before`,
    sesiDegistir: (etiket: string) => `Change Sound · ${etiket}`,
    vakitZamanindaUyarilar: 'Alerts At Prayer Time',
    kerahatVaktiDakika: 'Disliked Time (minutes)',
    dakika: (n: number) => `${n} minutes`,
    uyariSesi: (etiket: string) => `${etiket} Alert Sound`,
    konumIzniVerilmedi: 'Location permission not granted. You can enable it manually via Phone Settings > Apps > AzanAtlas > Permissions.',
    konumBasariylaAlindi: 'Location acquired successfully — Automatic mode active.',
    konumAlinamadi: 'Could not get location. Check that GPS and location services are enabled.',
    gpsKonumu: 'GPS Location',
    fromImsak: 'From Imsak', fromGunes: 'From Sunrise', fromOgle: 'From Dhuhr',
    fromIkindi: 'From Asr', fromAksam: 'From Maghrib', fromYatsi: 'From Isha',
    ezanSabah: 'Fajr Adhan', ezanOgle: 'Dhuhr Adhan', ezanIkindi: 'Asr Adhan',
    ezanAksam: 'Maghrib Adhan', ezanYatsi: 'Isha Adhan',
  },
};

// ── KAZA TAKİBİ ──
const kaza = {
  tr: {
    kazaTakibi: 'Kaza Takibi',
    toplamKaza: (n: number) => `Toplam ${n} kaza`,
    kazaBorcuYok: 'Kaza borcu yok',
    toplamKazaBorcu: 'toplam kaza borcu',
    kazaBorcuGorunmuyor: 'kaza borcunuz görünmüyor',
    namaz: 'Namaz',
    oruc: 'Oruç',
    vitir: 'Vitir',
    kazaSayisiniAzalt: (etiket: string) => `${etiket} kaza sayısını azalt`,
    kazaSayisiniArtir: (etiket: string) => `${etiket} kaza sayısını artır`,
    kazaNotu: 'Sayaçlar yalnızca bu cihazda tutulur. Kaza namazlarınızı kıldıkça eksi düğmesiyle sayıyı düşürün.',
  },
  en: {
    kazaTakibi: 'Makeup Tracker',
    toplamKaza: (n: number) => `${n} total makeup`,
    kazaBorcuYok: 'No makeup owed',
    toplamKazaBorcu: 'total makeup owed',
    kazaBorcuGorunmuyor: 'you have no makeup owed',
    namaz: 'Prayer',
    oruc: 'Fasting',
    vitir: 'Witr',
    kazaSayisiniAzalt: (etiket: string) => `Decrease ${etiket} makeup count`,
    kazaSayisiniArtir: (etiket: string) => `Increase ${etiket} makeup count`,
    kazaNotu: 'Counters are kept on this device only. Lower the count with the minus button as you make up your prayers.',
  },
};

// ── KEŞFET ──
const kesfet = {
  tr: {
    kesfetAltBaslik: 'Tüm araçlar',
    grupIbadet: 'İbadet',
    grupHatirlatmaAyarlar: 'Hatırlatma ve Ayarlar',
    aciklamaYonBul: 'Yön bul',
    aciklamaZikirmatik: 'Zikirmatik',
    adEsmaulHusna: 'Esmâü’l-Hüsnâ',
    aciklama99GuzelIsim: '99 güzel isim',
    aciklamaAylikTakvim: 'Aylık takvim',
    adIbadetTakibi: 'İbadet Takibi',
    aciklamaGunlukSeri: 'Günlük seri',
    aciklamaBorcSayaci: 'Borç sayacı',
    aciklamaTekrarliUyari: 'Tekrarlı uyarı',
    aciklamaOzelUyarilar: 'Özel uyarılar',
    adTema: 'Tema',
    aciklamaRenkDuzeni: '11 renk düzeni',
    adKonum: 'Konum',
    aciklamaSehirSec: 'Şehir seç',
    aciklamaTumAyarlar: 'Tüm ayarlar',
    kesfetSeriRozeti: (n: number) => `${n}g`,
  },
  en: {
    kesfetAltBaslik: 'All tools',
    grupIbadet: 'Worship',
    grupHatirlatmaAyarlar: 'Reminders & Settings',
    aciklamaYonBul: 'Find direction',
    aciklamaZikirmatik: 'Dhikr counter',
    adEsmaulHusna: 'Names of Allah',
    aciklama99GuzelIsim: '99 beautiful names',
    aciklamaAylikTakvim: 'Monthly calendar',
    adIbadetTakibi: 'Worship Tracker',
    aciklamaGunlukSeri: 'Daily streak',
    aciklamaBorcSayaci: 'Debt counter',
    aciklamaTekrarliUyari: 'Repeating alert',
    aciklamaOzelUyarilar: 'Custom alerts',
    adTema: 'Theme',
    aciklamaRenkDuzeni: '11 color palettes',
    adKonum: 'Location',
    aciklamaSehirSec: 'Choose city',
    aciklamaTumAyarlar: 'All settings',
    kesfetSeriRozeti: (n: number) => `${n}d`,
  },
};

// ── ESMÂÜ'L-HÜSNÂ ──
const esma = {
  tr: {
    esmaAltBaslik: 'Allah’ın 99 güzel ismi',
    esmaAramaYerTutucu: 'İsim veya anlam ara',
    esmaAramayiTemizle: 'Aramayı temizle',
    esmaSonucBulunamadi: 'Aramanızla eşleşen isim bulunamadı.',
  },
  en: {
    esmaAltBaslik: 'The 99 beautiful names of Allah',
    esmaAramaYerTutucu: 'Search name or meaning',
    esmaAramayiTemizle: 'Clear search',
    esmaSonucBulunamadi: 'No names match your search.',
  },
};

// ── HATIRLATICILAR ──
const hatirlaticilarEkrani = {
  tr: {
    sahurUyarisi: 'Sahur Uyarısı',
    teheccutUyandirma: 'Teheccüt Uyandırma',
    pazartesiPersembeOrucuBaslik: 'Pazartesi/Perşembe Orucu',
    cumaNamaziHatirlatma: 'Cuma Namazı Hatırlatma',
    birGunOnceHatirlat: 'Bir gün önce hatırlat',
    kacDakikaOnce: 'Kaç Dakika Önce',
    uyariSesiBaslik: 'Uyarı Sesi',
    dkOnce: (n: number) => `${n} dk. önce`,
  },
  en: {
    sahurUyarisi: 'Suhoor Alert',
    teheccutUyandirma: 'Tahajjud Wake-up',
    pazartesiPersembeOrucuBaslik: 'Monday/Thursday Fast',
    cumaNamaziHatirlatma: 'Friday Prayer Reminder',
    birGunOnceHatirlat: 'Remind a day before',
    kacDakikaOnce: 'How Many Minutes Before',
    uyariSesiBaslik: 'Alert Sound',
    dkOnce: (n: number) => `${n} min. before`,
  },
};

// ── VAKTİNDE KIL ──
// NOT: alıntı ("Allah katında en hayırlı amel...") bir HADİS metni —
// Ana Sayfa'daki ayet/tarih verileri gibi VERİ içeriği sayılıyor, bu
// paketin kapsamı dışında (yalnızca çevre metinler çevrildi).
const vaktindeKilEkrani = {
  tr: {
    vaktindeKilBilgi:
      'Vaktinde Kıl açıkken, bir namaz vakti girdikten belirlediğin gecikme süresi kadar sonra, eğer o vakti henüz kılmadıysan sana hatırlatma bildirimi gönderir. Bir sonraki vakit girene kadar, belirlediğin sıklıkla bu hatırlatma tekrarlanır. Bildirimdeki "Kıldım" butonuna dokunursan, o vakit için kalan hatırlatmalar durur.',
    // Madde 7 (i18n taraması, bu tur): bu hadis alıntısı daha önce
    // VaktindeKilScreen.tsx'te hardcoded Türkçe idi.
    vaktindeKilHadis:
      'Allah katında en hayırlı amel, vaktinde kılınan namazdır. Sonra anne babaya iyilik, sonra da Allah yolunda cihad etmektir.',
    vaktindeKilHadisKaynak: 'Buhârî',
    ilkUyariGecikmesi: 'İlk Uyarı Gecikmesi',
    uyariSikligi: 'Uyarı Sıklığı',
    dakikadaBir: (n: number) => `${n} dakikada bir`,
    bip: 'Bip',
    dong: 'Dong',
  },
  en: {
    vaktindeKilBilgi:
      'When Pray on Time is on, it sends you a reminder notification after your chosen delay once a prayer time begins, if you haven’t marked it as performed yet. This reminder repeats at your chosen frequency until the next prayer time begins. Tapping "Done" on the notification stops the remaining reminders for that prayer.',
    vaktindeKilHadis:
      'The most beloved deed to Allah is prayer performed on time, then kindness to parents, then striving in the way of Allah.',
    vaktindeKilHadisKaynak: 'Sahih al-Bukhari',
    ilkUyariGecikmesi: 'First Alert Delay',
    uyariSikligi: 'Alert Frequency',
    dakikadaBir: (n: number) => `Every ${n} minutes`,
    bip: 'Beep',
    dong: 'Chime',
  },
};

// ── İMSAKİYE ──
const imsakiyeEkrani = {
  tr: {
    diyanetTakvimiVerisi: 'Diyanet Takvimi verisi',
    yerelHesaplamaUlasilamadi: 'Yerel hesaplama (Diyanet verisine ulaşılamadı)',
    bugun: 'Bugün',
  },
  en: {
    diyanetTakvimiVerisi: 'Diyanet Calendar data',
    yerelHesaplamaUlasilamadi: 'Local calculation (Diyanet data unavailable)',
    bugun: 'Today',
  },
};

// Gün adları (haftanın günleri) — İmsakiye cetvelinde kullanılıyor.
const gunAdlari = {
  tr: {
    pazar: 'Pazar', pazartesi: 'Pazartesi', sali: 'Salı', carsamba: 'Çarşamba',
    persembe: 'Perşembe', cuma: 'Cuma', cumartesi: 'Cumartesi',
  },
  en: {
    pazar: 'Sunday', pazartesi: 'Monday', sali: 'Tuesday', carsamba: 'Wednesday',
    persembe: 'Thursday', cuma: 'Friday', cumartesi: 'Saturday',
  },
};

// ── KONUM SEÇİCİ ──
// NOT: il/ilçe adları (TURKEY_PROVINCES, DISTRICT_COORDS) yer adı VERİSİ —
// diğer uygulamalardaki gibi yer adları çevrilmiyor, yalnızca çevre metin
// çevrildi.
const konumSecici = {
  tr: {
    sehriDegistir: 'Şehri Değiştir',
    ilSec: 'İl Seç',
    ilceSec: 'İlçe Seç',
    sil: 'Sil',
    gpsIleEkle: 'GPS ile Ekle',
    ilIlceSecerekEkle: '+ İl/İlçe Seçerek Ekle',
  },
  en: {
    sehriDegistir: 'Change City',
    ilSec: 'Select Province',
    ilceSec: 'Select District',
    sil: 'Delete',
    gpsIleEkle: 'Add via GPS',
    ilIlceSecerekEkle: '+ Add by Selecting Province/District',
  },
};

// ── BİLDİRİMLER ── (madde 3, bu paket)
// NOT: `lib/notificationScheduler.ts`, `lib/remindersScheduler.ts` ve
// `lib/vaktindeKilScheduler.ts` React bileşeni DEĞİL — `useCeviri()` hook'unu
// çağıramazlar. Bu yüzden bu üç dosyadaki fonksiyonlar artık bir `dil`
// parametresi alıyor (çağıran taraf, yani HomeScreen, aktif dili
// `useCeviri()`'den okuyup geçiriyor) ve metni doğrudan bu sözlükten
// (`SOZLUK[dil]`) okuyor — ekran render'ı değil, bildirim PLANLANDIĞI ANDA
// hangi dil aktifse o dilde metin gömülüyor. Kullanıcı dili değiştirdiğinde
// HomeScreen'deki zamanlama efekti yeniden çalışıp bildirimleri o dille
// yeniden kurar (bkz. HomeScreen'deki useEffect'in bağımlılık dizisi).
const bildirimler = {
  tr: {
    bildirimVaktiBaslik: (vakitAdi: string) => `${vakitAdi} Vakti`,
    bildirimVaktiGirdiGovde: (vakitAdi: string) => `${vakitAdi} vakti girdi.`,
    bildirimOnUyariBaslik: (vakitAdi: string, dk: number) => `${vakitAdi} Vaktine ${dk} Dakika`,
    bildirimOnUyariGovde: (vakitAdi: string) => `${vakitAdi} vaktine az kaldı.`,
    kerahatVaktiBaslik: 'Kerahat Vakti',
    kerahatGunesDoarken: 'Güneş doğarken namaz kılınması mekruhtur.',
    kerahatGunesBatarken: 'Güneş batarken namaz kılınması mekruhtur.',
    kerahatZeval: 'Zeval vakti — namaz kılınması mekruhtur.',
    titresimli: 'Titreşimli',
    titresimsiz: 'Titreşimsiz',
    bildirimleriTitresimli: 'AzanAtlas Bildirimleri (Titreşimli)',
    bildirimleriTitresimsiz: 'AzanAtlas Bildirimleri (Titreşimsiz)',
    sahurUyarisiBaslik: 'Sahur Uyarısı',
    sahurUyarisiGovde: (dk: number) => `İmsak vaktine ${dk} dakika kaldı.`,
    teheccutBaslik: 'Teheccüt Uyandırma',
    teheccutGovde: 'Teheccüt namazı için uyanma vakti.',
    pazartesiPersembeBaslik: 'Pazartesi/Perşembe Orucu',
    pazartesiPersembeGovde: 'Niyet etmeyi ve sahuru unutma.',
    yarinOrucGunuBaslik: 'Yarın Oruç Günü',
    yarinOrucGunuGovde: 'Yarın Pazartesi/Perşembe orucu — unutma.',
    cumaBaslik: 'Cuma Namazı Hatırlatma',
    cumaGovde: 'Cuma namazına hazırlan.',
    vaktindeKilBaslik: (vakitAdi: string) => `${vakitAdi} Namazı`,
    vaktindeKilGovde: (vakitAdi: string) => `${vakitAdi} namazını henüz kılmadıysan vaktinde kılmayı unutma.`,
    // Madde 7 (i18n taraması, bu tur): "Vaktinde Kıl" bildirimindeki aksiyon
    // butonu metinleri (bkz. vaktindeKilActions.ts) daha önce hardcoded
    // Türkçe idi ve `dil` parametresi hiç almıyordu — İngilizce arayüzde
    // bile "KILDIM" / "Sonra hatırlat" görünüyordu.
    vaktindeKilButonuKildim: '✓  KILDIM',
    vaktindeKilButonuSonraHatirlat: 'Sonra hatırlat',
  },
  en: {
    bildirimVaktiBaslik: (vakitAdi: string) => `${vakitAdi} Time`,
    bildirimVaktiGirdiGovde: (vakitAdi: string) => `It is now time for ${vakitAdi}.`,
    bildirimOnUyariBaslik: (vakitAdi: string, dk: number) => `${dk} Minutes to ${vakitAdi}`,
    bildirimOnUyariGovde: (vakitAdi: string) => `${vakitAdi} time is approaching.`,
    kerahatVaktiBaslik: 'Disliked Time',
    kerahatGunesDoarken: 'It is disliked (makrooh) to pray while the sun is rising.',
    kerahatGunesBatarken: 'It is disliked (makrooh) to pray while the sun is setting.',
    kerahatZeval: 'Zawal time — prayer is disliked (makrooh) during this period.',
    titresimli: 'Vibration',
    titresimsiz: 'No Vibration',
    bildirimleriTitresimli: 'AzanAtlas Notifications (Vibration)',
    bildirimleriTitresimsiz: 'AzanAtlas Notifications (No Vibration)',
    sahurUyarisiBaslik: 'Suhoor Reminder',
    sahurUyarisiGovde: (dk: number) => `${dk} minutes until Imsak.`,
    teheccutBaslik: 'Tahajjud Wake-up',
    teheccutGovde: 'Time to wake up for Tahajjud prayer.',
    pazartesiPersembeBaslik: 'Monday/Thursday Fast',
    pazartesiPersembeGovde: "Don't forget to make your intention and have suhoor.",
    yarinOrucGunuBaslik: 'Fasting Day Tomorrow',
    yarinOrucGunuGovde: "Tomorrow is a Monday/Thursday fast — don't forget.",
    cumaBaslik: 'Friday Prayer Reminder',
    cumaGovde: 'Get ready for Friday prayer.',
    vaktindeKilBaslik: (vakitAdi: string) => `${vakitAdi} Prayer`,
    vaktindeKilGovde: (vakitAdi: string) => `If you haven't prayed ${vakitAdi} yet, don't forget to pray it on time.`,
    vaktindeKilButonuKildim: '✓  PRAYED',
    vaktindeKilButonuSonraHatirlat: 'Remind me later',
  },
};

// ── TESBİH / ZİKİRMATİK ──
const tesbih = {
  tr: {
    dokunSaymakIcin: 'Saymak için dokunun',
    tamamlananTur: 'Tamamlanan tur',
    geriAl: 'Geri Al',
    sifirla: 'Sıfırla',
    sayaciArtirEtiketi: (sayac: number, hedef: number) => `Sayacı artır. Şu an ${sayac}, hedef ${hedef}`,
    sonSayimiGeriAlEtiketi: 'Son sayımı geri al',
    sayaciSifirlaEtiketi: 'Sayacı ve turları sıfırla',
  },
  en: {
    dokunSaymakIcin: 'Tap to count',
    tamamlananTur: 'Completed rounds',
    geriAl: 'Undo',
    sifirla: 'Reset',
    sayaciArtirEtiketi: (sayac: number, hedef: number) => `Increase counter. Currently ${sayac}, target ${hedef}`,
    sonSayimiGeriAlEtiketi: 'Undo last count',
    sayaciSifirlaEtiketi: 'Reset counter and rounds',
  },
};

// ── İBADET TAKİBİ ──
const takip = {
  tr: {
    besVaktiNamaz: 'Beş vakit namaz',
    kesintisizSeri: 'Kesintisiz seri',
    gun: 'gün',
    seriBaslarSonrasi: 'Beş vakti tamamladığın gün seri başlar.',
    seriDevamAciklama: 'Beş vakti de tamamladığın kesintisiz gün sayısı.',
    son28GundeKilinanVakit: 'son 28 günde\nkılınan vakit',
    bugun: 'Bugün',
    bugüneDon: 'Bugüne dön',
    namaziEtiketi: (vakitAdi: string) => `${vakitAdi} namazı`,
    gelecekGunUyarisi: 'Gelecek bir gün işaretlenemez.',
    son4Hafta: 'Son 4 hafta',
    gunVakitKilindiEtiketi: (gun: number, ay: string, n: number) => `${gun} ${ay}, ${n} vakit kılındı`,
    besVaktiTam: 'Beş vakit tam',
    kismen: 'Kısmen',
    kayitYok: 'Kayıt yok',
    takipNotu: 'Kayıtlar yalnızca bu cihazda tutulur; hiçbir sunucuya gönderilmez. Bildirimdeki "Kıldım" butonuna bastığında da o vakit burada işaretlenir.',
  },
  en: {
    besVaktiNamaz: 'The five daily prayers',
    kesintisizSeri: 'Current streak',
    gun: 'days',
    seriBaslarSonrasi: 'Your streak starts the day you complete all five prayers.',
    seriDevamAciklama: 'The number of consecutive days you completed all five prayers.',
    son28GundeKilinanVakit: 'prayers performed\nin the last 28 days',
    bugun: 'Today',
    bugüneDon: 'Back to today',
    namaziEtiketi: (vakitAdi: string) => `${vakitAdi} prayer`,
    gelecekGunUyarisi: 'A future day cannot be marked.',
    son4Hafta: 'Last 4 weeks',
    gunVakitKilindiEtiketi: (gun: number, ay: string, n: number) => `${ay} ${gun}, ${n} prayers performed`,
    besVaktiTam: 'All five prayers',
    kismen: 'Partial',
    kayitYok: 'No record',
    takipNotu: 'Records are kept on this device only; nothing is sent to a server. Tapping "Done" on a notification also marks that prayer here.',
  },
};

// ── TEMA SEÇİMİ ──
// NOT: palet adları/açıklamaları ("İznik Turkuazı" vb.) burada değil,
// `theme.ts`'teki `PALETLER` nesnesinde — her palet artık `adEn`/
// `aciklamaEn` alanlarını da taşıyor, TemaScreen aktif dile göre seçiyor.
const temaEkrani = {
  tr: {
    renkDuzeni: (n: number) => `${n} renk düzeni`,
    seciminizKaydedildi: 'Seçiminiz kaydedildi. Yeni tema, uygulamayı kapatıp açtığınızda uygulanacak.',
    temaAciklamaParagrafi: 'Tüm temalar İslami sanat geleneğinden türetildi. Her birinin metin okunabilirliği ayrı ayrı ölçüldü — hangisini seçerseniz seçin yazılar net kalır.',
    temaEtiketi: (ad: string, aciklama: string) => `${ad} teması. ${aciklama}`,
    suAnKullanimda: 'Şu an kullanımda',
    temaNotu: 'Tema seçtiğinizde bir onay penceresi açılır. Hemen yeniden başlatmak istemezseniz uygulama olduğu gibi açık kalır, yeni tema bir sonraki normal açılışta uygulanır.',
    temaDegisti: 'Tema değişti',
    temaKaydedildiYeniden: (ad: string) => `${ad} teması kaydedildi. Değişikliğin uygulanması için uygulamanın yeniden başlaması gerekiyor.`,
    yenidenBaslatiliyor: 'Yeniden başlatılıyor…',
    simdiYenidenBaslat: 'Şimdi Yeniden Başlat',
    dahaSonraBtn: 'Daha Sonra',
  },
  en: {
    renkDuzeni: (n: number) => `${n} color palettes`,
    seciminizKaydedildi: 'Your selection has been saved. The new theme will apply the next time you close and reopen the app.',
    temaAciklamaParagrafi: "All themes are derived from the Islamic art tradition. Each one's text readability was measured individually — whichever you choose, the text stays clear.",
    temaEtiketi: (ad: string, aciklama: string) => `${ad} theme. ${aciklama}`,
    suAnKullanimda: 'Currently in use',
    temaNotu: "A confirmation window opens when you pick a theme. If you don't want to restart right away, the app stays open as is, and the new theme applies at the next normal launch.",
    temaDegisti: 'Theme changed',
    temaKaydedildiYeniden: (ad: string) => `The ${ad} theme has been saved. The app needs to restart for the change to take effect.`,
    yenidenBaslatiliyor: 'Restarting…',
    simdiYenidenBaslat: 'Restart Now',
    dahaSonraBtn: 'Later',
  },
};

// ── KIBLE ──
const kibleEkrani = {
  tr: {
    kible: 'Kıble',
    pusulaDogrulugu: 'Pusula Doğruluğu',
    pusulaDogruluguGiris: 'Pusulanın doğruluğu tamamen telefonunuzun manyetik sensörüne bağlıdır. Aşağıdaki adımlar çoğu telefonda doğruluğu belirgin şekilde artırır.',
    pusulaAdim1: 'Telefonu mıknatıs, hoparlör ve metal yüzeylerden uzaklaştırın. Mıknatıslı kılıflar pusulayı en çok bozan etkendir.',
    pusulaAdim2: 'Telefonu düz tutarak havada sekiz (8) çizer gibi birkaç kez çevirin. Bu, cihazın sensörü yeniden kalibre etmesini sağlar.',
    pusulaAdim3: 'Mümkünse açık alanda kullanın. Bina içi, asansör ve otopark manyetik alanı bozar.',
    pusulaAdim4: 'Telefonu yere paralel (masaya koyar gibi) tutun. Eğik tutmak okumayı kaydırır.',
    pusulaHazirlaniyor: 'Pusula hazırlanıyor…',
    kibleYonundesiniz: 'Kıble yönündesiniz',
    sagaDonun: 'Sağa dönün',
    solaDonun: 'Sola dönün',
    kibleAcisi: 'Kıble açısı',
    kabeyeUzaklik: 'Kâbe’ye uzaklık',
    gunesleKibleAni: 'Güneşle kıble anı',
    pusulaSensorunaErisilemedi: 'Pusula sensörüne erişilemedi.',
    pusulaOkumasiBekleniyor: 'Pusula okuması bekleniyor. Telefonu düz tutup hafifçe çevirin.',
    manyetikKuzeyeGoreGosteriliyor: 'Manyetik kuzeye göre gösteriliyor. Konum izni verilirse gerçek kuzeye göre daha isabetli olur.',
    pusulaDogruGostermiyorMu: 'Pusula doğru göstermiyor mu?',
    mil: 'mil',
    yonKuzey: 'K', yonDogu: 'D', yonGuney: 'G', yonBati: 'B',
  },
  en: {
    kible: 'Qibla',
    pusulaDogrulugu: 'Compass Accuracy',
    pusulaDogruluguGiris: "The compass's accuracy depends entirely on your phone's magnetic sensor. The steps below noticeably improve accuracy on most phones.",
    pusulaAdim1: 'Keep the phone away from magnets, speakers, and metal surfaces. Magnetic cases are the biggest cause of compass interference.',
    pusulaAdim2: 'Hold the phone flat and move it in a figure-eight (8) motion in the air a few times. This lets the device recalibrate its sensor.',
    pusulaAdim3: 'Use it outdoors when possible. Indoors, elevators, and parking garages disturb the magnetic field.',
    pusulaAdim4: 'Hold the phone parallel to the ground (as if placing it on a table). Tilting it skews the reading.',
    pusulaHazirlaniyor: 'Preparing compass…',
    kibleYonundesiniz: 'You are facing the Qibla',
    sagaDonun: 'Turn right',
    solaDonun: 'Turn left',
    kibleAcisi: 'Qibla angle',
    kabeyeUzaklik: 'Distance to Kaaba',
    gunesleKibleAni: 'Sun-Qibla alignment time',
    pusulaSensorunaErisilemedi: 'Could not access the compass sensor.',
    pusulaOkumasiBekleniyor: 'Waiting for compass reading. Hold the phone flat and turn it slightly.',
    manyetikKuzeyeGoreGosteriliyor: 'Shown relative to magnetic north. Granting location permission gives a more accurate reading relative to true north.',
    pusulaDogruGostermiyorMu: "Compass not pointing correctly?",
    mil: 'mi',
    yonKuzey: 'N', yonDogu: 'E', yonGuney: 'S', yonBati: 'W',
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
  tr: {
    ...ortak.tr, ...anaSayfa.tr, ...ayarlar.tr, ...kaza.tr, ...kesfet.tr, ...esma.tr,
    ...hatirlaticilarEkrani.tr, ...vaktindeKilEkrani.tr, ...imsakiyeEkrani.tr,
    ...gunAdlari.tr, ...konumSecici.tr, ...bildirimler.tr, ...tesbih.tr, ...takip.tr,
    ...temaEkrani.tr, ...kibleEkrani.tr, vakit: vakitAdlari.tr,
  },
  en: {
    ...ortak.en, ...anaSayfa.en, ...ayarlar.en, ...kaza.en, ...kesfet.en, ...esma.en,
    ...hatirlaticilarEkrani.en, ...vaktindeKilEkrani.en, ...imsakiyeEkrani.en,
    ...gunAdlari.en, ...konumSecici.en, ...bildirimler.en, ...tesbih.en, ...takip.en,
    ...temaEkrani.en, ...kibleEkrani.en, vakit: vakitAdlari.en,
  },
};

export type CeviriAnahtari = keyof typeof SOZLUK['tr'];

/**
 * Bileşen olmayan (hook çağıramayan) dosyalar için — `lib/*Scheduler.ts`
 * gibi — doğrudan çeviri okuma yardımcıları. `useCeviri()`'nin `t()`/
 * `vakitAdi()` fonksiyonlarıyla AYNI davranışı taşır, yalnızca React
 * state'ine değil doğrudan geçirilen `dil` parametresine bağlıdır.
 */
export function tDil(dil: DilKodu, anahtar: CeviriAnahtari, ...args: any[]): string {
  const kaynak = (SOZLUK[dil] as any)[anahtar] ?? (SOZLUK[VARSAYILAN_DIL] as any)[anahtar];
  if (typeof kaynak === 'function') return kaynak(...args);
  if (typeof kaynak === 'string') return kaynak;
  return String(anahtar);
}

export function vakitAdiDil(dil: DilKodu, kod: keyof typeof vakitAdlari['tr']): string {
  return (vakitAdlari[dil] as any)[kod] ?? (vakitAdlari[VARSAYILAN_DIL] as any)[kod] ?? String(kod);
}

/** Ay adı anahtarları, 0=Ocak/January sırasıyla — `new Date().getMonth()`
    ile doğrudan indekslenebilsin diye. `useCeviri()`'nin `t()` fonksiyonu
    ile birlikte kullanılır: `t(AY_ANAHTARLARI[now.getMonth()])`. */
export const AY_ANAHTARLARI: CeviriAnahtari[] = [
  'ocak', 'subat', 'mart', 'nisan', 'mayis', 'haziran',
  'temmuz', 'agustos', 'eylul', 'ekim', 'kasim', 'aralik',
];

/** Gün adı anahtarları, 0=Pazar sırasıyla — `Date.getDay()` ile doğrudan
    indekslenebilsin diye (İmsakiye cetveli için). */
export const GUN_ANAHTARLARI: CeviriAnahtari[] = [
  'pazar', 'pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi',
];
