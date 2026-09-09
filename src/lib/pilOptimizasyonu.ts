// src/lib/pilOptimizasyonu.ts
//
// PİL OPTİMİZASYONU MUAFİYETİ (bu tur — madde 8 + 11 birleşik çözüm)
//
// ─────────────────────────────────────────────────────────────────────────────
// KULLANICININ ŞİKAYETİ VE KÖK NEDEN
//
// Madde 8: "Hiçbir bildirim vaktinde ve doğru çalışmıyor" — örnek olarak
// 16:48'deki İkindi bildirimi 17:05'te (17 dakika gecikmeli) geldiği
// gösterildi. Madde 11: "pil optimizasyon eklenmemeli, arka planda pil
// tüketimi çok az olmalı" (kullanıcı "Ezan Vakti Pro" adlı başka bir
// uygulamanın "Bildirimler kesintisiz çalışsın / Pil kısıtlamasını kaldır"
// modalının ekran görüntüsünü referans verdi).
//
// Bu ikisi AYNI kök nedenin iki yüzü: Android'in Doze modu / "Pil
// Optimizasyonu" (üretici bazında Samsung'da "Uyku modundaki uygulamalar",
// Xiaomi'de "Otomatik başlatma", vb. farklı adlarla) uygulama arka planda
// veya ekran kapalıyken zamanlanmış görevleri (expo-notifications'ın
// AlarmManager tabanlı yerel bildirimleri DAHİL) erteleyebilir — bu, kod
// hatası DEĞİL, işletim sisteminin pil tasarrufu davranışıdır. ÇÖZÜM kod
// tarafında yoktur; kullanıcının cihazında bu uygulama için pil
// kısıtlamasını MANUEL olarak kaldırması gerekir. Bunu yapmadan "vaktinde
// bildirim" garanti edilemez.
//
// Bu dosya, Android'in KENDİ resmi Intent'ini (`ACTION_REQUEST_IGNORE_
// BATTERY_OPTIMIZATIONS`) `expo-intent-launcher` ile açar — bu, kullanıcıyı
// doğrudan sistemin "Pil kısıtlamasını kaldır" onay diyaloğuna götürür,
// hiçbir üçüncü taraf/üretici-özel ayar sayfasına gitmeye gerek kalmaz ve
// ekstra native config plugin GEREKTİRMEZ (expo-intent-launcher, App.json
// değişikliği olmadan `npx expo install` ile eklenebilen basit bir modül).
//
// NOT: bu muafiyeti istemek Google Play politikası açısından hassastır —
// `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` izni Play Console'da "Yalnızca
// gerçek arka plan görevi olan uygulamalar kullanmalı" uyarısı taşır. Bu
// uygulama gerçekten arka planda zamanlanmış namaz vakti bildirimleri
// gösterdiği için MEŞRU bir kullanım — ama gereksiz yere agresif/ısrarcı
// GÖSTERİLMEMESİ gerekiyor: bu yüzden modal yalnızca AÇILIŞTA BİR KEZ
// (kullanıcı "Sonra" derse bir daha o oturumda sorulmaz) gösteriliyor,
// tekrar açmak isteyen kullanıcı için Ayarlar'da kalıcı bir link var.

import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GORULDU_ANAHTARI = 'azanatlas_pil_optimizasyonu_uyarisi_goruldu_v1';

function nativeModulBagliMi(): boolean {
  return Platform.OS === 'android' && !!(NativeModules as any)?.ExpoIntentLauncher;
}

/**
 * Uygulama şu anda pil optimizasyonundan MUAF mı (yani kısıtlama zaten
 * kaldırılmış mı)? `expo-intent-launcher` bunu doğrudan sormaz — bu yüzden
 * Android'in `PowerManager.isIgnoringBatteryOptimizations()` çağrısına en
 * yakın pratik yol, native tarafta ayrı bir modül gerektirmeden, doğrudan
 * `Linking`/Intent ile SORGULAMAK değil, kullanıcıya HER ZAMAN seçeneği
 * sunup zaten muaf olan bir cihazda sistemin kendisinin "zaten kapalı" ya
 * da işlemsiz geçmesidir — bu yüzden burada bir "izin var mı" kontrolü
 * YOKTUR, yalnızca "daha önce bu oturumda/gün gösterildi mi" kontrolü var.
 */
export async function pilUyarisiGosterilmisMi(): Promise<boolean> {
  try {
    const ham = await AsyncStorage.getItem(GORULDU_ANAHTARI);
    return ham === '1';
  } catch {
    return false;
  }
}

export async function pilUyarisiniGoruldiIsaretle(): Promise<void> {
  try {
    await AsyncStorage.setItem(GORULDU_ANAHTARI, '1');
  } catch {
    // yoksay — en kötü ihtimalle kullanıcı bir dahaki açılışta tekrar görür.
  }
}

/**
 * Kullanıcıyı doğrudan Android'in "Pil kısıtlamasını kaldır" sistem onay
 * diyaloğuna yönlendirir. `expo-intent-launcher` kurulu değilse (henüz
 * `npx expo install expo-intent-launcher` çalıştırılmadıysa) veya Expo
 * Go'daysak sessizce hiçbir şey yapmaz — uygulamanın geri kalanı etkilenmez.
 */
export async function pilKisitlamasiniKaldir(): Promise<void> {
  if (!nativeModulBagliMi()) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IntentLauncher = require('expo-intent-launcher');
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS
    );
  } catch {
    // Bazı üreticilerde (özellikle MIUI/ColorOS) bu Intent'in doğrudan
    // "muafiyet ekle" varyantı yerine genel pil ayarları listesini açması
    // beklenir — kullanıcı listede uygulamayı bulup kendisi kapatır. Intent
    // hiç açılamazsa (çok eski/özel ROM) sessizce geçilir.
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const IntentLauncher = require('expo-intent-launcher');
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
        { data: 'package:com.azanatlas.app' }
      );
    } catch {
      // son çare de başarısızsa yoksay.
    }
  }
}
