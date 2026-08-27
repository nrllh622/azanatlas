// src/lib/reklamOnay.ts
//
// GDPR/UMP RIZA (CONSENT) AKIŞI — react-native-google-mobile-ads
//
// Madde 6 (eksik analizi, bu tur): AB/EEA/İngiltere'deki kullanıcılara
// kişiselleştirilmiş reklam göstermeden önce Google'ın User Messaging
// Platform (UMP) SDK'sı üzerinden GDPR uyumlu bir rıza formu gösterilmesi
// AdMob politikası gereği ZORUNLU — aksi halde politika ihlali sayılır ve
// hesap askıya alınabilir. Hedef ülkelerden Fransa (FR) AB üyesi olduğu
// için bu, AzanAtlas için de geçerli.
//
// `react-native-google-mobile-ads` paketi Google'ın UMP SDK'sını
// `AdsConsent` adıyla saracak şekilde dışa açar — ayrı bir paket kurmaya
// gerek yok. Bu dosya, BannerReklam.tsx'teki native-modül-kontrolü ile
// AYNI güvenlik desenini izliyor: paket Expo Go'da / native tarafı
// derlenmemiş bir build'de yoksa hiçbir şey çökme yaratmadan sessizce
// atlanır.
//
// NASIL ÇAĞRILIR: uygulama açılışında (App.tsx ya da AppGovde.tsx'te), İLK
// reklam yüklemesinden ÖNCE `reklamOnayiIsteVeGuncelle()` bir kez
// çağrılmalı. Kullanıcı AB/EEA/İngiltere dışındaysa (ör. Türkiye) SDK zaten
// formu hiç göstermez, fonksiyon anında sonuçlanır — Türkiye kullanıcıları
// için ekstra bir adım/gecikme YARATMAZ.
//
// NOT: Bu dosya native modülü kontrol eder ama gerçek çağrıyı henüz hiçbir
// ekran/App.tsx TETİKLEMİYOR — entegrasyon noktası olarak AppGovde.tsx'in en
// başına (Provider'lar kurulduktan hemen sonra, banner reklam ilk
// render'dan ÖNCE) bir `useEffect` içinde `reklamOnayiIsteVeGuncelle()`
// çağrısı eklenmesi gerekiyor. Gerçek AdMob hesabı/ID'lerine geçişle
// BİRLİKTE yapılması önerilir (bkz. devir dosyası / eksik analizi) —
// aksi halde unutulma riski var.

import { NativeModules } from 'react-native';

let AdsConsent: any = null;
let AdsConsentStatus: any = null;
let AdsConsentDebugGeography: any = null;

const nativeReklamModuluBagli = !!(NativeModules as any)?.RNGoogleMobileAdsModule;

if (nativeReklamModuluBagli) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mobileAds = require('react-native-google-mobile-ads');
    AdsConsent = mobileAds.AdsConsent;
    AdsConsentStatus = mobileAds.AdsConsentStatus;
    AdsConsentDebugGeography = mobileAds.AdsConsentDebugGeography;
  } catch {
    // Ekstra güvenlik ağı — BannerReklam.tsx'teki ile aynı gerekçe.
  }
}

// Geliştirme sırasında formu Türkiye'den de test edebilmek için: bu satırı
// `true` yapıp `testDeviceIdentifiers`'a kendi test cihaz ID'ni eklersen
// (Metro/Logcat konsolunda "Use the following code..." hatası gerçek ID'yi
// verir), SDK'yı AB'deymiş gibi zorlayabilirsin. YAYINLANMADAN ÖNCE MUTLAKA
// `false`'A ÇEVRİLMELİ — aksi halde gerçek kullanıcılara da test/debug
// coğrafyası uygulanır.
const GELISTIRME_TEST_MODU = false;
const TEST_CIHAZ_IDLERI: string[] = [];

// Uygulama açılışında bir kez çağrılır. AB/EEA/İngiltere dışındaki
// kullanıcılar için (SDK kendi coğrafi tespitine göre karar verir) hiçbir
// form göstermeden hemen sonuçlanır. Coğrafyaya girenler için gerekliyse
// Google'ın standart rıza formunu gösterir; kullanıcı seçimini yapana kadar
// bekler. Native modül yoksa (Expo Go) hiçbir şey yapmadan döner.
export async function reklamOnayiIsteVeGuncelle(): Promise<void> {
  if (!AdsConsent) return;

  try {
    const consentInfo = await AdsConsent.requestInfoUpdate(
      GELISTIRME_TEST_MODU
        ? {
            debugGeography: AdsConsentDebugGeography?.EEA,
            testDeviceIdentifiers: TEST_CIHAZ_IDLERI,
          }
        : undefined
    );

    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdsConsentStatus?.REQUIRED
    ) {
      await AdsConsent.loadAndShowConsentFormIfRequired();
    }
  } catch {
    // Form yüklenemezse (ağ hatası vb.) sessizce geçilir — reklam SDK'sı
    // zaten kendi varsayılan (non-personalized ağırlıklı) davranışına döner,
    // uygulama akışı bloklanmaz.
  }
}

// Kullanıcının Ayarlar'dan rıza tercihini SONRADAN değiştirebilmesi için —
// Google'ın politikası bunu bir "Gizlilik Seçenekleri" bağlantısıyla
// sunmayı ÖNERİR (zorunlu değil ama iyi pratik). Ayarlar ekranındaki
// "Hakkında" bölümüne (bkz. eksik analizi, henüz eklenmedi) bir buton olarak
// bağlanabilir.
export async function reklamOnayFormuTekrarGoster(): Promise<boolean> {
  if (!AdsConsent) return false;
  try {
    const bilgi = await AdsConsent.getConsentInfo();
    if (bilgi?.isPrivacyOptionsRequired) {
      await AdsConsent.showPrivacyOptionsForm();
      return true;
    }
  } catch {
    // sessizce yok say
  }
  return false;
}
