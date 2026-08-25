// src/lib/notificationScheduler.ts
import * as Notifications from 'expo-notifications';
import { VakitEntry } from './prayerCalculator';
import { NotificationSettings } from '../context/NotificationSettingsContext';
import { getSoundById, SOUND_CATALOG } from '../data/soundCatalog';
import { DilKodu, VARSAYILAN_DIL, tDil, vakitAdiDil } from '../i18n/ceviriler';

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

// ÖNEMLİ — Android kanal/ses kısıtı:
// Android'de bir bildirim kanalı bir kez oluşturulduktan sonra o kanalın sesi
// ASLA değiştirilemez (platform kısıtı). `scheduleNotificationAsync` içindeki
// `content.sound` alanı Android 8+ üzerinde TAMAMEN YOK SAYILIR — gerçek ses
// her zaman bildirimin gönderildiği KANALDAN gelir. Bu yüzden her farklı ses
// dosyası için, hem titreşimli hem titreşimsiz varyantıyla, ayrı ve sabit bir
// kanal oluşturuyoruz. Kanal ID'si sesin kimliğini taşır: "snd-<soundId>-on/off".
// Yeni bir ses dosyası eklenirse, App güncellemesinde YENİ bir kanal ID'si
// kullanılmalı (var olan kanal asla değişmemeli) — aksi halde eski kullanıcılarda
// kanal sesi güncellenmez.
function channelIdFor(soundId: string, vibrationEnabled: boolean) {
  const suffix = vibrationEnabled ? 'on' : 'off';
  return `snd-${soundId}-${suffix}`;
}

const VAKTINDE_KIL_SOUND_IDS = ['bip', 'dong'] as const;

export async function configureAndroidChannels(dil: DilKodu = VARSAYILAN_DIL) {
  const titresimliEtiket = tDil(dil, 'titresimli');
  const titresimsizEtiket = tDil(dil, 'titresimsiz');

  // Genel bildirim sesleri kataloğu (Melodi, Uyandırma, Essalatu Hayrun, vb.)
  for (const s of SOUND_CATALOG) {
    if (s.id === 'none') continue;
    const soundFile = `${s.id}.wav`;
    await Notifications.setNotificationChannelAsync(channelIdFor(s.id, true), {
      name: `AzanAtlas — ${s.label} (${titresimliEtiket})`,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: soundFile,
    });
    await Notifications.setNotificationChannelAsync(channelIdFor(s.id, false), {
      name: `AzanAtlas — ${s.label} (${titresimsizEtiket})`,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0],
      sound: soundFile,
    });
  }

  // Vaktinde Kıl — Bip / Dong
  // Madde 7 (i18n taraması, bu tur): kanal adındaki "Vaktinde Kıl" ifadesi
  // daha önce hardcoded Türkçe idi — İngilizce arayüzde bile Android sistem
  // bildirim ayarlarında "Vaktinde Kıl" olarak görünüyordu. `t('vaktindeKil')`
  // zaten ORTAK bölümünde tanımlı ("Pray on Time" karşılığıyla), burada
  // `tDil()` ile aynı anahtar kullanılıyor.
  const vaktindeKilEtiket = tDil(dil, 'vaktindeKil');
  for (const soundId of VAKTINDE_KIL_SOUND_IDS) {
    const soundFile = `${soundId}.wav`;
    const soundEtiket = soundId === 'bip' ? tDil(dil, 'bip') : tDil(dil, 'dong');
    await Notifications.setNotificationChannelAsync(channelIdFor(soundId, true), {
      name: `AzanAtlas — ${vaktindeKilEtiket} ${soundEtiket} (${titresimliEtiket})`,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: soundFile,
    });
    await Notifications.setNotificationChannelAsync(channelIdFor(soundId, false), {
      name: `AzanAtlas — ${vaktindeKilEtiket} ${soundEtiket} (${titresimsizEtiket})`,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0],
      sound: soundFile,
    });
  }

  // Ses seçilmemiş (varsayılan sistem sesi) durumlar için genel kanal
  await Notifications.setNotificationChannelAsync('vibrate-on', {
    name: tDil(dil, 'bildirimleriTitresimli'),
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    sound: 'default',
  });
  await Notifications.setNotificationChannelAsync('vibrate-off', {
    name: tDil(dil, 'bildirimleriTitresimsiz'),
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0],
    sound: 'default',
  });
}

