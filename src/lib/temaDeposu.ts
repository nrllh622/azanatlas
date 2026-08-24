// src/lib/temaDeposu.ts
//
// TEMA SEÇİMİNİN KALICI SAKLANMASI
//
// Kullanıcının seçtiği palet cihazda saklanır ve uygulama her açılışta,
// HERHANGİ BİR EKRAN ÇİZİLMEDEN ÖNCE okunur (bkz. index.ts). Bu sıra
// kritiktir: ekranlar `StyleSheet.create` ile stillerini modül yüklenirken
// bir kez oluşturur; palet o andan sonra değişirse ekrana yansımaz.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETLER, PaletAdi, VARSAYILAN_PALET, _paletiAyarla } from '../theme';

const ANAHTAR = 'azanatlas_tema_v1';

/**
 * Kayıtlı temayı okur ve uygulamaya uygular.
 *
 * Uygulama açılışında, App bileşeni render edilmeden önce çağrılır.
 * Okuma başarısız olursa varsayılan palet kullanılır — tema tercihi
 * uygulamanın açılmasını engellememeli.
 */
export async function kayitliTemayiUygula(): Promise<PaletAdi> {
  try {
    const deger = await AsyncStorage.getItem(ANAHTAR);
    if (deger && PALETLER[deger]) {
      _paletiAyarla(deger as PaletAdi);
      return deger as PaletAdi;
    }
  } catch {
    // Depolama okunamadı — varsayılana düş.
  }
  _paletiAyarla(VARSAYILAN_PALET);
  return VARSAYILAN_PALET;
}

/** Seçilen temayı kaydeder. Uygulanması bir sonraki açılışta olur. */
export async function temayiKaydet(ad: PaletAdi): Promise<void> {
  await AsyncStorage.setItem(ANAHTAR, ad);
}

/** Kayıtlı temayı yalnızca okur (uygulamaz) — seçim ekranı için. */
export async function kayitliTemayiOku(): Promise<PaletAdi> {
  try {
    const deger = await AsyncStorage.getItem(ANAHTAR);
    if (deger && PALETLER[deger]) return deger as PaletAdi;
  } catch {
    // yoksay
  }
  return VARSAYILAN_PALET;
}
