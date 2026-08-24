# AzanAtlas — Proje Devir Dosyası

> Bu dosya, AzanAtlas geliştirme sohbetinin yeni bir oturumda kaldığı yerden
> devam edebilmesi için hazırlandı. **Yeni sohbete bu dosyayı ekle ve
> "AzanAtlas'a devam ediyoruz, devir dosyasını oku" de.**
>
> Son güncelleme: 24 Ağustos 2026 · Bu turda: (1) Anasayfadaki "Günün Ayeti"
> ve "İslam Tarihinde Bugün" kartları artık dil değişiminde gerçekten
> değişiyor. (2) Reklam SDK çökmesi (`RNGoogleMobileAdsModule could not be
> found`) kalıcı olarak düzeltildi. (3) Bildirimler (vakit bildirimleri,
> hatırlatıcılar, Vaktinde Kıl) artık seçili dilde kuruluyor. (4) Açılış
> ekranındaki cami görseli yukarı, uygulama adı+slogan aşağı alındı. (5)
> Banner reklam zaten test reklamı gösteriyor — mağaza yayınından önce
> gerçek AdMob ID'leriyle değiştirilecek. (6) Çok dillilik (i18n) taraması
> TAMAMLANDI — uygulamadaki 14 ekranın ve 2 paylaşımlı popup'ın tamamı artık
> `useCeviri()` üzerinden çeviriyle çalışıyor, hiçbir ekranda sabit Türkçe
> metin kalmadı (yer adları ve dini veri metinleri hariç — bkz. §8). Ayrıca
> kullanıcıdan **YENİ, henüz hiç işlenmemiş** 10 maddelik büyük bir liste
> geldi (anasayfa düzeni, kavisli üst şerit kaldırma, tema tutarlılığı,
> pusula/Kâbe yeniden tasarımı, 3 widget varyantı, 3 açılış ekranı
> varyantı) — kullanıcı bu listeye "dur" dedi, henüz BAŞLANMADI. Bkz. §7.

---

## 0. HIZLI BAŞLANGIÇ (yeni asistan için)

**Yapman gereken ilk şey:** Kullanıcının bilgisayarındaki projeyi oku.
Klasör bağlıysa `mcp__remote-devices__device_list_dir` ile
`C:\Users\nrllh\azanatlas\src` içeriğini listele, sonra
`device_stage_files` ile dosyaları al. **Cihazdaki kopya tek doğru kaynaktır.**

**⚠️ İŞ AKIŞI DEĞİŞTİ (önemli):** Eski devir dosyalarında "zip paketi
hazırla, kullanıcı `tar -xf` ile açsın" akışı anlatılıyordu. **Bu akış artık
KULLANILMIYOR.** Güncel kural: dosyalar `SendUserFile` ile gönderilip
ardından `mcp__remote-devices__device_commit_files` ile doğrudan
`C:\Users\nrllh\azanatlas\...` altındaki gerçek yoluna yazılıyor — kullanıcı
hiçbir zip açmıyor, hiçbir şey elle taşımıyor. Kod aşağıdaki test/git
komutlarını çalıştırmadan önce zaten yerinde.

**⚠️ ÖNEMLİ ÖĞRENİLEN DERS:** Kullanıcı geçmişte "bazı maddeleri ısrarla
yapmıyorsun" diye geri bildirmişti. Sebep atlama değildi — bazı "yapıldı"
denen maddeler GERÇEKTE YETERSİZ kalmıştı (örn. İslam Tarihinde Bugün kartı
kodda vardı ama veri seti o kadar seyrekti ki neredeyse hiçbir gün
görünmüyordu). **Ders:** "kodda var" ile "kullanıcının gördüğü sonucu
üretiyor" aynı şey değil — özellikle koşullu/veri-bağımlı özelliklerde,
gerçek veri kapsamını da kontrol et. Yeni bir madde geldiğinde önce mevcut
kodu oku, "zaten yapılmış" gibi görünse bile kullanıcının ekran görüntüsü
daha güncel bir build'e mi ait diye kontrol et.

**Kullanıcının çalışma tarzı:** Ekran görüntüsüyle/uzun numaralı listelerle
geri bildirim veriyor, görsel/tasarım kararlarında önce varyant sunulup
onay istenmesini tercih ediyor (bkz. §7), teslimat artık doğrudan cihaza
(device bridge). Bir madde yarım kalırsa veya kodda olup sonuçta
görünmüyorsa AYNI maddeyi tekrar yazıyor — bu bir sabır sınaması değil,
gerçek bir sinyal.

---

## 1. PROJE KİMLİĞİ

