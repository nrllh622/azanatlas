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
// NEDEN AYRI BİR BİLEŞEN?
//
// `react-native-google-mobile-ads` NATIVE bir modüldür — Expo Go'da
// çalışmaz (development build/`expo run:android` gerekir). Bu bileşen
// import edildiğinde Expo Go'da modül bulunamazsa uygulamayı ÇÖKERTMEMESİ
// için `try/require` deseniyle korumalı yüklendi; bulunamazsa yerine boş
// bir View render edilir (reklamAlani'nın ayrılmış 50dp'lik alanı
// bozulmaz, yalnızca reklam görünmez).
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mobileAds = require('react-native-google-mobile-ads');
  BannerAd = mobileAds.BannerAd;
  BannerAdSize = mobileAds.BannerAdSize;
  TestIds = mobileAds.TestIds;
} catch {
  // Expo Go'da veya modül henüz kurulmadıysa (npm install eksikse) burası
  // sessizce atlanır — BannerAd null kalır, aşağıda boş View render edilir.
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
  if (!BannerAd || !BANNER_UNIT_ID) {
    // Native modül yok (Expo Go) — yer tutucu boşluk aynı yükseklikte
    // kalsın diye boş bir View, içerik konumu değişmesin.
    return <View style={[styles.bosluk, style]} />;
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
  kap: { alignItems: 'center', justifyContent: 'center', minHeight: 50 },
  bosluk: { height: 50 },
});
