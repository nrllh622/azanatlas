// src/lib/vaktindeKilActions.ts
import * as Notifications from 'expo-notifications';

export const VAKTINDE_KIL_CATEGORY = 'VAKTINDE_KIL';
export const MARK_PRAYED_ACTION = 'MARK_PRAYED';

export async function setupVaktindeKilCategory() {
  await Notifications.setNotificationCategoryAsync(VAKTINDE_KIL_CATEGORY, [
    {
      identifier: MARK_PRAYED_ACTION,
      buttonTitle: 'Kıldım',
      options: { opensAppToForeground: false },
    },
  ]);
}

// "Kıldım" butonuna basılınca, o vaktin/günün kalan tüm Vaktinde Kıl
// hatırlatmalarını iptal eder — diğer günler/vakitler etkilenmez.
// Hem uygulama açıkken (foreground/background) HEM DE uygulama tamamen
// kapatılmışken (killed state, bkz. index.ts'teki arka plan görevi)
// çağrılabilecek şekilde ortak bir fonksiyon olarak dışa açılıyor.
export async function handleMarkPrayedAction(data: any) {
  if (!data || data.type !== 'vaktindekil') return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    const d = n.content.data as any;
    if (d && d.type === 'vaktindekil' && d.vakitKey === data.vakitKey && d.vakitDateISO === data.vakitDateISO) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }

  // Bildirim çubuğunda hâlâ görünen, AYNI vakte ait Vaktinde Kıl bildirimlerini
  // kaldır — "Kıldım" dedikten sonra ekranda asılı kalmasınlar. Sadece bu
  // vaktin bildirimlerini hedefliyoruz (dismissAllNotificationsAsync yerine
  // tek tek dismissNotificationAsync) — böylece o an ekranda duran BAŞKA bir
  // vaktin/türün bildirimi (ör. bir sonraki vaktin ön-uyarısı) yanlışlıkla
  // silinmiyor.
  try {
    const gosterilen = await Notifications.getPresentedNotificationsAsync();
    for (const n of gosterilen) {
      const d = n.request.content.data as any;
      if (d && d.type === 'vaktindekil' && d.vakitKey === data.vakitKey && d.vakitDateISO === data.vakitDateISO) {
        await Notifications.dismissNotificationAsync(n.request.identifier);
      }
    }
  } catch {
    // getPresentedNotificationsAsync Android 6.0 altında desteklenmiyor;
    // sessizce yut — asıl iş (iptal) zaten yukarıda tamamlandı.
  }
}

// Uygulama açıkken (foreground/background, ama process canlıyken) çalışan
// JS listener. Uygulama tamamen kapalıyken (killed) bu ASLA tetiklenmez —
// o durum index.ts'teki TaskManager arka plan görevi tarafından ele alınır.
export function registerVaktindeKilResponseListener() {
  return Notifications.addNotificationResponseReceivedListener(async (response) => {
    if (response.actionIdentifier !== MARK_PRAYED_ACTION) return;
    const data = response.notification.request.content.data as any;
    await handleMarkPrayedAction(data);
  });
}