| | |
|---|---|
| **Uygulama** | AzanAtlas — Türkçe/global namaz vakitleri uygulaması |
| **Paket adı** | `com.azanatlas.app` |
| **Teknoloji** | React Native + Expo SDK 54 (`expo ~54.0.35`, RN 0.81.5, React 19.1.0) |
| **Proje yolu** | `C:\Users\nrllh\azanatlas` (Windows, kullanıcı: nrllh) |
| **GitHub** | `nrllh622/azanatlas` — yerel dal `master`, uzak dal `main` |
| **Push komutu** | `git push origin master:main` |
| **Hedef kitle** | Global / uluslararası (Türkiye öncelikli değil, eşit) — bu yüzden çok dillilik (TR/EN) çalışması sürüyor |
| **Kapsam kararı** | "Orta genişlik" — sosyal ağ, premium mağaza, gerçek AI sohbet YOK |

---

## 2. KULLANICININ KALICI TALİMATLARI

1. **Her çalışma sonunda test komutlarını yaz** — Expo Go'da çalıştırma dahil, `.cmd` uzantılı (PowerShell execution-policy kısıtı: `npm.cmd`, `npx.cmd`).
2. **Git komutlarını da yaz** — pull, commit, push, gerekiyorsa diğerleri. Push her zaman `git push origin master:main`.
3. **"Uygulamadaki renkler, resimler, görseller, ikonlar, butonlar, yazılar ve uygulamadaki her şey İslami tonlarda olmalı."**
4. **Performansa dikkat** — uygulama hızlı açılmalı, ekran geçişleri hızlı olmalı.
5. **Teslimat biçimi:** ASLA zip/indirilebilir paket değil — dosyalar doğrudan `C:\Users\nrllh\azanatlas` içine, device bridge (`SendUserFile` + `device_commit_files`) ile yazılıyor. Kullanıcı GitHub'a kendisi push ediyor (Claude'un bu oturumda gerçek `git` komutu çalıştırma imkânı yok — komutlar kullanıcı için yazılıp teslim ediliyor).
6. **Görsel/medya lisans kuralı (TÜM projelerde geçerli, kullanıcı birden fazla kez vurguladı):** "görseller ile ilgili internette free olarak kullanılacak her türlü görsel için gerekirse araştırma yap ve benden izin istemeden bu görselleri kullan. fakat lisans hakları, ticari kullanım hakkı gibi konulara dikkat et. kullanacağın bütün materyaller mutlaka free ve hiçbir ticari hakkı olmamalı." — izin istemeden araştırıp seçilebilir ama lisans MUTLAKA doğrulanmalı.
7. **Devir dosyası yalnızca açıkça istendiğinde oluşturulur/güncellenir** — her paket sonunda otomatik üretilmez.
8. **Görsel/tasarım kararlarında (yeni bir bileşen, renk şeması, pusula/Kâbe illüstrasyonu, widget/açılış ekranı varyantı gibi) önce birkaç varyant üretip sunmak, onay aldıktan SONRA koda işlemek** kullanıcının tercih ettiği yöntem (alt navigasyon "Zümrüt Şerit" kararı bu şekilde verilmişti).

### Test komutları (her teslimatta yazılacak şablon)

```powershell
cd C:\Users\nrllh\azanatlas
npx.cmd expo start -c
```

`package.json`/`app.json` değişmediyse `npm install` gerekmez; değiştiyse:

```powershell
npm.cmd install
```

Widget veya `expo-updates`'in gerçek (native) davranışını test etmek için
Expo Go yetmez, development build gerekir:

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

Push reddedilirse: `git fetch origin` → `git merge origin/main` → tekrar push.

**"Şimdi Yeniden Başlat" gerçekten yeniden başlatmıyor — bu bir hata
değil:** `expo-updates`'in `Updates.reloadAsync()` fonksiyonu Expo Go'da
native modülü BULAMAZ, `catch` bloğuna düşer ve sessizce pop-up'ı kapatır.
Gerçek testi `npx.cmd expo run:android` (development build) gerektirir.

---

## 3. MİMARİ

### Navigasyon (react-navigation YOK)
`HomeScreen.tsx` bir **kabuk** görevi görüyor: 5 kalıcı sekme (Ana Sayfa,
İmsakiye, Keşfet, Kıble, Ayarlar — Kıble alt navigasyonda, Takip hızlı-araç
satırında, bkz. önceki "Sekme/Araç yer değişimi" kararı) + tam ekran araçlar
(Takip, Tesbih, Esmâ, Kaza, Vaktinde Kıl, Hatırlatıcılar, Konum, Tema).

