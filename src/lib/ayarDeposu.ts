// src/lib/ayarDeposu.ts
//
// AYAR KALICILIĞI — GENEL YARDIMCI
//
// DÜZELTME (bu tur — madde 4): kullanıcı "uygulama kapanıp açıldığında
// kullanıcının tercihleri sıfırlanmamalı" dedi ve somut örnek olarak
// "Ezan Duası" seçeneğinin kaybolduğunu, ayrıca bildirim çubuğu widget
// seçeneğinin de kaybolduğunu belirtti.
//
// KÖK NEDEN — TÜM AYARLAR İÇİN GEÇERLİ, TEK BİR MADDE DEĞİL:
// `NotificationSettingsContext`, `GeneralSettingsContext`,
// `CalculationSettingsContext`, `RemindersContext`, `VaktindeKilContext` ve
// `LocationContext` — altısı da state'i yalnızca `useState` ile bellekte
// tutuyordu, HİÇBİRİ AsyncStorage'a yazmıyordu. Uygulama tamamen kapatılıp
// (process sonlandırılıp) yeniden açıldığında React state sıfırdan kurulur,
// bu yüzden hepsi modüldeki DEFAULT_SETTINGS'e dönüyordu — "Ezan Duası"
// sadece rastgele fark edilen tek örnekti, aslında Konum, Hesaplama Yöntemi,
// Titreşim, Widget, Hatırlatıcılar, Vaktinde Kıl ayarlarının TAMAMI aynı
// şekilde sıfırlanıyordu.
//
// (Karşılaştırma için: `KazaContext` ve `IbadetTakibiContext` bu sorunu hiç
// yaşamıyordu çünkü onlar zaten kendi özel storage dosyalarına
// [`kazaStorage.ts`, `ibadetTakibi.ts`] yazıp okuyordu — aynı deseni burada
// da genel bir yardımcıya çıkarıyoruz.)
//
// Bu dosya `temaDeposu.ts`/`kazaStorage.ts` ile AYNI deseni izleyen, ANCAK
// her ayar dosyası için ayrı ayrı tekrar yazılmasın diye TEK SEFERDE
// genelleştirilmiş bir yükle/kaydet çifti sağlıyor. Her çağıran kendi
// depolama anahtarını (`anahtar`) ve varsayılan değerini verir.

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Verilen anahtarda kayıtlı JSON değeri okur. Kayıt yoksa veya okuma/parse
 * başarısız olursa (bozuk veri, depolama erişim hatası) sessizce
 * `varsayilan`a düşer — bir ayar dosyasının okunamaması uygulamanın
 * açılmasını ASLA engellememeli.
 *
 * Not: kayıtlı nesne varsayılanla YÜZEYSEL (shallow) birleştirilir — bu
 * sayede uygulamaya sonradan yeni bir alan eklenirse (ör. yeni bir bildirim
 * bayrağı), eski kullanıcılarda o alan `undefined` değil varsayılan değeriyle
 * gelir.
 */
export async function ayarYukle<T extends object>(anahtar: string, varsayilan: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(anahtar);
    if (!raw) return varsayilan;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { ...varsayilan, ...parsed };
    }
    return varsayilan;
  } catch {
    return varsayilan;
  }
}

/** Verilen anahtara verilen değeri JSON olarak kaydeder. */
export async function ayarKaydet<T>(anahtar: string, deger: T): Promise<void> {
  try {
    await AsyncStorage.setItem(anahtar, JSON.stringify(deger));
  } catch {
    // Kaydedilemezse bir sonraki değişiklikte tekrar denenir; UI'ı bloklamaz.
  }
}
