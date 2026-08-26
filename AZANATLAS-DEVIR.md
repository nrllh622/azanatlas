# AzanAtlas — Proje Devir Dosyası

> Bu dosya, AzanAtlas geliştirme sohbetinin yeni bir oturumda kaldığı yerden
> devam edebilmesi için hazırlandı. **Yeni sohbete bu dosyayı ekle ve
> "AzanAtlas'a devam ediyoruz, devir dosyasını oku" de.**
>
> Son güncelleme: 26 Ağustos 2026 · Bu son iki turda: (1) Kıble pusulası
> kalibrasyon uyarısı eklendi (Android'e özgü, sensör doğruluğu düşükken
> aktif uyarı kartı). (2) "Şehir Değiştir" ekranındaki buton metinleri
> netleştirildi. (3) Endonezce "Esma" satır kayması düzeltildi. (4) "Diyanet
> verisine ulaşılamadı" hatasının kök nedeni bulundu ve düzeltildi (GPS'ten
> dönen il/ilçe adının normalize edilmemiş eşleştirmesi). (5) Konum
> değiştirilince Ayarlar'daki "Otomatik" hesaplama otomatik açılıyor. (6)
> İkindi Hesabı etiketinden "Türkiye" kelimesi kaldırıldı VE manuel moddayken
> mezhep seçiminin sessizce göz ardı edildiği gerçek bir hata bulunup
> düzeltildi. (7) Anasayfadaki konum ok'ları "Şehir" adının yanına taşındı.
> (8) GPS izin akışında "ikinci tıklamada çalışma" hatası düzeltildi. (9)
> Aynı konumun GPS ile tekrar eklenmesi engellendi. (10) İlk açılış
> tanıtım + izin talebi akışı (`OnboardingEkrani.tsx`, Varyant A — Doğrusal
> Karşılama) sıfırdan tasarlanıp koda döküldü. **Önceki turdaki (24 Ağustos)
> 10 maddelik büyük liste hâlâ HİÇ İŞLENMEDİ** — bkz. §7.

---

## 0. HIZLI BAŞLANGIÇ (yeni asistan için)

**Yapman gereken ilk şey:** Kullanıcının bilgisayarındaki projeyi oku.
Klasör bağlıysa `mcp__remote-devices__device_list_dir` ile
`C:\Users\nrllh\azanatlas\src` içeriğini listele, sonra
`device_stage_files` ile dosyaları al. **Cihazdaki kopya tek doğru
kaynaktır — yeni bir turda düzenlemeye başlamadan önce MUTLAKA taze
kopya çek, önceki turdan kalan yerel/staged kopyaya güvenme** (bu kural
bir önceki oturumda gerçek bir "eski kopya üzerinden düzenleme" hatasından
sonra kalıcı hale getirildi).