### Vakit hesaplama — iki aşamalı
1. `calculateVakitler()` — `adhan` kütüphanesiyle senkron, anında sonuç.
2. `getVakitlerWithDiyanetFallback()` — Türkiye içindeyse Diyanet verisini
   asenkron çekip üzerine yazar.

**Diyanet API:** `ezanvakti.emushaf.net`. Önbellek dönen dizideki gerçek
ilk/son tarihe göre yapılıyor.

### Sabah vakti kuralı
```
imsak = Fecr-i Sadık (Fajr) — değişmez
sabah = Türkiye/Diyanet konvansiyonunda max(fajr, sunrise − 60dk)
        diğer ülke/yöntemlerde = fajr
```

### Tema sistemi
- **10 palet** ("Zümrüt & Varak" duplikasyonu kaldırıldı, sadece "Zümrüt
  Varak" kaldı).
- `colors` bir **Proxy** — her okumada aktif paletten değer döner.
- Seçim `AsyncStorage`'da, `temaDeposu.ts` yönetiyor.
- Tema seçildiğinde `TemaScreen` "Tema değişti" bilgilendirmesiyle
  kullanıcı onaylı bir `Modal` gösteriyor: "Şimdi Yeniden Başlat" / "Daha
  Sonra" / "Vazgeç" (Vazgeç, az önce yazılan seçimi geri alıp önceki
  çalışan temayı tekrar kaydeder). Onay verilirse `expo-updates`'in
  `Updates.reloadAsync()`'i çağrılır. Expo Go'da native modül bulunamadığı
  için bu adım sessizce no-op olur (beklenen davranış, hata değil).
- Her palet artık `adEn`/`aciklamaEn` alanlarını da taşıyor — `TemaScreen`
  aktif dile göre isim/açıklamayı seçiyor (bkz. §8).

⚠️ **Kritik mimari detay korunuyor:** `App.tsx`, `src/AppGovde.tsx`'i statik
import ETMİYOR — tema okunduktan sonra `require()` ile yüklüyor. **Bu yapıyı
bozma.**

### Widget (kod yazıldı, HİÇ test edilmedi)
- `react-native-android-widget` paketiyle, Kotlin/XML yazmadan TSX widget.
- `src/widget/AzanAtlasWidget.tsx` — görünüm.
- `src/widget/widgetTaskHandler.ts` — Android'in tetiklediği görev,
  `index.ts`'te try/catch içinde `registerWidgetTaskHandler` ile kayıtlı.
- `src/lib/widgetVeriDeposu.ts` — "önceden hesapla, sonra oku" deseni:
  `HomeScreen` vakitleri her hesapladığında AsyncStorage'a yazıyor, widget
  yalnızca bunu okuyor.
- `app.json`'a `react-native-android-widget` config plugin'i eklendi.
- **Expo Go'da hiçbir etkisi yok.** `npx expo run:android` (development
  build) ile test edilecek — kullanıcı bunu development build alınca
  deneyeceğini belirtmişti.
- Canlı geri sayım YOK (Android kısıtı, statik liste).
- Kullanıcı mevcut tasarımı beğenmedi, özellikle uygulama adının konumu —
  bkz. §7 madde 10, henüz işlenmedi.

### Reklam SDK — çökme düzeltildi (bu turun işi)
`react-native-google-mobile-ads` `16.0.1` sabitlendi (Expo SDK 54
uyumluluğu için). Daha önce paket, `require('react-native-google-mobile-ads')`
çağrısını düz bir `try/catch` içine alıyordu — bu YETERSİZ çıktı: paketin iç
modül zinciri (`index.ts` → `MobileAds.ts` → `GoogleMobileAdsModule.ts`)
`TurboModuleRegistry.getEnforcing()`'i senkron çağırıyor ve bu throw, bu RN/
Expo sürümünde çevresindeki try/catch tarafından güvenilir şekilde
yakalanamıyordu — sonuç: "Uncaught Error: TurboModuleRegistry.getEnforcing(...):
'RNGoogleMobileAdsModule' could not be found" ile açılışta çökme.

**Kalıcı çözüm:** `require()` çağrısından ÖNCE `NativeModules.RNGoogleMobileAdsModule`
truthiness kontrolü ekleniyor — modül gerçekten bağlı değilse `require()`
hiç denenmiyor. İki yerde uygulandı:
- `src/components/BannerReklam.tsx`
- `src/AppGovde.tsx` (`reklamSdkBaslat()` içinde)

**Banner reklam durumu:** Şu an test reklamı (`ca-app-pub-3940256099942544~...`,
`app.json`'daki `react-native-google-mobile-ads` plugin config'inde) —
kullanıcı "mağazada yayınlayınca gerçek ID'ye geçelim" dedi, bu yüzden kod
tarafında ek bir işlem YAPILMADI, sadece onaylandı. **Mağaza yayınından
hemen önce yapılacak:** `app.json`'daki `androidAppId`/`iosAppId` ve
`BannerReklam.tsx`/`AppGovde.tsx` içindeki birim ID'lerini gerçek AdMob
ID'leriyle değiştir.

