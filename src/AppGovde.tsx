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

import React from 'react';
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

export default function AppGovde() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
