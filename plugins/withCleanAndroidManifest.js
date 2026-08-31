// plugins/withCleanAndroidManifest.js
//
// AMAÇ
// ----
// KÖK NEDEN (bulundu 2026-08-31, bir önceki yaklaşım işe yaramadıktan
// sonra AAB'nin gerçek içeriği bundletool ile incelenerek kanıtlandı):
// bu izinler `expo prebuild` sırasında oluşan `android/app/src/main/
// AndroidManifest.xml`'de DEĞİL — onları filtreleyen önceki plugin
// sürümü o dosyayı gerçekten temizliyordu (yerelde doğrulandı). Sorun,
// Android'in kendi GRADLE MANIFEST MERGER mekanizmasında: derleme
// sırasında, her native bağımlılığın (AAR) kendi içine gömülü
// AndroidManifest.xml parçası ana manifestle otomatik birleştiriliyor.
// Bu birleştirme, expo config plugin'lerin çalıştığı `expo prebuild`
// aşamasından TAMAMEN AYRI ve SONRAKİ bir adım (Gradle build zamanı),
// bu yüzden dosya filtrelemesi manifest merger'ı etkilemiyor —
// kaldırdığımız izin, kütüphanenin kendi manifest'inden geri geliyor.
//
// Somut kaynak:
//   node_modules/expo-sensors/android/src/main/AndroidManifest.xml
//     → <uses-permission android:name="android.permission.ACTIVITY_RECOGNITION"/>
//   (uygulama yalnızca kıble pusulası için manyetometre kullanıyor,
//   expo-sensors'ın adım sayar/pedometer API'si hiç kullanılmıyor —
//   ama kütüphane kendi manifest'ine bu izni koşulsuz ekliyor.)
//   Benzer şekilde RECORD_AUDIO/SYSTEM_ALERT_WINDOW/READ-WRITE_EXTERNAL_
//   STORAGE de expo-av ve türü bağımlılıkların kendi manifest'lerinden
//   geliyor.
//
// ÇÖZÜM: dosya içeriğini filtrelemek yerine, Android'in kendi manifest
// merger'ının resmi mekanizması olan `tools:node="remove"` kullanmak.
// Bu attribute, ana uygulama manifestine "bu izin HANGİ KÜTÜPHANEDEN
// gelirse gelsin, nihai birleştirilmiş manifestte YER ALMASIN" der —
// filtrelemenin aksine, bu kural Gradle build sırasında da (EAS Cloud
// Build dahil) geçerlidir, çünkü merger'ın kendisine yazılan bir
// komuttur, prebuild'in JS tarafında yapılan bir temizlik değildir.
//
// Uygulamanın GERÇEKTEN ihtiyaç duyduğu ve KORUNAN izinler:
//   ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION → namaz vakti/kıble
//   INTERNET                                      → Diyanet API, AdMob
//   MODIFY_AUDIO_SETTINGS                         → ezan sesi çalma
//   VIBRATE                                       → bildirim titreşimi
//   POST_NOTIFICATIONS, RECEIVE_BOOT_COMPLETED,
//   FOREGROUND_SERVICE, WAKE_LOCK                 → zamanlanmış bildirimler
//   (bunlara dokunulmuyor, meşru ve gerekli)

const { withAndroidManifest } = require('@expo/config-plugins');

const KALDIRILACAK_IZINLER = [
  'android.permission.RECORD_AUDIO',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.ACTIVITY_RECOGNITION',
];

const TOOLS_NS = 'http://schemas.android.com/tools';

function withCleanAndroidManifest(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // `tools` namespace'i manifest kök elemanında tanımlı olmalı —
    // çoğu Expo/RN projesinde zaten vardır (tools:replace için) ama
    // garanti altına alalım.
    if (!manifest.manifest.$) manifest.manifest.$ = {};
    manifest.manifest.$['xmlns:tools'] = TOOLS_NS;

    if (!Array.isArray(manifest.manifest['uses-permission'])) {
      manifest.manifest['uses-permission'] = [];
    }

    // DÜZELTME: önceki sürümde `forEach` içinde her iterasyon
    // `manifest.manifest['uses-permission']`'ı güncelliyordu AMA
    // döngü, hâlâ döngü BAŞINDAKİ (bir kez alınmış, hiç güncellenmeyen)
    // orijinal diziyi referans alan `mevcutIzinler` üzerinden
    // filtreleme yapıyordu — bu yüzden her iterasyon bir öncekinin
    // eklediği `tools:node="remove"` girişini FARKINDA OLMADAN eziyordu,
    // sonuçta yalnızca SON işlenen izin (ACTIVITY_RECOGNITION) doğru
    // işaretlenmiş, diğer 4'ü (RECORD_AUDIO, SYSTEM_ALERT_WINDOW,
    // READ/WRITE_EXTERNAL_STORAGE) işaretsiz kalmıştı — gerçek
    // manifest çıktısında görülüp doğrulandı. Şimdi tek bir filtre +
    // tek bir toplu `push` ile, dizi yalnızca BİR KEZ, tüm izinler için
    // birlikte güncelleniyor.
    const korunacaklar = manifest.manifest['uses-permission'].filter(
      (izin) => !KALDIRILACAK_IZINLER.includes(izin?.$?.['android:name'])
    );
    const kaldirmaGirisleri = KALDIRILACAK_IZINLER.map((izinAdi) => ({
      $: {
        'android:name': izinAdi,
        'tools:node': 'remove',
      },
    }));
    manifest.manifest['uses-permission'] = [...korunacaklar, ...kaldirmaGirisleri];

    return config;
  });
}

module.exports = withCleanAndroidManifest;
