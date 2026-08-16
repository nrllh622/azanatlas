// src/lib/vaktindeKilScheduler.ts
import * as Notifications from 'expo-notifications';
import { VakitEntry } from './prayerCalculator';
import { VaktindeKilSound } from '../context/VaktindeKilContext';

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
  // Bildirim sesi olarak bundle edilen dosya adı — app.json'daki expo-notifications
  // eklenti yapılandırmasında tanımlı olması gerekiyor (bip.wav / dong.wav)
  const soundFile = sound === 'dong' ? 'dong.wav' : 'bip.wav';

  while (t.getTime() < end.getTime() && count < 20) {
    if (t.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Vaktinde Kıl',
          body: `${current.label} namazını henüz kılmadıysan vaktinde kılmayı unutma.`,
          sound: soundFile,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: t, channelId },
      });
    }
    t = new Date(t.getTime() + repeatIntervalMinutes * 60 * 1000);
    count++;
  }
}
