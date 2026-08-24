// src/widget/AzanAtlasWidget.tsx
//
// ANA EKRAN WIDGET'I
//
// ─────────────────────────────────────────────────────────────────────────────
// NEDEN BU KÜTÜPHANE?
//
// Expo'nun resmî `expo-widgets` paketi yalnızca iOS'u destekliyor. Android
// widget için Kotlin/XML yazmaya gerek kalmadan TSX ile widget tanımlamayı
// sağlayan `react-native-android-widget` kullanıldı (bkz. devir notları).
//
// Bu dosya widget'ın GÖRÜNÜMÜNÜ tanımlar — normal bir React bileşeni gibi
// yazılır ama `View`/`Text` yerine bu kütüphanenin kendi `FlexWidget`/
// `TextWidget` bileşenleri kullanılır; kütüphane bunları arka planda native
// Android RemoteViews'a çeviriyor.
//
// ─────────────────────────────────────────────────────────────────────────────
// TASARIM KARARI: HEM ANA SAYFA UYUMLU HEM SADE
//
// Renkler doğrudan `theme.ts`'teki aktif paletten alınıyor — Ana Sayfa'nın
// koyu hero kartıyla aynı `primary`/`primaryDark` zemin ve `copperLight`
// vurgu kullanılıyor, böylece widget uygulamanın küçük bir uzantısı gibi
// duruyor. Ama Muslim Pro'daki gibi TEK amaca odaklı: yalnızca vakit adı +
// saat listesi, dekoratif öge yok — kalabalık değil, en hızlı okunan liste.
//
// Muslim Pro'nun widget'ı 5 vakit gösteriyor (İmsak ve Güneş hariç);
// kullanıcı isteği üzerine burada YEDİ vaktin TAMAMI gösteriliyor.
//
// ─────────────────────────────────────────────────────────────────────────────
// CANLI GEZ SAYIM NEDEN YOK?
//
// `react-native-android-widget` React ağacını bir RESME dönüştürüp gösteriyor;
// Android işletim sistemi widget güncellemesini 30 dakikadan sık işlemiyor.
// Bu yüzden widget akan bir sayaç DEĞİL, "şu an hangi vakitteyiz + bugünün
// tam listesi" gösteren STATİK bir görünüm sunuyor (Muslim Pro'nun widget'ı
// da aynı sınırlamayla statiktir).

import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { PALETLER, PaletAdi, VARSAYILAN_PALET } from '../theme';
import type { WidgetVakitVerisi } from '../lib/widgetVeriDeposu';

interface Props {
  veri: WidgetVakitVerisi | null;
  paletAdi: PaletAdi;
}

const GUN_KISALTMA: Record<string, string> = {
  imsak: 'İmsak', sabah: 'Sabah', gunes: 'Güneş', ogle: 'Öğle',
  ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı',
};

export function AzanAtlasWidget({ veri, paletAdi }: Props) {
  const palet = PALETLER[paletAdi] ?? PALETLER[VARSAYILAN_PALET];
  const C = palet.renkler;

  if (!veri) {
    return (
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: C.primaryDark,
          borderRadius: 16,
          padding: 14,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextWidget
          text="AzanAtlas"
          style={{ color: C.textOnDark, fontSize: 14, fontWeight: 'bold' }}
        />
        <TextWidget
          text="Uygulamayı açıp vakitleri yükleyin"
          style={{ color: C.textOnDarkMuted, fontSize: 11, marginTop: 4 }}
        />
      </FlexWidget>
    );
  }

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: C.primaryDark,
        borderRadius: 16,
        padding: 12,
        flexDirection: 'column',
      }}
    >
      {/* Üst şerit — konum + tarih, ana sayfanın küçük özeti */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 6,
        }}
      >
        <TextWidget
          text={veri.konumEtiketi}
          style={{ color: C.textOnDark, fontSize: 13, fontWeight: 'bold' }}
          maxLines={1}
        />
        <TextWidget
          text={veri.hicriEtiketi}
          style={{ color: C.copperLight, fontSize: 10 }}
          maxLines={1}
        />
      </FlexWidget>

      {/* Yedi vaktin tamamı — tek satır liste, aktif vakit vurgulanır */}
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'column' }}>
        {veri.vakitler.map((v) => (
          <FlexWidget
            key={v.key}
            style={{
              width: 'match_parent',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 3,
              backgroundColor: v.aktif ? C.primary : 'transparent',
              borderRadius: 8,
              paddingHorizontal: v.aktif ? 6 : 0,
            }}
          >
            <TextWidget
              text={GUN_KISALTMA[v.key] ?? v.key}
              style={{
                color: v.aktif ? C.textOnDark : C.textOnDarkMuted,
                fontSize: 12,
                fontWeight: v.aktif ? 'bold' : 'normal',
              }}
            />
            <TextWidget
              text={v.saat}
              style={{
                color: v.aktif ? C.copperLight : C.textOnDarkMuted,
                fontSize: 12,
                fontWeight: 'bold',
              }}
            />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}
