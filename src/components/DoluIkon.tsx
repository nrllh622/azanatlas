// src/components/DoluIkon.tsx
//
// DOLGULU RENKLİ İKON SETİ
//
// ─────────────────────────────────────────────────────────────────────────────
// NEDEN AYRI BİR SET?
//
// `Icon.tsx` içindeki ince çizgi ikonlar liste satırlarında ve küçük
// boyutlarda doğru tercih — sade ve okunaklılar. Ama Ana Sayfa'daki dört
// hızlı buton, Keşfet ızgarası ve alt navigasyon gibi yerlerde tek renkli
// ince çizgi "ne olduğu anlaşılmıyor" geri bildirimini aldı.
//
// Bu dosya o yerler için DOLGULU, ÇOK TONLU ikonlar sunar: her ikon 2-3
// renk katmanından oluşur (gövde + vurgu + ışık), böylece uzaktan bakınca
// bile silueti okunur. Muslim Pro'nun renkli görsel etkisini verir ama:
//   • PNG değil, SVG — uygulama boyutunu artırmaz (dosya ~8 KB toplam)
//   • Emoji değil — her cihazda AYNI görünür ve palete uyumludur
//   • Renkleri temadan alır; palet değişince ikonlar da değişir
//
// PERFORMANS: Her ikon 4-9 SVG düğümü. Ana Sayfa'da 4, Keşfet'te 10, alt
// navigasyonda 5 tane kullanılıyor — toplam ~150 düğüm. React Native'in
// rahatlıkla kaldırdığı bir yük; ölçülebilir bir etkisi yok.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import Svg, { Path, Circle, Rect, G, Ellipse, Line } from 'react-native-svg';
import { colors } from '../theme';

export type DoluIkonAdi =
  | 'kible'
  | 'tesbih'
  | 'esma'
  | 'kaza'
  | 'imsakiye'
  | 'takip'
  | 'kesfet'
  | 'anasayfa'
  | 'ayarlar'
  | 'vaktindekil'
  | 'hatirlatici'
  | 'konum'
  | 'ayet'
  | 'cami'
  | 'kabe'
  | 'tema';

interface Props {
  ad: DoluIkonAdi;
  boyut?: number;
  /** Ana gövde rengi. Verilmezse paletin ana rengi kullanılır. */
  govde?: string;
  /** Vurgu rengi (sıcak aile). Verilmezse paletin vurgu rengi kullanılır. */
  vurgu?: string;
  /** İkonun oturduğu zeminin rengi — iç boşluklar bununla doldurulur. */
  zemin?: string;
}

export default function DoluIkon({
  ad,
  boyut = 28,
  govde,
  vurgu,
  zemin,
}: Props) {
  const G1 = govde ?? colors.primary;       // koyu gövde
  const G2 = vurgu ?? colors.copperVivid;   // sıcak vurgu
  const BG = zemin ?? colors.white;         // iç boşluk / kontrast

  // HATA DÜZELTMESİ, KÖKTEN (Keşfet ikonu tıklandığında "bozuk" görünmesi):
  // A1 önceden SABİT olarak colors.primaryBright'tı — çağıran G1/G2/BG için
  // ne renk gönderirse göndersin değişmiyordu. Alt navigasyonda aktif sekme
  // tam olarak zemin=primaryBright, pasif sekme ise vurgu=primaryBright
  // gönderiyor: her iki durumda da A1, ya BG ya da G2 ile AYNI renge
  // düşüyordu. Keşfet ikonu dört kutudan biri A1, biri de yarı saydam BG/G2
  // kullandığı için, bu çakışma olduğunda iki kutu görsel olarak birbirine
  // karışıp ikon "bozuk/eksik" görünüyordu.
  //
  // Kalıcı çözüm: A1'i sabit bir renk yerine, G1/G2/BG'nin HİÇBİRİYLE
  // çakışmayan ilk adaydan seçiyoruz. Aday sırası paletin doğal parlaklık
  // basamağını izliyor (en açık turkuazdan başlayıp koyulaşır), böylece
  // hangi çağrı bağlamında olursa olsun hem çakışma önlenir hem de seçilen
  // renk her zaman "vurgu" hissi veren bir tondan gelir.
  const A1_ADAYLARI = [
    colors.primaryBright,
    colors.primaryGlow,
    colors.primaryLight,
    colors.copperBright,
  ];
  const A1 = A1_ADAYLARI.find((c) => c !== G1 && c !== G2 && c !== BG) ?? colors.primaryBright;

  return (
    <Svg width={boyut} height={boyut} viewBox="0 0 32 32">
      {ciz(ad, G1, G2, BG, A1)}
    </Svg>
  );
}

