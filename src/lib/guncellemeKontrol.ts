// src/lib/guncellemeKontrol.ts
//
// UYGULAMA GÜNCELLEME KONTROLÜ (7. tur — madde 7)
//
// ─────────────────────────────────────────────────────────────────────────────
// KULLANICININ İSTEĞİ NE, BUNUNLA NE YAPILDI?
//
// Kullanıcı, referans olarak Google Play'in KENDİ yerleşik "Uygulamanın yeni
// versiyonu bulundu / ŞİMDİ GÜNCELLE / SONRA HATIRLAT" diyaloğuna benzer bir
// örnek gösterdi. Bu tam olarak Google Play'in "In-App Updates" (Play Core)
// API'sinin GÖRÜNÜMÜ — `expo-updates` (JS/OTA yamaları, mağaza incelemesi
// GEREKTİRMEZ, sessizce günceller) ile KARIŞTIRILMAMALI; bu ayrı, native bir
// mekanizma ve APK/AAB'nin Play Store'da YENİ bir sürüm olarak yayınlanmış
// olmasını gerektiriyor.
//
// Kullanılan paket: `expo-in-app-updates` (native modül — Expo Go'da ÇALIŞMAZ,
// yalnızca `npx expo run:android` ile alınan gerçek build'de çalışır; iOS'ta
// Play Core karşılığı yok, App Store'u modal olarak açar).
//
// ─────────────────────────────────────────────────────────────────────────────
// AKIŞ
//
// 1. `guncellemeVarMi()` Play Store'a sorar: yayınlanmış sürüm, yüklü
//    sürümden yeni mi?
// 2. Yeni sürüm varsa VE kullanıcı bu sürümü daha önce "Sonra Hatırlat" ile
//    ERTELEMEMİŞSE (aynı sürüm için günde bir kez sorulur — `sonHatirlatilanSurum`
//    + `sonHatirlatmaZamani`), `GuncellemeUyarisi` modalı gösterilir.
// 3. Kullanıcı "Otomatik Güncelleme" ayarını AÇMIŞSA, modal hiç gösterilmeden
//    doğrudan FLEXIBLE güncelleme (arka planda indirilir, kullanıcı istediği
//    an "Yeniden Başlat"a basar) başlatılır.
//
// Native modül yokken (Expo Go, iOS'ta paket desteklenmiyor, ya da herhangi
// bir hata) TÜM fonksiyonlar sessizce `{ updateAvailable: false }` benzeri
// güvenli bir sonuç döndürür — uygulamanın geri kalanı hiç etkilenmez. Bu,
// projede zaten kullanılan (react-native-android-widget, react-native-google-
// mobile-ads) "önce NativeModules ile var mı diye bak, sonra require et"
// desenini izliyor.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

const HATIRLATMA_ANAHTARI = 'azanatlas_guncelleme_hatirlatma_v1';

export interface GuncellemeDurumu {
  updateAvailable: boolean;
  immediateAllowed?: boolean;
  flexibleAllowed?: boolean;
}

function nativeModulBagliMi(): boolean {
  // expo-in-app-updates'in native tarafı Android'de bu isimle kayıtlı oluyor.
  // Paket henüz kurulmadıysa ya da Expo Go'daysak bu her zaman `false` döner.
  return Platform.OS === 'android' && !!(NativeModules as any)?.ExpoInAppUpdates;
}

/** Play Store'da yüklüden daha yeni bir sürüm var mı, sessizce kontrol eder. */
export async function guncellemeVarMi(): Promise<GuncellemeDurumu> {
  if (!nativeModulBagliMi()) return { updateAvailable: false };
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const InAppUpdates = require('expo-in-app-updates');
    const sonuc = await InAppUpdates.checkForUpdate();
    return {
      updateAvailable: !!sonuc?.updateAvailable,
      immediateAllowed: sonuc?.immediateAllowed,
      flexibleAllowed: sonuc?.flexibleAllowed,
    };
  } catch {
    return { updateAvailable: false };
  }
}

/** FLEXIBLE güncellemeyi başlatır (arka planda indirir, kullanıcı sonra yeniden başlatır). */
export async function esnekGuncellemeyiBaslat(): Promise<void> {
  if (!nativeModulBagliMi()) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const InAppUpdates = require('expo-in-app-updates');
    await InAppUpdates.startUpdate(false); // false = flexible
  } catch {
    // Sessizce yoksay — kullanıcı Play Store'dan elle güncelleyebilir.
  }
}

/** IMMEDIATE güncellemeyi başlatır (indirilene kadar uygulama kullanılamaz). */
export async function zorunluGuncellemeyiBaslat(): Promise<void> {
  if (!nativeModulBagliMi()) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const InAppUpdates = require('expo-in-app-updates');
    await InAppUpdates.startUpdate(true); // true = immediate
  } catch {
    // Sessizce yoksay.
  }
}

/**
 * Kullanıcı "Sonra Hatırlat" dediğinde çağrılır — o GÜN için bu sürüm hakkında
 * tekrar sorulmaz (ertesi gün ya da uygulama tamamen kapatılıp açıldığında
 * tekrar hatırlatılır, sürekli erteleme sonsuza kadar sürmesin diye).
 */
export async function guncellemeyiBugunErtele(surumEtiketi: string): Promise<void> {
  try {
    const bugun = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    await AsyncStorage.setItem(HATIRLATMA_ANAHTARI, JSON.stringify({ surumEtiketi, gun: bugun }));
  } catch {
    // yoksay — en kötü ihtimalle kullanıcı aynı gün içinde tekrar görür.
  }
}

/** Bu sürüm için bugün zaten "Sonra Hatırlat" denip denmediğini kontrol eder. */
export async function bugunErtelendiMi(surumEtiketi: string): Promise<boolean> {
  try {
    const ham = await AsyncStorage.getItem(HATIRLATMA_ANAHTARI);
    if (!ham) return false;
    const { surumEtiketi: kayitliSurum, gun } = JSON.parse(ham);
    const bugun = new Date().toISOString().slice(0, 10);
    return kayitliSurum === surumEtiketi && gun === bugun;
  } catch {
    return false;
  }
}
