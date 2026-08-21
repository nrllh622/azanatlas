// src/components/IslamicPattern.tsx
//
// Koyu turkuaz zeminlerin (hero kartı, ekran başlıkları, seri kartı) üzerine
// çok düşük opaklıkta serilen geometrik İslami desen.
//
// Desen "girih" geleneğindeki sekiz köşeli yıldızı (hatem) ve onu çevreleyen
// birbirine geçen çokgen ızgarasını taklit ediyor. Amaç dikkat çekmek değil;
// düz renk zemine çini yüzeyindeki gibi hafif bir doku kazandırmak.
//
// PERFORMANS NOTU: Desen, her karesi ayrı bir <Svg> olan bir ızgara olarak
// DEĞİL, tek bir <Svg> içinde SVG `<Pattern>` döşemesi olarak çiziliyor.
// İlk yaklaşımda 7x11 = 77 ayrı Svg bileşeni oluşuyordu (her biri ~5 path);
// bu, Android'de gereksiz yere yüzlerce native görünüm demekti. Pattern ile
// tek bir düğüm kalıyor, döşemeyi native SVG motoru yapıyor.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Path, Circle, Rect, G } from 'react-native-svg';
import { colors } from '../theme';

interface Props {
  /** Desen çizgilerinin rengi. */
  color?: string;
  /** Toplam opaklık — dokunun ne kadar görüneceği. */
  opacity?: number;
  /** Tek bir desen karesinin kenar uzunluğu (px). Küçük değer = sık desen. */
  tile?: number;
}

export default function IslamicPattern({
  color = colors.cream,
  opacity = 0.07,
  tile = 44,
}: Props) {
  return (
    // Desen bir View'e sarılıyor ve dokunma olayları BURADA kapatılıyor.
    // `pointerEvents` doğrudan <Svg> üzerine verildiğinde her sürümde
    // güvenilir şekilde iletilmiyor; desen mutlak konumlu olduğu için
    // altındaki butonların (konum seçici, geri tuşu) dokunmalarını
    // yutmaması kritik.
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" opacity={opacity}>
      <Defs>
        <Pattern
          id="azanatlasGirih"
          patternUnits="userSpaceOnUse"
          width={tile}
          height={tile}
          viewBox="0 0 40 40"
        >
          <G stroke={color} strokeWidth={1} fill="none" strokeLinejoin="round">
            {/* Merkezdeki sekiz köşeli yıldız (hatem) */}
            <Path d="M20 6 L24.9 15.1 L34 20 L24.9 24.9 L20 34 L15.1 24.9 L6 20 L15.1 15.1 Z" />
            {/* Yıldızı çevreleyen eşkenar dörtgen çerçeve */}
            <Path d="M20 10.5 L29.5 20 L20 29.5 L10.5 20 Z" />
            {/* Köşe bağlantıları — komşu karelerle birbirine geçmeyi sağlar */}
            <Path d="M0 0 L10.5 10.5M40 0 L29.5 10.5M0 40 L10.5 29.5M40 40 L29.5 29.5" />
            <Circle cx="20" cy="20" r="2" />
          </G>
        </Pattern>
      </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="url(#azanatlasGirih)" />
      </Svg>
    </View>
  );
}
