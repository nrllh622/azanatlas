// src/components/BannerReklam.tsx
//
// BANNER REKLAM — react-native-google-mobile-ads
//
// ─────────────────────────────────────────────────────────────────────────────
// TEST KİMLİKLERİ KULLANILIYOR — YAYINLANMADAN ÖNCE DEĞİŞTİRİLMELİ
//
// Şu an Google'ın herkese açık, resmi TEST reklam birimi kimliği
// kullanılıyor (`TestIds.BANNER`). Bu, geliştirme sırasında gerçek reklam
// göstermeden entegrasyonu test etmeyi sağlar — Play Console'a yüklemeden
// ÖNCE gerçek AdMod banner birim kimliğiyle değiştirilmesi ZORUNLU, aksi
// halde AdMob politikası ihlali olur (test kimliğiyle canlıya çıkmak
// hesabı askıya aldırabilir).
//
// Kalıcı hafızada bir önceki uygulama (BillSplit Nova) için gerçek bir
// AdMob App ID/Banner Unit ID kaydı var, ama bu YENİ bir uygulama —
// azanatlas'ın kendi AdMob hesabında ayrı bir uygulama olarak
// kaydedilmesi ve kendi birim kimliklerinin alınması gerekiyor. O
// kimlikler elde edilince hem burada hem `app.json`'daki
// `androidAppId`/`iosAppId` alanlarında güncellenmeli.
//
// ─────────────────────────────────────────────────────────────────────────────
// NEDEN AYRI BİR BİLEŞEN? — VE NEDEN SADECE try/catch YETMEDİ
//
// `react-native-google-mobile-ads` NATIVE bir modüldür — Expo Go'da ve
// paketin native tarafı henüz derlenmemiş bir development build'de
// çalışmaz. İLK sürümde yalnızca `try { require(...) } catch {}` ile
// korunmuştu, ama gerçek cihazda "Uncaught Error:
// TurboModuleRegistry.getEnforcing(...): 'RNGoogleMobileAdsModule' could
// not be found" hatasıyla ÇÖKTÜ — paketin kendi iç dosyaları
// (MobileAds.ts → GoogleMobileAdsModule.ts) modül YÜKLENİRKEN native
// modülü SENKRON olarak `invariant()` ile arıyor; bu belirli RN/Expo
// sürüm kombinasyonunda `require()` çağrısını saran try/catch'in dışına
// taşan bir noktada patlıyor.
//
// Çözüm: paketi hiç `require` ETMEDEN önce, native tarafın gerçekten
// bağlı olup olmadığını `NativeModules` üzerinden DOĞRUDAN kontrol
// ediyoruz. Native modül kayıtlı değilse (Expo Go / eski development
// build) paketin JS dosyalarına hiç girilmiyor — çökme ihtimali kalmıyor.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, NativeModules } from 'react-native';

let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

const nativeReklamModuluBagli = !!(NativeModules as any)?.RNGoogleMobileAdsModule;

if (nativeReklamModuluBagli) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mobileAds = require('react-native-google-mobile-ads');
    BannerAd = mobileAds.BannerAd;
    BannerAdSize = mobileAds.BannerAdSize;
    TestIds = mobileAds.TestIds;
  } catch {
    // Ekstra güvenlik ağı: native modül kayıtlı görünse bile herhangi bir
    // beklenmeyen hata olursa sessizce atlanır — BannerAd null kalır.
  }
}

// Gerçek kimlik alındığında bu satır güncellenecek:
//   const BANNER_UNIT_ID = Platform.OS === 'ios' ? 'ca-app-pub-XXXX/IOS_ID' : 'ca-app-pub-XXXX/ANDROID_ID';
const BANNER_UNIT_ID = TestIds?.BANNER;

interface Props {
  /** Çağıran ekranın kendi boşluk/konum ayarını verebilmesi için —
      HomeScreen'deki eski `reklamAlani` stilinin (marginTop) yerini alır. */
  style?: StyleProp<ViewStyle>;
}

export default function BannerReklam({ style }: Props) {
  // DÜZELTME (6. tur — madde 6): kullanıcı "Takip/Tesbih/Esma/Kaza" ile
  // "Günün Ayeti" arasında gereksiz boşluk kalmaya devam ettiğini belirtti.
  // Kök neden HomeScreen'deki marginlar değildi — bu bileşenin KENDİSİ,
  // gerçek reklam yokken (Expo Go'da native modül hiç bulunamadığı için)
  // SABİT 50dp'lik boş bir kutu ayırıyordu; kullanıcının gördüğü "boşluk"
  // işte bu boş kutuydu. Artık native modül/reklam yokken HİÇBİR ŞEY
  // render edilmiyor (`null`) — hiç yer kaplamıyor. Prod'da gerçek reklam
  // yüklendiğinde içerik bir miktar aşağı kayar (reflow) ama bu, reklam
  // SDK'larında standart ve kabul edilen bir davranıştır; kalıcı olarak
  // boş yer ayırmaktan (kullanıcının asıl şikayeti) çok daha iyi bir denge.
  if (!BannerAd || !BANNER_UNIT_ID) {
    return null;
  }

  return (
    <View style={[styles.kap, style]}>
      <BannerAd
        unitId={BANNER_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  kap: { alignItems: 'center', justifyContent: 'center' },
});
