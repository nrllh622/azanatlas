// src/AppGovde.tsx
//
// UYGULAMANIN ASIL GÖVDESİ — tüm sağlayıcılar ve Ana Sayfa.
//
// ─────────────────────────────────────────────────────────────────────────────
// BU DOSYA NEDEN AYRI?
//
// Ekran stilleri `StyleSheet.create(...)` ile MODÜL YÜKLENİRKEN bir kez
// oluşturulur ve o an `colors`'tan okunan değerlere kilitlenir. Eğer bu
// modüller uygulama açılırken hemen yüklenirse, kullanıcının seçtiği tema
// henüz cihazdan okunmamış olur ve stiller VARSAYILAN renklere kilitlenir —
// tema seçimi hiç işe yaramaz.
//
// Çözüm: bu dosya App.tsx tarafından STATİK olarak import EDİLMEZ; tema
// okunduktan sonra `require` ile yüklenir. Böylece modül zinciri (HomeScreen
// → tüm ekranlar → theme) tam olarak doğru anda çözülür ve her ekran seçilen
// paletle oluşturulur.
//
// Bu, açılışa ölçülebilir bir gecikme eklemez: aynı modüller zaten
// yüklenecekti, sadece birkaç milisaniye sonra yükleniyorlar — üstelik bu
// sırada açılış animasyonu zaten ekranda.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeModules, View } from 'react-native';
import { colors } from './theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import OnboardingEkrani from './screens/OnboardingEkrani';
import { LocationProvider } from './context/LocationContext';
import { NotificationSettingsProvider } from './context/NotificationSettingsContext';
import { CalculationSettingsProvider } from './context/CalculationSettingsContext';
import { KazaProvider } from './context/KazaContext';
import { GeneralSettingsProvider } from './context/GeneralSettingsContext';
import { VaktindeKilProvider } from './context/VaktindeKilContext';
import { RemindersProvider } from './context/RemindersContext';
import { IbadetTakibiProvider } from './context/IbadetTakibiContext';
import { DilProvider } from './i18n/DilContext';
import { onboardingTamamlandiMi, onboardingTamamlandiOlarakIsaretle } from './lib/onboardingDeposu';

/**
 * Reklam SDK'sını uygulama açılışında BİR KEZ başlatır.
 *
 * ÖNEMLİ: yalnızca `try/catch` YETMEDİĞİ gerçek cihazda görüldü — paket
 * modül yüklenirken native tarafı senkron `invariant()` ile arıyor ve bu,
 * try/catch'in her zaman yakalayabildiği bir noktada olmuyor ("Uncaught
 * Error: TurboModuleRegistry.getEnforcing(...): 'RNGoogleMobileAdsModule'
 * could not be found"). Bu yüzden paketi hiç `require` ETMEDEN önce
 * native modülün gerçekten bağlı olup olmadığı `NativeModules` üzerinden
 * kontrol ediliyor — aynı korunma `components/BannerReklam.tsx`'te de var,
 * iki dosya birbirinden bağımsız aynı kontrolü yapıyor.
 */
function reklamSdkBaslat() {
  const nativeReklamModuluBagli = !!(NativeModules as any)?.RNGoogleMobileAdsModule;
  if (!nativeReklamModuluBagli) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mobileAds = require('react-native-google-mobile-ads').default;
    mobileAds().initialize();
  } catch {
    // Ekstra güvenlik ağı — beklenmeyen bir hata olursa sessizce atlanır.
  }
}

// Madde 4 (bu tur): İLK AÇILIŞ TANITIM + İZİN AKIŞI (OnboardingEkrani.tsx).
//
// Bu akış, kullanıcının konum/bildirim tercihlerini gerçek Context'lere
// (LocationContext, NotificationSettingsContext) yazabilmesi için tüm
// Provider'ların İÇİNDE, ama `HomeScreen` yerine geçici olarak render
// ediliyor — yani `onboardingBitti` `true` olana kadar `HomeScreen` hiç
// mount edilmiyor. `onboardingKontrolEdiliyor` (kayıtlı durum AsyncStorage'dan
// okunana kadar) `null` tutuluyor ki daha önce tamamlamış bir kullanıcıya
// bir anlığına da olsa onboarding ekranı YANIP SÖNMESİN.
export default function AppGovde() {
  useEffect(() => {
    reklamSdkBaslat();
  }, []);

  const [onboardingBitti, setOnboardingBitti] = useState<boolean | null>(null);

  useEffect(() => {
    onboardingTamamlandiMi().then(setOnboardingBitti);
  }, []);

  const onboardingiTamamla = () => {
    onboardingTamamlandiOlarakIsaretle();
    setOnboardingBitti(true);
  };

  return (
    <SafeAreaProvider>
      {/* DilProvider en dışta — çünkü metin çevirisi hem HomeScreen hem
          ileride tüm alt ekranlar tarafından kullanılacak, tema gibi
          açılıştan önce okunması ZORUNLU değil (metinler StyleSheet'e
          kilitlenmiyor), ama sağlayıcı hiyerarşisinde en tepede olması
          herhangi bir alt bileşenin sorunsuz erişebilmesini garanti eder. */}
      <DilProvider>
        <LocationProvider>
          <CalculationSettingsProvider>
            <GeneralSettingsProvider>
              <VaktindeKilProvider>
                <RemindersProvider>
                  <KazaProvider>
                    <IbadetTakibiProvider>
                      <NotificationSettingsProvider>
                        {/* Üst blok koyu olduğu için durum çubuğu açık renkte */}
                        <StatusBar style={onboardingBitti ? 'light' : 'dark'} />
                        {onboardingBitti === null ? (
                          <View style={{ flex: 1, backgroundColor: colors.cream }} />
                        ) : onboardingBitti ? (
                          <HomeScreen />
                        ) : (
                          <OnboardingEkrani onTamamlandi={onboardingiTamamla} />
                        )}
                      </NotificationSettingsProvider>
                    </IbadetTakibiProvider>
                  </KazaProvider>
                </RemindersProvider>
              </VaktindeKilProvider>
            </GeneralSettingsProvider>
          </CalculationSettingsProvider>
        </LocationProvider>
      </DilProvider>
    </SafeAreaProvider>
  );
}
