// plugins/withCleanAndroidManifest.js
//
// AMAÇ
// ----
// `expo prebuild` her çalıştığında (temiz build, EAS build, veya
// `expo run:android`), native `android/` klasörü SIFIRDAN yeniden
// üretilir. Bu sırada bazı kütüphaneler (özellikle expo-av, ses
// çalma/kaydetme desteği için) kendi native modüllerinin autolinking
// aşamasında AndroidManifest.xml'e ihtiyaç duymadığımız izinler ekler:
//
//   - RECORD_AUDIO          → uygulama mikrofon KULLANMIYOR, yalnızca
//                              önceden paketlenmiş ses dosyalarını ÇALIYOR.
//   - SYSTEM_ALERT_WINDOW    → uygulama başka uygulamaların üstünde
//                              pencere/overlay göstermiyor.
//   - READ_EXTERNAL_STORAGE  → uygulama harici depolama okumuyor,
//   - WRITE_EXTERNAL_STORAGE   AsyncStorage kullanıyor (bu farklı bir
//                              mekanizma, bu izinleri gerektirmez).
//
// Bu izinler Play Console'un Data Safety / App Content formlarında
// "bu uygulama mikrofon/depolama kullanıyor" gibi ekstra beyan
// yükümlülüğü doğurur ve kullanıcıya kurulumda gereksiz izin isteği
// olarak görünür. Elle AndroidManifest.xml düzenlemek KALICI DEĞİLDİR —
// her `expo prebuild --clean` bu dosyayı sıfırdan yazar. Bu plugin,
// manifest oluşturulduktan HEMEN SONRA, Expo config plugin API'si
// üzerinden bu izinleri programatik olarak kaldırır — böylece her
// build'de garanti şekilde uygulanır.
//
// Uygulamanın GERÇEKTEN ihtiyaç duyduğu ve KORUNAN izinler:
//   ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION → namaz vakti/kıble
//   INTERNET                                      → Diyanet API, AdMob
//   MODIFY_AUDIO_SETTINGS                         → ezan sesi çalma
//   VIBRATE                                       → bildirim titreşimi

const { withAndroidManifest } = require('@expo/config-plugins');

const KALDIRILACAK_IZINLER = [
  'android.permission.RECORD_AUDIO',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
];

function withCleanAndroidManifest(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    if (Array.isArray(manifest.manifest['uses-permission'])) {
      manifest.manifest['uses-permission'] = manifest.manifest['uses-permission'].filter((izin) => {
        const ad = izin?.$?.['android:name'];
        return !KALDIRILACAK_IZINLER.includes(ad);
      });
    }

    return config;
  });
}

module.exports = withCleanAndroidManifest;