---

## 4. DOSYA HARİTASI (bu turda değişen dosyalar)

| Dosya | Değişiklik |
|---|---|
| `src/data/ayetler.ts` | 39 ayetin tamamına `kaynakEn`/`mealEn` eklendi |
| `src/data/tariheBugun.ts` | 13 tarihi olayın tamamına `baslikEn`/`aciklamaEn` eklendi |
| `src/screens/HomeScreen.tsx` | Ayet/tarih kartları artık `dil` state'ine göre EN/TR alan seçiyor; bildirim zamanlayıcı çağrılarına `dil` parametresi eklendi + `useEffect` bağımlılık dizisine `dil` eklendi |
| `src/i18n/ceviriler.ts` | `bildirimler`, `kibleEkrani` bölümleri + `kapatBuyuk`/`vazgecBuyuk`/`tamamBuyuk` eklendi; `tDil()`/`vakitAdiDil()` yardımcı fonksiyonları (hook çağıramayan `lib/*.ts` dosyaları için) |
| `src/lib/notificationScheduler.ts` | `configureAndroidChannels()` ve `scheduleAllNotifications()` artık `dil` parametresi alıyor, tüm bildirim başlık/gövde/kanal adları `tDil()` üzerinden geliyor |
| `src/lib/remindersScheduler.ts` | `scheduleReminders()` artık `dil` parametresi alıyor (sahur, teheccüt, Pazartesi/Perşembe orucu, Cuma hatırlatmaları) |
| `src/lib/vaktindeKilScheduler.ts` | `scheduleVaktindeKil()` artık `dil` parametresi alıyor |
| `src/components/BannerReklam.tsx` | Reklam SDK çökme düzeltmesi (yukarı bkz.) |
| `src/AppGovde.tsx` | Reklam SDK çökme düzeltmesi (yukarı bkz.) |
| `src/screens/AcilisEkrani.tsx` | Cami-varyantlarında (`cami-siluet`, `cami-hilal`, `cami-altin`, `ufuk-cizgisi`) mizanpaj ters çevrildi: cami görseli artık üstte/ortada, "AzanAtlas" + slogan artık altta |
| `src/screens/LocationPickerScreen.tsx` | Tüm çevre metinler `useCeviri()`'ye taşındı |
| `src/screens/TesbihScreen.tsx` | Tüm çevre metinler + zikir anlamları (`anlamEn`) çevrildi |
| `src/screens/TakipScreen.tsx` | Tüm çevre metinler + ay/gün adları çeviri sözlüğünden okunuyor |
| `src/screens/TemaScreen.tsx` | Tüm çevre metinler + onay modalı çevrildi |
| `src/screens/QiblaScreen.tsx` | Tüm çevre metinler (pusula rehberi, kartlar, K/D/G/B yön harfleri) çevrildi |
| `src/theme.ts` | Her paletteki `PaletTanimi`ye `adEn`/`aciklamaEn` eklendi (10 palet) |
| `src/components/SoundPickerModal.tsx` | "VAZGEÇ"/"TAMAM" butonları çevrildi |
| `src/components/SimplePickerModal.tsx` | "KAPAT" butonu çevrildi |

Bu turdan ÖNCE zaten çevrilmiş olan ekranlar (önceki, bu devir dosyasına
yansımamış bir oturumda yapılmış): `RemindersScreen.tsx`,
`VaktindeKilScreen.tsx`, `ImsakiyeScreen.tsx`, `SettingsScreen.tsx`,
`KazaScreen.tsx`, `KesfetScreen.tsx`, `EsmaulHusnaScreen.tsx`.

**Sonuç: uygulamadaki 14 ekranın ve 2 paylaşımlı popup bileşeninin TAMAMI
artık `useCeviri()` üzerinden çalışıyor.** Tüm dosyalar syntax + StyleSheet
anahtar tutarlılığı açısından doğrulandı (sıfır eksik/kullanılmayan stil
anahtarı, sıfır kalan literal Türkçe JSX metni — repo genelinde grep ile
tarandı).

---

## 5. ÇÖZÜLEN KRİTİK HATALAR (tekrar bozma!)

