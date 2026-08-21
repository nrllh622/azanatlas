import { registerRootComponent } from 'expo';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { handleMarkPrayedAction, MARK_PRAYED_ACTION } from './src/lib/vaktindeKilActions';

import App from './App';

// ÖNEMLİ: Bu görev, uygulama TAMAMEN KAPALIYKEN (killed state) "Kıldım"
// butonuna basıldığında da çalışabilmesi için modül düzeyinde (component
// ağacının dışında) tanımlanıyor. `Notifications.addNotificationResponseReceivedListener`
// yalnızca JS/React ortamı hafızada canlıyken tetiklenir; uygulama tamamen
// kapatıldığında o listener hiç çalışmaz. Bu native arka plan görevi ise
// process kapalı olsa bile Android tarafından tetiklenir — "Kıldım"
// butonunun her durumda çalışmasını sağlayan asıl mekanizma budur.
const BACKGROUND_NOTIFICATION_TASK = 'AZANATLAS_BACKGROUND_NOTIFICATION_TASK';

// Tüm blok try/catch içinde: bu kod UYGULAMA AÇILMADAN ÖNCE, modül yüklenirken
// çalışıyor. Expo Go gibi arka plan bildirim görevini desteklemeyen ortamlarda
// `defineTask` hata fırlatırsa, yakalanmadığı takdirde uygulama hiç açılmaz
// (beyaz ekran). Bu özellik olmadan da uygulamanın geri kalanı çalışmalı.
try {
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
    if (error) return;

    // expo-notifications, aksiyon butonuna basıldığında `data` alanına bir
    // NotificationResponse nesnesi koyar: { actionIdentifier, notification }.
    // Düz bir bildirim teslimatında ise bu alan bulunmaz — ayırt edici kontrol budur.
    const isNotificationResponse = !!data && 'actionIdentifier' in (data as any);
    if (!isNotificationResponse) return;

    const response = data as unknown as { actionIdentifier: string; notification: any };
    if (response.actionIdentifier !== MARK_PRAYED_ACTION) return;

    const content = response.notification?.request?.content?.data;
    await handleMarkPrayedAction(content);
  });

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK).catch(() => {
    // Expo Go'da veya bu görev tipini desteklemeyen ortamlarda kayıt başarısız
    // olabilir — bu durumda uygulama açıkken çalışan foreground listener
    // (HomeScreen) yine devrede kalır, sadece killed-state avantajı kaybolur.
  });
} catch {
  // Aynı gerekçe: arka plan görevi kurulamazsa uygulama yine de açılmalı.
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
