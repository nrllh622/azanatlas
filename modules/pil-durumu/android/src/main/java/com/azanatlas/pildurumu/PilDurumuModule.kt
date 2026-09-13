// modules/pil-durumu/android/.../PilDurumuModule.kt
//
// AMAÇ: Android'in PowerManager.isIgnoringBatteryOptimizations() API'sini
// JS tarafına expose eden minimal bir Expo native modülü.
//
// KÖK NEDEN — neden bu gerekiyor: `expo-intent-launcher` yalnızca Intent
// AÇAR (kullanıcıyı bir ayar ekranına götürür), gerçek muafiyet DURUMUNU
// SORGULAYAMAZ. "Pil kısıtlaması kaldırıldı mı?" sorusunun doğru cevabını
// almanın tek native-olmayan (üçüncü taraf paket eklemeden) yolu budur —
// bu yüzden proje için özel, tek fonksiyonlu bir Expo modülü yazıldı.
//
// `settings.gradle`'daki `expoAutolinking.useExpoModules()` çağrısı,
// `expo-module.config.json` içeren HER paketi (bu yerel modül dahil)
// otomatik olarak native tarafa bağlar — `node_modules`'taki paketlerden
// (expo-intent-launcher, expo-store-review vb.) ayrı bir mekanizma
// kullanmaz, elle hiçbir yere eklenmesi gerekmez.
package com.azanatlas.pildurumu

import android.content.Context
import android.os.Build
import android.os.PowerManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class PilDurumuModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("PilDurumuModule")

    // Senkron fonksiyon: JS tarafında `await` gerektirmeden anında
    // `true`/`false` döner. Android 6.0 (API 23) altında Doze modu
    // kavramı yok — böyle bir cihazda kısıtlama zaten uygulanmıyor
    // sayılır, bu yüzden `true` (muaf) dönülüyor.
    Function("kisitlamaKaldirilmisMi") {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
        return@Function true
      }
      val context = appContext.reactContext ?: return@Function false
      val powerManager = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
        ?: return@Function false
      powerManager.isIgnoringBatteryOptimizations(context.packageName)
    }
  }
}
