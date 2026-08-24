# AzanAtlas — Proje Devir Dosyası

> Bu dosya, AzanAtlas geliştirme sohbetinin yeni bir oturumda kaldığı yerden
> devam edebilmesi için hazırlandı. **Yeni sohbete bu dosyayı ekle ve
> "AzanAtlas'a devam ediyoruz, devir dosyasını oku" de.**
>
> Son güncelleme: 24 Ağustos 2026 · Paket 6 teslim edildi (üst şerit yeniden
> renklendirme, Kalan Süre etiketi, tema değişikliği onay pop-up'ı, Kıble↔Takip
> yer değişimi, 3 ekranın tema diline geçirilmesi). **NOT:** Kullanıcıdan
> Paket 6 teslim edilirken YENİ bir 10 maddelik liste daha geldi (Paket 7
> konusu) — bu liste henüz işlenmedi, sıradaki oturum bununla başlamalı
> (bkz. §7 "Bekleyen — Paket 7").

---

## 0. HIZLI BAŞLANGIÇ (yeni asistan için)

**Yapman gereken ilk şey:** Kullanıcının bilgisayarındaki projeyi oku.
Klasör bağlıysa `mcp__remote-devices__device_list_dir` ile
`C:\Users\nrllh\azanatlas\src` içeriğini listele, sonra
`device_stage_files` ile dosyaları al. **Cihazdaki kopya tek doğru kaynaktır** —
kullanıcı her paketi uyguluyor.

**⚠️ ÖNEMLİ ÖĞRENİLEN DERS (Paket 4→5):** Kullanıcı Paket 4'ten sonra "bazı
maddeleri ısrarla yapmıyorsun" diye geri bildirdi. Sebep kötü niyet ya da
atlama değildi — bazı "yapıldı" denen maddeler GERÇEKTE YETERSİZ kalmıştı
(örn. İslam Tarihinde Bugün kartı kodda vardı ama veri seti o kadar seyrekti
ki neredeyse hiçbir gün görünmüyordu). **Ders:** "kodda var" ile "kullanıcının
gördüğü sonucu üretiyor" aynı şey değil — özellikle koşullu/veri-bağımlı
özelliklerde, gerçek veri kapsamını da kontrol et.

**Bekleyen kararlar:**
- Açılış ekranı varyantı — 3 cami-görselli varyant eklendi
  (`cami-siluet`, `cami-hilal`, `cami-altin`), ama `App.tsx`'te aktif varyant
  hâlâ eski `'girih'`. Kullanıcı yeni varyantları görüp seçim yapmalı.
- Widget — kod yazıldı ama HİÇ TEST EDİLMEDİ (Expo Go'da çalışmaz,
  `expo run:android` gerekir). Kullanıcı "development build aldığımızda test
  ederiz" dedi.
- `expo-updates` paketi eklendi ama `npm install` sonrası ilk kez test
  edilecek — tema değiştirince gerçekten yeniden başlıyor mu doğrulanmalı.

**Kullanıcının çalışma tarzı:** Ekran görüntüsüyle geri bildirim veriyor,
karar gerektiren yerlerde onay istiyor, teslimat tam dosya + zip. Bir madde
yarım kalırsa veya kodda olup sonuçta görünmüyorsa AYNI maddeyi tekrar
tekrar yazıyor — bu bir sabır sınaması değil, gerçek bir sinyal: madde
"tamam" işaretlenmeden önce gerçekten kullanıcının göreceği sonucu üretip
üretmediği ayrıca doğrulanmalı.

---

## 1. PROJE KİMLİĞİ

| | |
|---|---|
| **Uygulama** | AzanAtlas — Türkçe/global namaz vakitleri uygulaması |
| **Paket adı** | `com.azanatlas.app` |
| **Teknoloji** | React Native + Expo SDK 54 (`expo ~54.0.35`, RN 0.81.5) |
| **Proje yolu** | `C:\Users\nrllh\azanatlas` (Windows, kullanıcı: nrllh) |
| **GitHub** | `nrllh622/azanatlas` — yerel dal `master`, uzak dal `main` |
| **Push komutu** | `git push origin master:main` |
| **Hedef kitle** | Global / uluslararası (Türkiye öncelikli değil, eşit) |
| **Kapsam kararı** | "Orta genişlik" — sosyal ağ, premium mağaza, gerçek AI sohbet YOK |

---

## 2. KULLANICININ KALICI TALİMATLARI