function ciz(ad: DoluIkonAdi, G1: string, G2: string, BG: string, A1: string) {
  switch (ad) {
    // ── KIBLE: dolu pusula kadranı + mercan ibre ────────────────────────
    case 'kible':
      return (
        <G>
          <Circle cx="16" cy="16" r="13" fill={G1} />
          <Circle cx="16" cy="16" r="10" fill={BG} opacity={0.18} />
          <Circle cx="16" cy="16" r="10" stroke={BG} strokeWidth="1.2" fill="none" opacity={0.55} />
          {/* İbre: bir yarısı mercan (kıble), diğeri açık */}
          <Path d="M16 7.5 L19.4 16 L16 24.5 Z" fill={G2} />
          <Path d="M16 7.5 L12.6 16 L16 24.5 Z" fill={BG} opacity={0.85} />
          <Circle cx="16" cy="16" r="2.1" fill={BG} />
          <Circle cx="16" cy="16" r="1" fill={G2} />
          {/* Kuzey işareti */}
          <Circle cx="16" cy="5" r="1.6" fill={G2} />
        </G>
      );

    // ── TESBİH: ipe dizili dolu taneler + imame ─────────────────────────
    case 'tesbih':
      return (
        <G>
          <Path
            d="M8 10.5a9 9 0 0 0 0 11M24 10.5a9 9 0 0 1 0 11"
            stroke={G1}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Üstteki imame — daha büyük ve vurgulu */}
          <Ellipse cx="16" cy="5.4" rx="2.6" ry="3.2" fill={G2} />
          <Ellipse cx="16" cy="4.6" rx="1" ry="1.2" fill={BG} opacity={0.55} />
          {/* Yan taneler */}
          <Circle cx="8.6" cy="9.4" r="2.5" fill={G1} />
          <Circle cx="23.4" cy="9.4" r="2.5" fill={G1} />
          <Circle cx="6.6" cy="16" r="2.5" fill={A1} />
          <Circle cx="25.4" cy="16" r="2.5" fill={A1} />
          <Circle cx="8.6" cy="22.6" r="2.5" fill={G1} />
          <Circle cx="23.4" cy="22.6" r="2.5" fill={G1} />
          <Circle cx="16" cy="26" r="2.8" fill={G2} />
          {/* Işık noktaları — taneleri parlak gösterir */}
          <Circle cx="7.8" cy="8.6" r="0.8" fill={BG} opacity={0.5} />
          <Circle cx="5.8" cy="15.2" r="0.8" fill={BG} opacity={0.5} />
        </G>
      );

    // ── ESMÂ: tezhipli levha + hilal ────────────────────────────────────
    case 'esma':
      return (
        <G>
          <Path d="M16 3 27 8v9c0 5.5-4.6 8.8-11 10.5C9.6 25.8 5 22.5 5 17V8Z" fill={G1} />
          <Path d="M16 6 24 9.8v7.2c0 4-3.4 6.5-8 7.8-4.6-1.3-8-3.8-8-7.8V9.8Z" fill={BG} opacity={0.14} />
          {/* İçteki hilal — Esmâ levhalarındaki motif */}
          <Path
            d="M20.5 16.4A5.4 5.4 0 1 1 14.6 11a4.2 4.2 0 0 0 5.9 5.4Z"
            fill={G2}
          />
          <Circle cx="19.6" cy="11.8" r="1" fill={G2} />
        </G>
      );

    // ── KAZA: seccade + secde silueti ───────────────────────────────────
    case 'kaza':
      return (
        <G>
          {/* Seccade */}
          <Path d="M3 24.5h26v3.2H3Z" fill={G2} opacity={0.35} />
          <Path d="M4.5 24.5h23v-1.6H4.5Z" fill={G2} />
          {/* Secde eden siluet */}
          <Path
            d="M9.5 22.9c0-4.4 3.4-7.6 7.6-7.6h5.6c2.8 0 4.8 2.2 4.8 4.6v3H9.5Z"
            fill={G1}
          />
          <Circle cx="10.6" cy="12.4" r="3.4" fill={G1} />
          <Path d="M9.5 22.9h4.2c0-2.6 1.4-4.6 3.6-5.6" stroke={BG} strokeWidth="1.1" fill="none" opacity={0.35} />
        </G>
      );

    // ── İMSAKİYE: takvim + hilal ────────────────────────────────────────
    case 'imsakiye':
      return (
        <G>
          <Rect x="4" y="6.5" width="24" height="21" rx="3.5" fill={G1} />
          <Rect x="4" y="6.5" width="24" height="6" rx="3.5" fill={G2} />
          <Rect x="4" y="10" width="24" height="2.5" fill={G2} />
          <Rect x="9.2" y="3.5" width="2.6" height="6" rx="1.3" fill={G1} />
          <Rect x="20.2" y="3.5" width="2.6" height="6" rx="1.3" fill={G1} />
          {/* Gövde içindeki hilal */}
          <Path
            d="M20.6 21.4A4.9 4.9 0 1 1 15.2 16.5a3.8 3.8 0 0 0 5.4 4.9Z"
            fill={BG}
            opacity={0.92}
          />
        </G>
      );

    // ── TAKİP: pano + onay işareti ──────────────────────────────────────
    case 'takip':
      return (
        <G>
          <Rect x="5.5" y="4.5" width="21" height="23" rx="3.5" fill={G1} />
          <Rect x="11" y="2.5" width="10" height="5" rx="2.5" fill={G2} />
          <Path
            d="M10.5 15.2l3.2 3.2 7-7"
            stroke={A1}
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M10.5 22h11" stroke={BG} strokeWidth="1.8" opacity={0.42} strokeLinecap="round" />
        </G>
      );

    // ── KEŞFET: dört kutulu ızgara (yıldız yerine — "araçlar" anlamı) ───
    case 'kesfet':
      return (
        <G>
          <Rect x="4.5" y="4.5" width="10.5" height="10.5" rx="3" fill={G1} />
          <Rect x="17" y="4.5" width="10.5" height="10.5" rx="3" fill={G2} />
          <Rect x="4.5" y="17" width="10.5" height="10.5" rx="3" fill={A1} />
          <Rect x="17" y="17" width="10.5" height="10.5" rx="3" fill={G1} />
          <Circle cx="22.25" cy="22.25" r="2.4" fill={BG} opacity={0.85} />
        </G>
      );

    // ── ANA SAYFA: mihrap kemerli ev ────────────────────────────────────
    case 'anasayfa':
      return (
        <G>
          <Path d="M5 27.5V15a11 11 0 0 1 22 0v12.5Z" fill={G1} />
          <Path d="M16 2.2l1.1 3.2h-2.2Z" fill={G2} />
          <Rect x="12.6" y="18" width="6.8" height="9.5" rx="3.4" fill={G2} />
          <Path d="M3 27.5h26" stroke={G1} strokeWidth="2.4" strokeLinecap="round" />
        </G>
      );

    // ── AYARLAR: dişli ───────────────────────────────────────────────────
    case 'ayarlar':
      return (
        <G>
          <Path
            d="M16 3.5l2.3 2.6 3.4-.9.6 3.5 3.3 1.2-1.5 3.2 2.2 2.7-2.7 2.2 1 3.4-3.4.9-1.2 3.3-3.2-1.5-2.8 2.2-2.2-2.7-3.4 1-.9-3.4-3.3-1.2 1.5-3.2L3.5 16l2.7-2.2-1-3.4 3.4-.9 1.2-3.3 3.2 1.5Z"
            fill={G1}
          />
          <Circle cx="16" cy="16" r="5.4" fill={BG} />
          <Circle cx="16" cy="16" r="2.8" fill={G2} />
        </G>
      );

    // ── VAKTİNDE KIL: saat + hilal ──────────────────────────────────────
    case 'vaktindekil':
      return (
        <G>
          <Circle cx="14" cy="17" r="11" fill={G1} />
          <Circle cx="14" cy="17" r="8" fill={BG} opacity={0.15} />
          <Path d="M14 10.5V17l4.4 2.6" stroke={A1} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M28.5 7.4A5 5 0 1 1 23 1.5a3.9 3.9 0 0 0 5.5 5.9Z" fill={G2} />
        </G>
      );

    // ── HATIRLATICI: kandil biçiminde çan ───────────────────────────────
    case 'hatirlatici':
      return (
        <G>
          <Path d="M24.5 13.5a8.5 8.5 0 0 0-17 0c0 7.5-3 9.5-3 9.5h23s-3-2-3-9.5Z" fill={G1} />
          <Path d="M18.8 25.5a3 3 0 0 1-5.6 0Z" fill={G2} />
          <Circle cx="16" cy="4.4" r="2.2" fill={G2} />
          <Path d="M11 16a5 5 0 0 1 5-5" stroke={BG} strokeWidth="1.5" fill="none" opacity={0.4} strokeLinecap="round" />
        </G>
      );

    // ── KONUM: dolu pin ─────────────────────────────────────────────────
    case 'konum':
      return (
        <G>
          <Path d="M16 29s10-9.2 10-16A10 10 0 0 0 6 13c0 6.8 10 16 10 16Z" fill={G1} />
          <Circle cx="16" cy="12.6" r="4.4" fill={BG} />
          <Circle cx="16" cy="12.6" r="2.2" fill={G2} />
        </G>
      );

    // ── AYET: açık mushaf ───────────────────────────────────────────────
    case 'ayet':
      return (
        <G>
          <Path d="M16 8.5C13.6 6.5 10.4 5.7 5 6v17c5.4-.3 8.6.5 11 2.5V8.5Z" fill={G1} />
          <Path d="M16 8.5C18.4 6.5 21.6 5.7 27 6v17c-5.4-.3-8.6.5-11 2.5V8.5Z" fill={G2} />
          <Path d="M16 8.5v17" stroke={BG} strokeWidth="1.6" opacity={0.8} />
          <Path d="M8 11h5M8 14.5h5M19 11h5M19 14.5h5" stroke={BG} strokeWidth="1.1" opacity={0.45} strokeLinecap="round" />
        </G>
      );

    // ── CAMİ: kubbe + iki minare ────────────────────────────────────────
    case 'cami':
      return (
        <G>
          <Rect x="4" y="12" width="3.2" height="15.5" rx="1.6" fill={G2} />
          <Rect x="24.8" y="12" width="3.2" height="15.5" rx="1.6" fill={G2} />
          <Path d="M9 27.5v-8.5a7 7 0 0 1 14 0v8.5Z" fill={G1} />
          <Rect x="13.4" y="20.5" width="5.2" height="7" rx="2.6" fill={BG} opacity={0.9} />
          <Path d="M16 6.5l.9 2.6h-1.8Z" fill={G2} />
          <Path d="M2.5 27.5h27" stroke={G1} strokeWidth="2.4" strokeLinecap="round" />
        </G>
      );

    // ── KÂBE ─────────────────────────────────────────────────────────────
    case 'kabe':
      return (
        <G>
          <Path d="M6 9.5 16 4.5l10 5v13L16 27.5 6 22.5Z" fill="#1A1A1A" />
          <Path d="M6 13.2h20M6 16.4h20" stroke={G2} strokeWidth="2.2" />
          <Path d="M16 4.5v23" stroke={BG} strokeWidth="0.9" opacity={0.25} />
        </G>
      );

    // ── TEMA: palet ──────────────────────────────────────────────────────
    case 'tema':
      return (
        <G>
          <Path
            d="M16 4c6.6 0 12 4.7 12 10.5S22.6 25 20 25c-1.6 0-2.2-1-2.2-2 0-1.4 1.2-1.8 1.2-3.2 0-1.2-1-2.1-2.4-2.1H13c-4.4 0-8-3.2-8-7.2C5 7.4 9.9 4 16 4Z"
            fill={G1}
          />
          <Circle cx="10.5" cy="11" r="2" fill={G2} />
          <Circle cx="16" cy="8.6" r="2" fill={A1} />
          <Circle cx="21.5" cy="11" r="2" fill={BG} opacity={0.85} />
        </G>
      );

    default:
      return <Circle cx="16" cy="16" r="12" fill={G1} />;
  }
}
