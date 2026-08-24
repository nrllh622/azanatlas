# AzanAtlas — Proje Devir Dosyası

> Bu dosya, AzanAtlas geliştirme sohbetinin yeni bir oturumda kaldığı yerden
> devam edebilmesi için hazırlandı. **Yeni sohbete bu dosyayı ekle ve
> "AzanAtlas'a devam ediyoruz, devir dosyasını oku" de.**
>
> Son güncelleme: 24 Ağustos 2026 · Paket 4 teslim edildi (10 maddelik revizyon).

---

## 0. HIZLI BAŞLANGIÇ (yeni asistan için)

**Yapman gereken ilk şey:** Kullanıcının bilgisayarındaki projeyi oku.
Klasör bağlıysa `mcp__remote-devices__device_list_dir` ile
`C:\Users\nrllh\azanatlas\src` içeriğini listele, sonra
`device_stage_files` ile dosyaları al. **Cihazdaki kopya tek doğru kaynaktır** —
kullanıcı her paketi uyguluyor.

**Bekleyen kararlar:**
- Açılış ekranı varyantı — Paket 4 ile 3 YENİ cami-görselli varyant eklendi
  (`cami-siluet`, `cami-hilal`, `cami-altin`), ama `App.tsx`'te aktif varyant
  hâlâ eski `'girih'`. Kullanıcı yeni varyantları görüp seçim yapmalı.
- Widget — kod yazıldı ama HİÇ TEST EDİLMEDİ (Expo Go'da çalışmaz,
  `expo run:android` gerekir). Kullanıcı "development build aldığımızda test
  ederiz" dedi.
- `expo-updates` paketi eklendi ama `npm install` sonrası ilk kez test
  edilecek — tema değiştirince gerçekten yeniden başlıyor mu doğrulanmalı.

**Kullanıcının çalışma tarzı:** Ekran görüntüsüyle geri bildirim veriyor,
karar gerektiren yerlerde onay istiyor, teslimat tam dosya + zip.

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
önce `N` yerine gerçek paket numarasını yazmalısın (ör. Paket 4 için
`azanatlas-paket4.zip`). Literal olarak `paketN` yazarsan `tar.exe: Error
opening archive: Failed to open 'azanatlas-paketN.zip'` hatası alırsın —
çünkü o isimde bir dosya gerçekten yok.

```powershell
cd C:\Users\nrllh\azanatlas

tar -xf azanatlas-paket4.zip
del azanatlas-paket4.zip

npm.cmd install

git add .
git commit -m "..."
git push origin master:main

npx.cmd expo start -c --go
```

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
- **Paket 4'ten itibaren `npm install` ŞART** — `expo-updates` ve
  `react-native-android-widget` yeni bağımlılıklar olarak eklendi.
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
- **Paket 4 itibarıyla 10 palet** (11 değil — "Zümrüt & Varak" duplikasyonu
  kaldırıldı, sadece "Zümrüt Varak" kaldı).
- `zumrutVarak`, `lilaTezhibi`, `kisveSiyahi`, `tugraBordosu` paletleri Paket
  4'te KOYULAŞTIRILDI (önceki sürüm çok parlak/göz yorucuydu). Tüm kritik
  metin/zemin çiftleri WCAG AAA seviyesinde doğrulandı (script ile).
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

## 4. DOSYA HARİTASI — Paket 4'te değişen/eklenen dosyalar

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

### YENİ — "Keşfet ikonu tıklanınca bozuluyor" (Paket 4'te çözüldü)
**Sebep:** İki neden birleşiyordu: (1) `TouchableOpacity`'lerin çoğunda
`activeOpacity` belirtilmemişti (RN varsayılanı 0.2 — dolgulu SVG ikonu
şeffaflaştırıp katmanları karıştırıyordu), (2) alt navigasyonda pasif
sekmenin `vurgu` rengi (`copperLight`) kesfet ikonundaki 4 renkli kutucukla
düşük kontrastta çakışıyordu.
**Çözüm:** Tüm `TouchableOpacity`'lere `activeOpacity` eklendi (0.6–0.8
arası, konuma göre); pasif alt nav ikonunun vurgu rengi `primaryBright`'a
çekildi.

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
