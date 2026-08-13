// src/lib/notificationScheduler.ts
import * as Notifications from 'expo-notifications';
import { VakitEntry } from './prayerCalculator';
import { NotificationSettingsMap } from '../context/NotificationSettingsContext';

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

// Bugünün ve yarının vakitlerini, kullanıcı tercihine göre zamanlanmış
// bildirim olarak kur. Her çağrıda önce eski zamanlamalar temizlenir,
// böylece konum/vakit değiştiğinde çakışma olmaz.
export async function scheduleAllNotifications(
  vakitler: VakitEntry[],
  settings: NotificationSettingsMap
) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const vakit of vakitler) {
    const setting = settings[vakit.key];
    if (!setting || setting.mode === 'none') continue;
    if (vakit.date.getTime() <= Date.now()) continue; // geçmiş vakit için kurma

    const playsSound = setting.mode !== 'silent';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${vakit.label} Vakti`,
        body: `${vakit.label} vakti girdi.`,
        sound: playsSound ? 'default' : undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: vakit.date,
      },
    });
  }
}
