// src/components/BannerReklam.tsx
//
// BANNER REKLAM — react-native-google-mobile-ads
//
// ─────────────────────────────────────────────────────────────────────────────
// DÜZELTME (bu tur): kullanıcı AdMob'da gerçek App ID ile birlikte 3 AYRI
// Banner reklam birimi oluşturdu (Anasayfa Alt, Anasayfa Orta, Keşfet) —
// her yerleşimin kendi unit ID'si olması AdMob raporlarında hangi
// konumun ne kadar kazandırdığını ayrı ayrı görebilmek için önemli. Bu
// yüzden `BANNER_UNIT_ID` sabiti kaldırıldı; bileşen artık `unitId` prop'u
// ZORUNLU alıyor, her çağıran (HomeScreen — 2 yerde, KesfetScreen — 1
// yerde) kendi gerçek unit ID'sini `src/config/reklamKimlikleri.ts`'ten
// import edip geçiriyor. TEST modunda (development build, `__DEV__`)
// gerçek unit ID yerine otomatik olarak `TestIds.BANNER` kullanılır —
// böylece geliştirme sırasında yanlışlıkla gerçek reklamlara tıklanıp
// AdMob hesabının geçersiz trafik nedeniyle askıya alınma riski olmaz;
// bu, AdMob'un kendi resmi tavsiyesidir (bkz. Google AdMob dokümantasyonu
// "Test your ads" bölümü).
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

interface Props {
  /** Bu yerleşimin gerçek AdMob Banner Reklam Birimi Kimliği —
      `src/config/reklamKimlikleri.ts`'ten import edilip geçirilir. */
  unitId: string;
  /** Çağıran ekranın kendi boşluk/konum ayarını verebilmesi için —
      HomeScreen'deki eski `reklamAlani` stilinin (marginTop) yerini alır. */
  style?: StyleProp<ViewStyle>;
}

export default function BannerReklam({ unitId, style }: Props) {
  // Development build'de (Expo Go/emülatör dahil, native modül bağlıyken)
  // gerçek birim yerine Google'ın test kimliği kullanılır — yayın (prod)
  // build'de `__DEV__` false olur ve gerçek `unitId` devreye girer.
  const effectiveUnitId = __DEV__ ? TestIds?.BANNER : unitId;
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
  if (!BannerAd || !effectiveUnitId) {
    return null;
  }

  return (
    <View style={[styles.kap, style]}>
      <BannerAd
        unitId={effectiveUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  kap: { alignItems: 'center', justifyContent: 'center' },
});