**⚠️ İŞ AKIŞI:** Dosyalar `SendUserFile` ile gönderilip ardından
`mcp__remote-devices__device_commit_files` ile doğrudan
`C:\Users\nrllh\azanatlas\...` altındaki gerçek yoluna yazılıyor —
kullanıcı hiçbir zip açmıyor, hiçbir şey elle taşımıyor, ASLA zip/paket
üretilmiyor. Kod aşağıdaki test/git komutlarını çalıştırmadan önce zaten
yerinde. `device_commit_files` çağrılarında mümkün olduğunca
`expectedMtimeMs` (staged kopyanın mtime'ı) geçirilmeli — cihazda kullanıcı
tarafından yapılmış olabilecek bir değişikliğin üzerine sessizce yazmamak
için.

**⚠️ ÖNEMLİ ÖĞRENİLEN DERS:** Kullanıcı geçmişte "bazı maddeleri ısrarla
yapmıyorsun" diye geri bildirmişti. Sebep atlama değildi — bazı "yapıldı"
denen maddeler GERÇEKTE YETERSİZ kalmıştı. **Ders:** "kodda var" ile
"kullanıcının gördüğü sonucu üretiyor" aynı şey değil. Yeni bir madde
geldiğinde önce mevcut kodu oku, "zaten yapılmış" gibi görünse bile
kullanıcının ekran görüntüsü daha güncel bir build'e mi ait diye kontrol et.

**⚠️ İKİNCİ ÖNEMLİ DERS (bu turda yaşandı):** Kullanıcı "İkindi Hesabı'nı
değiştirdim ama saat değişmiyor" dediğinde, önceki turdaki cevap yalnızca
`adhan` kütüphanesinin HAM matematiğini test edip "doğru çalışıyor"
demişti — ama uygulama İÇİNDEKİ akışı (manuel moddayken bile Diyanet
verisinin devreye girip kullanıcının mezhep seçimini ezmesi) hiç kontrol
etmemişti. **Ders:** kullanıcı "X değişmiyor" derse, yalnızca hesaplama
kütüphanesini izole test etmek yetmez — o değerin GERÇEKTEN ekrana kadar
hangi kod yolundan geldiğini uçtan uca izle.

**Kullanıcının çalışma tarzı:** Ekran görüntüsüyle/uzun numaralı listelerle
geri bildirim veriyor, görsel/tasarım kararlarında önce birkaç varyant
sunulup onay istenmesini tercih ediyor (bu turda pusula/onboarding
varyantları böyle sunuldu — önce görsel mockup, sonra "variant a olsun"
onayından sonra koda döküldü). Bir madde yarım kalırsa veya kodda olup
sonuçta görünmüyorsa AYNI maddeyi tekrar yazıyor — bu bir sabır sınaması
değil, gerçek bir sinyal. Tüm iletişim Türkçe.

---

## 1. PROJE KİMLİĞİ

| | |
|---|---|
| **Uygulama** | AzanAtlas — Türkçe/global namaz vakitleri uygulaması |
| **Paket adı** | `com.azanatlas.app` |
| **Teknoloji** | React Native + Expo SDK 54 (`expo ~54.0.35`, RN 0.81.5, React 19.1.0, TypeScript) |
| **Proje yolu** | `C:\Users\nrllh\azanatlas` (Windows, kullanıcı: nrllh) |
| **GitHub** | `nrllh622/azanatlas` — yerel dal `master`, uzak dal `main` |
| **Push komutu** | `git push origin master:main` |
| **Hedef kitle** | Global / uluslararası — 4 dil: TR/EN/ID (Endonezce)/FR |
| **Kapsam kararı** | "Orta genişlik" — sosyal ağ, premium mağaza, gerçek AI sohbet YOK |
| **Navigasyon** | react-navigation YOK — `HomeScreen.tsx` özel bir "kabuk" (shell) deseni |

---

## 2. KULLANICININ KALICI TALİMATLARI

1. **Her çalışma sonunda test komutlarını yaz** — `.cmd` uzantılı
   (PowerShell execution-policy kısıtı: `npm.cmd`, `npx.cmd`).
2. **Git komutlarını da yaz** — push her zaman `git push origin master:main`.
3. **"Uygulamadaki renkler, resimler, görseller, ikonlar, butonlar, yazılar
   ve uygulamadaki her şey İslami tonlarda olmalı."**
4. **Performansa dikkat** — uygulama hızlı açılmalı, ekran geçişleri hızlı
   olmalı.
5. **Teslimat biçimi:** ASLA zip/indirilebilir paket değil — dosyalar
   doğrudan `C:\Users\nrllh\azanatlas` içine, device bridge (`SendUserFile`
   + `device_commit_files`) ile yazılıyor. Kullanıcı GitHub'a kendisi push
   ediyor.
6. **Görsel/medya lisans kuralı (TÜM projelerde geçerli, kalıcı hafızaya
   kaydedildi):** İnternette bulunacak her görsel/medya için izin istemeden
   araştırma yapılabilir ve kullanılabilir, AMA mutlaka ücretsiz ve hiçbir
   ticari kullanım kısıtı olmamalı — lisans/ticari haklar MUTLAKA
   doğrulanmalı.
7. **Devir dosyası yalnızca açıkça istendiğinde oluşturulur/güncellenir** —
   her teslimat sonunda otomatik üretilmez.
8. **Görsel/tasarım kararlarında önce birkaç varyant üretip sunmak, onay
   aldıktan SONRA koda işlemek** kullanıcının tercih ettiği yöntem.
9. **Permanent UI kuralı:** Hiçbir ekranda hiçbir buton/ikon/kontrol, üst
   veya alt kenara yapışık durmamalı — her zaman görünür bir boşluk
   bırakılmalı. Bu, her yeni ekran/değişiklikte proaktif olarak kontrol
   edilmeli.
10. **Yeni bir turda düzenlemeye başlamadan önce cihazdan taze kopya çek**
    (bkz. §0) — bir önceki turda yaşanan "bayat kopya üzerinden düzenleme"
    hatasından sonra kalıcı hale getirilen alışkanlık.

### Test komutları (her teslimatta yazılacak şablon)

```powershell
cd C:\Users\nrllh\azanatlas
npx.cmd expo start -c
```

`package.json`/`app.json` değişmediyse `npm install` gerekmez; değiştiyse:

```powershell
npm.cmd install
```

Widget veya `expo-updates`'in gerçek (native) davranışını, GPS izin
diyaloglarının native akışını test etmek için Expo Go yetmez, development
build gerekir:

```powershell
npx.cmd expo run:android
```

### Git komutları (her teslimatta yazılacak şablon)

```powershell
cd C:\Users\nrllh\azanatlas
git add .
git commit -m "<bu turun kısa özeti>"
git push origin master:main
```

Push reddedilirse: `git fetch origin` → `git merge origin/main` → tekrar
push.

**"Şimdi Yeniden Başlat" gerçekten yeniden başlatmıyor — bu bir hata
değil:** `expo-updates`'in `Updates.reloadAsync()` fonksiyonu Expo Go'da
native modülü BULAMAZ, `catch` bloğuna düşer ve sessizce pop-up'ı kapatır.
Gerçek testi `npx.cmd expo run:android` (development build) gerektirir.

---

## 3. MİMARİ

### Navigasyon (react-navigation YOK)
`HomeScreen.tsx` bir **kabuk** görevi görüyor: kalıcı sekmeler + tam ekran
araçlar (Kıble, Tesbih, Esmâ, Kaza, Vaktinde Kıl, Hatırlatıcılar, Konum,
Tema, Şehir Değiştir).

### Açılış sırası (bu turda değişti — onboarding eklendi)
```
App.tsx
  1. Kayıtlı tema cihazdan okunur ve uygulanır.
  2. Yazı tipleri yüklenir.
  3. Açılış animasyonu oynar (AcilisEkrani, 1.6sn).
  4. Üçü de tamamlandığında AppGovde `require()` ile yüklenir.

AppGovde.tsx (TÜM Provider'ların içinde)
  5. Onboarding daha önce tamamlanmış mı? (AsyncStorage, onboardingDeposu.ts)
     - Kontrol ediliyor (`null`)   → boş/cream renkli View (flaş önleme)
     - HAYIR (ilk açılış)         → OnboardingEkrani.tsx gösterilir
     - EVET (daha önce tamamlandı) → HomeScreen.tsx gösterilir
```
⚠️ **Kritik mimari detay korunuyor:** `App.tsx`, `src/AppGovde.tsx`'i statik
import ETMİYOR — tema okunduktan sonra `require()` ile yüklüyor. **Bu yapıyı
bozma.** Aynı gerekçe (ekran stilleri `StyleSheet.create` ile modül
yüklenirken bir kez oluşuyor ve o anki tema/renklere kilitleniyor).

### İlk açılış onboarding akışı (YENİ — bu tur, Varyant A "Doğrusal Karşılama")
- **`src/screens/OnboardingEkrani.tsx`** — 4 tam ekran kart, adım göstergesi
  yok, doğrusal ilerliyor: Karşılama → Konum izni → Bildirim izni (vakit
  vakit aç/kapa anahtarlarıyla) → Tamamlandı.
- **`src/lib/onboardingDeposu.ts`** — `dilDeposu.ts`/`temaDeposu.ts` ile
  birebir aynı kalıp: `AsyncStorage`'da `azanatlas_onboarding_tamam_v1`
  anahtarıyla saklanıyor, bir kez tamamlanınca (ya da atlanınca) bir daha
  gösterilmiyor.
- Konum adımı `LocationPickerScreen.tsx`'teki `useGps` ile AYNI mantığı
  kullanıyor (izin → servis açık mı kontrolü → gerekirse native "Konumu
  Etkinleştir" diyaloğu → reverseGeocode → bilinen il/ilçeye onarım) — kod
  kasıtlı olarak tekrarlandı çünkü onboarding, ana uygulama mount
  edilmeden önce çalışıyor.
- Bildirim adımı mevcut `requestNotificationPermission()`'ı çağırıyor
  (`notificationScheduler.ts`) — ayrı bir izin mantığı YAZILMADI.
- Her adımda "Atla"/"Listeden Seç" seçeneği var — akış hiçbir zaman
  kilitlenmiyor, izinsiz de ilerlenebiliyor.
- **Test için:** Onboarding'i tekrar görmek üzere uygulamayı telefondan
  kaldırıp yeniden yüklemek gerekir, ya da geliştirme sırasında
  `AsyncStorage`'daki `azanatlas_onboarding_tamam_v1` anahtarı elle
  silinebilir.
- **Sunulan ama seçilmeyen diğer 2 varyant** (referans için, kod
  yazılmadı): Varyant B "Kaydırmalı Hikaye" (Muslim Pro tarzı, koyu yeşil
  zemin + büyük illüstrasyon + sayfa noktaları), Varyant C "Şeffaf Gerekçe"
  (Athan Pro tarzı, her izni önceden madde madde gerekçelendiren liste).

### Vakit hesaplama — iki aşamalı (bu turda kritik bir hata düzeltildi)
1. `calculateVakitler()` (`src/lib/prayerCalculator.ts`) — `adhan`
   kütüphanesiyle senkron, anında sonuç. `autoMethod=false` (manuel mod)
   olduğunda kullanıcının seçtiği `madhab`/`highLatRule` burada uygulanıyor.
2. `getVakitlerWithDiyanetFallback()` — **YENİ KURAL (bu tur):** Diyanet
   SADECE `autoMethod === true` (Otomatik açık) iken denenir. Önceden
   `methodId === 'Turkey'` de yeterliydi — bu, manuel modda kullanıcı
   Hanefi seçse bile Diyanet'in mezhep ayrımı yapmayan resmi verisinin
   hâlâ kullanılmasına, yani kullanıcının seçiminin SESSİZCE göz ardı
   edilmesine yol açan bir hataydı. **Artık:** Otomatik açıkken → Diyanet
   (varsa) + yerel yedek; Otomatik kapalıyken → HER ZAMAN yerel `adhan`
   hesabı, kullanıcının madhab/yöntem/yüksek-açı seçimiyle birebir.

**Diyanet API:** `ezanvakti.emushaf.net` (`src/lib/diyanetApi.ts`).
Önbellek dönen dizideki gerçek ilk/son tarihe göre yapılıyor.

**YENİ (bu tur) — İl/ilçe eşleştirme normalize edildi:** GPS'ten dönen
il/ilçe adı (`expo-location`'ın `reverseGeocodeAsync`'i, özellikle
Android'de) `diyanetSehirIds.ts`'teki/`turkeyLocations.ts`'teki TAM yazımla
her zaman birebir eşleşmiyordu (boşluk, "İli" eki, farklı isimlendirme) —
bu, "Diyanet verisine ulaşılamadı" hatasının kök nedeniydi. Artık iki
katmanlı normalize eşleştirme var: (1) `LocationPickerScreen.tsx`/
`OnboardingEkrani.tsx`'teki `resolveKnownIl`/`resolveKnownIlce` GPS
sonucunu bilinen 81 il listesine "onarıyor"; (2)
`diyanetSehirIds.ts`'teki `getSehirIdForIl` de ayrıca Türkçe karakter/
noktalama sadeleştirilmiş bir arama tablosuna sahip.

**YENİ (bu tur) — Aynı konumun tekrar eklenmesi engellendi:**
`LocationContext.tsx`'teki `addLocation` artık eklemeden önce aynı
il+ilçe+ülke kodu zaten listede var mı diye bakıyor; varsa yeni satır
açmıyor, mevcut kaydı güncelleyip aktif ediyor (GPS ile aynı yerden
tekrar eklemede önceden yinelenen satır oluşuyordu).

**YENİ (bu tur) — GPS izin akışındaki "ikinci tıklamada çalışma" hatası
düzeltildi:** `requestForegroundPermissionsAsync()`'in "granted" dönmesi
yalnızca UYGULAMA izni anlamına geliyor, telefonun konum SERVİSİNİN
(GPS'in) açık olduğu anlamına gelmiyor. Artık Android'de
`Location.hasServicesEnabledAsync()` ile önce kontrol ediliyor, kapalıysa
`Location.enableNetworkProviderAsync()` çağrılıyor (native "Konumu
Etkinleştir" diyaloğunu açan ve kullanıcı onayladığında promise'i
RESOLVE eden `expo-location` fonksiyonu) — kullanıcı diyalogdan konumu
açtığı AN, ikinci bir tıklamaya gerek kalmadan konum alınıyor. Bu mantık
hem `LocationPickerScreen.tsx`'te hem `OnboardingEkrani.tsx`'te var.

### Kıble pusulası — kalibrasyon uyarısı (YENİ — bu tur)
`src/screens/QiblaScreen.tsx`: kullanıcı "pusula tam doğru çalışmıyor gibi"
şikayetinde bulundu. Araştırma sonucu: `expo-location`'ın
`watchHeadingAsync()` callback'i Android'de bir `accuracy` alanı da
döndürüyor (`SensorManager` doğruluk seviyesi: 0=güvenilmez, 1=düşük,
2=orta, 3=yüksek) — bu değer önceden HİÇ okunmuyordu. Artık `accuracy <= 1`
olduğunda ekranda sallanan, kırmızı bir "Pusula kalibrasyonu gerekiyor"
uyarı kartı çıkıyor (8 çizme animasyonu talimatıyla). **Yalnızca
Android'de** — iOS zaten kendi native kalibrasyon animasyonunu otomatik
gösteriyor, bu yüzden iOS'ta ek bir uyarıya gerek yok.

### İkindi hesabı (madhab) — doğrulandı
`adhan` kütüphanesi gerçek verilerle test edildi: İstanbul/Küçükçekmece,
21 Ağustos 2026 için Şafi ikindi 16:58, Hanefi ikindi 18:00 (62 dakika
fark). Bu fark İslami fıkıh astronomisi açısından DOĞRU — yaz aylarında
güneş yüksekteyken Şafi/Hanefi (1x/2x gölge) farkı büyür, kışın küçülür
(aynı test 21 Aralık'ta ~37 dakika fark veriyor). Kütüphanenin kendisi
hatasız; asıl hata yukarıda anlatılan "manuel modda bile Diyanet'in
devreye girmesi" sorunuydu (§3, Vakit hesaplama).

### Tema sistemi
- 10 palet, `colors` bir **Proxy** — her okumada aktif paletten değer
  döner.
- Seçim `AsyncStorage`'da, `temaDeposu.ts` yönetiyor.
- Tema seçildiğinde `TemaScreen` "Tema değişti" bilgilendirmesiyle
  kullanıcı onaylı bir `Modal` gösteriyor: "Şimdi Yeniden Başlat" / "Daha
  Sonra" / "Vazgeç".
- Her palet `adEn`/`aciklamaEn` alanlarını da taşıyor.

### Widget (kod yazıldı, HİÇ test edilmedi — durum değişmedi)
- `react-native-android-widget` paketiyle, Kotlin/XML yazmadan TSX widget.
- `src/widget/AzanAtlasWidget.tsx` — görünüm.
- `src/widget/widgetTaskHandler.ts` — Android'in tetiklediği görev.
- `src/lib/widgetVeriDeposu.ts` — "önceden hesapla, sonra oku" deseni.
- **Expo Go'da hiçbir etkisi yok.** `npx expo run:android` (development
  build) ile test edilecek.
- Kullanıcı önceki tasarımı beğenmemişti (§7 madde 10) — HENÜZ ele
  alınmadı.

### Reklam SDK
`react-native-google-mobile-ads` `16.0.1`. `require()`'dan önce
`NativeModules.RNGoogleMobileAdsModule` truthiness kontrolü var (çökme
düzeltmesi, önceki turdan). Şu an test reklamı — mağaza yayınından hemen
önce gerçek AdMob ID'leriyle değiştirilecek.

---

## 4. DOSYA HARİTASI (bu son iki turda değişen/eklenen dosyalar)

| Dosya | Değişiklik |
|---|---|
| `src/screens/QiblaScreen.tsx` | Android'e özgü pusula kalibrasyon uyarı kartı (`KalibrasyonIkonu` animasyonlu bileşeni + `sensorDogruluk`/`kalibrasyonGerekli` state'i) |
| `src/i18n/ceviriler.ts` | `pusulaKalibrasyonBasligi`/`pusulaKalibrasyonMetni` (4 dil); `gpsIleEkle`/`konumEkle` buton metinleri güncellendi; ID dilinde `aracEsma: 'Asma'` düzeltmesi; **YENİ `onboarding` bölümü** (4 dilde ~15 anahtar) |
| `src/screens/HomeScreen.tsx` | `hizliAd` metnine `numberOfLines={1}` güvencesi; üst şeritteki konum ok'ları (`konumOkGrubu`) "Şehir" adının yanına taşındı, `hero` içindeki eski `eskiKonumSatir` kaldırıldı |
| `src/data/diyanetSehirIds.ts` | `getSehirIdForIl` artık normalize edilmiş (Türkçe karakter/noktalama sadeleştirilmiş) bir arama tablosuna da bakıyor |
| `src/screens/LocationPickerScreen.tsx` | `resolveKnownIl`/`resolveKnownIlce` (GPS il/ilçe onarımı); `useGps` içinde `hasServicesEnabledAsync`/`enableNetworkProviderAsync` (izin akışı düzeltmesi); konum eklendiğinde `setAutoMethod(true)` (3 yerde: GPS, şehir, il/ilçe akışları) |
| `src/context/LocationContext.tsx` | `addLocation` artık yineleme kontrolü yapıyor (aynı il+ilçe+ülke varsa günceller, yeni satır açmıyor); `locationsRef` eklendi |
| `src/context/CalculationSettingsContext.tsx` | `MADHAB_OPTIONS`'taki `label`'dan "Türkiye" kelimesi kaldırıldı: `'Şafi, Maliki, Hanbeli'` |
| `src/lib/prayerCalculator.ts` | `getVakitlerWithDiyanetFallback`: Diyanet artık SADECE `autoMethod === true` iken deneniyor (kritik hata düzeltmesi — bkz. §3) |
| `src/screens/OnboardingEkrani.tsx` | **YENİ dosya** — ilk açılış tanıtım + izin akışı (Varyant A) |
| `src/lib/onboardingDeposu.ts` | **YENİ dosya** — onboarding tamamlanma durumunun kalıcı saklanması |
| `src/AppGovde.tsx` | Onboarding kontrolü eklendi (`onboardingBitti` state'i, `OnboardingEkrani`/`HomeScreen` arasında koşullu render) |

Bundan önceki (24 Ağustos ve öncesi) turlarda değişen dosyalar için
önceki devir dosyası sürümüne bakılabilir — özet: 14 ekranın ve 2 paylaşımlı
popup'ın tamamı `useCeviri()` üzerinden çalışıyor, reklam SDK çökmesi
düzeltildi, anasayfa veri kartları (Günün Ayeti, İslam Tarihinde Bugün)
bilingual, bildirimler seçili dilde kuruluyor.

---

## 5. ÇÖZÜLEN KRİTİK HATALAR (tekrar bozma!)

(Önceki dönemlerdeki hatalar aynen geçerli — Kıldım butonu, Keşfet→Kıble
eşlemesi, Android bildirim kanalı, Kerahat ayarı parametre uyuşmazlığı,
"Keşfet ikonu bozuluyor" → `DoluIkon.tsx` A1 renk çakışması, "İslam
Tarihinde Bugün seyrek veri" fallback'i, reklam SDK çökmesi, anasayfa veri
kartlarının dil değişiminde güncellenmemesi, bildirimlerin dil
değişiminde güncellenmemesi — ayrıntı için önceki devir dosyası sürümüne
bakılabilir.)

### YENİ (bu tur) — İkindi Hesabı manuel modda sessizce göz ardı ediliyordu
**Kök neden:** `getVakitlerWithDiyanetFallback`'teki
`kullaniciDiyanetIstiyor = autoMethod || methodId === 'Turkey'` koşulu —
`methodId` varsayılan olarak `'Turkey'` kaldığı için, kullanıcı "Otomatik"i
kapatıp manuel modda Hanefi seçse bile Diyanet'in mezhep ayrımı yapmayan
resmi verisi hâlâ kullanılmaya devam ediyordu. **Çözüm:** koşul
`!autoMethod` iken Diyanet'e hiç başvurulmayacak şekilde sadeleştirildi —
bkz. §3.

### YENİ (bu tur) — GPS "Diyanet verisine ulaşılamadı" hatası
**Kök neden:** GPS reverse-geocode sonucu (`place.region`/`place.subregion`)
uygulamanın bilinen il/ilçe listeleriyle birebir yazım eşleşmiyordu.
**Çözüm:** normalize edilmiş (Türkçe karakter sadeleştirilmiş) çift katmanlı
eşleştirme — bkz. §3, §4.

### YENİ (bu tur) — GPS izninde ikinci tıklamaya kadar konum eklenmiyordu
**Kök neden:** "izin verildi" durumu, konum SERVİSİNİN açık olduğunu
garanti etmiyordu; kullanıcı native diyalogdan konumu açtığında uygulama
bunu öğrenmiyordu. **Çözüm:** `hasServicesEnabledAsync`/
`enableNetworkProviderAsync` — bkz. §3.

### YENİ (bu tur) — Aynı konum GPS ile tekrar eklenince yineleniyordu
**Kök neden:** `addLocation`'da hiçbir yineleme kontrolü yoktu. **Çözüm:**
il+ilçe+ülke eşleşmesi kontrolü — bkz. §3, §4.

---

## 6. TASARIM SİSTEMİ KURALLARI

Palet kalibrasyon yöntemi (WCAG AA — büyük metin ≥3:1, gövde metni ≥4.5:1),
rol sözleşmesi, punto ölçeği, ikon kullanımı kuralları aynen geçerli. 10
palet var. Emoji KULLANILMIYOR — `src/components/Icon.tsx`'teki tek renkli
SVG ikon seti kullanılıyor.

**Kalıcı UI kuralı (§2 madde 9):** hiçbir buton/ikon ekran kenarına
yapışık durmamalı — her yeni ekranda proaktif kontrol edilmeli.

---

## 7. BEKLEYEN — 24 AĞUSTOS'TAN KALAN 10 MADDELİK LİSTE (HÂLÂ İŞLENMEDİ)

⚠️ Bu liste, en son iki turda (kıble kalibrasyonu, GPS/Diyanet düzeltmeleri,
onboarding) hiç ele alınmadı — kullanıcı farklı, daha acil maddelerle
devam etti. Yeni bir oturumda kullanıcıya bu listenin hâlâ geçerli olup
olmadığı sorulabilir/hatırlatılabilir.

1. **Anasayfa vakit listesi taşması.** Yatsı satırı tam çıkmıyor, özel gün
   eklenince aşağı kaymış olabilir. Reklam alanını da hesaba katarak
   vakitleri tam sığdır. Kıble, Tesbih, Esmâ, Kaza kısmı da **scroll
   yapılmadan** ilk görünsün.
2. **Kavisli üst şerit geri alınsın.** Anasayfanın üst yeşil bloğunun
   kavisli yapısı beğenilmedi, düz/kavissiz hale dönülsün — bildirim ve
   konum değiştir butonları kalsın. **NOT:** bu turda üst şeridin JSX
   yapısı zaten elden geçti (konum okları taşındı) — güncel `hero`/
   `ustSerit` köşe yuvarlama durumunu cihazda kontrol edip bu maddenin
   hâlâ geçerli olup olmadığını doğrula.
3. ~~"Günün Ayeti"nden sonra tarihi olaylar~~ — ÇÖZÜLDÜ (önceki turlarda).
4. **Ayarlar ekranı ve altındaki ekranlarda tema tutarlılığı.** Büyük
   ölçüde işlendiği belgelenmiş — kullanıcının GÜNCEL ekran görüntüsüyle
   doğrulanmalı.
5. **Tema değişikliğinde otomatik yeniden başlama.** ⚠️ Şu an kullanıcı
   onaylı pop-up var (otomatik değil) — gerçekten otomatik geri sayım
   isteniyorsa ayrıca doğrulanmalı.
6. **Sıradaki Vakit saati küçük + tema renginden görünürlüğü az.**
   Güncel build'de tekrar doğrulanmalı.
7. **Keşfet ikonu tıklanınca tema renginden bozuluyor.** Önceki kök neden
   çözülmüştü — güncel build'de tekrar doğrulanmalı.
8. **"Zümrüt Varak" duplikasyonu + bazı temaların rengi çok parlak.**
   Duplikasyon kaldırılmıştı — parlaklık şikayeti hâlâ geçerliyse bir tur
   daha koyulaştırılmalı.
9. **Kıble pusulası ve Kâbe görseli yenilenmeli** (görsel tasarım, mevcut
   SVG beğenilmedi — Muslim Pro/Ezan Vakti Pro referans alınacak). **NOT:**
   bu turda pusulaya sadece kalibrasyon UYARI KARTI eklendi — pusulanın
   kendi GÖRSEL tasarımı (ok, çember, Kâbe illüstrasyonu) hâlâ
   YENİLENMEDİ, bu madde ayrı ve hâlâ açık.
10. **Widget ve açılış ekranı yeniden tasarımı** (3 yeni widget varyantı,
    3 yeni açılış ekranı varyantı) — henüz başlanmadı.

**Yeni oturuma başlarken izlenecek yöntem:** Önce 2, 4, 6, 7, 8
maddelerinin cihazdaki GÜNCEL build'de gerçekten hâlâ sorunlu olup
olmadığını kullanıcıyla doğrula. 1, 5 gerçek/açık işler. 9 ve 10 için
önce varyant üretip sun, onay bekle, SONRA koda işle (bu turda onboarding
akışı tam olarak bu yöntemle yapıldı — önce 3 mockup görseli sunuldu,
"variant a olsun" onayı alındıktan sonra koda döküldü — aynı yöntem
tekrarlanmalı).

---

## 8. ÇOK DİLLİLİK (i18n) MİMARİSİ

### Genel yapı
- `src/i18n/ceviriler.ts` — merkezi sözlük. Her ekran/alan kendi bölümünde
  ayrı bir `const` nesnesi (`ortak`, `anaSayfa`, `ayarlar`, `kaza`,
  `kesfet`, `esma`, `hatirlaticilarEkrani`, `vaktindeKilEkrani`,
  `imsakiyeEkrani`, `gunAdlari`, `konumSecici`, `bildirimler`, `tesbih`,
  `takip`, `temaEkrani`, `kibleEkrani`, `onboarding` [YENİ], `vakitAdlari`),
  sonunda hepsi `SOZLUK`'ta 4 dil için ayrı ayrı spread ediliyor.
  `CeviriAnahtari` tipi `keyof typeof SOZLUK['tr']`.
- Yeni bir bölüm eklerken: (1) bölüm nesnesini `vakitAdlari`'ndan önce
  tanımla, (2) `SOZLUK`'un 4 dilindeki (`tr`/`en`/`id`/`fr`) spread
  listesine `...yeniBolum.<dil>` ekle — dördüne birden, yoksa
  `i18nkeycheck.js` uyarır.
- `src/i18n/dilDeposu.ts` — seçili dili `AsyncStorage`'da saklıyor.
- `src/i18n/DilContext.tsx` — `DilProvider` + `useCeviri()` hook'u. Döner:
  `dil`, `hazir`, `diliDegistir(yeni)`, `t(anahtar, ...args)`,
  `vakitAdi(kod)`.
- **Dil değişikliği ANINDA uygulanır** — metinler `StyleSheet.create`'e
  kilitlenmiyor, her render'da `t()` ile okunuyor.

### Hook çağıramayan dosyalar için (lib/*.ts)
```ts
tDil(dil: DilKodu, anahtar: CeviriAnahtari, ...args: any[]): string
vakitAdiDil(dil: DilKodu, kod: keyof typeof vakitAdlari['tr']): string
```

### Bilingual VERİ deseni (chrome/UI metninden farklı)
Veri içeriği (ayet meali, tarihi olay, zikir anlamı, tema adı) için
`src/lib/veriSec.ts`'teki `veriSec(dil, tr, en, id?, fr?)` yardımcısı
kullanılıyor — id/fr eksikse sessizce Türkçe'ye DEĞİL İngilizce'ye düşüyor.
Kullanılan yerler: `ayetler.ts`, `tariheBugun.ts`, `diniGunler.ts`,
`TesbihScreen.tsx`'teki `ZIKIRLER`, `theme.ts`'teki `PALETLER`.

### Kasıtlı olarak ÇEVRİLMEYEN içerikler
- İl/ilçe adları (`turkeyLocations.ts`, `districtCoords.ts`).
- Hesaplama Yöntemi / Mezhep / Yüksek Açı seçeneklerinin etiketleri
  (`CalculationSettingsContext.tsx`) — sadece `label`/`labelEn` var,
  id/fr YOK, henüz i18n'e tam geçirilmedi.
- "Esmâü'l-Hüsnâ" gibi özel/dini terimler.

### Kapsam durumu
14+ ekranın ve paylaşımlı popup bileşenlerinin TAMAMI `useCeviri()`
üzerinden çalışıyor. Her yeni çeviri değişikliğinden sonra
`/tmp/i18nkeycheck.js` ile 4 dilin anahtar kümesinin eşleştiği
doğrulanmalı (bu araç kalıcı değil, oturuma özel `/tmp` altında — yeni
oturumda yeniden yazılması gerekebilir, mantığı: her bölümün `tr`/`en`/
`id`/`fr` alt nesnelerinin AYNI anahtar kümesine sahip olduğunu
karşılaştırmak).

---

## 9. HENÜZ YAPILMAYANLAR / AÇIK KONULAR (özet)

| # | Madde | Durum |
|---|---|---|
| — | **§7'deki 10 maddelik liste (24 Ağustos)** | HÂLÂ İŞLENMEDİ |
| — | **Kıble pusulasının GÖRSEL tasarımı** (ok/çember/Kâbe illüstrasyonu) | Yalnızca kalibrasyon UYARI KARTI eklendi, görsel yenileme AYRI ve açık |
| — | **Widget** | Kod yazıldı, HİÇ test edilmedi (`expo run:android` gerekiyor) |
| — | **Hesaplama Yöntemi/Mezhep/Yüksek Açı seçenek etiketleri (tam i18n — id/fr)** | Henüz çevrilmedi |
| — | **Onboarding akışının gerçek cihazda testi** | Kod teslim edildi, kullanıcı henüz test etmedi (bu devir dosyası o testten ÖNCE yazıldı) |
| — | **Gerçek AdMob ID'lerine geçiş** | Mağaza yayınından hemen önce yapılacak |
| — | **`expo-updates` gerçek reload testi** | development build ile test edilmeli |

### Bilinen sınırlar (kullanıcıya açıklandı)
- Widget canlı geri sayım gösteremez (Android kısıtı, statik liste).
- Expo Go: özel bildirim sesi çalmaz, killed-state "Kıldım" çalışmaz,
  widget çalışmaz, `expo-updates` reload çalışmaz, GPS "Konumu Etkinleştir"
  native diyaloğu Expo Go'da farklı davranabilir — hepsi `expo
  run:android` (development build) gerektirir.

---

## 10. GÖRSEL/MEDYA LİSANS KURALI (kalıcı, tüm projelerde geçerli)

Kullanıcı: internette free olarak kullanılacak her türlü görsel için
gerekirse araştırma yapılıp izin istenmeden kullanılabilir, fakat lisans
hakları/ticari kullanım hakkı MUTLAKA doğrulanmalı — kullanılan tüm
materyaller ücretsiz ve hiçbir ticari hakkı olmamalı. Bu kural tüm
projelerde geçerli ve kalıcı hafızaya kaydedildi.

**Şimdiye kadarki uygulanışı:** Açılış ekranındaki cami silüeti gerçek
fotoğraf yerine orijinal elle çizilmiş SVG — sıfır lisans riski. Onboarding
ekranındaki ikonlar da mevcut `Icon.tsx` SVG setinden — aynı ilke.
