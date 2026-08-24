import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import {
  handleMarkPrayedAction,
  handleDismissReminderAction,
  MARK_PRAYED_ACTION,
  DISMISS_ACTION,
} from './src/lib/vaktindeKilActions';

import App from './App';

// ─────────────────────────────────────────────────────────────────────────────
// ANA EKRAN WIDGET'I — GÖREV KAYDI
//
// `registerWidgetTaskHandler`, `react-native-android-widget`'ın native config
// plugin'i (AndroidManifest.xml girişi) OLMADAN, yani Expo Go'da veya bu
// paket henüz derlenmemiş bir build'de çağrılırsa modül bulunamadığı için
// hata fırlatabilir. Bu try/catch, "Kıldım" bildirim görevindeki aynı
// desenle, widget kurulu olmayan ortamlarda uygulamanın normal açılmaya
// devam etmesini garanti ediyor — widget yalnızca `npx expo run:android`
// ile alınan bir development build'de fiilen çalışır.
try {
  // `require` bilinçli tercih: statik `import` derleme zamanında çözülür ve
  // paket eksikse try/catch onu YAKALAYAMAZ; `require` ise çalışma zamanında
  // çözüldüğü için burada güvenle yakalanabiliyor.
  // @ts-ignore — react-native-android-widget'ın tipleri yalnızca native
  // build kurulu olduğunda çözülür; Expo Go geliştirmesinde de derlensin diye
  // dinamik require + ts-ignore kullanıldı.
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  // @ts-ignore
  const { widgetTaskHandler } = require('./src/widget/widgetTaskHandler');
  registerWidgetTaskHandler(widgetTaskHandler);
} catch {
  // Widget native modülü mevcut değil (Expo Go ya da henüz derlenmemiş
  // build) — sessizce geçiliyor, uygulamanın geri kalanı etkilenmiyor.
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPO GO UYARISINI SUSTUR
//
// expo-notifications, SADECE import edildiğinde Expo Go'da şu hatayı basıyor:
//   "Android Push notifications (remote notifications) ... removed from Expo Go"
//
// Bu uyarı bizim için ANLAMSIZ: uygulama uzak (push) bildirim kullanmıyor,
// yalnızca cihazda zamanlanan YEREL bildirimler kullanıyor ve onlar Expo Go'da
// sorunsuz çalışıyor. Uyarı, kütüphanenin kendi içindeki otomatik push-token
// kaydından geliyor (PushTokenAutoRegistration) ve engellenemiyor.
//
// Kırmızı hata ekranı geliştirme sırasında gerçek hataları gizlediği için
// yalnızca BU mesajı filtreliyoruz — diğer tüm hatalar görünmeye devam ediyor.
// ─────────────────────────────────────────────────────────────────────────────
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
]);

// LogBox bazı sürümlerde console.error kaynaklı kırmızı katmanı yakalamıyor;
// bu yüzden aynı mesajı console seviyesinde de süzüyoruz. Filtre metin
// eşleşmesiyle çalışıyor, başka hiçbir hatayı bastırmıyor.
const _origConsoleError = console.error;
console.error = (...args: any[]) => {
  const ilk = typeof args[0] === 'string' ? args[0] : '';
  if (ilk.includes('expo-notifications: Android Push notifications')) return;
  _origConsoleError(...args);
};

// ÖNEMLİ: Bu görev, uygulama TAMAMEN KAPALIYKEN (killed state) "Kıldım" ya
// da "Sonra hatırlat" butonuna basıldığında da çalışabilmesi için modül
// düzeyinde (component ağacının dışında) tanımlanıyor.
// `Notifications.addNotificationResponseReceivedListener` yalnızca JS/React
// ortamı hafızada canlıyken tetiklenir; uygulama tamamen kapatıldığında o
// listener hiç çalışmaz. Bu native arka plan görevi ise process kapalı olsa
// bile Android tarafından tetiklenir — her iki butonun da her durumda
// çalışmasını (ve aynı vakte ait diğer bildirim eşlerini kapatmasını)
// sağlayan asıl mekanizma budur.
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
    const content = response.notification?.request?.content?.data;

    if (response.actionIdentifier === MARK_PRAYED_ACTION) {
      await handleMarkPrayedAction(content);
    } else if (response.actionIdentifier === DISMISS_ACTION) {
      await handleDismissReminderAction(content);
    }
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
