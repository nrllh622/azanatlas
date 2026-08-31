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
//   - ACTIVITY_RECOGNITION   → `expo-sensors`ın autolinking'i ekliyor
//                              (adım sayar/pedometer API'si için);
//                              uygulama yalnızca kıble pusulası için
//                              manyetometre kullanıyor, adım sayma/
//                              hareket algılama özelliği YOK. Google
//                              Play bu izni "Sağlık Uygulamaları
//                              Politikası" kapsamında değerlendirip
//                              ekstra beyan istiyor — kaldırılması
//                              gerekiyordu (Play Console uyarısı, 2026).
//
// Bu izinler Play Console'un Data Safety / App Content formlarında
// "bu uygulama mikrofon/depolama/sağlık verisi kullanıyor" gibi ekstra
// beyan yükümlülüğü doğurur ve kullanıcıya kurulumda gereksiz izin
// isteği olarak görünür. Elle AndroidManifest.xml düzenlemek KALICI
// DEĞİLDİR — her `expo prebuild --clean` (ve EAS Cloud Build'in kendi
// sunucusunda çalıştırdığı prebuild adımı da dahil) bu dosyayı sıfırdan
// yazar. Bu plugin, manifest oluşturulduktan HEMEN SONRA, Expo config
// plugin API'si üzerinden bu izinleri programatik olarak kaldırır —
// böylece hem yerel build'de hem EAS Cloud Build'de garanti şekilde
// uygulanır (plugin app.json'a bağlı olduğu için EAS de aynı adımı
// kendi tarafında işletir, ekstra bir ayar gerekmez).
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
  'android.permission.ACTIVITY_RECOGNITION',
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
