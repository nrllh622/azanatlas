// src/i18n/dilDeposu.ts
//
// DİL SEÇİMİNİN KALICI SAKLANMASI
//
// `lib/temaDeposu.ts` ile BİREBİR aynı kalıp: seçilen dil cihazda saklanır,
// uygulama her açılışta okunur. Tema ile fark: dil değişikliği ekranları
// KİLİTLEMEZ (metinler StyleSheet içinde değil, JSX'te render sırasında
// okunuyor) — bu yüzden burada tema deposundaki "uygula" adımı yok, yalnızca
// oku/kaydet var. Gerçek "uygulama" `DilContext`'in state güncellemesiyle
// olur (bkz. DilContext.tsx).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DilKodu, VARSAYILAN_DIL, sistemDiliniTahminEt } from './ceviriler';

const ANAHTAR = 'azanatlas_dil_v1';

/** Kayıtlı dili okur; hiç seçim yapılmadıysa cihaz diline göre tahmin eder. */
export async function kayitliDiliOku(): Promise<DilKodu> {
  try {
    const deger = await AsyncStorage.getItem(ANAHTAR);
    if (deger === 'tr' || deger === 'en') return deger;
  } catch {
    // yoksay — tahmine düş
  }
  return sistemDiliniTahminEt();
}

/** Seçilen dili kaydeder. */
export async function diliKaydet(dil: DilKodu): Promise<void> {
  try {
    await AsyncStorage.setItem(ANAHTAR, dil);
  } catch {
    // Kaydedilemezse bir sonraki açılışta tekrar sistem diline düşülür;
    // uygulamanın çalışmasını engellemez.
  }
}
