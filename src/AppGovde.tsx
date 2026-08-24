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

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import { LocationProvider } from './context/LocationContext';
import { NotificationSettingsProvider } from './context/NotificationSettingsContext';
import { CalculationSettingsProvider } from './context/CalculationSettingsContext';
import { KazaProvider } from './context/KazaContext';
import { GeneralSettingsProvider } from './context/GeneralSettingsContext';
import { VaktindeKilProvider } from './context/VaktindeKilContext';
import { RemindersProvider } from './context/RemindersContext';
import { IbadetTakibiProvider } from './context/IbadetTakibiContext';
import { DilProvider } from './i18n/DilContext';

/**
 * Reklam SDK'sını uygulama açılışında BİR KEZ başlatır. `require` ile
 * korumalı çağrılıyor — Expo Go'da bu native modül bulunamaz, `catch`
 * bloğu sessizce yutar (bkz. `components/BannerReklam.tsx`'teki aynı
 * desen). `initialize()` çağrılmadan `<BannerAd>` reklamı yüklemez, bu
 * yüzden bu adım BannerReklam ile birlikte, ayrı bir dosyada tutuldu.
 */
function reklamSdkBaslat() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mobileAds = require('react-native-google-mobile-ads').default;
    mobileAds().initialize();
  } catch {
    // Expo Go'da veya modül henüz kurulmadıysa sessizce atlanır.
  }
}

export default function AppGovde() {
  useEffect(() => {
    reklamSdkBaslat();
  }, []);


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
                        <StatusBar style="light" />
                        <HomeScreen />
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
