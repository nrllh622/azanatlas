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

// Geçerli dil kodlarının listesi — Faz-1 diline yeni bir dil eklendiğinde
// (bkz. `ceviriler.ts`'teki `DilKodu`) yalnızca burası güncellenmesi
// gerekiyor. Önceden yalnızca 'tr'/'en' hardcoded kontrol ediliyordu; bu,
// kullanıcı Endonezce/Fransızca seçse bile uygulama yeniden açıldığında
// kayıtlı seçimin tanınmayıp sessizce varsayılan dile (tr) dönmesine yol
// açan bir hataydı — Faz-1 dilleri eklenirken fark edilip düzeltildi.
const GECERLI_DILLER: DilKodu[] = ['tr', 'en', 'id', 'fr'];

/** Kayıtlı dili okur; hiç seçim yapılmadıysa cihaz diline göre tahmin eder. */
export async function kayitliDiliOku(): Promise<DilKodu> {
  try {
    const deger = await AsyncStorage.getItem(ANAHTAR);
    if (deger && (GECERLI_DILLER as string[]).includes(deger)) return deger as DilKodu;
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
