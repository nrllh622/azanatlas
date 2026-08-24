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
    ilkUyariGecikmesi: 'İlk Uyarı Gecikmesi',
    uyariSikligi: 'Uyarı Sıklığı',
    dakikadaBir: (n: number) => `${n} dakikada bir`,
    bip: 'Bip',
    dong: 'Dong',
  },
  en: {
    vaktindeKilBilgi:
      'When Pray on Time is on, it sends you a reminder notification after your chosen delay once a prayer time begins, if you haven’t marked it as performed yet. This reminder repeats at your chosen frequency until the next prayer time begins. Tapping "Done" on the notification stops the remaining reminders for that prayer.',
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
    ...gunAdlari.tr, ...konumSecici.tr, vakit: vakitAdlari.tr,
  },
  en: {
    ...ortak.en, ...anaSayfa.en, ...ayarlar.en, ...kaza.en, ...kesfet.en, ...esma.en,
    ...hatirlaticilarEkrani.en, ...vaktindeKilEkrani.en, ...imsakiyeEkrani.en,
    ...gunAdlari.en, ...konumSecici.en, vakit: vakitAdlari.en,
  },
};

export type CeviriAnahtari = keyof typeof SOZLUK['tr'];

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
