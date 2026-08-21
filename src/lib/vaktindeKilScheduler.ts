// src/lib/vaktindeKilScheduler.ts
import * as Notifications from 'expo-notifications';
import { VakitEntry } from './prayerCalculator';
import { VaktindeKilSound } from '../context/VaktindeKilContext';
import { VAKTINDE_KIL_CATEGORY } from './vaktindeKilActions';
import { getChannelForSound } from './notificationScheduler';

// Yeniden planlamadan önce, SADECE Vaktinde Kıl'a ait daha önce kurulmuş
// bildirimleri iptal eder (diğer bildirim türlerine dokunmaz). Bu olmadan,
// HomeScreen'deki useEffect her tetiklendiğinde eski Vaktinde Kıl bildirimleri
// silinmeden üzerine yenileri ekleniyordu — "Kıldım" ile iptal edilen bir
// vaktin hatırlatmaları bu şekilde geri geliyordu.
async function cancelExistingVaktindeKilNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    const d = n.content.data as any;
    if (d && d.type === 'vaktindekil') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

export async function scheduleVaktindeKil(
  current: VakitEntry,
  next: VakitEntry,
  firstDelayMinutes: number,
  repeatIntervalMinutes: number,
  sound: VaktindeKilSound,
  vibrationEnabled: boolean
) {
  await cancelExistingVaktindeKilNotifications();

  const start = new Date(current.date.getTime() + firstDelayMinutes * 60 * 1000);
  const end = next.date;
  let t = start;
  let count = 0;
  const channelId = getChannelForSound(sound, vibrationEnabled);
  const soundFile = `${sound}.wav`;
  const vakitDateISO = current.date.toISOString();

  while (t.getTime() < end.getTime() && count < 20) {
    if (t.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Vaktinde Kıl',
          body: `${current.label} namazını henüz kılmadıysan vaktinde kılmayı unutma.`,
          sound: soundFile,
          categoryIdentifier: VAKTINDE_KIL_CATEGORY,
          data: { type: 'vaktindekil', vakitKey: current.key, vakitDateISO },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: t, channelId },
      });
    }
    t = new Date(t.getTime() + repeatIntervalMinutes * 60 * 1000);
    count++;
  }
}
