// src/lib/vaktindeKilScheduler.ts
import * as Notifications from 'expo-notifications';
import { VakitEntry } from './prayerCalculator';
import { VaktindeKilSound } from '../context/VaktindeKilContext';
import { VAKTINDE_KIL_CATEGORY } from './vaktindeKilActions';

export async function scheduleVaktindeKil(
  current: VakitEntry,
  next: VakitEntry,
  firstDelayMinutes: number,
  repeatIntervalMinutes: number,
  sound: VaktindeKilSound,
  vibrationEnabled: boolean
) {
  const start = new Date(current.date.getTime() + firstDelayMinutes * 60 * 1000);
  const end = next.date;
  let t = start;
  let count = 0;
  const channelId = vibrationEnabled ? 'vibrate-on' : 'vibrate-off';
  const soundFile = sound === 'dong' ? 'dong.wav' : 'bip.wav';
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
