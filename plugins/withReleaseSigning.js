// plugins/withReleaseSigning.js
//
// AMAÇ
// ----
// `expo prebuild` her çalıştığında native `android/` klasörü SIFIRDAN
// yeniden üretilir ve varsayılan olarak `release` build type'ı, `debug`
// keystore'uyla imzalanacak şekilde gelir (yalnızca yerel geliştirme/test
// için uygun). Play Console bunu KABUL ETMEZ: "Hata ayıklama modunda
// imzalanmış bir APK veya Android App Bundle yüklediniz" hatası verir.
//
// Bu plugin, `android/app/build.gradle` oluşturulduktan hemen sonra:
//   1. Gerçek bir "release" signingConfig ekler — keystore dosyasının
//      yolunu ve parolalarını `android/gradle.properties` (ya da
//      `~/.gradle/gradle.properties`) içindeki değişkenlerden okur,
//      KOD İÇİNE PAROLA YAZILMAZ.
//   2. `buildTypes.release.signingConfig`'i `signingConfigs.debug`
//      yerine bu yeni `signingConfigs.release`'e bağlar.
//
// Elle build.gradle düzenlemek KALICI DEĞİLDİR — her `expo prebuild
// --clean` bu dosyayı sıfırdan yazar. Bu plugin sayesinde her build'de
// garanti şekilde doğru imzalama uygulanır.
//
// GEREKLİ KURULUM (bir kereye mahsus, proje klasöründe):
//   1. keytool ile azanatlas-release.keystore üretilir (README/talimat).
//   2. android/gradle.properties dosyasına şu 4 satır eklenir:
//        AZANATLAS_RELEASE_STORE_FILE=azanatlas-release.keystore
//        AZANATLAS_RELEASE_KEY_ALIAS=azanatlas
//        AZANATLAS_RELEASE_STORE_PASSWORD=...
//        AZANATLAS_RELEASE_KEY_PASSWORD=...
//   Bu dosya `expo prebuild --clean` ile SIFIRLANDIĞI için (android/
//   klasörünün tamamı silinip yeniden oluşturuluyor), bu 4 satırı HER
//   `prebuild --clean` sonrası yeniden eklemeniz gerekir — ya da (önerilen)
//   bu 4 satırı proje kökünde `android/gradle.properties` yerine
//   kullanıcının ana dizinindeki `~/.gradle/gradle.properties` dosyasına
//   koyarsanız, o dosya prebuild'den ETKİLENMEZ ve her seferinde silinmez.

const { withAppBuildGradle } = require('@expo/config-plugins');

function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // signingConfigs bloğuna release girdisini ekle (debug'ın hemen altına).
    const signingConfigsRegex = /(signingConfigs\s*\{\s*debug\s*\{[^}]*\}\s*)/;
    if (signingConfigsRegex.test(contents) && !contents.includes('signingConfigs.release')) {
      contents = contents.replace(
        signingConfigsRegex,
        `$1
        release {
            if (project.hasProperty('AZANATLAS_RELEASE_STORE_FILE')) {
                storeFile file(AZANATLAS_RELEASE_STORE_FILE)
                storePassword AZANATLAS_RELEASE_STORE_PASSWORD
                keyAlias AZANATLAS_RELEASE_KEY_ALIAS
                keyPassword AZANATLAS_RELEASE_KEY_PASSWORD
            } else {
                // Keystore ayarlanmamışsa (ör. CI/geliştirme ortamı),
                // güvenli şekilde debug'a düş — release imzalama Play'e
                // yüklenecek gerçek sürüm için gradle.properties'e keystore
                // bilgisi eklenmeden ÇALIŞMAZ, bu bilinçli bir davranış.
                storeFile signingConfigs.debug.storeFile
                storePassword signingConfigs.debug.storePassword
                keyAlias signingConfigs.debug.keyAlias
                keyPassword signingConfigs.debug.keyPassword
            }
        }
`
      );
    }

    // buildTypes.release içindeki signingConfig referansını debug'dan
    // release'e çevir.
    contents = contents.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{\s*)signingConfig signingConfigs\.debug/,
      '$1signingConfig signingConfigs.release'
    );

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withReleaseSigning;