(Önceki paket dönemlerindeki hatalar aynen geçerli: Kıldım butonu, Kıble
pusulası doğruluğu — `trueHeading` vs `magHeading`, Keşfet→Kıble eşlemesi,
Android bildirim kanalı, Expo Go kırmızı hata ekranı, Kerahat ayarı
parametre uyuşmazlığı, "Keşfet ikonu bozuluyor" → `DoluIkon.tsx`'teki A1
renk çakışması, "İslam Tarihinde Bugün seyrek veri" → `getTariheEnYakinOlay()`
fallback'i, alt navigasyon "Zümrüt Şerit" kararı, Ayarlar/popup'ların tema
diline uydurulması.)

### YENİ (bu tur) — Reklam SDK çökmesi
Yukarıda §3'te detaylandırıldı. Kök neden: `try/catch`'in yakalayamadığı
senkron `TurboModuleRegistry.getEnforcing()` throw'u. Çözüm:
`require()`'dan önce native modül varlığını kontrol et.

### YENİ (bu tur) — Anasayfa veri kartları dil değişiminde değişmiyordu
**Kök neden:** `ayetler.ts`/`tariheBugun.ts`'teki veri yalnızca Türkçe
alanlar taşıyordu (`meal`/`kaynak`, `baslik`/`aciklama`); `HomeScreen.tsx`
`dil` state'ini kontrol etmeden doğrudan bu Türkçe alanları render
ediyordu. **Çözüm:** Her iki veri dosyasına `*En` alanları eklendi,
`HomeScreen.tsx` artık `dil === 'en' ? x.fooEn : x.foo` deseniyle seçiyor —
Ana Sayfa'daki bilingual DATA deseni ilk kez burada uygulandı (bkz. §8).

