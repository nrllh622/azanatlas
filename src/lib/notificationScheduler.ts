// src/lib/notificationScheduler.ts
import * as Notifications from 'expo-notifications';
import { VakitEntry } from './prayerCalculator';
import { NotificationSettings } from '../context/NotificationSettingsContext';
import { getSoundById } from '../data/soundCatalog';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleAllNotifications(vakitler: VakitEntry[], settings: NotificationSettings) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const vakit of vakitler) {
    // Vakit zamanında uyarı
    const onTime = (settings.onTimeAlerts as any)[vakit.key];
    if (onTime && onTime.soundId !== 'none' && vakit.date.getTime() > Date.now()) {
      const sound = getSoundById(onTime.soundId);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${vakit.label} Vakti`,
          body: `${vakit.label} vakti girdi.`,
          sound: sound.id !== 'none' ? 'default' : undefined,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: vakit.date },
      });
    }

    // Vakitten önce uyarı
    const preAlert = (settings.preAlerts as any)[vakit.key];
    if (preAlert && preAlert.enabled && preAlert.soundId !== 'none') {
      const alertDate = new Date(vakit.date.getTime() - preAlert.minutesBefore * 60 * 1000);
      if (alertDate.getTime() > Date.now()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${vakit.label} Vaktine ${preAlert.minutesBefore} Dakika`,
            body: `${vakit.label} vaktine az kaldı.`,
            sound: 'default',
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: alertDate },
        });
      }
    }
  }
}
