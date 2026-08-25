// src/lib/vaktindeKilActions.ts
import * as Notifications from 'expo-notifications';
import { vaktiKilindiIsaretle, takipEdilebilir } from './ibadetTakibi';
import { DilKodu, VARSAYILAN_DIL, tDil } from '../i18n/ceviriler';

export const VAKTINDE_KIL_CATEGORY = 'VAKTINDE_KIL';
export const MARK_PRAYED_ACTION = 'MARK_PRAYED';

export const DISMISS_ACTION = 'DISMISS_REMINDER';

/**
 * Bildirim aksiyon butonlarını tanımlar.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * GÖRÜNÜRLÜK
 *
 * Android bildirim aksiyonlarının rengini ve simgesini uygulama BELİRLEYEMEZ;
 * sistem kendi bildirim gölgesi temasına göre çizer. Elimizdeki tek gerçek
 * araç BUTON METNİDİR. Bu yüzden düz "Kıldım" yerine, ne yapacağını açıkça
 * söyleyen ve gözle taranırken ayrışan bir metin kullanılıyor.
 *
 * Ayrıca ikinci bir "Sonra" butonu eklendi: tek butonlu bildirimde kullanıcı
 * genelde butonu değil bildirimin kendisini kapatmaya çalışıyor. İki buton
 * olunca ikisi de birer eylem olarak okunuyor ve "Kıldım" fark ediliyor.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Madde 7 (i18n taraması, bu tur): buton metinleri daha önce hardcoded
 * Türkçe idi, `dil` parametresi hiç almıyordu — İngilizce arayüzde bile
 * "KILDIM" / "Sonra hatırlat" görünüyordu. Artık `tDil()` ile seçili dile
 * göre kuruluyor. Bu fonksiyon HomeScreen'de dil değiştiğinde de yeniden
 * çağrılmalı (bkz. oradaki `useEffect` bağımlılık dizisine `dil` eklendi).
 */
export async function setupVaktindeKilCategory(dil: DilKodu = VARSAYILAN_DIL) {
  await Notifications.setNotificationCategoryAsync(VAKTINDE_KIL_CATEGORY, [
    {
      identifier: MARK_PRAYED_ACTION,
      buttonTitle: tDil(dil, 'vaktindeKilButonuKildim'),
      options: { opensAppToForeground: false },
    },
    {
      identifier: DISMISS_ACTION,
      buttonTitle: tDil(dil, 'vaktindeKilButonuSonraHatirlat'),
      options: { opensAppToForeground: false },
    },
  ]);
}

// AYNI vakte (aynı `vakitKey` + `vakitDateISO`) ait TÜM Vaktinde Kıl
// bildirimlerini kapatır — hem henüz tetiklenmemiş, zamanlanmış olanları
// (`cancelScheduledNotificationAsync`) hem o an bildirim çubuğunda görünen,
// zaten teslim edilmiş olanları (`dismissNotificationAsync`). `scheduleVaktindeKil`
// aynı vakit için `repeatIntervalMinutes` aralığıyla art arda birden fazla
// bildirim kurduğundan (bkz. vaktindeKilScheduler.ts) — kullanıcı bunlardan
// SADECE BİRİNE "Kıldım" ya da "Sonra hatırlat" ile yanıt verse bile, aynı
// vakte ait geri kalan tüm eşler de bu fonksiyonla birlikte kapanır. Hem
// "Kıldım" hem "Sonra hatırlat" ortak olarak bunu çağırır — ikisi de "bu
// vakit için beni artık rahatsız etme" anlamına gelir, farkları yalnızca
// ibadet takibine işaretleyip işaretlememekte.
async function tumEslerinBildirimlerinikapat(vakitKey: string, vakitDateISO: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    const d = n.content.data as any;
    if (d && d.type === 'vaktindekil' && d.vakitKey === vakitKey && d.vakitDateISO === vakitDateISO) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }

  // Bildirim çubuğunda hâlâ görünen, AYNI vakte ait Vaktinde Kıl bildirimlerini
  // kaldır — butona bastıktan sonra ekranda asılı kalmasınlar. Sadece bu
  // vaktin bildirimlerini hedefliyoruz (dismissAllNotificationsAsync yerine
  // tek tek dismissNotificationAsync) — böylece o an ekranda duran BAŞKA bir
  // vaktin/türün bildirimi (ör. bir sonraki vaktin ön-uyarısı) yanlışlıkla
  // silinmiyor.
  try {
    const gosterilen = await Notifications.getPresentedNotificationsAsync();
    for (const n of gosterilen) {
      const d = n.request.content.data as any;
      if (d && d.type === 'vaktindekil' && d.vakitKey === vakitKey && d.vakitDateISO === vakitDateISO) {
        await Notifications.dismissNotificationAsync(n.request.identifier);
      }
    }
  } catch {
    // getPresentedNotificationsAsync Android 6.0 altında desteklenmiyor;
    // sessizce yut — asıl iş (iptal) zaten yukarıda tamamlandı.
  }
}