1. **Her çalışma sonunda test komutlarını yaz** — Expo Go'da çalıştırma dahil.
2. **Git komutlarını da yaz** — pull, commit, push, gerekiyorsa diğerleri.
3. **"Uygulamadaki renkler, resimler, görseller, ikonlar, butonlar, yazılar ve
   uygulamadaki her şey İslami tonlarda olmalı."**
4. **Performansa dikkat** — uygulama hızlı açılmalı, ekran geçişleri hızlı olmalı.
5. **Teslimat biçimi:** tam dosya içeriği (kısmi/satır ekleme değil), zip olarak,
   proje klasörünün üzerine açılacak şekilde.
6. **YENİ (Paket 4):** İnternetten kullanılan HER görsel/medya mutlaka ücretsiz
   ve ticari hak sorunu olmayan kaynaklardan olmalı — izin istemeden araştırıp
   seçilebilir ama lisans MUTLAKA doğrulanmalı. Bu kural TÜM projelerde geçerli.

### Test komutları (her pakette verilecek)

**ÖNEMLİ:** `azanatlas-paketN.zip` bir YER TUTUCUDUR — komutu çalıştırmadan
önce `N` yerine gerçek paket numarasını yazmalısın (ör. Paket 5 için
`azanatlas-paket5.zip`). Literal olarak `paketN` yazarsan `tar.exe: Error
opening archive: Failed to open 'azanatlas-paketN.zip'` hatası alırsın —
çünkü o isimde bir dosya gerçekten yok.

```powershell
cd C:\Users\nrllh\azanatlas

tar -xf azanatlas-paket6.zip
del azanatlas-paket6.zip

git add .
git commit -m "Paket 6: ust serit yeniden renklendirme, Kalan Sure etiketi, tema onay pop-up, Kible-Takip yer degisimi, 3 ekran tema gecisi"
git push origin master:main

npx.cmd expo start -c --go
```

**Not:** Paket 6'da `package.json`/`app.json` DEĞİŞMEDİ — yeni bağımlılık
yok, bu yüzden `npm install` bu pakette gerekli değil.

