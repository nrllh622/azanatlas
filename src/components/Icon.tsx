// src/components/Icon.tsx
//
// AZANATLAS İKON SETİ
//
// Uygulamada emoji KULLANILMIYOR. Emoji, cihazdan cihaza farklı görünür
// (Samsung/Google/Apple setleri birbirinden çok farklıdır), renk kontrolü
// yapılamaz ve İslami bir görsel dil kurmaz. Bunun yerine burada tanımlı,
// tek renkli, ince çizgi (line) SVG ikonlar kullanılıyor:
//   • rengi `color` prop'u ile paletten geliyor
//   • boyutu `size` ile ölçekleniyor, her ekranda aynı ağırlıkta duruyor
//   • motifler İslami görsel gelenekten: hilal, sekiz köşeli yıldız (hatem),
//     mihrap kemeri, kubbe/minare silueti, Kâbe, tesbih, kandil
//
// Kullanım:  <Icon name="kible" size={22} color={colors.copper} />

import React from 'react';
import Svg, { Path, Circle, Rect, G, Line, Polyline } from 'react-native-svg';
import { colors } from '../theme';

export type IconName =
  // navigasyon
  | 'anasayfa'
  | 'imsakiye'
  | 'kesfet'
  | 'takip'
  | 'ayarlar'
  // araçlar
  | 'kible'
  | 'tesbih'
  | 'esma'
  | 'kaza'
  | 'vaktindekil'
  | 'hatirlatici'
  | 'ayet'
  | 'konum'
  | 'cami'
  | 'kabe'
  // vakitler
  | 'imsak'
  | 'sabah'
  | 'gunes'
  | 'ogle'
  | 'ikindi'
  | 'aksam'
  | 'yatsi'
  // arayüz
  | 'bildirimAcik'
  | 'bildirimKapali'
  | 'onay'
  | 'daire'
  | 'geri'
  | 'kapat'
  | 'sol'
  | 'sag'
  | 'asagi'
  | 'arti'
  | 'eksi'
  | 'yenile'
  | 'uyari'
  | 'bilgi'
  | 'hilal'
  | 'yildiz';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function Icon({
  name,
  size = 22,
  color = colors.textOnLight,
  strokeWidth = 1.8,
}: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderPaths(name, common, color)}
    </Svg>
  );
}

