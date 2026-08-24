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
// TASARIM KARARI: "KOMPAKT ŞERİT" (kullanıcının 3 varyant arasından seçtiği)
//
// Önceki tasarımın ASIL sorunu: "AzanAtlas" adı yalnızca veri YOKKEN
// (aşağıdaki boş durum) gösteriliyordu — widget veriyle dolunca marka adı
// TAMAMEN kayboluyordu. Bu paket bunu düzeltiyor: marka adı artık DOLU
// durumda da en üstte, kalın ve belirgin duruyor (Muslim Pro'daki gibi).
//
// İkinci düzeltme: ilk "Kompakt Şerit" denemesinde 7 vakit TEK satıra
// sığdırılmaya çalışılıyordu, bu da dar widget boyutlarında Güneş ve
// Yatsı'nın kesilmesine/görünmemesine yol açtı (kullanıcı geri bildirimi).
// Widget'lar (react-native-android-widget) KAYDIRMA desteklemez — her şey
// tek bakışta, kesilmeden sığmalı. Çözüm: yedi vakit artık TEK satır değil,
// kronolojik sırayla 4+3'lük İKİ SATIRLIK bir ızgarada — böylece hiçbiri
// kesilmiyor, her hücre okunaklı kalıyor.
//
// Renkler doğrudan `theme.ts`'teki aktif paletten alınıyor — Ana Sayfa'nın
// koyu hero kartıyla aynı `primary`/`primaryDark` zemin ve `copperLight`
// vurgu kullanılıyor, böylece widget uygulamanın küçük bir uzantısı gibi
// duruyor.
//
// ─────────────────────────────────────────────────────────────────────────────
// CANLI GEZ SAYIM NEDEN YOK?
//
// `react-native-android-widget` React ağacını bir RESME dönüştürüp gösteriyor;
// Android işletim sistemi widget güncellemesini 30 dakikadan sık işlemiyor.
// Bu yüzden widget akan bir sayaç DEĞİL, "şu an hangi vakitteyiz + bugünün
// tam listesi" gösteren STATİK bir görünüm sunuyor (Muslim Pro'nun widget'ı
// da aynı sınırlamayla statiktir). Bu yüzden üst şeritte de bir "şu anki
// saat" göstergesi YOK — 30 dakikaya kadar bayatlayabilecek bir saat,
// kullanıcıyı yanıltır; onun yerine konum bilgisi gösteriliyor.

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

// Kronolojik sırayla 4 + 3 — hiçbir vakit atlanmıyor (Güneş ve Yatsı dahil).
const UST_SIRA: string[] = ['imsak', 'sabah', 'gunes', 'ogle'];
const ALT_SIRA: string[] = ['ikindi', 'aksam', 'yatsi'];

function VakitHucresi({
  v,
  C,
}: {
  v: { key: string; saat: string; aktif: boolean } | undefined;
  C: Record<string, string>;
}) {
  if (!v) {
    // Alt sırada 3 hücre olduğu için boş bir dördüncü hücre bırakılıyor,
    // ızgara hizası bozulmasın diye (görünmez, aynı genişlikte).
    return <FlexWidget style={{ flex: 1 }} />;
  }
  return (
    <FlexWidget
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 4,
        marginHorizontal: 2,
        backgroundColor: v.aktif ? C.primary : 'transparent',
        borderRadius: 8,
      }}
    >
      <TextWidget
        text={GUN_KISALTMA[v.key] ?? v.key}
        style={{
          color: v.aktif ? C.textOnDark : C.textOnDarkMuted,
          fontSize: 10,
          fontWeight: v.aktif ? 'bold' : 'normal',
        }}
        maxLines={1}
      />
      <TextWidget
        text={v.saat}
        style={{
          color: v.aktif ? C.copperLight : C.textOnDark,
          fontSize: 12,
          fontWeight: 'bold',
        }}
        maxLines={1}
      />
    </FlexWidget>
  );
}

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

  const bul = (key: string) => veri.vakitler.find((v) => v.key === key);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: C.primaryDark,
        borderRadius: 16,
        padding: 10,
        flexDirection: 'column',
      }}
    >
      {/* Marka adı — DOLU durumda da her zaman görünür, en üstte ve kalın
          (önceki tasarımın asıl eksiği buydu). */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <TextWidget
          text="AzanAtlas"
          style={{ color: C.copperLight, fontSize: 14, fontWeight: 'bold' }}
          maxLines={1}
        />
        <TextWidget
          text={veri.hicriEtiketi}
          style={{ color: C.textOnDarkMuted, fontSize: 9 }}
          maxLines={1}
        />
      </FlexWidget>

      {/* İkinci satır — konum */}
      <TextWidget
        text={veri.konumEtiketi}
        style={{ color: C.textOnDark, fontSize: 10 }}
        maxLines={1}
      />

      {/* Yedi vaktin TAMAMI — 4 + 3'lük iki satırlık ızgara, hiçbiri
          kesilmiyor (Güneş ve Yatsı dahil). Aktif vakit vurgulanır. */}
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'column', marginTop: 6 }}>
        <FlexWidget style={{ width: 'match_parent', flexDirection: 'row' }}>
          {UST_SIRA.map((key) => (
            <VakitHucresi key={key} v={bul(key)} C={C} />
          ))}
        </FlexWidget>
        <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', marginTop: 2 }}>
          {ALT_SIRA.map((key) => (
            <VakitHucresi key={key} v={bul(key)} C={C} />
          ))}
          <VakitHucresi v={undefined} C={C} />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