(Paket 5 komutları — arşiv olarak artık `paket5` değil `paket6`
kullanılmalı, ama komut kalıbı aynı: `tar -xf azanatlas-paket5.zip` /
`del azanatlas-paket5.zip` / commit mesajı "Paket 5: anasayfa sıkıştırma,
tarih kartı fallback, kesfet ikonu kök çözüm, tema koyultma, alt nav
Zümrüt Şerit" — sadece referans için burada bırakıldı.)

**"running scripts is disabled on this system" hatası** (`npm install`
veya `npm ...` çalıştırırken): PowerShell'in execution-policy kısıtlaması
`npm.ps1`'i engelliyor — `npx` için zaten uygulanan çözüm burada da geçerli:
düz `npm` yerine `npm.cmd` kullan (yukarıdaki komutta zaten güncellendi).
Aynı kısıtlama projede çalıştırılan HER npm/npx komutunu etkiler — `npm run
...`, `npm uninstall ...` gibi komutları da hep `npm.cmd` ile yaz.

**`tar` yine de "Failed to open" hatası verirse** (dosya adı doğru olduğu
halde), aşağıdaki iki ihtimali sırayla kontrol et:

1. **Dosya gerçekten o klasörde mi?** `dir azanatlas-paket4.zip` ile
   doğrula — indirilenler klasörüne inmiş olabilir, `move` ile proje
   köküne taşı.
2. **PowerShell'in `tar`'ı yerine Windows'un `tar.exe`'sini zorla dene**,
   ya da `tar` yerine PowerShell'in kendi arşiv aracını kullan:
   ```powershell
   Expand-Archive -Path azanatlas-paket4.zip -DestinationPath . -Force
   del azanatlas-paket4.zip
   ```
   `-Force` mevcut dosyaların üzerine yazar — zip zaten proje köküne
   açılacak şekilde hazırlanıyor, bu güvenlidir.

**Diğer kritik komut notları:**
- `npx.cmd` kullan — PowerShell'de düz `npx` execution-policy hatası veriyor.
- `--go` şart — projede `expo-dev-client` kurulu, bayraksız dev-build moduna düşer.
- `-c` şart — önbellek temizliği, yeni dosyalarda gerekli.
- **`npm install` yalnızca `package.json` değiştiğinde gerekli** — Paket 4
  `expo-updates` ve `react-native-android-widget` eklediği için gerekliydi;
  Paket 5 bağımlılık eklemiyor, gerekmiyor. Her paketin kendi test komutu
  bloğu bunu netleştirir.
- **EAS build hakkı harcanmıyor.** `expo start --go` ve `expo run:android`
  ikisi de yerel; kotadan düşen tek şey `eas build`.
- Push reddedilirse: `git fetch origin` → `git merge origin/main` → tekrar push.
- Widget ve `expo-updates`'in gerçek reload'u test edilecekse:
  `npx expo run:android` (development build) gerekir, Expo Go'da ikisi de
  sessizce devre dışı kalır (uygulama çökmez, sadece o özellik pasif kalır).

---

## 3. MİMARİ

### Navigasyon (react-navigation YOK)
`HomeScreen.tsx` bir **kabuk** görevi görüyor: 5 kalıcı sekme (Ana Sayfa,
İmsakiye, Keşfet, Takip, Ayarlar) + tam ekran araçlar (Kıble, Tesbih, Esmâ,
Kaza, Vaktinde Kıl, Hatırlatıcılar, Konum, Tema).

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
- **10 palet** (11 değil — "Zümrüt & Varak" duplikasyonu kaldırıldı, sadece
  "Zümrüt Varak" kaldı).
- `zumrutVarak`, `lilaTezhibi`, `kisveSiyahi`, `tugraBordosu` paletleri Paket
  4'te koyulaştırılmıştı ama YETERSİZ kalmıştı — kullanıcı Paket 5'te aynı
  şikayeti tekrarladı. Paket 5'te bu dört palette `copperLight`/`gold`
  (aynı renk, alias), `textOnDarkMuted` ve `primaryGlow` DAHA DA
  koyulaştırıldı (bkz. §5 "kök neden" notu) — bu üçü koyu zeminde METİN
  rolünde kullanıldığı için en çok göz yoran değerlerdi. Tüm kritik
  metin/zemin çiftleri WCAG AA eşiğinde (büyük metin ≥3:1, gövde metni
  ≥4.5:1) yeniden doğrulandı (Python script ile, gerçek kullanım
  bağlamlarına karşı — sadece rastgele renk çiftlerine karşı değil).
- `colors` bir **Proxy** — her okumada aktif paletten değer döner.
- Seçim `AsyncStorage`'da, `temaDeposu.ts` yönetiyor.
- **YENİ (Paket 4):** Tema seçildiğinde artık elle kapat-aç GEREKMİYOR —
  `TemaScreen` kullanıcıya "Tema değişti" bilgilendirmesi gösterip 1.8 saniye
  sonra `expo-updates`'in `Updates.reloadAsync()` fonksiyonuyla uygulamayı
  KENDİLİĞİNDEN yeniden başlatıyor. Expo Go'da bu native modül
  bulunamayacağı için sessizce eski (elle kapat-aç) davranışa düşer.

⚠️ **Kritik mimari detay korunuyor:** `App.tsx`, `src/AppGovde.tsx`'i statik
import ETMİYOR — tema okunduktan sonra `require()` ile yüklüyor. **Bu yapıyı
bozma.**

### Widget (YENİ — Paket 4, henüz test edilmedi)
- `react-native-android-widget` paketiyle, Kotlin/XML yazmadan TSX widget.
- `src/widget/AzanAtlasWidget.tsx` — görünüm (ana sayfa renk diliyle uyumlu
  ama Muslim Pro kadar sade; TÜM 7 vakit gösteriliyor, Muslim Pro'nun
  aksine).
- `src/widget/widgetTaskHandler.ts` — Android'in tetiklediği görev,
  `index.ts`'te try/catch içinde `registerWidgetTaskHandler` ile kayıtlı
  (paket kurulu değilse/Expo Go'daysa sessizce atlanır).
- `src/lib/widgetVeriDeposu.ts` — "önceden hesapla, sonra oku" deseni:
  `HomeScreen` vakitleri her hesapladığında AsyncStorage'a yazıyor, widget
  yalnızca bunu okuyor (kendi başına astronomik hesap yapmıyor).
- `app.json`'a `react-native-android-widget` config plugin'i eklendi.
- **Expo Go'da hiçbir etkisi yok.** `npx expo run:android` (development
  build) ile test edilecek.
- Canlı geri sayım YOK (Android kısıtı, statik liste — Muslim Pro da öyle).

---

## 4. DOSYA HARİTASI

### Paket 6'da değişen dosyalar

| Dosya | Değişiklik |
|---|---|
| `screens/HomeScreen.tsx` | Üst şerit artık `colors.primary` zemin (koyu yeşil), `IslamicPattern` overlay eklendi; konum/bildirim butonları dolgu daireden yarı-saydam "cam" daireye döndü (`rgba(255,255,255,0.10)` zemin, `rgba(255,255,255,0.18)` kenarlık), ikon rengi `copperLight`; konum metinleri `textOnDark`/`textOnDarkMuted`'a geçti. Geri sayımın üstüne "KALAN SÜRE" etiketi eklendi. Sıradaki Vakit saati 26→32px büyütüldü, "Sıradaki" adı 26→22px küçültüldü (satır dengesi için). Kıble ve Takip'in konumu YAPISAL olarak değişti — bkz. §3 "Sekme/Araç yer değişimi" |
| `screens/TemaScreen.tsx` | Otomatik (1.8sn sonra kendiliğinden) yeniden başlatma KALDIRILDI — yerine kullanıcı onaylı `Modal` geldi: "Şimdi Yeniden Başlat" / "Daha Sonra". Reddedilirse uygulama AÇIK kalıyor, hiçbir zorlama yok |
| `screens/LocationPickerScreen.tsx` | Kendi özel başlığı kaldırıldı, `ScreenHeader` kullanılıyor (3 mod: liste/il/ilçe); hardcoded punto/renk yerine theme token'ları; buton stilleri `primary` zeminli birincil + çerçeveli ikincil olarak yenilendi |
| `screens/VaktindeKilScreen.tsx` | Kendi özel başlığı kaldırıldı, `ScreenHeader` (bilgi ikonu ile) kullanılıyor; kart/switch stilleri theme token'larına ve `primaryBright` switch rengine geçti |
| `screens/RemindersScreen.tsx` | Kendi özel başlığı kaldırıldı, `ScreenHeader` kullanılıyor; kart/switch stilleri theme token'larına geçti; kullanılmayan bir eski import temizlendi |

**Bu paket dışında değişen dosya yok** — `package.json`/`app.json` aynı,
`npm install` gerekmiyor.

### Sekme/Araç yer değişimi — Kıble ↔ Takip (Paket 6)

Kullanıcı isteği: Kıble alt navigasyona (kalıcı sekme) taşınsın, Takip onun
yerine hızlı-araç satırına (anasayfadaki araç kartı) geçsin — yani ikisi yer
değiştirsin.

**Yapılan yapısal değişiklik:**
- `Tab` tipi: `'takip'` çıktı, `'qibla'` girdi → artık
  `'home' | 'imsakiye' | 'kesfet' | 'qibla' | 'settings'`.
- `SubScreen` tipi: `'qibla'` çıktı, `'takip'` girdi.
- `SEKMELER` (alt nav dizisi) artık Kıble'yi listeliyor, Takip'i değil.
- `HIZLI_ARACLAR` (anasayfa hızlı-araç kartları) artık Takip'i listeliyor,
  Kıble'yi değil.
- Keşfet ekranından yönlendirme (`kesfetYonlendir`) ters çevrildi: `'kible'`
  artık `setTab('qibla')`'ya, `'takip'` artık `setSub('takip')`'e gidiyor.
- Alt-ekran render dispatch'i: `sub === 'takip'` → `TakipScreen`
  (eskiden `sub === 'qibla'` → `QiblaScreen`'di).
- Sekme içeriği dispatch'i: `tab === 'qibla'` → `QiblaScreen` (eskiden
  `tab === 'takip'` → `TakipScreen`'di).
- Kaza sayısına bağlı bildirim noktası (kırmızı nokta), eskiden alt-nav
  Takip ikonundaydı — artık hızlı-araç Takip ikonunda (yeni `hizliNokta`
  stili). Eski `navNokta` stili tamamen silindi.

**ÖNEMLİ — neden `TakipScreen.tsx`/`QiblaScreen.tsx`'in kendisi
DEĞİŞMEDİ:** İkisi de zaten opsiyonel `onClose?: () => void` prop'u
destekliyordu — `onClose` verilmezse (kalıcı sekme modu) `ScreenHeader`
kapatma butonu yerine boş bir `sideBtn` placeholder çiziyor, verilirse
(pushed sub-screen modu) kapatma butonu çiziyor. Bu yüzden hangi ekranın
sekme, hangisinin araç olduğu SADECE `HomeScreen.tsx`'teki dispatch/tip
tanımlarıyla belirleniyor — hedef ekranların içinde hiçbir değişiklik
gerekmedi. Yeni bir sekme/araç yer değişimi istenirse aynı desen
kullanılabilir: hedef ekranın `onClose` prop'u opsiyonel mi diye kontrol et,
öyleyse sadece `HomeScreen.tsx`'i düzenle.

### Paket 5'te değişen dosyalar

| Dosya | Değişiklik |
|---|---|
| `screens/HomeScreen.tsx` | Üst şerit/hero/vakit satırları/hızlı araçlar tekrar sıkıştırıldı (Kıble/Tesbih/Esmâ/Kaza artık scroll'suz görünüyor — hesap notu §5'te); Sıradaki Vakit saati büyütüldü (19→26px, display font); İslam Tarihinde Bugün artık HER GÜN görünüyor (fallback mantığı) |
| `data/tariheBugun.ts` | `getTariheEnYakinOlay()` eklendi — tam eşleşme yoksa takvimdeki en yakın gerçek olayı, kendi tarihiyle birlikte gösteriyor. Eski `getTariheBugun` geriye dönük uyumluluk için korundu (deprecated) |
| `components/DoluIkon.tsx` | Keşfet ikonu "bozuk görünme" hatası KÖKTEN çözüldü — bkz. §5 |
| `theme.ts` | 4 koyu tema paleti (Zümrüt Varak, Lila Tezhibi, Tuğra Bordosu, Kisve Siyahı) daha da koyulaştırıldı |
| `screens/HomeScreen.tsx` (aynı dosya, ek değişiklik) | Alt navigasyon "Zümrüt Şerit" (Varyant C) olarak yeniden tasarlandı — bkz. aşağıdaki alt başlık |

**Bu paket dışında değişen dosya yok** — `package.json`/`app.json` aynı,
`npm install` gerekmiyor.

### Alt navigasyon kararı — ÇÖZÜLDÜ

3 varyant (Yumuşak Cam / Yükselen Nokta / Zümrüt Şerit) bir Artifact
sayfasında sunuldu, kullanıcı **Zümrüt Şerit**'i onayladı: dolgulu pil
daralıp dikdörtgene (58×32, `radius.sm`) dönüştü; dolgu rengi
`primaryBright`'tan `copperLight`'a değişti; aktif sekmenin üstünde, o
sekmenin payı kadar genişlikte ince bir `copperLight` şerit beliriyor
(`styles.serit`/`seritPay`/`seritCizgi`). 10 paletin tamamında yeni renk
kombinasyonu (DoluIkon'un G1/G2/BG/A1) çakışma testinden geçirildi.

### Paket 4'te değişen/eklenen dosyalar

| Dosya | Değişiklik |
|---|---|
| `theme.ts` | "Zümrüt & Varak" kaldırıldı (10 palet), 4 tema koyulaştırıldı |
| `screens/HomeScreen.tsx` | Hero kavis kaldırıldı, vakit listesi sıkıştırıldı, reklam alanı yer tutucusu, renk/boyut düzeltmeleri, widget veri senkronu |
| `screens/SettingsScreen.tsx` | Tamamen yeniden yazıldı — `ScreenHeader` + tema dili |
| `screens/TemaScreen.tsx` | Otomatik yeniden başlatma (`expo-updates`) |
| `screens/QiblaScreen.tsx` | Pusula ve Kâbe illüstrasyonu komple yenilendi |
| `screens/AcilisEkrani.tsx` | 3 yeni cami-görselli varyant eklendi (6 varyant oldu) |
| `components/SimplePickerModal.tsx` | Tema diline uyduruldu |
| `components/SoundPickerModal.tsx` | Tema diline uyduruldu |
| `lib/widgetVeriDeposu.ts` | YENİ — widget veri köprüsü |
| `widget/AzanAtlasWidget.tsx` | YENİ — widget görünümü |
| `widget/widgetTaskHandler.ts` | YENİ — widget görev yöneticisi |
| `App.tsx` | Yorum güncellendi (6 varyant listesi) |
| `index.ts` | Widget handler kaydı (try/catch) |
| `package.json` | `expo-updates`, `react-native-android-widget` eklendi |
| `app.json` | `expo-updates` + widget config plugin eklendi |

Diğer tüm dosyalar (screens/TesbihScreen, EsmaulHusnaScreen, KazaScreen,
KesfetScreen, data/, lib/diğerleri, components/Icon, DoluIkon,
IslamicPattern, ScreenHeader) **değişmedi** — zaten tema-uyumluydu.

---

## 5. ÇÖZÜLEN KRİTİK HATALAR (tekrar bozma!)

(Paket 3'e kadarki hatalar aynen geçerli — bkz. önceki devir dosyası içeriği,
burada tekrar edilmiyor: Kıldım butonu, Kıble pusulası doğruluğu,
Keşfet→Kıble eşlemesi, Android bildirim kanalı, Expo Go kırmızı hata ekranı,
Kerahat ayarı parametre uyuşmazlığı.)

### "Keşfet ikonu tıklanınca bozuluyor" — Paket 4'teki çözüm YETERSİZDİ,
### Paket 5'te KÖKTEN çözüldü
**Paket 4'te yapılan (yetersiz kaldı):** `activeOpacity` eklendi ve alt
navigasyonun KENDİ renk seçimleri ayarlandı — ama bu sorunu ekrana özel bir
yamayla kapattı, bileşenin kendi içindeki asıl kusuru bırakmıştı.

**Gerçek kök neden (Paket 5'te bulundu):** `DoluIkon.tsx` içinde dördüncü
bir vurgu rengi olan `A1`, `govde`/`vurgu`/`zemin` prop'larından bağımsız,
SABİT olarak `colors.primaryBright` idi. Alt navigasyon aktif sekmede tam
olarak `zemin={colors.primaryBright}` gönderiyor, pasif sekmede ise
`vurgu={colors.primaryBright}` gönderiyor — yani HER İKİ durumda da A1,
çağıranın gönderdiği başka bir renkle birebir çakışıyordu. Keşfet ikonu dört
kutudan birini A1 ile dolduruyor; A1 çakıştığında o kutu zeminle/başka bir
kutuyla görsel olarak birleşip ikon "eksik/bozuk" görünüyordu.

**Kalıcı çözüm:** `A1` artık sabit değil — `govde`/`vurgu`/`zemin`'in
HİÇBİRİYLE çakışmayan ilk adayı otomatik seçen bir liste
(`primaryBright → primaryGlow → primaryLight → copperBright`) kullanıyor.
Bu, DoluIkon'u kullanan HER ekran/bağlam için (bugün 3 çağrı noktası var:
Keşfet ızgarası, Ana Sayfa hızlı araçlar, alt navigasyon) otomatik olarak
çalışır — yeni bir ekrandan yeni renk kombinasyonuyla çağrılsa bile. 10
paletin tamamında, gerçek 3 çağrı bağlamında (nav aktif, nav pasif,
ızgara/hızlı-araç) Python scriptiyle doğrulandı: hiçbir çakışma yok.

### "İslam Tarihinde Bugün ısrarla gösterilmiyor" — Paket 3-4'te "yapıldı"
### denildi ama veri kapsamı yetersizdi
**Kök neden:** Kart kodda gerçekten vardı ve doğru yerdeydi (Günün
Ayeti'nden sonra) — ama `tariheBugun.ts`'deki veri seti yalnızca 12 kayıt
içeriyordu (yılda ~353 gün için HİÇ kayıt yok). Kullanıcı hangi gün
kontrol ederse etsin, büyük ihtimalle kart görünmüyordu — "yapmadın" izlenimi
buradan geliyordu, kod hiç çalışmıyor değildi.
**Çözüm:** `getTariheEnYakinOlay()` — tam eşleşme yoksa takvimdeki en yakın
GERÇEK olayı, kendi gerçek tarihiyle ("Yıl dönümüne N gün var" gibi)
gösteriyor. Böylece kart her gün dolu ama hiçbir olay uydurma bir "bugün"
etiketiyle sunulmuyor — dosyanın kendi "doğruluk feda edilmesin" ilkesi
korundu.

### Anasayfa hâlâ scroll gerektiriyordu (Paket 4'teki sıkıştırma yetersizdi)
**Çözüm:** Üst şerit, hero, vakit satırları ve hızlı araçlar kartı ayrı ayrı
tekrar sıkıştırıldı (bkz. §4 dosya haritası). Kaba dp hesabıyla toplam
yükseklik ~557dp'ye indi — tipik kullanılabilir ekran yüksekliği (~640-780dp)
içinde rahat sığıyor. Gerçek cihazda doğrulama kullanıcıdan bekleniyor.

### YENİ — Ayarlar ekranı ve popup'lar tema diline uymuyordu
**Sebep:** `SettingsScreen` kendi başlığını yazıyordu, `ScreenHeader`
(İslami doku) kullanmıyordu; `SimplePickerModal`/`SoundPickerModal` düz
beyaz sheet'ti.
**Çözüm:** Üçü de `ScreenHeader`/`IslamicPattern`/`elevation.card` ve ortak
`radius`/`fontSize` ölçeğine geçirildi.

---

## 6. TASARIM SİSTEMİ KURALLARI (değişmedi, bkz. Paket 3 notları)

Palet kalibrasyon yöntemi, rol sözleşmesi, punto ölçeği, ikon kullanımı
kuralları aynen geçerli. **Tek fark:** artık 10 palet var, 11 değil.

---

## 7. BEKLEYEN — PAKET 7 (kullanıcıdan yeni liste geldi, HENÜZ İŞLENMEDİ)

Paket 6 teslim edilirken kullanıcıdan aşağıdaki 10 maddelik yeni liste
geldi (2 ekran görüntüsü + widget/açılış ekranı referans görselleriyle
birlikte). **Bu liste bu pakette işlenmedi** — bir sonraki oturumun ilk işi
bu olmalı. Kullanıcının kendi ifadeleriyle, sırayla:

1. Anasayfadaki vakitlerde yatsı tam çıkmıyor — özel gün eklenince aşağı
   kaymış. Reklam alanını da hesaba katarak vakitleri tam sığdır. Ayrıca
   Kıble/Tesbih/Esmâ/Kaza scroll'suz ilk görünsün — gerekirse ikon/emoji/
   yazı küçült ama yazılar mutlaka okunaklı kalsın.
2. Anasayfanın kavisli (curved) üst şerit yapısı beğenilmedi — düz/kavissiz
   hale dönülsün, ama en üstteki bildirim/konum butonları kalsın.
3. "Günün Ayeti"nden sonra İslam tarihinde o gün yaşanan önemli olaylar
   gösterilsin demişti, hâlâ yapılmamış diyor. **DİKKAT:** bu muhtemelen
   Paket 5'te eklenen `getTariheEnYakinOlay()` fallback'ini kapsıyor olabilir
   — ekran görüntüleri Paket 5 öncesine mi ait kontrol et, ama yine de
   kartın gerçekten göründüğünü cihazda doğrula.
4. Ayarlar ekranı ve altındaki HİÇBİR ekranda temanın görünümü yansımıyor,
   sadece renk değişiyor diyor — pop-up'lar dahil TÜM ekranlar anasayfanın
   renk/ton/görsel diliyle tam uyumlu olmalı. **DİKKAT:** Paket 6'da
   LocationPicker/VaktindeKil/Reminders zaten bu yöne taşındı — kullanıcının
   ekran görüntüleri bu değişiklik öncesine mi ait kontrol et; ayrıca
   SettingsScreen ve diğer araçları (Tesbih/Esmâ/Kaza/Kıble) da tara.
5. Tema değişikliğinde bilgilendirme + birkaç saniye sonra KENDİLİĞİNDEN
   yeniden başlama istiyor. **ÇELİŞKİ:** Paket 6'da kullanıcı onayı
   gerektiren pop-up'a geçildi (otomatik değil). Bu madde muhtemelen Paket 6
   öncesi yazılmış — kullanıcıya YENİ pop-up davranışını göster, otomatik
   mi onaylı mı istediğini doğrulamadan karar değiştirme.
6. Sıradaki Vakit saati küçük + tema renginden dolayı görünürlüğü az; aynı
   yerdeki "şimdiki vakit"/"sonraki vakit" yazıları da tema renginden ötürü
   belirgin değil — kullanıcı deneyimine ve tema uyumuna sadık kalarak farklı
   bir renk önerilebilir. **DİKKAT:** Paket 6'da saat 32px'e büyütüldü —
   ekran görüntüsü bu değişiklik öncesine mi ait kontrol et.
7. Keşfet ikonu tıklanınca tema renginden dolayı ikon bozuluyor (ekran
   görüntüsü var). **DİKKAT:** Paket 5'te DoluIkon kök neden çözümü
   yapıldı — bu şikayet o düzeltme öncesine mi ait, cihazda tekrar doğrula.
8. (İki kez "8" yazılmış, iki ayrı madde:)
   - 8a. Temalarda "Zümrüt Varak" iki kez var, "Zümrüt&Varak" (ve işareti
     olan) kaldırılsın. **DİKKAT:** devir dosyası bunun Paket 4'te zaten
     kaldırıldığını, 10 palet olduğunu söylüyor — kullanıcının cihazındaki
     gerçek palet listesini kontrol et, çelişki varsa cihaz hangi paket
     sürümünde kaldıysa ona göre kök nedeni bul.
   - 8b. Zümrüt Varak/Lila Tezhibi/Tuğra Bordosu/Kisve Siyahı temalarındaki
     renkler hâlâ çok parlak/açık, göz yoruyor, ekrana bakılamıyor diyor —
     daha da koyulaştır. **DİKKAT:** Paket 5'te bu 4 palet zaten
     koyulaştırılmış ve WCAG doğrulaması yapılmıştı — kullanıcının ekran
     görüntüsü Paket 5 öncesine mi ait kontrol et; yine de gerekirse bir tur
     daha koyulaştır ve tekrar WCAG doğrula.
9. Kıble pusulası kötü, önceki tasarımlar daha güzeldi; Kâbe görseli
   anlaşılmıyor kadar kötü. Kullanıcı daha önce Muslim Pro ve benzeri
   uygulamalardan pusula referans görselleri vermiş — bizimki onlar kadar
   güzel olmalı. **YENİ İŞ — henüz hiç başlanmadı.**
10. Widget: Expo'da şimdilik çalışmasın (development build'de test
    edilecek) ama üretilen 3 varyant beğenilmedi — özellikle uygulama adı
    çok aşağıda kalmış, Muslim Pro'daki gibi olmalı. Ayrıca "Ezan Vakti Pro"
    örneğindeki gibi (ekte referans görsel var) animasyonlu, mutlaka cami
    görselli bir AÇILIŞ EKRANI isteniyor — 3 yeni açılış ekranı varyantı
    daha üretilmesi isteniyor. **YENİ İŞ — henüz hiç başlanmadı.**

**Ek kalıcı kural (kullanıcı bu turda tekrarladı, hafızaya zaten
kaydedildi):** İnternetten kullanılacak HER görsel/medya mutlaka ücretsiz
ve ticari hak sorunu olmayan kaynaklardan olmalı; izin istemeden araştırıp
seçilebilir ama lisans MUTLAKA doğrulanmalı. Bu kural TÜM projelerde
geçerli (bkz. §2 madde 6 — zaten oradaydı, kullanıcı bu turda tekrar
vurguladı).

**Paket 7'ye başlarken izlenecek yöntem:** Yukarıdaki "DİKKAT" notlarının
çoğu, ekran görüntülerinin Paket 5/6 öncesine ait olabileceğine işaret
ediyor (§0'daki "ÖNEMLİ ÖĞRENİLEN DERS" ile aynı risk). Kod okumakla
yetinme — cihazdaki GÜNCEL build'i çalıştırıp/inceleyip her maddenin hâlâ
geçerli olup olmadığını tek tek doğrula, sonra düzelt. Gerçekten hâlâ
sorunluysa kök nedeni bul (yüzeysel yama değil) ve devir dosyasına aynı
titizlikle işle.

---

## 7. HENÜZ YAPILMAYANLAR / AÇIK KONULAR

| # | Madde | Durum |
|---|---|---|
| — | **Açılış varyantı seçimi** | 6 varyant hazır (3 eski + 3 yeni cami), `App.tsx`'te hâlâ `'girih'` aktif — kullanıcı yeni varyantları görüp seçmeli |
| — | **Widget testi** | Kod yazıldı, HİÇ test edilmedi — `expo run:android` gerekiyor |
| — | **`expo-updates` testi** | Tema değişince gerçek reload davranışı henüz doğrulanmadı |
| — | **Reklam entegrasyonu** | HomeScreen'de yer ayrıldı (`reklamAlani`, 50dp) ama `react-native-google-mobile-ads` henüz entegre edilmedi |
| — | **Bildirim sesleri testi** | Kullanıcı "sonra kontrol edeceğim" dedi |

### Bilinen sınırlar (kullanıcıya açıklandı)
- Widget canlı geri sayım gösteremez (Android kısıtı, statik liste).
- Expo Go: özel bildirim sesi çalmaz, killed-state "Kıldım" çalışmaz, widget
  çalışmaz, `expo-updates` reload çalışmaz. Bunların hepsi `expo run:android`
  gerektirir.

---

## 8. GÖRSEL/MEDYA LİSANS KURALI (YENİ — Paket 4, kalıcı)

Kullanıcı: "internette free olarak kullanılacak her türlü görsel için
gerekirse araştırma yap ve benden izin istemeden bu görselleri kullan. fakat
lisans hakları, ticari kullanım hakkı gibi konulara dikkat et... bunu senin
yaptığımız bütün projelerde dikkate al."

**Paket 4'te uygulanışı:** Açılış ekranı için gerçek raster fotoğraf
indirmek yerine, orijinal elle çizilmiş SVG cami silüeti tercih edildi —
sıfır lisans riski, paket boyutuna etkisi yok (birkaç KB), tüm temalarla
otomatik uyumlu, açılış süresine ek gecikme getirmiyor (aynı zamanlayıcı).