function renderPaths(name: IconName, c: any, color: string) {
  switch (name) {
    // ----------------------------------------------------------------
    // NAVİGASYON
    // ----------------------------------------------------------------
    case 'anasayfa':
      // Mihrap kemeri biçiminde ev — düz bir "home" ikonu yerine
      // cami mihrabının sivri kemerini andıran bir siluet.
      return (
        <G>
          <Path {...c} d="M4 20v-8.5a8 8 0 0 1 16 0V20" />
          <Path {...c} d="M3 20h18" />
          <Path {...c} d="M9.5 20v-4.5a2.5 2.5 0 0 1 5 0V20" />
        </G>
      );

    case 'imsakiye':
      // Takvim + hilal: aylık vakit cetveli
      return (
        <G>
          <Rect {...c} x="3" y="5" width="18" height="16" rx="3" />
          <Path {...c} d="M3 10h18M8 3v4M16 3v4" />
          <Path {...c} d="M15.5 16.2a2.7 2.7 0 1 1-2.9-3.7 2.1 2.1 0 0 0 2.9 3.7Z" />
        </G>
      );

    case 'kesfet':
      // Sekiz köşeli yıldız (hatem) — İslam geometrik sanatının temel motifi
      return (
        <G>
          <Path
            {...c}
            d="M12 2.5 14.6 8.1 20.5 8.1 16.2 12 20.5 15.9 14.6 15.9 12 21.5 9.4 15.9 3.5 15.9 7.8 12 3.5 8.1 9.4 8.1Z"
          />
        </G>
      );

    case 'takip':
      // Seccade üzerinde işaretlenmiş günler — kontrol listesi
      return (
        <G>
          <Rect {...c} x="4" y="3" width="16" height="18" rx="3" />
          <Path {...c} d="M8.5 9l1.8 1.8L14 7.2" />
          <Path {...c} d="M8.5 16h7" />
        </G>
      );

    case 'ayarlar':
      return (
        <G>
          <Circle {...c} cx="12" cy="12" r="3" />
          <Path
            {...c}
            d="M12 2.8v2.4M12 18.8v2.4M4.5 4.5l1.7 1.7M17.8 17.8l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.5 19.5l1.7-1.7M17.8 6.2l1.7-1.7"
          />
        </G>
      );

    // ----------------------------------------------------------------
    // ARAÇLAR
    // ----------------------------------------------------------------
    case 'kible':
      // Pusula: dış çember + kıbleyi gösteren ibre
      return (
        <G>
          <Circle {...c} cx="12" cy="12" r="9" />
          <Path {...c} d="M15.6 8.4 13.4 13.4 8.4 15.6 10.6 10.6Z" />
          <Circle cx="12" cy="12" r="1" fill={color} />
        </G>
      );

    case 'tesbih':
      // Tesbih: ipe dizili taneler ve imame
      return (
        <G>
          <Path {...c} d="M5.5 8.5a8 8 0 0 0 0 7" />
          <Path {...c} d="M18.5 8.5a8 8 0 0 1 0 7" />
          <Circle {...c} cx="12" cy="4.6" r="1.7" />
          <Circle {...c} cx="6.6" cy="6.8" r="1.4" />
          <Circle {...c} cx="17.4" cy="6.8" r="1.4" />
          <Circle {...c} cx="6.6" cy="17.2" r="1.4" />
          <Circle {...c} cx="17.4" cy="17.2" r="1.4" />
          <Circle {...c} cx="12" cy="19.6" r="1.7" />
        </G>
      );

    case 'esma':
      // Tezhipli levha: Esmaül Hüsna panosu
      return (
        <G>
          <Path {...c} d="M12 3 20 7v6.5c0 4-3.4 6.4-8 7.5-4.6-1.1-8-3.5-8-7.5V7Z" />
          <Path {...c} d="M9 11.5h6M12 8.8v5.4" />
        </G>
      );

    case 'kaza':
      // Seccade üzerinde secde silueti — kaza namazı
      return (
        <G>
          <Path {...c} d="M3.5 18.5h17" />
          <Path {...c} d="M5.5 18.5c0-3 2.4-5 5-5h3c2.6 0 5 2 5 5" />
          <Circle {...c} cx="8.5" cy="9.5" r="2.2" />
        </G>
      );

    case 'vaktindekil':
      // Saat + hilal: vaktinde kılma hatırlatması
      return (
        <G>
          <Circle {...c} cx="11" cy="12" r="8" />
          <Path {...c} d="M11 7.5V12l3 1.8" />
          <Path {...c} d="M21.5 5.5a3.2 3.2 0 1 1-3.4-4.3 2.5 2.5 0 0 0 3.4 4.3Z" />
        </G>
      );

    case 'hatirlatici':
      // Kandil biçiminde çan — cami kandilinden esinli
      return (
        <G>
          <Path {...c} d="M18 9.5a6 6 0 0 0-12 0c0 5.5-2.2 7-2.2 7h16.4S18 15 18 9.5Z" />
          <Path {...c} d="M13.8 20a2 2 0 0 1-3.6 0" />
        </G>
      );

    case 'ayet':
      // Açık mushaf
      return (
        <G>
          <Path {...c} d="M12 6.5C10.2 5 7.8 4.4 4 4.6v13c3.8-.2 6.2.4 8 1.9 1.8-1.5 4.2-2.1 8-1.9v-13c-3.8-.2-6.2.4-8 1.9Z" />
          <Path {...c} d="M12 6.5v12.9" />
        </G>
      );

    case 'konum':
      return (
        <G>
          <Path {...c} d="M12 21.5s7.5-6.9 7.5-12A7.5 7.5 0 0 0 4.5 9.5c0 5.1 7.5 12 7.5 12Z" />
          <Circle {...c} cx="12" cy="9.3" r="2.6" />
        </G>
      );

    case 'cami':
      // Kubbe + iki minare
      return (
        <G>
          <Path {...c} d="M6 20v-6.5a6 6 0 0 1 12 0V20" />
          <Path {...c} d="M4 20h16" />
          <Path {...c} d="M4 20v-7M20 20v-7" />
          <Path {...c} d="M12 7.5V5" />
          <Path {...c} d="M10.3 20v-3.2a1.7 1.7 0 0 1 3.4 0V20" />
        </G>
      );

    case 'kabe':
      // Kâbe: küp gövde + üzerinde kuşak şeklindeki hizam/kuşak şeridi
      return (
        <G>
          <Path {...c} d="M4.5 7.6 12 4l7.5 3.6v8.8L12 20l-7.5-3.6Z" />
          <Path {...c} d="M4.5 10.4h15M4.5 13.2h15" />
          <Path {...c} d="M12 4v16" opacity={0.35} />
        </G>
      );

    // ----------------------------------------------------------------
    // VAKİT İKONLARI — günün ışık durumunu anlatan siluetler
    // ----------------------------------------------------------------
    case 'imsak':
      // Ufkun hemen altındaki ilk aydınlık (fecr-i sadık)
      return (
        <G>
          <Path {...c} d="M3.5 19h17" />
          <Path {...c} d="M7 19a5 5 0 0 1 10 0" />
          <Path {...c} d="M12 5.5v2M6.4 7.9l1.4 1.4M17.6 7.9l-1.4 1.4" />
        </G>
      );

    case 'sabah':
      // Ufuktan yükselen güneşin ilk hali + yıldız izi
      return (
        <G>
          <Path {...c} d="M3.5 19h17" />
          <Path {...c} d="M7.5 19a4.5 4.5 0 0 1 9 0" />
          <Path {...c} d="M12 6v2.2M6.9 8.4l1.5 1.5M17.1 8.4l-1.5 1.5M3.8 14h1.8M18.4 14h1.8" />
        </G>
      );

    case 'gunes':
      // Tam güneş — doğuş
      return (
        <G>
          <Circle {...c} cx="12" cy="12" r="4" />
          <Path
            {...c}
            d="M12 3v2.2M12 18.8V21M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M3 12h2.2M18.8 12H21M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"
          />
        </G>
      );

    case 'ogle':
      // Tepedeki güneş — zeval
      return (
        <G>
          <Circle {...c} cx="12" cy="11" r="4.2" />
          <Path {...c} d="M12 2.5v2M4.6 4.6l1.5 1.5M17.9 6.1l1.5-1.5M2.5 11h2M19.5 11h2" />
          <Path {...c} d="M3.5 19.5h17" />
        </G>
      );

    case 'ikindi':
      // Alçalan güneş, uzayan gölge
      return (
        <G>
          <Circle {...c} cx="12" cy="10.5" r="3.6" />
          <Path {...c} d="M12 3.6v1.8M5.6 6.6l1.3 1.3M17.1 7.9l1.3-1.3" />
          <Path {...c} d="M3.5 18.5h17M6.5 21.5h11" />
        </G>
      );

    case 'aksam':
      // Ufka inen güneş — gurub
      return (
        <G>
          <Path {...c} d="M3.5 18h17" />
          <Path {...c} d="M8 18a4 4 0 0 1 8 0" />
          <Path {...c} d="M12 4v2.4M5.9 7.4l1.5 1.5M16.6 8.9l1.5-1.5" />
          <Path {...c} d="M6 21.5h12" />
        </G>
      );

    case 'yatsi':
      // Hilal + yıldızlar — gece
      return (
        <G>
          <Path {...c} d="M20.5 13.4A8.5 8.5 0 1 1 11.1 3.5a6.6 6.6 0 0 0 9.4 9.9Z" />
          <Circle cx="17.2" cy="5.6" r="0.9" fill={color} />
          <Circle cx="14" cy="3.4" r="0.6" fill={color} />
        </G>
      );

    // ----------------------------------------------------------------
    // ARAYÜZ
    // ----------------------------------------------------------------
    case 'bildirimAcik':
      return (
        <G>
          <Path {...c} d="M18 9.5a6 6 0 0 0-12 0c0 5.5-2.2 7-2.2 7h16.4S18 15 18 9.5Z" />
          <Path {...c} d="M13.8 20a2 2 0 0 1-3.6 0" />
        </G>
      );

    case 'bildirimKapali':
      return (
        <G>
          <Path {...c} d="M18 9.5a6 6 0 0 0-9.3-5" />
          <Path {...c} d="M6.1 6.9A6 6 0 0 0 6 9.5c0 5.5-2.2 7-2.2 7h13" />
          <Path {...c} d="M13.8 20a2 2 0 0 1-3.6 0" />
          <Line {...c} x1="3.5" y1="3.5" x2="20.5" y2="20.5" />
        </G>
      );

    case 'onay':
      // Kılındı işareti — dolu daire + tik
      return (
        <G>
          <Circle cx="12" cy="12" r="9.5" fill={color} />
          <Polyline
            points="7.8,12.2 10.6,15 16.2,9.2"
            stroke={colors.white}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </G>
      );

    case 'daire':
      // Boş daire — henüz kılınmadı
      return <Circle {...c} cx="12" cy="12" r="9" />;

    case 'geri':
      return (
        <G>
          <Path {...c} d="M15 4.5 7.5 12l7.5 7.5" />
        </G>
      );

    case 'kapat':
      return (
        <G>
          <Path {...c} d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
        </G>
      );

    case 'sol':
      return <Path {...c} d="M14.5 5 8 12l6.5 7" />;

    case 'sag':
      return <Path {...c} d="M9.5 5 16 12l-6.5 7" />;

    case 'asagi':
      return <Path {...c} d="M5 9.5 12 16l7-6.5" />;

    case 'arti':
      return <Path {...c} d="M12 5v14M5 12h14" />;

    case 'eksi':
      return <Path {...c} d="M5 12h14" />;

    case 'yenile':
      return (
        <G>
          <Path {...c} d="M20 12a8 8 0 1 1-2.6-5.9" />
          <Path {...c} d="M20 3.5V9h-5.5" />
        </G>
      );

    case 'uyari':
      return (
        <G>
          <Path {...c} d="M12 3.8 21 19.5H3Z" />
          <Path {...c} d="M12 9.8v4.2" />
          <Circle cx="12" cy="16.8" r="1" fill={color} />
        </G>
      );

    case 'bilgi':
      return (
        <G>
          <Circle {...c} cx="12" cy="12" r="9" />
          <Path {...c} d="M12 11v5.5" />
          <Circle cx="12" cy="7.8" r="1" fill={color} />
        </G>
      );

    case 'hilal':
      return <Path {...c} d="M20.5 13.4A8.5 8.5 0 1 1 11.1 3.5a6.6 6.6 0 0 0 9.4 9.9Z" />;

    case 'yildiz':
      // Sekiz köşeli yıldız — dolu
      return (
        <Path
          d="M12 2.5 14.6 8.1 20.5 8.1 16.2 12 20.5 15.9 14.6 15.9 12 21.5 9.4 15.9 3.5 15.9 7.8 12 3.5 8.1 9.4 8.1Z"
          fill={color}
        />
      );

    default:
      return <Circle {...c} cx="12" cy="12" r="9" />;
  }
}

// Vakit anahtarından ikon adına eşleme — HomeScreen ve İmsakiye ortak kullanır.
export function vakitIcon(key: string): IconName {
  switch (key) {
    case 'imsak': return 'imsak';
    case 'sabah': return 'sabah';
    case 'gunes': return 'gunes';
    case 'ogle': return 'ogle';
    case 'ikindi': return 'ikindi';
    case 'aksam': return 'aksam';
    case 'yatsi': return 'yatsi';
    default: return 'hilal';
  }
}
