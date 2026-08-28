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

// Faz-1 (bu paket): Türkçe, İngilizce, Endonezce, Fransızca. Sıradaki fazlar
// (Arapça, Urduca, Bengalce, Hausa, Swahili, Farsça, Kürtçe lehçeleri)
// onaylanmış yol haritasına göre ayrı paketlerde eklenecek — bkz. proje
// devir dosyası / pazar stratejisi raporu.
export type DilKodu = 'tr' | 'en' | 'id' | 'fr';

export const VARSAYILAN_DIL: DilKodu = 'tr';

export const DIL_ADLARI: Record<DilKodu, string> = {
  tr: 'Türkçe',
  en: 'English',
  id: 'Bahasa Indonesia',
  fr: 'Français',
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
  },
  id: {
    kapat: 'Tutup',
    geri: 'Kembali',
    kaydet: 'Simpan',
    iptal: 'Batal',
    tamam: 'OK',
    ayarlar: 'Pengaturan',
    yukleniyor: 'Memuat…',
    kapatBuyuk: 'TUTUP',
    vazgecBuyuk: 'BATAL',
    tamamBuyuk: 'OK',
  },
  fr: {
    kapat: 'Fermer',
    geri: 'Retour',
    kaydet: 'Enregistrer',
    iptal: 'Annuler',
    tamam: 'OK',
    ayarlar: 'Paramètres',
    yukleniyor: 'Chargement…',
    kapatBuyuk: 'FERMER',
    vazgecBuyuk: 'ANNULER',
    tamamBuyuk: 'OK',
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
    kerahatSebepGunesDogarken: 'Güneş doğarken',
    kerahatSebepZeval: 'Zeval vakti (öğleye yakın)',
    kerahatSebepGunesBatarken: 'Güneş batarken',
    iftaraKalan: (sure: string) => `İftara kalan süre: ${sure}`,
    diyanetUlasilamadi: 'Diyanet verisine ulaşılamadı, geçici olarak yerel hesaplama gösteriliyor.',
    // Madde 2 (bu tur): manuel moddayken (Otomatik kapalı) Diyanet'e hiç
    // başvurulmuyor — bkz. prayerCalculator.ts. Bu, kullanıcının kendi
    // mezhep/yöntem seçimine SAYGI gösterildiği anlamına gelir, bir "hata"
    // değildir. Önceden bu durumda da "ulaşılamadı" metni gösteriliyordu —
    // yanıltıcıydı. Artık ayrı, nötr bir etiket kullanılıyor.
    yerelHesaplamaManuel: 'Yerel hesaplama — manuel ayarların kullanılıyor.',
    simdi: 'Şimdi',
    kilindiOlarakIsaretle: (vakit: string) => `${vakit} namazını kıldım olarak işaretle`,
    vaktiBildirimi: (vakit: string) => `${vakit} vakti bildirimi`,
    islamTarihindeBugun: 'İslam Tarihinde Bugün',
    islamTarihinden: 'İslam Tarihinden',
    yilDonumineGunVar: (n: number) => `Yıl dönümüne ${n} gün var`,
    yilDonumuGunOnceydi: (n: number) => `Yıl dönümü ${n} gün önceydi`,
    // Madde 8 (6. tur): karşılıksız, harici bağış linki — reklam kaldırma
    // gibi bir vaat İÇERMİYOR, sadece "geliştiriciye destek" çağrısı.
    destekOl: 'Geliştiriciye Destek Ol',
    destekOlAciklama: 'AzanAtlas\'ı geliştirmeye devam etmemize yardımcı olun',
    guncellemeBulunduMesaji: 'Uygulamanın yeni versiyonu bulundu.',
    sonraHatirlat: 'Sonra Hatırlat',
    simdiGuncelle: 'Şimdi Güncelle',
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
    kerahatSebepGunesDogarken: 'While the sun is rising',
    kerahatSebepZeval: 'Zawal time (near noon)',
    kerahatSebepGunesBatarken: 'While the sun is setting',
    iftaraKalan: (sure: string) => `Time to Iftar: ${sure}`,
    diyanetUlasilamadi: 'Could not reach Diyanet data, showing local calculation temporarily.',
    yerelHesaplamaManuel: 'Local calculation — using your manual settings.',
    simdi: 'Now',
    kilindiOlarakIsaretle: (vakit: string) => `Mark ${vakit} prayer as performed`,
    vaktiBildirimi: (vakit: string) => `${vakit} prayer notification`,
    islamTarihindeBugun: 'On This Day in Islamic History',
    islamTarihinden: 'From Islamic History',
    yilDonumineGunVar: (n: number) => `${n} days to anniversary`,
    yilDonumuGunOnceydi: (n: number) => `Anniversary was ${n} days ago`,
    destekOl: 'Support the Developer',
    destekOlAciklama: 'Help us keep improving AzanAtlas',
    guncellemeBulunduMesaji: 'A new version of the app is available.',
    sonraHatirlat: 'Remind Later',
    simdiGuncelle: 'Update Now',
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
    // Madde 12 (bu tur): "Names" tek başına anlamsız/eksikti — "Tasbih" gibi
    // İngilizce konuşan Müslümanlar arasında zaten yerleşik olan "Asma"
    // (Esmâ'nın uluslararası yazımı) kullanıldı.
    aracEsma: 'Asma',
    aracKaza: 'Makeup',
    ocak: 'January', subat: 'February', mart: 'March', nisan: 'April',
    mayis: 'May', haziran: 'June', temmuz: 'July', agustos: 'August',
    eylul: 'September', ekim: 'October', kasim: 'November', aralik: 'December',
  },
  id: {
    konumDegistirEtiketi: 'Ubah lokasi',
    bildirimAyarlariEtiketi: 'Pengaturan notifikasi',
    kalanSure: 'SISA WAKTU',
    siradakiVakit: 'WAKTU BERIKUTNYA',
    diyanetTakvimi: 'Kalender Diyanet',
    yerelHesaplama: 'Perhitungan lokal',
    gunlukSeri: (n: number) => `Rentetan ${n} hari`,
    gunlukSeriEtiketi: (n: number) => `Rentetan ${n} hari. Buka layar Pelacakan`,
    mekruhVakti: (sebep: string) => `Waktu makruh — ${sebep}`,
    kerahatSebepGunesDogarken: 'Saat matahari terbit',
    kerahatSebepZeval: 'Waktu zawal (mendekati tengah hari)',
    kerahatSebepGunesBatarken: 'Saat matahari terbenam',
    iftaraKalan: (sure: string) => `Waktu menuju Iftar: ${sure}`,
    diyanetUlasilamadi: 'Data Diyanet tidak dapat dijangkau, sementara menampilkan perhitungan lokal.',
    yerelHesaplamaManuel: 'Perhitungan lokal — menggunakan pengaturan manual Anda.',
    simdi: 'Sekarang',
    kilindiOlarakIsaretle: (vakit: string) => `Tandai salat ${vakit} sudah dikerjakan`,
    vaktiBildirimi: (vakit: string) => `Notifikasi waktu ${vakit}`,
    islamTarihindeBugun: 'Hari Ini dalam Sejarah Islam',
    islamTarihinden: 'Dari Sejarah Islam',
    yilDonumineGunVar: (n: number) => `${n} hari menuju hari peringatan`,
    yilDonumuGunOnceydi: (n: number) => `Hari peringatan telah berlalu ${n} hari lalu`,
    destekOl: 'Dukung Pengembang',
    destekOlAciklama: 'Bantu kami terus mengembangkan AzanAtlas',
    guncellemeBulunduMesaji: 'Versi baru aplikasi tersedia.',
    sonraHatirlat: 'Ingatkan Nanti',
    simdiGuncelle: 'Perbarui Sekarang',
    gununAyeti: 'Ayat Hari Ini',
    kalanGunKaldi: (ad: string, n: number) => `${n} hari menuju ${ad}`,
    oncekiKonum: 'Lokasi sebelumnya',
    sonrakiKonum: 'Lokasi berikutnya',
    sekmeAnaSayfa: 'Beranda',
    sekmeImsakiye: 'Jadwal Salat',
    sekmeKesfet: 'Jelajahi',
    sekmeKible: 'Kiblat',
    sekmeAyarlar: 'Pengaturan',
    aracTakip: 'Pelacakan',
    aracTesbih: 'Tasbih',
    // Madde 3 (bu tur): "Asmaul Husna" anasayfadaki dar hızlı-erişim
    // butonunda iki satıra bölünüyor ve o sütunu aşağı kaydırıyordu
    // (ekran görüntüsüyle bildirildi) — EN/FR'de zaten kullanılan kısa
    // "Asma" biçimine getirildi (Tasbih gibi tek kelime, taşma riski yok).
    // Tam "Asmaul Husna" adı ekranın kendi başlığında (`adEsmaulHusna`)
    // olduğu gibi kalıyor.
    aracEsma: 'Asma',
    aracKaza: 'Qadha',
    ocak: 'Januari', subat: 'Februari', mart: 'Maret', nisan: 'April',
    mayis: 'Mei', haziran: 'Juni', temmuz: 'Juli', agustos: 'Agustus',
    eylul: 'September', ekim: 'Oktober', kasim: 'November', aralik: 'Desember',
  },
  fr: {
    konumDegistirEtiketi: 'Changer de lieu',
    bildirimAyarlariEtiketi: 'Paramètres de notification',
    kalanSure: 'TEMPS RESTANT',
    siradakiVakit: 'PROCHAINE PRIÈRE',
    diyanetTakvimi: 'Calendrier Diyanet',
    yerelHesaplama: 'Calcul local',
    gunlukSeri: (n: number) => `Série de ${n} jours`,
    gunlukSeriEtiketi: (n: number) => `Série de ${n} jours. Ouvrir l'écran de suivi`,
    mekruhVakti: (sebep: string) => `Heure déconseillée — ${sebep}`,
    kerahatSebepGunesDogarken: 'Pendant le lever du soleil',
    kerahatSebepZeval: 'Heure du zawal (proche de midi)',
    kerahatSebepGunesBatarken: 'Pendant le coucher du soleil',
    iftaraKalan: (sure: string) => `Temps avant l'Iftar : ${sure}`,
    diyanetUlasilamadi: "Impossible d'accéder aux données Diyanet, le calcul local est affiché temporairement.",
    yerelHesaplamaManuel: 'Calcul local — vos paramètres manuels sont utilisés.',
    simdi: 'Maintenant',
    kilindiOlarakIsaretle: (vakit: string) => `Marquer la prière de ${vakit} comme accomplie`,
    vaktiBildirimi: (vakit: string) => `Notification de la prière de ${vakit}`,
    islamTarihindeBugun: "Ce jour dans l'histoire islamique",
    islamTarihinden: "De l'histoire islamique",
    yilDonumineGunVar: (n: number) => `${n} jours avant l'anniversaire`,
    yilDonumuGunOnceydi: (n: number) => `L'anniversaire était il y a ${n} jours`,
    destekOl: 'Soutenir le développeur',
    destekOlAciklama: "Aidez-nous à continuer d'améliorer AzanAtlas",
    guncellemeBulunduMesaji: "Une nouvelle version de l'application est disponible.",
    sonraHatirlat: 'Rappeler plus tard',
    simdiGuncelle: 'Mettre à jour',
    gununAyeti: 'Verset du jour',
    kalanGunKaldi: (ad: string, n: number) => `${n} jours avant ${ad}`,
    oncekiKonum: 'Lieu précédent',
    sonrakiKonum: 'Lieu suivant',
    sekmeAnaSayfa: 'Accueil',
    sekmeImsakiye: 'Horaires',
    sekmeKesfet: 'Explorer',
    sekmeKible: 'Qibla',
    sekmeAyarlar: 'Réglages',
    aracTakip: 'Suivi',
    aracTesbih: 'Tasbih',
    // Madde 12 (bu tur): "Noms" tek başına belirsizdi — "Tasbih" gibi
    // Fransızca konuşan Müslümanlar arasında da yerleşik olan "Asma"
    // (Esmâ'nın uluslararası yazımı) kullanıldı.
    aracEsma: 'Asma',
    aracKaza: 'Rattrapage',
    ocak: 'Janvier', subat: 'Février', mart: 'Mars', nisan: 'Avril',
    mayis: 'Mai', haziran: 'Juin', temmuz: 'Juillet', agustos: 'Août',
    eylul: 'Septembre', ekim: 'Octobre', kasim: 'Novembre', aralik: 'Décembre',
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
    dilBolumBasligi: 'Dil / Language',
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
    otomatikGuncelleme: 'Otomatik Güncelleme',
    otomatikGuncellemeAciklama: 'Açıksa, yeni sürüm sorulmadan arka planda indirilir',
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
    dilBolumBasligi: 'Dil / Language',
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
    otomatikGuncelleme: 'Automatic Updates',
    otomatikGuncellemeAciklama: 'When on, new versions download in the background without asking',
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
  id: {
    ayarlarAltBaslik: 'Semua preferensi di satu tempat',
    dilBolumBasligi: 'Dil / Language',
    vaktindeKil: 'Salat Tepat Waktu',
    hatirlaticilar: 'Pengingat',
    hesaplamaYontemiBaslik: 'Metode Perhitungan',
    otomatik: 'Otomatis',
    konumAliniyor: 'Mengambil lokasi…',
    konumTekrarDene: 'Coba lokasi lagi',
    konumaGore: 'Berdasarkan lokasi',
    ikindiHesabi: 'Perhitungan Asar',
    yuksekAciHesabi: 'Aturan Lintang Tinggi',
    kerahatVaktiSuresi: 'Durasi Waktu Makruh',
    dk: (n: number) => `${n} mnt`,
    kerahatVaktindeUyar: 'Peringatkan Saat Waktu Makruh',
    kisisellestirmeBaslik: 'Personalisasi',
    hicriGunDuzeltme: 'Penyesuaian Hari Hijriah',
    hicriGunDegisimiAksam: 'Ganti Hari Hijriah Saat Waktu Magrib',
    olcuBirimleri: 'Satuan Ukuran',
    genelBaslik: 'Umum',
    titresim: 'Getaran',
    yuzustuSesKapat: 'Bisukan Saat Ponsel Menghadap Bawah',
    bildirimCubuguWidgeti: 'Widget Bilah Notifikasi',
    otomatikGuncelleme: 'Pembaruan Otomatis',
    otomatikGuncellemeAciklama: 'Jika aktif, versi baru diunduh di latar belakang tanpa bertanya',
    ezanDuasi: 'Doa Setelah Azan',
    sabahEzaniImsakVaktinde: 'Putar Azan Subuh Saat Waktu Imsak',
    vakitlerdenOnceUyarilar: 'Peringatan Sebelum Waktu Salat',
    dakikaOnce: (n: number) => `${n} menit sebelumnya`,
    sesiDegistir: (etiket: string) => `Ubah Suara · ${etiket}`,
    vakitZamanindaUyarilar: 'Peringatan Tepat Waktu Salat',
    kerahatVaktiDakika: 'Waktu Makruh (menit)',
    dakika: (n: number) => `${n} menit`,
    uyariSesi: (etiket: string) => `Suara Peringatan ${etiket}`,
    konumIzniVerilmedi: 'Izin lokasi tidak diberikan. Anda dapat mengaktifkannya secara manual lewat Pengaturan Ponsel > Aplikasi > AzanAtlas > Izin.',
    konumBasariylaAlindi: 'Lokasi berhasil didapatkan — Mode otomatis aktif.',
    konumAlinamadi: 'Lokasi tidak dapat diperoleh. Periksa apakah GPS dan layanan lokasi aktif.',
    gpsKonumu: 'Lokasi GPS',
    fromImsak: 'Dari Imsak', fromGunes: 'Dari Terbit', fromOgle: 'Dari Zuhur',
    fromIkindi: 'Dari Asar', fromAksam: 'Dari Magrib', fromYatsi: 'Dari Isya',
    ezanSabah: 'Azan Subuh', ezanOgle: 'Azan Zuhur', ezanIkindi: 'Azan Asar',
    ezanAksam: 'Azan Magrib', ezanYatsi: 'Azan Isya',
  },
  fr: {
    ayarlarAltBaslik: 'Toutes les préférences au même endroit',
    dilBolumBasligi: 'Dil / Language',
    vaktindeKil: 'Prier à l\'heure',
    hatirlaticilar: 'Rappels',
    hesaplamaYontemiBaslik: 'Méthode de calcul',
    otomatik: 'Automatique',
    konumAliniyor: 'Localisation en cours…',
    konumTekrarDene: 'Réessayer la localisation',
    konumaGore: 'Selon la position',
    ikindiHesabi: 'Calcul de l\'Asr',
    yuksekAciHesabi: 'Règle des hautes latitudes',
    kerahatVaktiSuresi: 'Durée de l\'heure déconseillée',
    dk: (n: number) => `${n} min`,
    kerahatVaktindeUyar: 'Avertir pendant l\'heure déconseillée',
    kisisellestirmeBaslik: 'Personnalisation',
    hicriGunDuzeltme: 'Ajustement du jour hégirien',
    hicriGunDegisimiAksam: 'Changer le jour hégirien au Maghrib',
    olcuBirimleri: 'Unités de mesure',
    genelBaslik: 'Général',
    titresim: 'Vibration',
    yuzustuSesKapat: 'Couper le son face contre table',
    bildirimCubuguWidgeti: 'Widget de la barre de notification',
    otomatikGuncelleme: 'Mises à jour automatiques',
    otomatikGuncellemeAciklama: "Si activé, les nouvelles versions se téléchargent en arrière-plan sans demander",
    ezanDuasi: 'Invocation après l\'appel à la prière',
    sabahEzaniImsakVaktinde: 'Jouer l\'appel du Fajr à l\'heure de l\'Imsak',
    vakitlerdenOnceUyarilar: 'Alertes avant les heures de prière',
    dakikaOnce: (n: number) => `${n} minutes avant`,
    sesiDegistir: (etiket: string) => `Changer le son · ${etiket}`,
    vakitZamanindaUyarilar: 'Alertes à l\'heure de la prière',
    kerahatVaktiDakika: 'Heure déconseillée (minutes)',
    dakika: (n: number) => `${n} minutes`,
    uyariSesi: (etiket: string) => `Son d'alerte ${etiket}`,
    konumIzniVerilmedi: 'Autorisation de localisation non accordée. Vous pouvez l\'activer manuellement via Paramètres du téléphone > Applications > AzanAtlas > Autorisations.',
    konumBasariylaAlindi: 'Position obtenue avec succès — Mode automatique actif.',
    konumAlinamadi: 'Impossible d\'obtenir la position. Vérifiez que le GPS et les services de localisation sont activés.',
    gpsKonumu: 'Position GPS',
    fromImsak: 'Depuis l\'Imsak', fromGunes: 'Depuis le lever', fromOgle: 'Depuis le Dhuhr',
    fromIkindi: 'Depuis l\'Asr', fromAksam: 'Depuis le Maghrib', fromYatsi: 'Depuis l\'Isha',
    ezanSabah: 'Appel du Fajr', ezanOgle: 'Appel du Dhuhr', ezanIkindi: 'Appel de l\'Asr',
    ezanAksam: 'Appel du Maghrib', ezanYatsi: 'Appel de l\'Isha',
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
  id: {
    kazaTakibi: 'Pelacakan Qadha',
    toplamKaza: (n: number) => `Total ${n} qadha`,
    kazaBorcuYok: 'Tidak ada utang qadha',
    toplamKazaBorcu: 'total utang qadha',
    kazaBorcuGorunmuyor: 'Anda tidak memiliki utang qadha',
    namaz: 'Salat',
    oruc: 'Puasa',
    vitir: 'Witir',
    kazaSayisiniAzalt: (etiket: string) => `Kurangi jumlah qadha ${etiket}`,
    kazaSayisiniArtir: (etiket: string) => `Tambah jumlah qadha ${etiket}`,
    kazaNotu: 'Penghitung hanya disimpan di perangkat ini. Kurangi jumlahnya dengan tombol minus saat Anda mengqadha salat.',
  },
  fr: {
    kazaTakibi: 'Suivi des rattrapages',
    toplamKaza: (n: number) => `${n} rattrapages au total`,
    kazaBorcuYok: 'Aucun rattrapage dû',
    toplamKazaBorcu: 'total des rattrapages dus',
    kazaBorcuGorunmuyor: 'vous n\'avez aucun rattrapage dû',
    namaz: 'Prière',
    oruc: 'Jeûne',
    vitir: 'Witr',
    kazaSayisiniAzalt: (etiket: string) => `Diminuer le nombre de rattrapages de ${etiket}`,
    kazaSayisiniArtir: (etiket: string) => `Augmenter le nombre de rattrapages de ${etiket}`,
    kazaNotu: 'Les compteurs sont conservés uniquement sur cet appareil. Diminuez le nombre avec le bouton moins au fur et à mesure de vos rattrapages.',
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
  id: {
    kesfetAltBaslik: 'Semua alat',
    grupIbadet: 'Ibadah',
    grupHatirlatmaAyarlar: 'Pengingat dan Pengaturan',
    aciklamaYonBul: 'Temukan arah',
    aciklamaZikirmatik: 'Penghitung dzikir',
    adEsmaulHusna: 'Asmaul Husna',
    aciklama99GuzelIsim: '99 nama indah',
    aciklamaAylikTakvim: 'Kalender bulanan',
    adIbadetTakibi: 'Pelacakan Ibadah',
    aciklamaGunlukSeri: 'Rentetan harian',
    aciklamaBorcSayaci: 'Penghitung utang',
    aciklamaTekrarliUyari: 'Peringatan berulang',
    aciklamaOzelUyarilar: 'Peringatan khusus',
    adTema: 'Tema',
    aciklamaRenkDuzeni: '11 palet warna',
    adKonum: 'Lokasi',
    aciklamaSehirSec: 'Pilih kota',
    aciklamaTumAyarlar: 'Semua pengaturan',
    kesfetSeriRozeti: (n: number) => `${n}h`,
  },
  fr: {
    kesfetAltBaslik: 'Tous les outils',
    grupIbadet: 'Adoration',
    grupHatirlatmaAyarlar: 'Rappels et réglages',
    aciklamaYonBul: 'Trouver la direction',
    aciklamaZikirmatik: 'Compteur de dhikr',
    adEsmaulHusna: 'Noms d\'Allah',
    aciklama99GuzelIsim: '99 beaux noms',
    aciklamaAylikTakvim: 'Calendrier mensuel',
    adIbadetTakibi: 'Suivi des prières',
    aciklamaGunlukSeri: 'Série quotidienne',
    aciklamaBorcSayaci: 'Compteur de dette',
    aciklamaTekrarliUyari: 'Alerte répétée',
    aciklamaOzelUyarilar: 'Alertes personnalisées',
    adTema: 'Thème',
    aciklamaRenkDuzeni: '11 palettes de couleurs',
    adKonum: 'Position',
    aciklamaSehirSec: 'Choisir une ville',
    aciklamaTumAyarlar: 'Tous les réglages',
    kesfetSeriRozeti: (n: number) => `${n}j`,
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
  id: {
    esmaAltBaslik: '99 nama indah Allah',
    esmaAramaYerTutucu: 'Cari nama atau makna',
    esmaAramayiTemizle: 'Hapus pencarian',
    esmaSonucBulunamadi: 'Tidak ada nama yang cocok dengan pencarian Anda.',
  },
  fr: {
    esmaAltBaslik: 'Les 99 plus beaux noms d\'Allah',
    esmaAramaYerTutucu: 'Rechercher un nom ou une signification',
    esmaAramayiTemizle: 'Effacer la recherche',
    esmaSonucBulunamadi: 'Aucun nom ne correspond à votre recherche.',
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
  id: {
    sahurUyarisi: 'Peringatan Sahur',
    teheccutUyandirma: 'Bangun Tahajud',
    pazartesiPersembeOrucuBaslik: 'Puasa Senin/Kamis',
    cumaNamaziHatirlatma: 'Pengingat Salat Jumat',
    birGunOnceHatirlat: 'Ingatkan sehari sebelumnya',
    kacDakikaOnce: 'Berapa Menit Sebelumnya',
    uyariSesiBaslik: 'Suara Peringatan',
    dkOnce: (n: number) => `${n} mnt. sebelumnya`,
  },
  fr: {
    sahurUyarisi: 'Alerte Suhoor',
    teheccutUyandirma: 'Réveil pour le Tahajjud',
    pazartesiPersembeOrucuBaslik: 'Jeûne du lundi/jeudi',
    cumaNamaziHatirlatma: 'Rappel de la prière du vendredi',
    birGunOnceHatirlat: 'Rappeler la veille',
    kacDakikaOnce: 'Combien de minutes avant',
    uyariSesiBaslik: 'Son d\'alerte',
    dkOnce: (n: number) => `${n} min. avant`,
  },
};

// ── VAKTİNDE KIL ──
// NOT (bu tur): "vaktindeKilHadis"/"vaktindeKilHadisKaynak" anahtarları
// önceki bir turda VaktindeKilScreen.tsx'e eklenmişti ama sözlükte hiç
// tanımlanmamıştı — ekranda anahtar adının kendisi ("vaktindeKilHadis")
// görünmesine yol açan bir hataydı (bkz. `dilBolumBasligi` ile aynı sınıf
// hata). Alıntı, Sahih el-Buhârî 527 / Sahih Müslim 85'te geçen, İbn
// Mes'ûd (r.a.) rivayetiyle bilinen sahih bir hadis — dört dilde de o
// hadisin yerleşik/standart çevirisi kullanıldı.
const vaktindeKilEkrani = {
  tr: {
    vaktindeKilBilgi:
      'Vaktinde Kıl açıkken, bir namaz vakti girdikten belirlediğin gecikme süresi kadar sonra, eğer o vakti henüz kılmadıysan sana hatırlatma bildirimi gönderir. Bir sonraki vakit girene kadar, belirlediğin sıklıkla bu hatırlatma tekrarlanır. Bildirimdeki "Kıldım" butonuna dokunursan, o vakit için kalan hatırlatmalar durur.',
    vaktindeKilHadis: 'Allah katında en sevimli amel, vaktinde kılınan namazdır.',
    vaktindeKilHadisKaynak: 'Buhârî, Mevâkît, 5; Müslim, Îmân, 137',
    ilkUyariGecikmesi: 'İlk Uyarı Gecikmesi',
    uyariSikligi: 'Uyarı Sıklığı',
    dakikadaBir: (n: number) => `${n} dakikada bir`,
    bip: 'Bip',
    dong: 'Dong',
    // Madde 2 (bu tur): bu iki anahtar `vaktindeKilActions.ts`'teki
    // `setupNotificationCategoryAsync` tarafından referans alınıyordu ama
    // sözlükte hiç tanımlanmamıştı — `tDil()`'in fallback'i (`return
    // String(anahtar)`) ham anahtar adını bildirim butonunda gösteriyordu.
    // Aynı hata sınıfı daha önce `vaktindeKilHadis` ile de yaşanmıştı.
    vaktindeKilButonuKildim: 'Kıldım',
    vaktindeKilButonuSonraHatirlat: 'Sonra Hatırlat',
  },
  en: {
    vaktindeKilBilgi:
      'When Pray on Time is on, it sends you a reminder notification after your chosen delay once a prayer time begins, if you haven’t marked it as performed yet. This reminder repeats at your chosen frequency until the next prayer time begins. Tapping "Done" on the notification stops the remaining reminders for that prayer.',
    vaktindeKilHadis: 'The deed most beloved to Allah is prayer performed at its early appointed time.',
    vaktindeKilHadisKaynak: 'Sahih al-Bukhari 527; Sahih Muslim 85',
    ilkUyariGecikmesi: 'First Alert Delay',
    uyariSikligi: 'Alert Frequency',
    dakikadaBir: (n: number) => `Every ${n} minutes`,
    bip: 'Beep',
    dong: 'Chime',
    vaktindeKilButonuKildim: 'Done',
    vaktindeKilButonuSonraHatirlat: 'Remind Later',
  },
  id: {
    vaktindeKilBilgi:
      'Saat Salat Tepat Waktu aktif, setelah waktu salat masuk dan Anda belum menandainya sebagai dikerjakan, aplikasi akan mengirim notifikasi pengingat setelah jeda waktu yang Anda tentukan. Pengingat ini berulang sesuai frekuensi yang Anda tentukan hingga waktu salat berikutnya masuk. Menekan tombol "Sudah" pada notifikasi akan menghentikan sisa pengingat untuk waktu tersebut.',
    vaktindeKilHadis: 'Amalan yang paling dicintai Allah adalah shalat yang dikerjakan tepat pada waktunya.',
    vaktindeKilHadisKaynak: 'Shahih Bukhari 527; Shahih Muslim 85',
    ilkUyariGecikmesi: 'Jeda Peringatan Pertama',
    uyariSikligi: 'Frekuensi Peringatan',
    dakikadaBir: (n: number) => `Setiap ${n} menit`,
    bip: 'Bip',
    dong: 'Dong',
    vaktindeKilButonuKildim: 'Sudah',
    vaktindeKilButonuSonraHatirlat: 'Ingatkan Nanti',
  },
  fr: {
    vaktindeKilBilgi:
      'Lorsque Prier à l\'heure est activé, l\'application vous envoie une notification de rappel après le délai choisi une fois qu\'une heure de prière commence, si vous ne l\'avez pas encore marquée comme accomplie. Ce rappel se répète selon la fréquence choisie jusqu\'à la prochaine heure de prière. Toucher "Fait" sur la notification arrête les rappels restants pour cette prière.',
    vaktindeKilHadis: 'L\'œuvre la plus aimée d\'Allah est la prière accomplie à son heure.',
    vaktindeKilHadisKaynak: 'Sahih al-Boukhari 527 ; Sahih Muslim 85',
    ilkUyariGecikmesi: 'Délai de la première alerte',
    uyariSikligi: 'Fréquence des alertes',
    dakikadaBir: (n: number) => `Toutes les ${n} minutes`,
    bip: 'Bip',
    dong: 'Carillon',
    vaktindeKilButonuKildim: 'Fait',
    vaktindeKilButonuSonraHatirlat: 'Rappeler plus tard',
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
  id: {
    diyanetTakvimiVerisi: 'Data Kalender Diyanet',
    yerelHesaplamaUlasilamadi: 'Perhitungan lokal (data Diyanet tidak dapat dijangkau)',
    bugun: 'Hari Ini',
  },
  fr: {
    diyanetTakvimiVerisi: 'Données du calendrier Diyanet',
    yerelHesaplamaUlasilamadi: 'Calcul local (données Diyanet indisponibles)',
    bugun: 'Aujourd\'hui',
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
  id: {
    pazar: 'Minggu', pazartesi: 'Senin', sali: 'Selasa', carsamba: 'Rabu',
    persembe: 'Kamis', cuma: 'Jumat', cumartesi: 'Sabtu',
  },
  fr: {
    pazar: 'Dimanche', pazartesi: 'Lundi', sali: 'Mardi', carsamba: 'Mercredi',
    persembe: 'Jeudi', cuma: 'Vendredi', cumartesi: 'Samedi',
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
    // Madde 2 (bu tur): "GPS ile Ekle" tek başına belirsizdi (bazı
    // kullanıcılar GPS terimini tanımıyor) — "GPS/Konum ile Ekle" yapıldı.
    gpsIleEkle: 'GPS/Konum ile Ekle',
    ilIlceSecerekEkle: '+ İl/İlçe Seçerek Ekle',
    // Madde 9 (önceki tur): Türkiye dışındaki Faz-1 ülkeleri için manuel
    // ülke → şehir seçim akışı eklendi (bkz. globalLocations.ts,
    // LocationPickerScreen.tsx). Madde 2 (bu tur): buton metni "+ Konum
    // Ekle" yerine ne yaptığını daha net anlatan "Ülke/Şehir Değiştir"
    // yapıldı.
    konumEkle: 'Ülke/Şehir Değiştir',
    ulkeSec: 'Ülke Seç',
    sehirSec: 'Şehir Seç',
    turkiyeIlIlceSecerek: 'Türkiye (İl / İlçe seçerek)',
  },
  en: {
    sehriDegistir: 'Change City',
    ilSec: 'Select Province',
    ilceSec: 'Select District',
    sil: 'Delete',
    gpsIleEkle: 'Add via GPS/Location',
    ilIlceSecerekEkle: '+ Add by Selecting Province/District',
    konumEkle: 'Change Country/City',
    ulkeSec: 'Select Country',
    sehirSec: 'Select City',
    turkiyeIlIlceSecerek: 'Turkey (by Province / District)',
  },
  id: {
    sehriDegistir: 'Ubah Kota',
    ilSec: 'Pilih Provinsi',
    ilceSec: 'Pilih Kabupaten',
    sil: 'Hapus',
    gpsIleEkle: 'Tambah via GPS/Lokasi',
    ilIlceSecerekEkle: '+ Tambah dengan Memilih Provinsi/Kabupaten',
    konumEkle: 'Ubah Negara/Kota',
    ulkeSec: 'Pilih Negara',
    sehirSec: 'Pilih Kota',
    turkiyeIlIlceSecerek: 'Turki (pilih Provinsi / Kabupaten)',
  },
  fr: {
    sehriDegistir: 'Changer de ville',
    ilSec: 'Sélectionner la province',
    ilceSec: 'Sélectionner le district',
    sil: 'Supprimer',
    gpsIleEkle: 'Ajouter via GPS/position',
    ilIlceSecerekEkle: '+ Ajouter en choisissant province/district',
    konumEkle: 'Changer de pays/ville',
    ulkeSec: 'Sélectionner le pays',
    sehirSec: 'Sélectionner la ville',
    turkiyeIlIlceSecerek: 'Turquie (par province / district)',
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
  },
  id: {
    bildirimVaktiBaslik: (vakitAdi: string) => `Waktu ${vakitAdi}`,
    bildirimVaktiGirdiGovde: (vakitAdi: string) => `Sekarang waktu ${vakitAdi}.`,
    bildirimOnUyariBaslik: (vakitAdi: string, dk: number) => `${dk} Menit Menuju ${vakitAdi}`,
    bildirimOnUyariGovde: (vakitAdi: string) => `Waktu ${vakitAdi} akan segera tiba.`,
    kerahatVaktiBaslik: 'Waktu Makruh',
    kerahatGunesDoarken: 'Makruh melaksanakan salat saat matahari terbit.',
    kerahatGunesBatarken: 'Makruh melaksanakan salat saat matahari terbenam.',
    kerahatZeval: 'Waktu zawal — makruh melaksanakan salat pada periode ini.',
    titresimli: 'Bergetar',
    titresimsiz: 'Tanpa Getar',
    bildirimleriTitresimli: 'Notifikasi AzanAtlas (Bergetar)',
    bildirimleriTitresimsiz: 'Notifikasi AzanAtlas (Tanpa Getar)',
    sahurUyarisiBaslik: 'Peringatan Sahur',
    sahurUyarisiGovde: (dk: number) => `${dk} menit menuju waktu Imsak.`,
    teheccutBaslik: 'Bangun Tahajud',
    teheccutGovde: 'Waktu bangun untuk salat Tahajud.',
    pazartesiPersembeBaslik: 'Puasa Senin/Kamis',
    pazartesiPersembeGovde: 'Jangan lupa niat dan sahur.',
    yarinOrucGunuBaslik: 'Besok Hari Puasa',
    yarinOrucGunuGovde: 'Besok adalah puasa Senin/Kamis — jangan lupa.',
    cumaBaslik: 'Pengingat Salat Jumat',
    cumaGovde: 'Bersiaplah untuk salat Jumat.',
    vaktindeKilBaslik: (vakitAdi: string) => `Salat ${vakitAdi}`,
    vaktindeKilGovde: (vakitAdi: string) => `Jika belum melaksanakan salat ${vakitAdi}, jangan lupa untuk salat tepat waktu.`,
  },
  fr: {
    bildirimVaktiBaslik: (vakitAdi: string) => `Heure du ${vakitAdi}`,
    bildirimVaktiGirdiGovde: (vakitAdi: string) => `C'est maintenant l'heure du ${vakitAdi}.`,
    bildirimOnUyariBaslik: (vakitAdi: string, dk: number) => `${dk} minutes avant le ${vakitAdi}`,
    bildirimOnUyariGovde: (vakitAdi: string) => `L'heure du ${vakitAdi} approche.`,
    kerahatVaktiBaslik: 'Heure déconseillée',
    kerahatGunesDoarken: 'Il est déconseillé (makrouh) de prier pendant le lever du soleil.',
    kerahatGunesBatarken: 'Il est déconseillé (makrouh) de prier pendant le coucher du soleil.',
    kerahatZeval: 'Heure du zawal — la prière est déconseillée (makrouh) durant cette période.',
    titresimli: 'Vibration',
    titresimsiz: 'Sans vibration',
    bildirimleriTitresimli: 'Notifications AzanAtlas (Vibration)',
    bildirimleriTitresimsiz: 'Notifications AzanAtlas (Sans vibration)',
    sahurUyarisiBaslik: 'Rappel Suhoor',
    sahurUyarisiGovde: (dk: number) => `${dk} minutes avant l'Imsak.`,
    teheccutBaslik: 'Réveil pour le Tahajjud',
    teheccutGovde: 'Heure de se réveiller pour la prière du Tahajjud.',
    pazartesiPersembeBaslik: 'Jeûne du lundi/jeudi',
    pazartesiPersembeGovde: 'N\'oubliez pas de faire votre intention et le suhoor.',
    yarinOrucGunuBaslik: 'Jour de jeûne demain',
    yarinOrucGunuGovde: 'Demain est un jour de jeûne du lundi/jeudi — n\'oubliez pas.',
    cumaBaslik: 'Rappel de la prière du vendredi',
    cumaGovde: 'Préparez-vous pour la prière du vendredi.',
    vaktindeKilBaslik: (vakitAdi: string) => `Prière du ${vakitAdi}`,
    vaktindeKilGovde: (vakitAdi: string) => `Si vous n'avez pas encore prié le ${vakitAdi}, n'oubliez pas de le prier à l'heure.`,
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
  id: {
    dokunSaymakIcin: 'Ketuk untuk menghitung',
    tamamlananTur: 'Putaran selesai',
    geriAl: 'Urungkan',
    sifirla: 'Reset',
    sayaciArtirEtiketi: (sayac: number, hedef: number) => `Tambah hitungan. Saat ini ${sayac}, target ${hedef}`,
    sonSayimiGeriAlEtiketi: 'Urungkan hitungan terakhir',
    sayaciSifirlaEtiketi: 'Reset penghitung dan putaran',
  },
  fr: {
    dokunSaymakIcin: 'Touchez pour compter',
    tamamlananTur: 'Tours terminés',
    geriAl: 'Annuler',
    sifirla: 'Réinitialiser',
    sayaciArtirEtiketi: (sayac: number, hedef: number) => `Augmenter le compteur. Actuellement ${sayac}, objectif ${hedef}`,
    sonSayimiGeriAlEtiketi: 'Annuler le dernier compte',
    sayaciSifirlaEtiketi: 'Réinitialiser le compteur et les tours',
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
  id: {
    besVaktiNamaz: 'Lima waktu salat',
    kesintisizSeri: 'Rentetan berkelanjutan',
    gun: 'hari',
    seriBaslarSonrasi: 'Rentetan Anda dimulai pada hari Anda menyelesaikan lima waktu salat.',
    seriDevamAciklama: 'Jumlah hari berturut-turut Anda menyelesaikan lima waktu salat.',
    son28GundeKilinanVakit: 'salat dikerjakan\ndalam 28 hari terakhir',
    bugun: 'Hari Ini',
    bugüneDon: 'Kembali ke hari ini',
    namaziEtiketi: (vakitAdi: string) => `Salat ${vakitAdi}`,
    gelecekGunUyarisi: 'Hari yang akan datang tidak dapat ditandai.',
    son4Hafta: '4 minggu terakhir',
    gunVakitKilindiEtiketi: (gun: number, ay: string, n: number) => `${gun} ${ay}, ${n} waktu dikerjakan`,
    besVaktiTam: 'Lima waktu lengkap',
    kismen: 'Sebagian',
    kayitYok: 'Tidak ada catatan',
    takipNotu: 'Catatan hanya disimpan di perangkat ini; tidak dikirim ke server mana pun. Menekan tombol "Sudah" pada notifikasi juga menandai salat tersebut di sini.',
  },
  fr: {
    besVaktiNamaz: 'Les cinq prières quotidiennes',
    kesintisizSeri: 'Série actuelle',
    gun: 'jours',
    seriBaslarSonrasi: 'Votre série commence le jour où vous accomplissez les cinq prières.',
    seriDevamAciklama: 'Le nombre de jours consécutifs où vous avez accompli les cinq prières.',
    son28GundeKilinanVakit: 'prières accomplies\nces 28 derniers jours',
    bugun: 'Aujourd\'hui',
    bugüneDon: 'Retour à aujourd\'hui',
    namaziEtiketi: (vakitAdi: string) => `Prière du ${vakitAdi}`,
    gelecekGunUyarisi: 'Un jour futur ne peut pas être marqué.',
    son4Hafta: '4 dernières semaines',
    gunVakitKilindiEtiketi: (gun: number, ay: string, n: number) => `${gun} ${ay}, ${n} prières accomplies`,
    besVaktiTam: 'Cinq prières complètes',
    kismen: 'Partiel',
    kayitYok: 'Aucun enregistrement',
    takipNotu: 'Les enregistrements sont conservés uniquement sur cet appareil ; rien n\'est envoyé à un serveur. Toucher "Fait" sur une notification marque aussi cette prière ici.',
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
  id: {
    renkDuzeni: (n: number) => `${n} palet warna`,
    seciminizKaydedildi: 'Pilihan Anda telah disimpan. Tema baru akan diterapkan saat Anda menutup dan membuka kembali aplikasi.',
    temaAciklamaParagrafi: 'Semua tema berasal dari tradisi seni Islam. Keterbacaan teks setiap tema diukur secara terpisah — apa pun yang Anda pilih, teks tetap jelas.',
    temaEtiketi: (ad: string, aciklama: string) => `Tema ${ad}. ${aciklama}`,
    suAnKullanimda: 'Sedang digunakan',
    temaNotu: 'Jendela konfirmasi terbuka saat Anda memilih tema. Jika tidak ingin langsung memulai ulang, aplikasi tetap terbuka seperti biasa, dan tema baru diterapkan pada peluncuran normal berikutnya.',
    temaDegisti: 'Tema berubah',
    temaKaydedildiYeniden: (ad: string) => `Tema ${ad} telah disimpan. Aplikasi perlu dimulai ulang agar perubahan diterapkan.`,
    yenidenBaslatiliyor: 'Memulai ulang…',
    simdiYenidenBaslat: 'Mulai Ulang Sekarang',
    dahaSonraBtn: 'Nanti',
  },
  fr: {
    renkDuzeni: (n: number) => `${n} palettes de couleurs`,
    seciminizKaydedildi: 'Votre sélection a été enregistrée. Le nouveau thème s\'appliquera la prochaine fois que vous fermerez et rouvrirez l\'application.',
    temaAciklamaParagrafi: 'Tous les thèmes sont issus de la tradition artistique islamique. La lisibilité du texte de chacun a été mesurée individuellement — quel que soit votre choix, le texte reste clair.',
    temaEtiketi: (ad: string, aciklama: string) => `Thème ${ad}. ${aciklama}`,
    suAnKullanimda: 'Actuellement utilisé',
    temaNotu: 'Une fenêtre de confirmation s\'ouvre lorsque vous choisissez un thème. Si vous ne souhaitez pas redémarrer immédiatement, l\'application reste ouverte telle quelle, et le nouveau thème s\'applique au prochain lancement normal.',
    temaDegisti: 'Thème changé',
    temaKaydedildiYeniden: (ad: string) => `Le thème ${ad} a été enregistré. L\'application doit redémarrer pour appliquer le changement.`,
    yenidenBaslatiliyor: 'Redémarrage…',
    simdiYenidenBaslat: 'Redémarrer maintenant',
    dahaSonraBtn: 'Plus tard',
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
    // Madde 1 (bu tur): Android'in kendi manyetik sensör doğruluk seviyesi
    // (SensorManager accuracy) "düşük/güvenilmez" döndürdüğünde artık pasif
    // bir ipucu yerine AKTİF, göze çarpan bir uyarı gösteriliyor — bkz.
    // QiblaScreen.tsx'teki `kalibrasyonGerekli`.
    pusulaKalibrasyonBasligi: 'Pusula kalibrasyonu gerekiyor',
    pusulaKalibrasyonMetni: 'Telefonunuzun manyetik sensörü şu an güvenilir okuma yapamıyor. Telefonu düz tutup havada birkaç kez 8 (sekiz) çizer gibi çevirin.',
    mil: 'mil',
    yonKuzey: 'K', yonDogu: 'D', yonGuney: 'G', yonBati: 'B',
    // Madde 4 (bu tur): kıble hesabı zaten kayıtlı konuma (LocationContext)
    // göre yapılıyordu — bu iki anahtar, kullanıcının isteğe bağlı olarak
    // TAZE bir GPS okuması alabilmesi için eklendi (bkz. QiblaScreen.tsx).
    hassasKonumlaGuncelle: 'Hassas Konumla Güncelle',
    hassasKonumAktif: 'Hassas konum kullanılıyor',
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
    pusulaKalibrasyonBasligi: 'Compass calibration needed',
    pusulaKalibrasyonMetni: "Your phone's magnetic sensor cannot currently take a reliable reading. Hold the phone flat and move it in a figure-eight (8) motion in the air a few times.",
    mil: 'mi',
    yonKuzey: 'N', yonDogu: 'E', yonGuney: 'S', yonBati: 'W',
    hassasKonumlaGuncelle: 'Update with Precise Location',
    hassasKonumAktif: 'Using precise location',
  },
  id: {
    kible: 'Kiblat',
    pusulaDogrulugu: 'Akurasi Kompas',
    pusulaDogruluguGiris: 'Akurasi kompas sepenuhnya bergantung pada sensor magnetik ponsel Anda. Langkah-langkah di bawah ini secara nyata meningkatkan akurasi di sebagian besar ponsel.',
    pusulaAdim1: 'Jauhkan ponsel dari magnet, speaker, dan permukaan logam. Casing bermagnet adalah penyebab gangguan kompas terbesar.',
    pusulaAdim2: 'Pegang ponsel secara datar dan gerakkan membentuk angka delapan (8) di udara beberapa kali. Ini memungkinkan perangkat mengkalibrasi ulang sensornya.',
    pusulaAdim3: 'Gunakan di luar ruangan jika memungkinkan. Di dalam gedung, lift, dan tempat parkir dapat mengganggu medan magnet.',
    pusulaAdim4: 'Pegang ponsel sejajar dengan tanah (seperti meletakkannya di meja). Memiringkannya akan mengacaukan pembacaan.',
    pusulaHazirlaniyor: 'Menyiapkan kompas…',
    kibleYonundesiniz: 'Anda menghadap Kiblat',
    sagaDonun: 'Putar ke kanan',
    solaDonun: 'Putar ke kiri',
    kibleAcisi: 'Sudut kiblat',
    kabeyeUzaklik: 'Jarak ke Kakbah',
    gunesleKibleAni: 'Waktu keselarasan matahari-kiblat',
    pusulaSensorunaErisilemedi: 'Sensor kompas tidak dapat diakses.',
    pusulaOkumasiBekleniyor: 'Menunggu pembacaan kompas. Pegang ponsel secara datar dan putar sedikit.',
    manyetikKuzeyeGoreGosteriliyor: 'Ditampilkan relatif terhadap utara magnetik. Memberikan izin lokasi menghasilkan pembacaan yang lebih akurat relatif terhadap utara sejati.',
    pusulaDogruGostermiyorMu: 'Kompas tidak menunjuk dengan benar?',
    pusulaKalibrasyonBasligi: 'Kalibrasi kompas diperlukan',
    pusulaKalibrasyonMetni: 'Sensor magnetik ponsel Anda saat ini tidak dapat memberikan pembacaan yang andal. Pegang ponsel secara datar dan gerakkan membentuk angka delapan (8) di udara beberapa kali.',
    mil: 'mi',
    yonKuzey: 'U', yonDogu: 'T', yonGuney: 'S', yonBati: 'B',
    hassasKonumlaGuncelle: 'Perbarui dengan Lokasi Presisi',
    hassasKonumAktif: 'Menggunakan lokasi presisi',
  },
  fr: {
    kible: 'Qibla',
    pusulaDogrulugu: 'Précision de la boussole',
    pusulaDogruluguGiris: 'La précision de la boussole dépend entièrement du capteur magnétique de votre téléphone. Les étapes ci-dessous améliorent nettement la précision sur la plupart des téléphones.',
    pusulaAdim1: 'Éloignez le téléphone des aimants, haut-parleurs et surfaces métalliques. Les coques magnétiques sont la principale cause d\'interférence de la boussole.',
    pusulaAdim2: 'Tenez le téléphone à plat et déplacez-le en formant un huit (8) dans les airs plusieurs fois. Cela permet à l\'appareil de recalibrer son capteur.',
    pusulaAdim3: 'Utilisez-le à l\'extérieur si possible. Les intérieurs, ascenseurs et parkings perturbent le champ magnétique.',
    pusulaAdim4: 'Tenez le téléphone parallèle au sol (comme si vous le posiez sur une table). L\'incliner fausse la lecture.',
    pusulaHazirlaniyor: 'Préparation de la boussole…',
    kibleYonundesiniz: 'Vous êtes orienté vers la Qibla',
    sagaDonun: 'Tournez à droite',
    solaDonun: 'Tournez à gauche',
    kibleAcisi: 'Angle de la Qibla',
    kabeyeUzaklik: 'Distance à la Kaaba',
    gunesleKibleAni: 'Heure d\'alignement soleil-Qibla',
    pusulaSensorunaErisilemedi: 'Impossible d\'accéder au capteur de la boussole.',
    pusulaOkumasiBekleniyor: 'En attente de la lecture de la boussole. Tenez le téléphone à plat et tournez-le légèrement.',
    manyetikKuzeyeGoreGosteriliyor: 'Affiché par rapport au nord magnétique. Autoriser la localisation donne une lecture plus précise par rapport au nord vrai.',
    pusulaDogruGostermiyorMu: 'La boussole n\'indique pas correctement ?',
    pusulaKalibrasyonBasligi: 'Étalonnage de la boussole requis',
    pusulaKalibrasyonMetni: 'Le capteur magnétique de votre téléphone ne peut pas fournir de lecture fiable pour le moment. Tenez le téléphone à plat et déplacez-le en formant un huit (8) dans les airs plusieurs fois.',
    mil: 'mi',
    yonKuzey: 'N', yonDogu: 'E', yonGuney: 'S', yonBati: 'O',
    hassasKonumlaGuncelle: 'Mettre à jour avec la position précise',
    hassasKonumAktif: 'Position précise utilisée',
  },
};

// ── ONBOARDING (Madde 4, bu tur) ──
// İlk açılışta gösterilen tanıtım + izin talebi akışı (OnboardingEkrani.tsx).
// Varyant A: Karşılama → Konum izni → Bildirim izni → Tamamlandı, adım
// göstergesi olmadan doğrusal ilerleyen 4 kart.
const onboarding = {
  tr: {
    onbKarsilamaBaslik: 'Selamünaleyküm',
    onbKarsilamaMetin: 'Vaktinde ibadete, doğru vakitle.\nAzanAtlas’a hoş geldiniz.',
    onbDevamEt: 'Devam Et',
    onbKonumBaslik: 'Konumunuza göre\nen doğru vakit',
    onbKonumMetin: 'Bulunduğunuz yere göre namaz vakitlerini otomatik ve anında hesaplayalım.',
    onbKonumEtkinlestir: 'Konumu Etkinleştir',
    onbListedenSec: 'Listeden Seç',
    onbBildirimBaslik: 'Hiçbir vakti kaçırmayın',
    onbBildirimMetin: 'Hangi vakitlerde haber verelim?',
    onbBildirimIzinVer: 'İzin Ver',
    onbTamamBaslik: 'Her şey hazır!',
    onbTamamMetin: 'Namaz vakitleriniz artık\nkonumunuza göre hazır.',
    onbBasla: 'Başla',
    onbAtla: 'Atla',
  },
  en: {
    onbKarsilamaBaslik: 'Peace be upon you',
    onbKarsilamaMetin: 'Prayer on time, with the right time.\nWelcome to AzanAtlas.',
    onbDevamEt: 'Continue',
    onbKonumBaslik: 'The most accurate\ntimes for your location',
    onbKonumMetin: "Let us calculate prayer times automatically and instantly based on your location.",
    onbKonumEtkinlestir: 'Enable Location',
    onbListedenSec: 'Choose from List',
    onbBildirimBaslik: "Don't miss a single prayer time",
    onbBildirimMetin: 'Which prayer times should we notify you about?',
    onbBildirimIzinVer: 'Allow',
    onbTamamBaslik: 'All set!',
    onbTamamMetin: 'Your prayer times are now ready\nbased on your location.',
    onbBasla: 'Get Started',
    onbAtla: 'Skip',
  },
  id: {
    onbKarsilamaBaslik: 'Assalamu’alaikum',
    onbKarsilamaMetin: 'Beribadah tepat waktu, dengan waktu yang tepat.\nSelamat datang di AzanAtlas.',
    onbDevamEt: 'Lanjutkan',
    onbKonumBaslik: 'Waktu paling akurat\nsesuai lokasi Anda',
    onbKonumMetin: 'Mari hitung waktu salat secara otomatis dan instan berdasarkan lokasi Anda.',
    onbKonumEtkinlestir: 'Aktifkan Lokasi',
    onbListedenSec: 'Pilih dari Daftar',
    onbBildirimBaslik: 'Jangan lewatkan satu pun waktu salat',
    onbBildirimMetin: 'Waktu salat mana yang ingin Anda dapatkan notifikasinya?',
    onbBildirimIzinVer: 'Izinkan',
    onbTamamBaslik: 'Semua siap!',
    onbTamamMetin: 'Waktu salat Anda kini siap\nsesuai lokasi Anda.',
    onbBasla: 'Mulai',
    onbAtla: 'Lewati',
  },
  fr: {
    onbKarsilamaBaslik: 'Salam alaykoum',
    onbKarsilamaMetin: "La prière à l'heure, avec la bonne heure.\nBienvenue sur AzanAtlas.",
    onbDevamEt: 'Continuer',
    onbKonumBaslik: 'Les horaires les plus précis\npour votre position',
    onbKonumMetin: 'Calculons les horaires de prière automatiquement et instantanément selon votre position.',
    onbKonumEtkinlestir: 'Activer la position',
    onbListedenSec: 'Choisir dans la liste',
    onbBildirimBaslik: 'Ne manquez plus aucune prière',
    onbBildirimMetin: 'Pour quelles prières souhaitez-vous être notifié ?',
    onbBildirimIzinVer: 'Autoriser',
    onbTamamBaslik: 'Tout est prêt !',
    onbTamamMetin: 'Vos horaires de prière sont prêts\nselon votre position.',
    onbBasla: 'Commencer',
    onbAtla: 'Passer',
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
  id: {
    imsak: 'Imsak', sabah: 'Subuh', gunes: 'Terbit', ogle: 'Zuhur',
    ikindi: 'Asar', aksam: 'Magrib', yatsi: 'Isya',
  },
  fr: {
    imsak: 'Imsak', sabah: 'Fajr', gunes: 'Lever du soleil', ogle: 'Dhuhr',
    ikindi: 'Asr', aksam: 'Maghrib', yatsi: 'Isha',
  },
};

export const SOZLUK = {
  tr: {
    ...ortak.tr, ...anaSayfa.tr, ...ayarlar.tr, ...kaza.tr, ...kesfet.tr, ...esma.tr,
    ...hatirlaticilarEkrani.tr, ...vaktindeKilEkrani.tr, ...imsakiyeEkrani.tr,
    ...gunAdlari.tr, ...konumSecici.tr, ...bildirimler.tr, ...tesbih.tr, ...takip.tr,
    ...temaEkrani.tr, ...kibleEkrani.tr, ...onboarding.tr, vakit: vakitAdlari.tr,
  },
  en: {
    ...ortak.en, ...anaSayfa.en, ...ayarlar.en, ...kaza.en, ...kesfet.en, ...esma.en,
    ...hatirlaticilarEkrani.en, ...vaktindeKilEkrani.en, ...imsakiyeEkrani.en,
    ...gunAdlari.en, ...konumSecici.en, ...bildirimler.en, ...tesbih.en, ...takip.en,
    ...temaEkrani.en, ...kibleEkrani.en, ...onboarding.en, vakit: vakitAdlari.en,
  },
  id: {
    ...ortak.id, ...anaSayfa.id, ...ayarlar.id, ...kaza.id, ...kesfet.id, ...esma.id,
    ...hatirlaticilarEkrani.id, ...vaktindeKilEkrani.id, ...imsakiyeEkrani.id,
    ...gunAdlari.id, ...konumSecici.id, ...bildirimler.id, ...tesbih.id, ...takip.id,
    ...temaEkrani.id, ...kibleEkrani.id, ...onboarding.id, vakit: vakitAdlari.id,
  },
  fr: {
    ...ortak.fr, ...anaSayfa.fr, ...ayarlar.fr, ...kaza.fr, ...kesfet.fr, ...esma.fr,
    ...hatirlaticilarEkrani.fr, ...vaktindeKilEkrani.fr, ...imsakiyeEkrani.fr,
    ...gunAdlari.fr, ...konumSecici.fr, ...bildirimler.fr, ...tesbih.fr, ...takip.fr,
    ...temaEkrani.fr, ...kibleEkrani.fr, ...onboarding.fr, vakit: vakitAdlari.fr,
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