// "Kıldım" butonuna basılınca, o vaktin/günün kalan tüm Vaktinde Kıl
// hatırlatmalarını (aynı vakte ait TÜM eşler dahil) iptal eder — diğer
// günler/vakitler etkilenmez. Hem uygulama açıkken (foreground/background)
// HEM DE uygulama tamamen kapatılmışken (killed state, bkz. index.ts'teki
// arka plan görevi) çağrılabilecek şekilde ortak bir fonksiyon olarak dışa
// açılıyor.
export async function handleMarkPrayedAction(data: any) {
  if (!data || data.type !== 'vaktindekil') return;

  await tumEslerinBildirimlerinikapat(data.vakitKey, data.vakitDateISO);

  // GÜNLÜK İBADET TAKİBİ ile entegrasyon: kullanıcı bildirimden "Kıldım"
  // dediğinde, o vakit Takip ekranında da kılınmış olarak görünmeli. Aksi
  // halde kullanıcı aynı bilgiyi bir de uygulama içinde elle işaretlemek
  // zorunda kalırdı.
  //
  // Tarih olarak "şu an" değil, bildirimin ait olduğu VAKTİN tarihi
  // kullanılıyor: yatsı hatırlatması gece yarısını geçtikten sonra
  // yanıtlanırsa, işaret dünkü güne değil doğru güne düşmeli.
  try {
    if (takipEdilebilir(data.vakitKey)) {
      const vakitTarihi = data.vakitDateISO ? new Date(data.vakitDateISO) : new Date();
      const gecerliTarih = isNaN(vakitTarihi.getTime()) ? new Date() : vakitTarihi;
      await vaktiKilindiIsaretle(gecerliTarih, data.vakitKey);
    }
  } catch {
    // Takip kaydı yazılamazsa bildirim iptali yine de geçerli kalmalı.
  }
}

// "Sonra hatırlat" butonuna basılınca — "Kıldım"ın aksine — ibadet takibine
// HİÇBİR ŞEY işaretlenmez (kullanıcı henüz kılmadı, sadece o anki bildirim
// dizisini susturuyor). Ama kullanıcının asıl şikayeti ("aynı vakit için
// birden fazla bildirim ekranda birikiyor") "Kıldım" kadar burada da
// geçerli: bu yüzden aynı vakte ait tüm zamanlanmış/gösterilen eşler aynı
// şekilde kapatılıyor. Bir SONRAKİ vakit için hatırlatmalar (farklı
// vakitKey/vakitDateISO) etkilenmez.
export async function handleDismissReminderAction(data: any) {
  if (!data || data.type !== 'vaktindekil') return;
  await tumEslerinBildirimlerinikapat(data.vakitKey, data.vakitDateISO);
}

// Uygulama açıkken (foreground/background, ama process canlıyken) çalışan
// JS listener. Uygulama tamamen kapalıyken (killed) bu ASLA tetiklenmez —
// o durum index.ts'teki TaskManager arka plan görevi tarafından ele alınır.
export function registerVaktindeKilResponseListener() {
  return Notifications.addNotificationResponseReceivedListener(async (response) => {
    const data = response.notification.request.content.data as any;
    if (response.actionIdentifier === MARK_PRAYED_ACTION) {
      await handleMarkPrayedAction(data);
    } else if (response.actionIdentifier === DISMISS_ACTION) {
      await handleDismissReminderAction(data);
    }
  });
}
