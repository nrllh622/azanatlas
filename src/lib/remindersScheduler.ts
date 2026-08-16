// src/lib/remindersScheduler.ts
import * as Notifications from 'expo-notifications';
import { calculateVakitler } from './prayerCalculator';
import { RemindersSettings } from '../context/RemindersContext';
import { getSoundById } from '../data/soundCatalog';

// targetDay: 0=Pazar,1=Pazartesi,2=Salı,3=Çarşamba,4=Perşembe,5=Cuma,6=Cumartesi
// Bugün o günse bugünü, değilse bu haftanın/gelecek haftanın o gününü döndürür
function nearestWeekday(from: Date, targetDay: number): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const diff = (targetDay - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}

export async function scheduleReminders(
  latitude: number,
  longitude: number,
  countryCode: string,
  autoMethod: boolean,
  methodId: string,
  madhab: 'Shafi' | 'Hanafi',
  highLatRule: 'AngleBased' | 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'None',
  settings: RemindersSettings
) {
  const now = new Date();

  const todayVakitler = calculateVakitler(latitude, longitude, now, countryCode, autoMethod, methodId, madhab, highLatRule);
  const todayImsak = todayVakitler.find((v) => v.key === 'imsak')!;

  if (settings.sahur.enabled) {
    const d = new Date(todayImsak.date.getTime() - settings.sahur.minutesBefore * 60 * 1000);
    if (d.getTime() > now.getTime()) {
      const sound = getSoundById(settings.sahur.soundId);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Sahur Uyarısı',
          body: `İmsak vaktine ${settings.sahur.minutesBefore} dakika kaldı.`,
          sound: sound.id !== 'none' ? 'default' : undefined,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: d },
      });
    }
  }

  if (settings.teheccut.enabled) {
    const d = new Date(todayImsak.date.getTime() - settings.teheccut.minutesBefore * 60 * 1000);
    if (d.getTime() > now.getTime()) {
      const sound = getSoundById(settings.teheccut.soundId);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Teheccüt Uyandırma',
          body: 'Teheccüt namazı için uyanma vakti.',
          sound: sound.id !== 'none' ? 'default' : undefined,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: d },
      });
    }
  }

  if (settings.pazartesiPersembeOrucu.enabled) {
    for (const targetDay of [1, 4]) {
      const dayDate = nearestWeekday(now, targetDay);
      const vakitler = calculateVakitler(latitude, longitude, dayDate, countryCode, autoMethod, methodId, madhab, highLatRule);
      const dayImsak = vakitler.find((v) => v.key === 'imsak')!;
      const triggerDate = new Date(dayImsak.date.getTime() - settings.pazartesiPersembeOrucu.minutesBefore * 60 * 1000);

      if (triggerDate.getTime() > now.getTime()) {
        const sound = getSoundById(settings.pazartesiPersembeOrucu.soundId);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Pazartesi/Perşembe Orucu',
            body: 'Niyet etmeyi ve sahuru unutma.',
            sound: sound.id !== 'none' ? 'default' : undefined,
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
        });
      }

      if (settings.pazartesiPersembeOrucu.remindDayBefore) {
        const dayBefore = new Date(triggerDate.getTime() - 24 * 60 * 60 * 1000);
        if (dayBefore.getTime() > now.getTime()) {
          await Notifications.scheduleNotificationAsync({
            content: { title: 'Yarın Oruç Günü', body: 'Yarın Pazartesi/Perşembe orucu — unutma.', sound: 'default' },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: dayBefore },
          });
        }
      }
    }
  }

  if (settings.cumaNamazi.enabled) {
    const fridayDate = nearestWeekday(now, 5);
    const vakitler = calculateVakitler(latitude, longitude, fridayDate, countryCode, autoMethod, methodId, madhab, highLatRule);
    const ogle = vakitler.find((v) => v.key === 'ogle')!;
    const triggerDate = new Date(ogle.date.getTime() - settings.cumaNamazi.minutesBefore * 60 * 1000);

    if (triggerDate.getTime() > now.getTime()) {
      const sound = getSoundById(settings.cumaNamazi.soundId);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Cuma Namazı Hatırlatma',
          body: 'Cuma namazına hazırlan.',
          sound: sound.id !== 'none' ? 'default' : undefined,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
      });
    }
  }
}
