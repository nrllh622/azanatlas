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
// Bu yüzden widget akan bir sayaç DEĞİL, veri okunduğu anda statik olarak
// hesaplanan "~X sa Y dk kaldı" gösteren bir anlık görüntü sunuyor (Muslim
// Pro'nun widget'ı da aynı sınırlamayla statiktir).
//
// DÜZELTME (madde 7, 6. tur) — TASARIM DEĞİŞTİ: "KOMPAKT ŞERİT" (7 vaktin
// tamamı) TAMAMEN KALDIRILDI. Kullanıcı açıkça widget'ın SADECE sıradaki
// vakit + (statik) geri sayımı göstermesini istedi — detaylar (aylık
// imsakiye, kaza takibi, tesbih vb.) widget'ta YOK, widget'a dokununca
// uygulama açılıyor (`clickAction: 'OPEN_APP'`). Bunun iki gerekçesi var:
// (1) kullanıcının kendi tercihi, (2) reklam geliri — widget'tan hiç
// uygulamaya girmeden bilgi almak reklam gösterimini sıfırlıyordu; artık
// widget'a her dokunuş uygulamayı açan doğal bir "geri çağırma" kapısı
// (bkz. proje kökündeki madde 8-9 araştırma notu).
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { PALETLER, PaletAdi, VARSAYILAN_PALET } from '../theme';
import type { WidgetVakitVerisi } from '../lib/widgetVeriDeposu';
import { siradakiVakitiBul } from '../lib/widgetVeriDeposu';

interface Props {
  veri: WidgetVakitVerisi | null;
  paletAdi: PaletAdi;
}

// `react-native-android-widget`in `style.color`/`style.backgroundColor`
// prop'ları kendi dar `ColorProp` tipini bekliyor; `theme.ts`teki palet
// renkleri (`'#073634'` gibi) çalışma zamanında tamamen geçerli hex
// string'ler ama TypeScript tarafında genel `string` olarak çıkarsanıyor,
// bu yüzden `tsc --noEmit` tip uyuşmazlığı veriyor. Gerçek bir hata değil,
// sadece tip daraltma sorunu — kaynağında (`palet.renkler`) tip değiştirmek
// yerine, kullanım noktasında dar bir yardımcıyla güvenle daraltıyoruz.
const wc = (renk: string) => renk as any;

const VAKIT_ADI: Record<string, string> = {
  imsak: 'İmsak', sabah: 'Sabah', gunes: 'Güneş', ogle: 'Öğle',
  ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı',
};

function kalanSureMetni(dakika: number): string {
  if (dakika <= 0) return '';
  const saat = Math.floor(dakika / 60);
  const dk = dakika % 60;
  if (saat <= 0) return `${dk} dk kaldı`;
  if (dk === 0) return `${saat} sa kaldı`;
  return `${saat} sa ${dk} dk kaldı`;
}

export function AzanAtlasWidget({ veri, paletAdi }: Props) {
  const palet = PALETLER[paletAdi] ?? PALETLER[VARSAYILAN_PALET];
  const C = palet.renkler;

  // Boş durum da dahil, TÜM widget dokununca uygulamayı açıyor.
  if (!veri) {
    return (
      <FlexWidget
        clickAction="OPEN_APP"
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: wc(C.primaryDark),
          borderRadius: 16,
          padding: 14,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextWidget
          text="AzanAtlas"
          style={{ color: wc(C.textOnDark), fontSize: 14, fontWeight: 'bold' }}
        />
        <TextWidget
          text="Vakitleri yüklemek için dokunun"
          style={{ color: wc(C.textOnDarkMuted), fontSize: 11, marginTop: 4 }}
        />
      </FlexWidget>
    );
  }

  const siradaki = siradakiVakitiBul(veri);
  const vakitAdi = siradaki ? (VAKIT_ADI[siradaki.key] ?? siradaki.key) : '';
  const kalanMetin = siradaki ? kalanSureMetni(siradaki.kalanDakika) : '';

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: wc(C.primaryDark),
        borderRadius: 16,
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Marka adı + konum — tek satır, üstte, küçük. */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <TextWidget
          text="AzanAtlas"
          style={{ color: wc(C.copperLight), fontSize: 13, fontWeight: 'bold' }}
          maxLines={1}
        />
        <TextWidget
          text={veri.konumEtiketi}
          style={{ color: wc(C.textOnDarkMuted), fontSize: 10 }}
          maxLines={1}
        />
      </FlexWidget>

      {/* SIRADAKİ VAKİT — tek, büyük, net odak noktası. */}
      <TextWidget
        text={vakitAdi}
        style={{ color: wc(C.textOnDarkMuted), fontSize: 12, fontWeight: 'normal' }}
        maxLines={1}
      />
      <TextWidget
        text={siradaki?.saat ?? '—'}
        style={{ color: wc(C.textOnDark), fontSize: 30, fontWeight: 'bold' }}
        maxLines={1}
      />

      {/* Statik "kalan süre" — canlı sayaç değil, veri yenilendiğinde
          tazelenen bir anlık görüntü (bkz. dosya başındaki gerekçe). */}
      {!!kalanMetin && (
        <TextWidget
          text={kalanMetin}
          style={{ color: wc(C.copperLight), fontSize: 13, fontWeight: 'bold', marginTop: 2 }}
          maxLines={1}
        />
      )}
    </FlexWidget>
  );
}