### YENİ (bu tur) — Bildirimler dil değiştirince güncellenmiyordu
**Kök neden:** `lib/*Scheduler.ts` dosyaları React bileşeni değil, hook
çağıramıyor; bildirim metinleri doğrudan Türkçe literal string'di.
**Çözüm:** `ceviriler.ts`'e `tDil(dil, anahtar, ...args)` / `vakitAdiDil(dil,
kod)` yardımcı fonksiyonları eklendi (hook'suz, parametre olarak `dil`
alan sürüm); üç scheduler dosyası ve `configureAndroidChannels()` artık
`dil: DilKodu` parametresi alıyor; `HomeScreen.tsx`'teki çağrı yeri
`useCeviri()`'den okuduğu `dil`'i geçiriyor ve bu değer `useEffect`
bağımlılık dizisine eklendi — dil değişince zamanlama efekti yeniden
çalışıp bildirimleri yeni dilde kuruyor.

---

## 6. TASARIM SİSTEMİ KURALLARI

Palet kalibrasyon yöntemi (WCAG AA — büyük metin ≥3:1, gövde metni ≥4.5:1),
rol sözleşmesi, punto ölçeği, ikon kullanımı kuralları aynen geçerli. 10
palet var, 11 değil.

---

## 7. BEKLEYEN — YENİ 10 MADDELİK LİSTE (HENÜZ HİÇ BAŞLANMADI)

Kullanıcı bu turun sonunda aşağıdaki listeyi gönderdi, ardından "dur" dedi
— hiçbiri işlenmedi, aynen bekliyor. Yeni bir oturumda buradan devam
edilecek. **Görsel/tasarım gerektiren maddelerde (9, 10) önce varyant
sunup onay almak gerekiyor (§2 madde 8).**

1. **Anasayfa vakit listesi taşması.** Yatsı satırı tam çıkmıyor, özel gün
   eklenince aşağı kaymış. Reklam alanını da hesaba katarak vakitleri tam
   sığdır. Ayrıca Kıble, Tesbih, Esmâ, Kaza kısmı da **scroll yapılmadan**
   ilk görünsün — gerekirse ikon/emoji/yazı küçültülebilir ama yazılar
   MUTLAKA okunaklı kalmalı.
2. **Kavisli üst şerit geri alınsın.** Anasayfanın üst yeşil bloğunun
   kavisli (curved) yapısı beğenilmedi, düz/kavissiz hale dönülsün — ama
   en üstteki bildirim ve konum değiştir butonları kalsın.
3. **"Günün Ayeti"nden sonra İslam tarihinde o gün yaşanan önemli
   olaylar gösterilsin demiştim, yapmamışsın diyor.** ⚠️ **DİKKAT — bu
   madde artık ÇÖZÜLDÜ** (bu turda: `tariheBugun.ts` bilingual + kart
   zaten Ana Sayfa'da "Günün Ayeti"nden hemen sonra render ediliyor,
   `getTariheEnYakinOlay()` ile her gün dolu). Kullanıcının ekran
   görüntüsü muhtemelen bu turdan ÖNCEye ait — yeni oturumda cihazdaki
   GÜNCEL build'i kontrol edip kullanıcıya bunu göster, tekrar sıfırdan
   yapmaya çalışma.
4. **Ayarlar ekranı ve altındaki hiçbir ekranda temanın hali yansımamış,
   sadece renk değişiyor diyor.** Pop-up'lar dahil TÜM sayfalar Ana
   Sayfa'daki tema renk/ton/görsel diliyle tam uyumlu olmalı. Önceki
   paketlerde büyük ölçüde işlendiği belgelenmiş (§5) — yeni oturumda
   kullanıcının GÜNCEL ekran görüntüsüyle hangi ekran/pop-up'ın hâlâ
   uyumsuz olduğunu netleştir, kökten çöz.
5. **Tema değişikliklerinde bilgilendirme + birkaç saniye sonra
   KENDİLİĞİNDEN yeniden başlama istiyor.** ⚠️ **ÇELİŞKİ:** Şu an
   kullanıcı onaylı pop-up var ("Şimdi Yeniden Başlat" / "Daha Sonra" /
   "Vazgeç") — otomatik DEĞİL. Bu madde muhtemelen o karardan önce
   yazılmış. Yeni oturumda kullanıcıya güncel pop-up davranışını göster,
   gerçekten otomatik geri sayım isteniyorsa AYRICA doğrulat, sessizce
   pop-up'ı kaldırıp otomatiğe dönme.
6. **Sıradaki Vakit saati küçük + tema renginden görünürlüğü az;** aynı
   yerdeki "şimdiki vakit"/"sonraki vakit" yazıları da tema renginden
   ötürü belirgin değil. Kullanıcı deneyimine ve tema uyumuna sadık
   kalarak farklı bir renk denenebilir. Önceki paketlerde saat 32px'e
   büyütülmüştü — cihazdaki güncel build'i kontrol et, gerçekten hâlâ
   sorunluysa (özellikle koyu 4 palette) renk kontrastını tekrar ele al.
7. **Keşfet ikonu tıklanınca tema renginden dolayı bozuluyor.**
   `DoluIkon.tsx`'teki A1 renk çakışması kökten çözülmüştü (§5) — cihazdaki
   güncel build'de tekrar doğrula, gerçekten hâlâ görülüyorsa yeni bir kök
   neden aranmalı (örn. yeni eklenen bir renk kombinasyonu çakışıyor
   olabilir).
8. **"Zümrüt Varak"in iki kez listelendiği ("Zümrüt&Varak" adında bir
   ikinci kayıt) + Zümrüt Varak/Lila Tezhibi/Tuğra Bordosu/Kisve Siyahı
   temalarındaki renklerin hâlâ çok parlak/açık olduğu, göz yorduğu.**
   Duplikasyon önceki paketlerde kaldırılmıştı (10 palet var, `theme.ts`'te
   tek "Zümrüt Varak" kaydı) — cihazda doğrula. Parlaklık şikayeti WCAG AA
   doğrulamasıyla bir kez ele alınmıştı; kullanıcı hâlâ şikayetçiyse bir
   tur daha koyulaştır ve tekrar doğrula.
9. **Kıble pusulası ve Kâbe görseli yenilenmeli.** Kullanıcı mevcut SVG
   tabanlı tasarımı (`QiblaScreen.tsx`, `Circle`/`Polygon`/`Path` ile
   çizili) beğenmiyor — önceki tasarımların daha iyi olduğunu söylüyor,
   Kâbe illüzyonu anlaşılmıyor. Kullanıcı Muslim Pro ve "Ezan Vakti Pro"
   gibi uygulamalardan referans görseller PAYLAŞTI (bu sohbette ekran
   görüntüsü olarak geldi — yeni oturumda kullanıcıdan bu görselleri
   TEKRAR istemek gerekebilir, konuşma geçmişinde saklı değiller).
   **Yöntem:** birkaç pusula/Kâbe tasarım varyantı üret, Artifact ile sun,
   ONAY ALDIKTAN SONRA koda işle.
10. **Widget ve açılış ekranı yeniden tasarımı.**
    - **Widget:** Uygulama adının konumu şu an çok altta — Muslim Pro'daki
      gibi ÜST kısımda olmalı. Üretilen 3 varyant beğenilmedi, 3 YENİ
      varyant isteniyor. Expo'da "şimdilik çalışmasın" — kullanıcı
      development build alınca test edeceğini söyledi (`npx expo
      run:android` gerekiyor, Expo Go'da widget hiç çalışmaz).
    - **Açılış ekranı:** "Ezan Vakti Pro" örneğindeki gibi ANİMASYONLU,
      MUTLAKA cami görselli, 3 YENİ varyant isteniyor (mevcut 6 varyanttan
      — `girih`, `safak`, `hatem`, `cami-siluet`, `cami-hilal`,
      `cami-altin`/`ufuk-cizgisi` — farklı/daha iyi olmalı).
    - **Görsel/lisans kuralı hatırlatması:** kullanıcı bu maddeyle birlikte
      görsel lisans kuralını TEKRAR vurguladı (bkz. §2 madde 6 — zaten
      kalıcı kural, ama kullanıcı her büyük görsel işinde hatırlatıyor).

**Yeni oturuma başlarken izlenecek yöntem:** Önce 3, 4, 6, 7, 8 maddelerinin
cihazdaki GÜNCEL build'de gerçekten hâlâ sorunlu olup olmadığını doğrula
(yukarıdaki "DİKKAT" notları) — bunlar muhtemelen bu turdan önceki bir
duruma ait ekran görüntüleriyle geldi. 1, 2, 5 gerçek/açık işler, doğrudan
uygulanabilir. 9 ve 10 için önce varyant üretip Artifact ile sun, onay
bekle, SONRA koda işle — kullanıcı bu yöntemi tercih ediyor.

---

## 8. ÇOK DİLLİLİK (i18n) MİMARİSİ

### Genel yapı
- `src/i18n/ceviriler.ts` — merkezi sözlük. Her ekran kendi bölümünde ayrı
  bir nesne (`ortak`, `anaSayfa`, `ayarlar`, `kaza`, `kesfet`, `esma`,
  `hatirlaticilarEkrani`, `vaktindeKilEkrani`, `imsakiyeEkrani`,
  `gunAdlari`, `konumSecici`, `bildirimler`, `tesbih`, `takip`,
  `temaEkrani`, `kibleEkrani`, `vakitAdlari`), sonunda hepsi `SOZLUK`'ta
  birleştiriliyor. `CeviriAnahtari` tipi `keyof typeof SOZLUK['tr']`.
- `src/i18n/dilDeposu.ts` — seçili dili `AsyncStorage`'da saklıyor (tema
  sistemiyle aynı kalıp).
- `src/i18n/DilContext.tsx` — `DilProvider` + `useCeviri()` hook'u.
  `useCeviri()` şunları döndürür: `dil` (aktif dil kodu), `hazir`,
  `diliDegistir(yeni)`, `t(anahtar, ...args)` (düz string veya parametreli
  fonksiyon anahtarlarını otomatik ayırt eder), `vakitAdi(kod)` (vakit
  adları ayrı tutuluyor çünkü alt-nesne).
- **Dil değişikliği ANINDA uygulanır** (tema gibi yeniden başlatma
  GEREKMEZ) — çünkü metinler `StyleSheet.create`'e kilitlenmiyor, her
  render'da `t()` ile okunuyor. `DilProvider`, `AppGovde.tsx`'te en dış
  sağlayıcı olarak sarmalı ki her ekran erişebilsin.

### Hook çağıramayan dosyalar için (lib/*.ts)
`notificationScheduler.ts`, `remindersScheduler.ts`, `vaktindeKilScheduler.ts`
gibi React bileşeni olmayan dosyalar `useCeviri()` çağıramaz. Bunun için
`ceviriler.ts`'te iki yardımcı fonksiyon var:
```ts
tDil(dil: DilKodu, anahtar: CeviriAnahtari, ...args: any[]): string
vakitAdiDil(dil: DilKodu, kod: keyof typeof vakitAdlari['tr']): string
```
Çağıran taraf (genelde `HomeScreen.tsx`) `useCeviri()`'den okuduğu `dil`'i
parametre olarak geçirir; bildirim PLANLANDIĞI ANDA hangi dil aktifse o
dilde metin gömülür. Kullanıcı dili değiştirdiğinde `HomeScreen`'deki
zamanlama `useEffect`'i (`dil`'i bağımlılık dizisinde tutarak) yeniden
çalışıp bildirimleri yeni dille kurar.

### Bileşen içi çeviri-anahtarı dolaylılığı (modül seviyesi sabit diziler için)
Hook çağıramayan modül-seviyesi sabit dizilerde (React render'ı dışında
tanımlı), doğrudan çevrilmiş metin yerine bir anahtar saklanır (örn.
`adAnahtari`/`aciklamaAnahtari`/`baslikAnahtari`), render sırasında
`t(...)` ile çözülür. HomeScreen, KesfetScreen, SettingsScreen, TakipScreen
bu deseni kullanıyor.

### Bilingual VERİ deseni (chrome/UI metninden farklı)
Ekran çevre metinleri (başlık, buton, etiket) ile "veri içeriği" (ayet
meali, tarihi olay açıklaması, zikir anlamı, tema adı/açıklaması) ayrı ele
alınıyor. Veri içeriği için orijinal Türkçe alan korunuyor, yanına **ek**
bir `*En` alanı ekleniyor — ekran `dil === 'en' ? x.fooEn : x.foo` ile
seçiyor. Kullanılan yerler: `ayetler.ts` (`kaynakEn`/`mealEn`),
`tariheBugun.ts` (`baslikEn`/`aciklamaEn`), `TesbihScreen.tsx`'teki
`ZIKIRLER` (`anlamEn`), `theme.ts`'teki `PALETLER` (`adEn`/`aciklamaEn`).

### Kasıtlı olarak ÇEVRİLMEYEN içerikler (veri, isim değil)
- İl/ilçe adları (`turkeyLocations.ts`, `districtCoords.ts`) — yer adı
  verisi, diğer uygulamalardaki gibi çevrilmiyor.
- Hesaplama Yöntemi / Mezhep / Yüksek Açı seçeneklerinin etiketleri
  (`CalculationSettingsContext.tsx`) — henüz i18n'e geçirilmedi, kapsamı
  birden fazla ekran/bildirimi kapsıyor, ayrı bir tur gerektirir. **Bu,
  §7'deki 10 maddelik listede YOK ama "eksik hiçbir şey bırakma" talimatı
  hâlâ geçerliyse bir sonraki i18n turunda ele alınmalı.**
- "Esmâü'l-Hüsnâ" gibi özel/dini terimler — Arapça kökenli evrensel
  terminoloji, İngilizce'de de aynı kalıyor (Qibla, Ramadan gibi).

### Kapsam durumu
14 ekranın ve 2 paylaşımlı popup bileşeninin (`SimplePickerModal`,
`SoundPickerModal`) TAMAMI artık `useCeviri()` üzerinden çalışıyor.
Repo genelinde `grep` ile literal Türkçe JSX metni taraması SIFIR sonuç
verdi (yer adı verisi ve yukarıdaki kasıtlı istisnalar hariç).

---

## 9. HENÜZ YAPILMAYANLAR / AÇIK KONULAR (özet — ayrıntı §7'de)

| # | Madde | Durum |
|---|---|---|
| — | **§7'deki 10 maddelik liste** | HİÇ BAŞLANMADI — kullanıcı "dur" dedi |
| — | **Hesaplama Yöntemi/Mezhep/Yüksek Açı seçenek etiketleri (i18n)** | Henüz çevrilmedi — `CalculationSettingsContext.tsx` |
| — | **Widget** | Kod yazıldı, HİÇ test edilmedi (`expo run:android` gerekiyor) |
| — | **`expo-updates` gerçek reload testi** | Expo Go'da native modül yok (beklenen no-op) — development build ile test edilmeli |
| — | **Gerçek AdMob ID'lerine geçiş** | Mağaza yayınından hemen önce yapılacak, şu an bilinçli olarak test ID'leri kullanılıyor |
| — | **Bildirim sesleri testi** | Kullanıcı "sonra kontrol edeceğim" demişti |
| — | **Kıble pusulası/Kâbe görseli** | Yenilenmesi isteniyor — bkz. §7 madde 9 |

### Bilinen sınırlar (kullanıcıya açıklandı)
- Widget canlı geri sayım gösteremez (Android kısıtı, statik liste).
- Expo Go: özel bildirim sesi çalmaz, killed-state "Kıldım" çalışmaz,
  widget çalışmaz, `expo-updates` reload çalışmaz. Bunların hepsi `expo
  run:android` (development build) gerektirir.

---

## 10. GÖRSEL/MEDYA LİSANS KURALI (kalıcı, tüm projelerde geçerli)

Kullanıcı: "internette free olarak kullanılacak her türlü görsel için
gerekirse araştırma yap ve benden izin istemeden bu görselleri kullan.
fakat lisans hakları, ticari kullanım hakkı gibi konulara dikkat et...
bunu senin yaptığımız bütün projelerde dikkate al."

**Şimdiye kadarki uygulanışı:** Açılış ekranı için gerçek raster fotoğraf
indirmek yerine, orijinal elle çizilmiş SVG cami silüeti tercih edildi —
sıfır lisans riski, paket boyutuna etkisi yok, tüm temalarla otomatik
uyumlu. §7 madde 9/10'daki yeni pusula/Kâbe/widget/açılış ekranı işinde de
aynı ilke geçerli: mümkünse orijinal SVG/vektör çizim tercih edilmeli;
gerçek bir görsel/fotoğraf gerekiyorsa mutlaka ücretsiz + ticari kullanıma
açık kaynak araştırılıp lisansı doğrulanmalı.
