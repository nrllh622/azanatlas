// App.tsx
//
// AÇILIŞ SIRASI
//
// 1. Kayıtlı tema cihazdan okunur ve uygulanır.
// 2. Yazı tipleri yüklenir.
// 3. Açılış animasyonu oynar (1,6 sn) — 1 ve 2 bu sırada arka planda biter.
// 4. Üçü de tamamlandığında asıl gövde `require` ile yüklenir.
//
// Gövdenin STATİK import EDİLMEMESİ kritiktir: ekran stilleri modül
// yüklenirken oluşur ve o anki renklere kilitlenir. Statik import olsaydı
// stiller tema okunmadan önce oluşur, kullanıcının seçimi hiç uygulanmazdı.
// Ayrıntılı gerekçe: src/AppGovde.tsx

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Cairo_700Bold, Cairo_600SemiBold } from '@expo-google-fonts/cairo';
import { Manrope_400Regular, Manrope_500Medium, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { View } from 'react-native';
import AcilisEkrani, { AcilisVaryanti } from './src/screens/AcilisEkrani';
import { colors } from './src/theme';
import { kayitliTemayiUygula } from './src/lib/temaDeposu';
import { DilKodu, VARSAYILAN_DIL } from './src/i18n/ceviriler';
import { kayitliDiliOku } from './src/i18n/dilDeposu';

// ─────────────────────────────────────────────────────────────────────────────
// AÇILIŞ EKRANI VARYANTI — denemek için bu satırı değiştirin:
//   'girih'         → geometrik desen merkezden açılır, ortada hatem yıldızı
//   'safak'         → ufkun altından ışık doğar, üstünde hilal belirir
//   'hatem'         → yıldız dönerek büyür, çevresinde ince halkalar
//   'cami-siluet'   → cami silueti alttan yükselir, ad üstte (sade)
//   'cami-hilal'    → cami silueti + üzerinde beliren hilal, ad üstte
//   'cami-altin'    → girih dokulu zemin + altın/bakır gradyanlı cami, ad üstte
//   'ufuk-cizgisi'  → SEÇİLEN VARYANT: cami ufuk çizgisinde, arkasından
//                      doğan ışık yükselir, ad üstte (Artifact'taki "D")
// ─────────────────────────────────────────────────────────────────────────────
const ACILIS_VARYANTI: AcilisVaryanti = 'ufuk-cizgisi';

export default function App() {
  const [fontsLoaded] = useFonts({
    Cairo_700Bold,
    Cairo_600SemiBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
  });

  const [temaHazir, setTemaHazir] = useState(false);
  const [acilisBitti, setAcilisBitti] = useState(false);
  // Madde 7 (i18n taraması, bu tur): açılış ekranındaki slogan daha önce
  // hardcoded Türkçe idi. `AcilisEkrani` `DilProvider`'ın (AppGovde.tsx
  // içinde, tema sonrası yüklenir) DIŞINDA render edildiği için
  // `useCeviri()` çağıramaz — tıpkı temanın burada `kayitliTemayiUygula()`
  // ile doğrudan okunması gibi, dil de `kayitliDiliOku()` ile doğrudan
  // AsyncStorage'dan okunup `AcilisEkrani`'na prop olarak geçiriliyor.
  const [acilisDili, setAcilisDili] = useState<DilKodu>(VARSAYILAN_DIL);

  useEffect(() => {
    // Tema okuması başarısız olsa bile açılış devam etmeli — varsayılan
    // palet zaten yüklü durumda.
    kayitliTemayiUygula().finally(() => setTemaHazir(true));
    kayitliDiliOku().then(setAcilisDili);
  }, []);

  const hazir = fontsLoaded && temaHazir && acilisBitti;

  if (!hazir) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primaryDeep }}>
        <StatusBar style="light" />
        <AcilisEkrani varyant={ACILIS_VARYANTI} dil={acilisDili} onBitti={() => setAcilisBitti(true)} />
      </View>
    );
  }

  // Tema uygulandıktan SONRA yükleniyor — böylece tüm ekran stilleri
  // seçilen paletin renkleriyle oluşuyor.
  const AppGovde = require('./src/AppGovde').default;
  return <AppGovde />;
}