// Belirli bir soundId için doğru kanalı döndürür.
// Not: çağıranlar 'none' durumunda bildirimi zaten hiç planlamıyor,
// bu yüzden burada 'none' için ayrıca bir kanal tanımlanmadı.
export function getChannelForSound(soundId: string, vibrationEnabled: boolean): string {
  return channelIdFor(soundId, vibrationEnabled);
}

function getChannelId(vibrationEnabled: boolean) {
  return vibrationEnabled ? 'vibrate-on' : 'vibrate-off';
}

const EZAN_DUASI =
  "Allahümme Rabbe hazihi'd-da'veti't-tâmmeh, ve's-salâti'l-kâimeh, âti Muhammedeni'l-vasîlete ve'l-fadîleh, veb'ashü makâmen mahmûdenillezî vaadteh.";

export async function scheduleAllNotifications(
  vakitler: VakitEntry[],
  settings: NotificationSettings,
  kerahatMinutes: number,
  vibrationEnabled: boolean,
  dil: DilKodu = VARSAYILAN_DIL
) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const defaultChannelId = getChannelId(vibrationEnabled);

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
        const channelId = getChannelForSound(sound.id, vibrationEnabled);
        const vakitAdi = vakitAdiDil(dil, vakit.key as any);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: tDil(dil, 'bildirimVaktiBaslik', vakitAdi),
            body: settings.ezanDuasiEnabled ? EZAN_DUASI : tDil(dil, 'bildirimVaktiGirdiGovde', vakitAdi),
            sound: `${sound.id}.wav`,
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate, channelId },
        });
      }
    }

    const preAlert = (settings.preAlerts as any)[vakit.key];
    if (preAlert && preAlert.enabled && preAlert.soundId !== 'none') {
      const alertDate = new Date(vakit.date.getTime() - preAlert.minutesBefore * 60 * 1000);
      if (alertDate.getTime() > Date.now()) {
        const sound = getSoundById(preAlert.soundId);
        const channelId = getChannelForSound(sound.id, vibrationEnabled);
        const vakitAdi = vakitAdiDil(dil, vakit.key as any);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: tDil(dil, 'bildirimOnUyariBaslik', vakitAdi, preAlert.minutesBefore),
            body: tDil(dil, 'bildirimOnUyariGovde', vakitAdi),
            sound: `${sound.id}.wav`,
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: alertDate, channelId },
        });
      }
    }
  }

  if (settings.kerahatNotifyEnabled) {
    if (gunes && gunes.date.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: { title: tDil(dil, 'kerahatVaktiBaslik'), body: tDil(dil, 'kerahatGunesDoarken'), sound: 'default' },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: gunes.date, channelId: defaultChannelId },
      });
    }
    if (aksam) {
      const d = new Date(aksam.date.getTime() - kerahatMinutes * 60 * 1000);
      if (d.getTime() > Date.now()) {
        await Notifications.scheduleNotificationAsync({
          content: { title: tDil(dil, 'kerahatVaktiBaslik'), body: tDil(dil, 'kerahatGunesBatarken'), sound: 'default' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: d, channelId: defaultChannelId },
        });
      }
    }
    // Madde 5 (bu tur): kullanıcı isteğiyle ZEVAL VAKTİ bildirimi
    // KALDIRILDI — Güneş doğarken/batarken kerahat bildirimlerine (yukarıda,
    // bu if bloğunun içinde) DOKUNULMADI, onlar aynen çalışmaya devam
    // ediyor. Kod silinmedi, yalnızca yorum satırına alındı; kullanıcı
    // ileride tekrar açmak isteyebilir.
    //
    // if (ogle) {
    //   const d = new Date(ogle.date.getTime() - 10 * 60 * 1000);
    //   if (d.getTime() > Date.now()) {
    //     await Notifications.scheduleNotificationAsync({
    //       content: { title: tDil(dil, 'kerahatVaktiBaslik'), body: tDil(dil, 'kerahatZeval'), sound: 'default' },
    //       trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: d, channelId: defaultChannelId },
    //     });
    //   }
    // }
  }
}
