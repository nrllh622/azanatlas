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

  useEffect(() => {
    // Tema okuması başarısız olsa bile açılış devam etmeli — varsayılan
    // palet zaten yüklü durumda.
    kayitliTemayiUygula().finally(() => setTemaHazir(true));
  }, []);

  const hazir = fontsLoaded && temaHazir && acilisBitti;

  if (!hazir) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primaryDeep }}>
        <StatusBar style="light" />
        <AcilisEkrani varyant={ACILIS_VARYANTI} onBitti={() => setAcilisBitti(true)} />
      </View>
    );
  }

  // Tema uygulandıktan SONRA yükleniyor — böylece tüm ekran stilleri
  // seçilen paletin renkleriyle oluşuyor.
  const AppGovde = require('./src/AppGovde').default;
  return <AppGovde />;
}
