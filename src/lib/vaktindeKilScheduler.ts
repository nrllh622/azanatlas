// src/lib/vaktindeKilScheduler.ts
import * as Notifications from 'expo-notifications';
import { VakitEntry } from './prayerCalculator';

export async function scheduleVaktindeKil(
  current: VakitEntry,
  next: VakitEntry,
  firstDelayMinutes: number,
  repeatIntervalMinutes: number
) {
  const start = new Date(current.date.getTime() + firstDelayMinutes * 60 * 1000);
  const end = next.date;
  let t = start;
  let count = 0;

  while (t.getTime() < end.getTime() && count < 20) {
    if (t.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Vaktinde Kıl',
          body: `${current.label} namazını henüz kılmadıysan vaktinde kılmayı unutma.`,
          sound: 'default',
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: t },
      });
    }
    t = new Date(t.getTime() + repeatIntervalMinutes * 60 * 1000);
    count++;
  }
}
