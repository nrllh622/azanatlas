// src/widget/widgetTaskHandler.ts
//
// WIDGET GÖREV YÖNETİCİSİ
//
// `react-native-android-widget`, widget'ın her güncellenmesi/eklenmesi/
// kaldırılması gerektiğinde bu fonksiyonu çağırır. Gerçek bir React Native
// ortamında (component ağacı, context, navigasyon) ÇALIŞMAZ — bu yüzden
// yalnızca `widgetVeriDeposu.ts` üzerinden AsyncStorage okuyor ve palet
// adını okuyup `AzanAtlasWidget`'ı doğrudan render ediyor.
//
// ÖNEMLİ: Bu handler'ın kayıt edilmesi (`index.ts`'te) native
// `expo-widgets`/`react-native-android-widget` config plugin'i olmadan
// (yani Expo Go'da) etkisizdir — Android bu görevi hiç tetiklemez, hata da
// vermez. `npx expo run:android` ile development build alındığında devreye
// girer.

import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { AzanAtlasWidget } from './AzanAtlasWidget';
import { widgetVerisiniOku } from '../lib/widgetVeriDeposu';
import { kayitliTemayiOku } from '../lib/temaDeposu';

const WIDGET_ADI = 'AzanAtlasWidget';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const [veri, paletAdi] = await Promise.all([
    widgetVerisiniOku(),
    kayitliTemayiOku(),
  ]);

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      props.renderWidget(React.createElement(AzanAtlasWidget, { veri, paletAdi }));
      break;
    case 'WIDGET_DELETED':
      // Temizlenecek bir kaynak yok — veri deposu diğer widget örnekleri
      // için de paylaşıldığından silinmiyor.
      break;
    case 'WIDGET_CLICK':
      // Widget'a dokunma davranışı (ör. uygulamayı açma) ileride
      // `clickAction` ile eklenebilir; şimdilik widget yalnızca bilgi
      // gösteriyor.
      break;
    default:
      break;
  }
}

export { WIDGET_ADI };
