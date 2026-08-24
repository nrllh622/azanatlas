// src/lib/vaktindeKilScheduler.ts
import * as Notifications from 'expo-notifications';
import { VakitEntry } from './prayerCalculator';
import { VaktindeKilSound } from '../context/VaktindeKilContext';
import { VAKTINDE_KIL_CATEGORY } from './vaktindeKilActions';
import { getChannelForSound } from './notificationScheduler';
import { kayitlariYukle, gununVakitleri, takipEdilebilir, TakipVakti } from './ibadetTakibi';
import { DilKodu, VARSAYILAN_DIL, tDil, vakitAdiDil } from '../i18n/ceviriler';

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

/**
 * Bu vakit, bu gün için ZATEN KILINDI olarak işaretlenmiş mi?
 *
 * Kaynak, kullanıcının "Kıldım" dediği anda yazılan kalıcı ibadet takibi
 * kaydıdır. Bildirimlerin iptal edilmiş olması TEK BAŞINA yeterli bir hafıza
 * değildir — iptal yalnızca o anki zamanlanmış bildirimleri siler; sonraki
 * bir yeniden planlama onları geri getirir.
 */
async function buVakitKilindiMi(vakit: VakitEntry): Promise<boolean> {
  if (!takipEdilebilir(vakit.key)) return false;
  try {
    const kayitlar = await kayitlariYukle();
    return gununVakitleri(kayitlar, vakit.date).includes(vakit.key as TakipVakti);
  } catch {
    // Depolama okunamazsa hatırlatmayı kurmaya devam et — kullanıcıyı sessizce
    // hatırlatmasız bırakmaktansa fazladan hatırlatmak yeğdir.
    return false;
  }
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 * HATA DÜZELTMESİ — "Kıldım'a bastım ama bildirim gelmeye devam etti"
 *
 * Önceki akış:
 *   1. Kullanıcı "Kıldım"a basar → o vakte ait bildirimler iptal edilir. ✓
 *   2. Uygulama öne gelir / ayar değişir → HomeScreen useEffect yeniden
 *      çalışır → scheduleVaktindeKil çağrılır → AYNI vakit için hatırlatmalar
 *      SIFIRDAN yeniden kurulur. ✗
 *
 * Yani iptal doğruydu ama KALICI DEĞİLDİ: zamanlayıcı, kullanıcının o vakti
 * kıldığını bilmediği için iptal edilenleri geri getiriyordu. "Buton hiç
 * çalışmıyor" görünmesinin sebebi buydu.
 *
 * Çözüm: planlamadan ÖNCE kalıcı takip kaydına bak; kılınmışsa hiç kurma.
 * ─────────────────────────────────────────────────────────────────────────
 */
export async function scheduleVaktindeKil(
  current: VakitEntry,
  next: VakitEntry,
  firstDelayMinutes: number,
  repeatIntervalMinutes: number,
  sound: VaktindeKilSound,
  vibrationEnabled: boolean,
  dil: DilKodu = VARSAYILAN_DIL
) {
  await cancelExistingVaktindeKilNotifications();

  // Kullanıcı bu vakti kıldıysa hatırlatma kurulmaz.
  if (await buVakitKilindiMi(current)) return;

  const start = new Date(current.date.getTime() + firstDelayMinutes * 60 * 1000);
  const end = next.date;
  let t = start;
  let count = 0;
  const channelId = getChannelForSound(sound, vibrationEnabled);
  const soundFile = `${sound}.wav`;
  const vakitDateISO = current.date.toISOString();

  const vakitAdi = vakitAdiDil(dil, current.key as any);

  while (t.getTime() < end.getTime() && count < 20) {
    if (t.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: tDil(dil, 'vaktindeKilBaslik', vakitAdi),
          body: tDil(dil, 'vaktindeKilGovde', vakitAdi),
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


/**
 * Bir vakit UYGULAMA İÇİNDEN "kılındı" işaretlendiğinde çağrılır: o vakte ait
 * bekleyen hatırlatmaları ve ekranda duran bildirimleri anında kaldırır.
 *
 * Buna neden ayrıca ihtiyaç var: kullanıcı vakti uygulama içinden
 * işaretlediğinde `handleMarkPrayedAction` (bildirim aksiyonu) çalışmaz.
 * Bu fonksiyon olmadan, zaten kılınmış bir vakit için hatırlatmalar bir
 * sonraki yeniden planlamaya kadar gelmeye devam ederdi.
 */
export async function cancelVaktindeKilForVakit(vakitKey: string, vakitDate: Date) {
  try {
    const hedefISO = vakitDate.toISOString();
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      const d = n.content.data as any;
      if (d && d.type === 'vaktindekil' && d.vakitKey === vakitKey && d.vakitDateISO === hedefISO) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }
    const gosterilen = await Notifications.getPresentedNotificationsAsync();
    for (const n of gosterilen) {
      const d = n.request.content.data as any;
      if (d && d.type === 'vaktindekil' && d.vakitKey === vakitKey && d.vakitDateISO === hedefISO) {
        await Notifications.dismissNotificationAsync(n.request.identifier);
      }
    }
  } catch {
    // Bildirim API'si kullanılamıyorsa işaretleme yine de geçerli kalmalı.
  }
}
