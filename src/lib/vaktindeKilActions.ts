// src/lib/vaktindeKilActions.ts
import * as Notifications from 'expo-notifications';

export const VAKTINDE_KIL_CATEGORY = 'VAKTINDE_KIL';
const MARK_PRAYED_ACTION = 'MARK_PRAYED';

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
export function registerVaktindeKilResponseListener() {
  return Notifications.addNotificationResponseReceivedListener(async (response) => {
    if (response.actionIdentifier !== MARK_PRAYED_ACTION) return;
    const data = response.notification.request.content.data as any;
    if (!data || data.type !== 'vaktindekil') return;

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      const d = n.content.data as any;
      if (d && d.type === 'vaktindekil' && d.vakitKey === data.vakitKey && d.vakitDateISO === data.vakitDateISO) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }
  });
}
