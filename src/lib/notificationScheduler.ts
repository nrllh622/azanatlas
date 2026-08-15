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

// Titreşim ayarı gerçekten uygulanıyor (Android bildirim kanalı üzerinden).
// "Cihazı yüzüstü çevirdiğinde sesi kapat" ve "Bildirim Çubuğu Widgeti" şu an
// sadece ayar olarak saklanıyor — tam otomasyonları native modül gerektiriyor,
// ayrı bir pakette ele alınacak.
export async function configureAndroidChannel(vibrationEnabled: boolean) {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'AzanAtlas Bildirimleri',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: vibrationEnabled ? [0, 250, 250, 250] : [0],
    sound: 'default',
  });
}

const EZAN_DUASI =
  "Allahümme Rabbe hazihi'd-da'veti't-tâmmeh, ve's-salâti'l-kâimeh, âti Muhammedeni'l-vasîlete ve'l-fadîleh, veb'ashü makâmen mahmûdenillezî vaadteh.";

export async function scheduleAllNotifications(
  vakitler: VakitEntry[],
  settings: NotificationSettings,
  kerahatMinutes: number
) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const imsak = vakitler.find((v) => v.key === 'imsak');
  const gunes = vakitler.find((v) => v.key === 'gunes');
  const ogle = vakitler.find((v) => v.key === 'ogle');
  const aksam = vakitler.find((v) => v.key === 'aksam');

  for (const vakit of vakitler) {
    const onTime = (settings.onTimeAlerts as any)[vakit.key];
    if (onTime && onTime.enabled && onTime.soundId !== 'none') {
      let triggerDate = vakit.date;
      if (vakit.key === 'sabah' && settings.sabahAtImsakVaktinde && imsak) {
        triggerDate = imsak.date;
      }
      if (triggerDate.getTime() > Date.now()) {
        const sound = getSoundById(onTime.soundId);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${vakit.label} Vakti`,
            body: settings.ezanDuasiEnabled ? EZAN_DUASI : `${vakit.label} vakti girdi.`,
            sound: sound.id !== 'none' ? 'default' : undefined,
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
        });
      }
    }

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

  if (settings.kerahatNotifyEnabled) {
    if (gunes && gunes.date.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Kerahat Vakti', body: 'Güneş doğarken namaz kılınması mekruhtur.', sound: 'default' },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: gunes.date },
      });
    }
    if (aksam) {
      const d = new Date(aksam.date.getTime() - kerahatMinutes * 60 * 1000);
      if (d.getTime() > Date.now()) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Kerahat Vakti', body: 'Güneş batarken namaz kılınması mekruhtur.', sound: 'default' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: d },
        });
      }
    }
    if (ogle) {
      const d = new Date(ogle.date.getTime() - 10 * 60 * 1000);
      if (d.getTime() > Date.now()) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Kerahat Vakti', body: 'Zeval vakti — namaz kılınması mekruhtur.', sound: 'default' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: d },
        });
      }
    }
  }
}
