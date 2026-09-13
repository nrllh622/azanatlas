// modules/pil-durumu/src/index.ts
//
// Bu modül YALNIZCA Android'de var — iOS/web'de import edilirse
// `requireOptionalNativeModule` sayesinde `null` döner, throw etmez.
// Kullanan kodun (SettingsScreen.tsx) Platform.OS kontrolüyle zaten
// yalnızca Android'de çağırması bekleniyor ama bu ekstra güvenlik ağı.
import { requireOptionalNativeModule } from 'expo-modules-core';

const PilDurumuNative = requireOptionalNativeModule<{
  kisitlamaKaldirilmisMi: () => boolean;
}>('PilDurumuModule');

/**
 * Pil optimizasyonu kısıtlaması bu cihazda ŞU AN kaldırılmış mı
 * (Android'in PowerManager.isIgnoringBatteryOptimizations() sorgusu)?
 *
 * Native modül yoksa (henüz bu native koda sahip bir build alınmadı,
 * ya da iOS/web) `null` döner — çağıran taraf bunu "bilinmiyor" olarak
 * ele almalı (ne "kaldırıldı" ne "kısıtlı" yazısı gösterilmemeli).
 */
export function pilKisitlamasiKaldirilmisMi(): boolean | null {
  if (!PilDurumuNative) return null;
  try {
    return PilDurumuNative.kisitlamaKaldirilmisMi();
  } catch {
    return null;
  }
}
