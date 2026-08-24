// src/lib/widgetVeriDeposu.ts
//
// WIDGET İÇİN ÖNCEDEN HESAPLANMIŞ VERİ
//
// ─────────────────────────────────────────────────────────────────────────────
// NEDEN "ÖNCEDEN HESAPLA, SONRA OKU" DESENİ?
//
// Widget'ın kendi arka plan görevi (`widgetTaskHandler.ts`) Android
// tarafından tetiklendiğinde tam bir React ortamı YOKTUR — konum izni
// istemek, ağ isteği atmak veya `adhan` ile karmaşık astronomik hesap
// yapmak güvenilir değildir. Bunun yerine: UYGULAMA AÇIKKEN (HomeScreen
// zaten vakitleri hesaplarken) sonuç burada AsyncStorage'a yazılır; widget
// yalnızca bu hazır veriyi okur ve o anki saate göre "hangi vakitteyiz"
// sorusunu basit bir karşılaştırmayla cevaplar. Böylece widget güncellemesi
// gecikse bile (Android 30 dakikadan sık izin vermiyor) gösterilen veri
// HER ZAMAN o günün doğru vakitleridir — yalnızca "şu an" vurgusu birkaç
// dakika eskiyebilir, bu da görsel olarak önemsizdir.
// ─────────────────────────────────────────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import { VakitEntry, VakitKey } from './prayerCalculator';

const ANAHTAR = 'azanatlas_widget_veri_v1';

export interface WidgetVakitSatiri {
  key: VakitKey;
  saat: string;
  /** ISO zaman damgası — widget kendi anlık saatiyle karşılaştırıp "aktif" vakti belirler. */
  zamanIso: string;
  aktif: boolean;
}

export interface WidgetVakitVerisi {
  konumEtiketi: string;
  hicriEtiketi: string;
  vakitler: WidgetVakitSatiri[];
  /** Verinin hesaplandığı an — widget bunu kullanarak "aktif" bayrağını tazeleyebilir. */
  guncellemeIso: string;
}

function ikiHane(n: number): string {
  return String(n).padStart(2, '0');
}

function saatBicimle(d: Date): string {
  return `${ikiHane(d.getHours())}:${ikiHane(d.getMinutes())}`;
}

/**
 * HomeScreen, vakitler her yeniden hesaplandığında (konum/yöntem/gün
 * değiştiğinde) bu fonksiyonu çağırır. Widget'ın kendisi bu veriyi asla
 * hesaplamaz, yalnızca okur.
 */
export async function widgetVerisiniGuncelle(
  vakitler: VakitEntry[],
  konumEtiketi: string,
  hicriEtiketi: string,
  simdikiVakitKey: VakitKey | null
): Promise<void> {
  const veri: WidgetVakitVerisi = {
    konumEtiketi,
    hicriEtiketi,
    guncellemeIso: new Date().toISOString(),
    vakitler: vakitler.map((v) => ({
      key: v.key,
      saat: saatBicimle(v.date),
      zamanIso: v.date.toISOString(),
      aktif: v.key === simdikiVakitKey,
    })),
  };
  try {
    await AsyncStorage.setItem(ANAHTAR, JSON.stringify(veri));
  } catch {
    // Widget verisi yazılamazsa uygulamanın geri kalanı etkilenmemeli —
    // widget bir sonraki güncellemede eski veriyi göstermeye devam eder.
  }
}

/** Widget task handler'ının okuduğu fonksiyon — yalnızca AsyncStorage okur. */
export async function widgetVerisiniOku(): Promise<WidgetVakitVerisi | null> {
  try {
    const ham = await AsyncStorage.getItem(ANAHTAR);
    if (!ham) return null;
    const veri = JSON.parse(ham) as WidgetVakitVerisi;

    // "Aktif" bayrağını widget'ın render anındaki gerçek saatine göre
    // TAZELE — kaydedildiği andan beri vakit değişmiş olabilir.
    const simdi = Date.now();
    const gecmisVakitler = veri.vakitler.filter((v) => new Date(v.zamanIso).getTime() <= simdi);
    const suankiKey = gecmisVakitler.length > 0
      ? gecmisVakitler[gecmisVakitler.length - 1].key
      : veri.vakitler[veri.vakitler.length - 1]?.key;

    return {
      ...veri,
      vakitler: veri.vakitler.map((v) => ({ ...v, aktif: v.key === suankiKey })),
    };
  } catch {
    return null;
  }
}
