// src/lib/onboardingDeposu.ts
//
// Madde 4 (bu tur): İLK AÇILIŞ TANITIM + İZİN AKIŞININ KALICI SAKLANMASI
//
// `i18n/dilDeposu.ts` ve `lib/temaDeposu.ts` ile BİREBİR aynı kalıp:
// kullanıcı onboarding akışını (OnboardingEkrani.tsx) bir kez tamamladığında
// (ya da "Atla" ile geçtiğinde) bu bilgi cihazda saklanır — bir sonraki
// açılışta akış tekrar gösterilmez, doğrudan ana uygulamaya geçilir.

import AsyncStorage from '@react-native-async-storage/async-storage';

const ANAHTAR = 'azanatlas_onboarding_tamam_v1';

/** Onboarding akışının daha önce tamamlanıp tamamlanmadığını okur. */
export async function onboardingTamamlandiMi(): Promise<boolean> {
  try {
    const deger = await AsyncStorage.getItem(ANAHTAR);
    return deger === '1';
  } catch {
    // Depolama okunamazsa akışı GÖSTERMEK güvenli taraf — kullanıcı en
    // kötü ihtimalle onboarding'i bir kez daha görür, hiçbir işlevi bozmaz.
    return false;
  }
}

/** Onboarding akışının tamamlandığını (ya da atlandığını) kaydeder. */
export async function onboardingTamamlandiOlarakIsaretle(): Promise<void> {
  try {
    await AsyncStorage.setItem(ANAHTAR, '1');
  } catch {
    // Kaydedilemezse bir sonraki açılışta akış tekrar gösterilir; uygulamanın
    // çalışmasını engellemez.
  }
}
