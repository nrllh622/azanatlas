// src/screens/AcilisEkrani.tsx
//
// AÇILIŞ EKRANI — 7 VARYANT
//
// 7. VARYANT EKLENDİ: 'ufuk-cizgisi' — kullanıcının 3 yeni öneri arasından
// seçtiği varyant, artık VARSAYILAN olarak da bu ayarlandı (bkz. Props
// varsayılanı ve App.tsx/AppGovde.tsx'te kullanılan değer).
//
// ─────────────────────────────────────────────────────────────────────────────
// TASARIM KARARI
//
// İlk üç varyant (girih/şafak/hatem) uygulamanın KENDİ görsel dilinden
// türetildi: girih deseni, ışık eğrisi, hatem yıldızı. Kullanıcı geri
// bildiriminde Muslim Pro ve Ezan Vakti Pro'daki gibi gerçek bir CAMİ
// SİLÜETİ ve daha YUKARIDA, belirgin bir uygulama adı istedi. Bunun için
// üç yeni varyant eklendi: 'cami-siluet', 'cami-hilal', 'cami-altin'.
//
// Bu üç varyant RASTER FOTOĞRAF kullanmıyor — kendi çizdiğimiz, gradyanlı,
// katmanlı bir SVG cami silüeti (kubbe + iki minare + kemerli pencereler)
// kullanıyor. Bunun iki somut sebebi var:
//   1) LİSANS: internetten indirilecek bir fotoğrafın ticari kullanım
//      hakkı/atıf şartlarını her ihtimalde garanti etmek yerine, orijinal
//      bir çizim hiçbir lisans riski taşımaz.
//   2) PERFORMANS/BOYUT: SVG path'leri birkaç KB'dır ve native tarafta
//      vektör olarak çizilir — bir PNG/JPEG gibi ne paket boyutunu
//      büyütür ne de decode/network maliyeti getirir. Ayrıca her palette
//      otomatik uyumludur (renkleri `colors`'tan alır).
//
// PERFORMANS (tüm varyantlar)
//
// Her varyant SADECE `useNativeDriver: true` ile çalışan dönüşümleri
// (opacity, scale, rotate, translate) kullanır — animasyon JS iş parçacığında
// değil, native tarafta koşar. Bu, uygulama açılırken JS bundle yüklenirken
// bile animasyonun takılmamasını sağlar.
//
// Toplam süre 1600 ms; ayrıca `onBitti` çağrısı animasyondan BAĞIMSIZ bir
// zamanlayıcıya bağlı, yani animasyon herhangi bir sebeple takılsa da
// uygulama açılmaya devam eder (kullanıcıyı açılış ekranında kilitlemez).
// Yeni cami varyantları da AYNI zamanlayıcıyı ve AYNI SÜREYİ kullanır —
// açılış süresine hiçbir ek gecikme getirmezler.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, Circle, G, Defs, Pattern, Rect, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { colors, typography, fontSize, spacing } from '../theme';

export type AcilisVaryanti =
  | 'girih' | 'safak' | 'hatem'
  | 'cami-siluet' | 'cami-hilal' | 'cami-altin'
  | 'ufuk-cizgisi';

interface Props {
  varyant?: AcilisVaryanti;
  onBitti: () => void;
}

const { width: EKRAN_G } = Dimensions.get('window');
const SURE = 1600;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Sekiz köşeli yıldız (hatem) yolu — uygulamanın temel motifi. */
const HATEM_YOL =
  'M50 4 L61 39 L96 50 L61 61 L50 96 L39 61 L4 50 L39 39 Z';

/**
 * Cami silüeti — tek merkezî kubbe, iki yan minare, kemerli giriş ve
 * pencere sırası. `viewBox="0 0 300 200"`, taban çizgisi y=200'de; taban
 * genişliği ekran genişliğine göre ölçeklenip ortalanır. Elle çizilmiş
 * orijinal bir siluet olduğu için lisans riski taşımaz.
 */
const CAMI_GOVDE_YOL =
  // Ana bina gövdesi + merkezi kubbe kaidesi
  'M70 200 L70 130 Q70 118 82 118 L218 118 Q230 118 230 130 L230 200 Z';
const CAMI_KUBBE_YOL =
  // Soğan biçimli merkezi kubbe
  'M150 40 C130 40 118 58 118 76 C118 96 132 108 150 118 C168 108 182 96 182 76 C182 58 170 40 150 40 Z';
const CAMI_KUBBE_ALEM =
  // Kubbe tepesindeki hilal direği
  'M150 18 L150 40 M144 24 A7 7 0 1 0 150 14 A5.4 5.4 0 1 1 144 24 Z';
const CAMI_SOL_MINARE =
  'M46 200 L46 66 L54 50 L62 66 L62 200 Z';
const CAMI_SAG_MINARE =
  'M238 200 L238 66 L246 50 L254 66 L254 200 Z';
const CAMI_SOL_MINARE_SERFE =
  'M42 100 L66 100 L66 106 L42 106 Z';
const CAMI_SAG_MINARE_SERFE =
  'M234 100 L258 100 L258 106 L234 106 Z';
const CAMI_YAN_KUBBE_SOL =
  'M78 118 C78 106 87 98 96 98 C105 98 114 106 114 118 Z';
const CAMI_YAN_KUBBE_SAG =
  'M186 118 C186 106 195 98 204 98 C213 98 222 106 222 118 Z';
const CAMI_KAPI_YOL =
  'M150 200 L150 158 C150 148 158 141 168 141 L182 141 C192 141 200 148 200 158 L200 200 Z';

export default function AcilisEkrani({ varyant = 'girih', onBitti }: Props) {
  // ÖNEMLİ: Renkler `StyleSheet.create` içinde DEĞİL, burada okunuyor.
  // Açılış ekranı, tema cihazdan okunmadan önce çizilir; stile kilitlenmiş
  // renkler varsayılan palete sabitlenirdi. Render anında okuyunca, tema
  // hazır olduğunda bileşen yeniden çizilir ve doğru renklere geçer.
  const C = {
    deep: colors.primaryDeep,
    bright: colors.primaryBright,
    glow: colors.primaryGlow,
    coral: colors.copperVivid,
    cream: colors.textOnDark,
  };

  // Ortak: arka plan solması ve genel giriş
  const genel = useRef(new Animated.Value(0)).current;
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const a3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(genel, {
        toValue: 1, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(a1, {
          toValue: 1, duration: 620, easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(a2, {
          toValue: 1, duration: 720, delay: 140, easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
      ]),
      Animated.timing(a3, {
        toValue: 1, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true,
      }),
    ]).start();

    // Animasyondan bağımsız güvenlik zamanlayıcısı: animasyon takılsa bile
    // kullanıcı açılış ekranında kilitli kalmaz.
    const zamanlayici = setTimeout(onBitti, SURE);
    return () => clearTimeout(zamanlayici);
  }, [genel, a1, a2, a3, onBitti]);

  const govde = (() => {
    switch (varyant) {
      // ═══════════════════════════════════════════════════════════════════
      // VARYANT 1 — GİRİH
      // Geometrik desen merkezden dışa doğru açılır, ardından uygulama adı
      // desenin içinden yükselir. Uygulamanın her ekranındaki dokuya gönderme.
      // ═══════════════════════════════════════════════════════════════════
      case 'girih':
        return (
          <>
            <Animated.View
              style={{
                opacity: a1.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }),
                transform: [
                  { scale: a1.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.15] }) },
                ],
              }}
            >
              <Svg width={EKRAN_G} height={EKRAN_G}>
                <Defs>
                  <Pattern id="acilisGirih" patternUnits="userSpaceOnUse" width="56" height="56" viewBox="0 0 40 40">
                    <G stroke={C.glow} strokeWidth="1" fill="none" strokeLinejoin="round">
                      <Path d="M20 6 L24.9 15.1 L34 20 L24.9 24.9 L20 34 L15.1 24.9 L6 20 L15.1 15.1 Z" />
                      <Path d="M20 10.5 L29.5 20 L20 29.5 L10.5 20 Z" />
                      <Path d="M0 0 L10.5 10.5M40 0 L29.5 10.5M0 40 L10.5 29.5M40 40 L29.5 29.5" />
                      <Circle cx="20" cy="20" r="2" />
                    </G>
                  </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#acilisGirih)" />
              </Svg>
            </Animated.View>

            <Animated.View
              style={[
                styles.merkez,
                {
                  opacity: a2,
                  transform: [
                    { scale: a2.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
                  ],
                },
              ]}
            >
              <Svg width={104} height={104} viewBox="0 0 100 100">
                <Path d={HATEM_YOL} fill={C.bright} />
                <Circle cx="50" cy="50" r="13" fill={C.deep} />
                <Circle cx="50" cy="50" r="5" fill={C.coral} />
              </Svg>
            </Animated.View>
          </>
        );

      // ═══════════════════════════════════════════════════════════════════
      // VARYANT 2 — ŞAFAK
      // Ufuk çizgisinin altından bir ışık yayı doğar ve yükselir; üstünde
      // hilal belirir. Namaz vakitlerinin güneşe bağlı doğasına gönderme.
      // ═══════════════════════════════════════════════════════════════════
      case 'safak':
        return (
          <>
            {/* Yükselen ışık kürresi */}
            <Animated.View
              style={{
                position: 'absolute',
                opacity: a1,
                transform: [
                  {
                    translateY: a1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [130, 10],
                    }),
                  },
                  { scale: a1.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                ],
              }}
            >
              <Svg width={230} height={230} viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r="46" fill={C.bright} opacity={0.10} />
                <Circle cx="50" cy="50" r="34" fill={C.bright} opacity={0.16} />
                <Circle cx="50" cy="50" r="23" fill={C.bright} opacity={0.30} />
                <Circle cx="50" cy="50" r="13" fill={C.glow} />
              </Svg>
            </Animated.View>

            {/* Ufuk çizgisi — iki yana açılır */}
            <Animated.View
              style={{
                position: 'absolute',
                height: 2,
                backgroundColor: C.coral,
                width: a2.interpolate({ inputRange: [0, 1], outputRange: [0, EKRAN_G * 0.62] }),
                opacity: a2,
              }}
            />

            {/* Hilal */}
            <Animated.View
              style={{
                position: 'absolute',
                top: '30%',
                opacity: a3,
                transform: [
                  { translateY: a3.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
                ],
              }}
            >
              <Svg width={62} height={62} viewBox="0 0 24 24">
                <Path
                  d="M20.5 13.4A8.5 8.5 0 1 1 11.1 3.5a6.6 6.6 0 0 0 9.4 9.9Z"
                  fill={C.coral}
                />
              </Svg>
            </Animated.View>
          </>
        );

      // ═══════════════════════════════════════════════════════════════════
      // VARYANT 4 — CAMİ SİLÜETİ
      // Cami koyu bir siluet olarak alttan yükselir, arkasında geniş bir
      // ışık halesi yavaşça büyür. En sade cami varyantı — kubbe ve minare
      // netlikle okunur, dikkat dağıtıcı ayrıntı yok.
      // ═══════════════════════════════════════════════════════════════════
      case 'cami-siluet':
        return (
          <>
            <Animated.View
              style={{
                position: 'absolute',
                opacity: a1,
                transform: [{ scale: a1.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
              }}
            >
              <Svg width={340} height={340} viewBox="0 0 100 100">
                <Defs>
                  <RadialGradient id="camiHale1" cx="50%" cy="40%" r="60%">
                    <Stop offset="0" stopColor={C.bright} stopOpacity={0.22} />
                    <Stop offset="1" stopColor={C.bright} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle cx="50" cy="42" r="42" fill="url(#camiHale1)" />
              </Svg>
            </Animated.View>

            <Animated.View
              style={{
                opacity: a2,
                transform: [
                  { translateY: a2.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }) },
                ],
              }}
            >
              <Svg width={Math.min(EKRAN_G * 0.82, 300)} height={Math.min(EKRAN_G * 0.82, 300) * (200 / 300)} viewBox="0 0 300 200">
                <G fill={C.deep} stroke={C.bright} strokeWidth={1.4} strokeLinejoin="round">
                  <Path d={CAMI_SOL_MINARE} />
                  <Path d={CAMI_SAG_MINARE} />
                  <Path d={CAMI_GOVDE_YOL} />
                  <Path d={CAMI_YAN_KUBBE_SOL} />
                  <Path d={CAMI_YAN_KUBBE_SAG} />
                  <Path d={CAMI_KUBBE_YOL} />
                </G>
                <G fill={C.coral} opacity={0.85}>
                  <Path d={CAMI_SOL_MINARE_SERFE} />
                  <Path d={CAMI_SAG_MINARE_SERFE} />
                </G>
                <Path d={CAMI_KUBBE_ALEM} fill="none" stroke={C.coral} strokeWidth={2.4} strokeLinecap="round" />
                <Path d={CAMI_KAPI_YOL} fill={C.deep} stroke={C.glow} strokeWidth={1} opacity={0.9} />
              </Svg>
            </Animated.View>
          </>
        );

      // ═══════════════════════════════════════════════════════════════════
      // VARYANT 5 — CAMİ + HİLAL
      // "Ezan Vakti Pro" örneğindeki gibi: cami silueti + üzerinde beliren
      // hilal ve yıldız. Cami önce belirir, ardından hilal onun üstünde
      // yumuşakça parlayarak yükselir.
      // ═══════════════════════════════════════════════════════════════════
      case 'cami-hilal':
        return (
          <>
            <Animated.View
              style={{
                position: 'absolute',
                opacity: a1,
                transform: [{ scale: a1.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
              }}
            >
              <Svg width={360} height={360} viewBox="0 0 100 100">
                <Defs>
                  <RadialGradient id="camiHale2" cx="50%" cy="34%" r="55%">
                    <Stop offset="0" stopColor={C.glow} stopOpacity={0.25} />
                    <Stop offset="1" stopColor={C.glow} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle cx="50" cy="34" r="40" fill="url(#camiHale2)" />
              </Svg>
            </Animated.View>

            <Animated.View
              style={{
                opacity: a2,
                transform: [
                  { translateY: a2.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }) },
                ],
              }}
            >
              <Svg width={Math.min(EKRAN_G * 0.82, 300)} height={Math.min(EKRAN_G * 0.82, 300) * (200 / 300)} viewBox="0 0 300 200">
                <Defs>
                  <LinearGradient id="camiGovdeGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={C.bright} stopOpacity={0.9} />
                    <Stop offset="1" stopColor={C.deep} />
                  </LinearGradient>
                </Defs>
                <G fill="url(#camiGovdeGrad)" stroke={C.deep} strokeWidth={1} strokeLinejoin="round">
                  <Path d={CAMI_SOL_MINARE} />
                  <Path d={CAMI_SAG_MINARE} />
                  <Path d={CAMI_GOVDE_YOL} />
                  <Path d={CAMI_YAN_KUBBE_SOL} />
                  <Path d={CAMI_YAN_KUBBE_SAG} />
                  <Path d={CAMI_KUBBE_YOL} />
                </G>
                <G fill={C.coral}>
                  <Path d={CAMI_SOL_MINARE_SERFE} />
                  <Path d={CAMI_SAG_MINARE_SERFE} />
                </G>
                <Path d={CAMI_KUBBE_ALEM} fill="none" stroke={C.coral} strokeWidth={2.4} strokeLinecap="round" />
                <Path d={CAMI_KAPI_YOL} fill={C.deep} opacity={0.9} />
              </Svg>
            </Animated.View>

            {/* Hilal + yıldız — camiden sonra, üstünde belirir */}
            <Animated.View
              style={{
                position: 'absolute',
                top: '16%',
                opacity: a3,
                transform: [
                  { translateY: a3.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
                  { scale: a3.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
                ],
              }}
            >
              <Svg width={56} height={56} viewBox="0 0 24 24">
                <Path
                  d="M20.5 13.4A8.5 8.5 0 1 1 11.1 3.5a6.6 6.6 0 0 0 9.4 9.9Z"
                  fill={C.coral}
                />
                <Circle cx="19.5" cy="6.5" r="1.3" fill={C.coral} />
              </Svg>
            </Animated.View>
          </>
        );

      // ═══════════════════════════════════════════════════════════════════
      // VARYANT 6 — CAMİ ALTIN
      // En zengin varyant: girih dokusu zemin, cami altın/bakır tonlarda
      // ışıklı bir gradyanla parlar — Ezan Vakti Pro'daki sıcak, mistik
      // atmosferin AzanAtlas'ın kendi renk diliyle yeniden yorumu.
      // ═══════════════════════════════════════════════════════════════════
      case 'cami-altin':
      default:
        return (
          <>
            <Animated.View
              style={{
                opacity: a1.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] }),
              }}
            >
              <Svg width={EKRAN_G} height={EKRAN_G}>
                <Defs>
                  <Pattern id="acilisCamiGirih" patternUnits="userSpaceOnUse" width="60" height="60" viewBox="0 0 40 40">
                    <G stroke={C.coral} strokeWidth="0.8" fill="none" strokeLinejoin="round">
                      <Path d="M20 6 L24.9 15.1 L34 20 L24.9 24.9 L20 34 L15.1 24.9 L6 20 L15.1 15.1 Z" />
                      <Circle cx="20" cy="20" r="2" />
                    </G>
                  </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#acilisCamiGirih)" />
              </Svg>
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                opacity: a1,
                transform: [{ scale: a1.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
              }}
            >
              <Svg width={340} height={340} viewBox="0 0 100 100">
                <Defs>
                  <RadialGradient id="camiHale3" cx="50%" cy="38%" r="58%">
                    <Stop offset="0" stopColor={C.coral} stopOpacity={0.28} />
                    <Stop offset="1" stopColor={C.coral} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle cx="50" cy="38" r="42" fill="url(#camiHale3)" />
              </Svg>
            </Animated.View>

            <Animated.View
              style={{
                opacity: a2,
                transform: [
                  { translateY: a2.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }) },
                ],
              }}
            >
              <Svg width={Math.min(EKRAN_G * 0.82, 300)} height={Math.min(EKRAN_G * 0.82, 300) * (200 / 300)} viewBox="0 0 300 200">
                <Defs>
                  <LinearGradient id="camiAltinGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={C.coral} stopOpacity={0.95} />
                    <Stop offset="0.5" stopColor={C.bright} />
                    <Stop offset="1" stopColor={C.deep} />
                  </LinearGradient>
                </Defs>
                <G fill="url(#camiAltinGrad)" stroke={C.deep} strokeWidth={1} strokeLinejoin="round">
                  <Path d={CAMI_SOL_MINARE} />
                  <Path d={CAMI_SAG_MINARE} />
                  <Path d={CAMI_GOVDE_YOL} />
                  <Path d={CAMI_YAN_KUBBE_SOL} />
                  <Path d={CAMI_YAN_KUBBE_SAG} />
                  <Path d={CAMI_KUBBE_YOL} />
                </G>
                <G fill={C.deep} opacity={0.9}>
                  <Path d={CAMI_SOL_MINARE_SERFE} />
                  <Path d={CAMI_SAG_MINARE_SERFE} />
                </G>
                <Path d={CAMI_KUBBE_ALEM} fill="none" stroke={C.deep} strokeWidth={2.2} strokeLinecap="round" />
                <Path d={CAMI_KAPI_YOL} fill={C.deep} opacity={0.92} />
              </Svg>
            </Animated.View>
          </>
        );

      // ═══════════════════════════════════════════════════════════════════
      // VARYANT 7 — UFUK ÇİZGİSİ
      // Kullanıcının seçtiği yeni açılış varyantı. Cami ufuk çizgisinin
      // üzerinde bir siluet olarak durur; arkasından bir ışık (doğan
      // güneş/hilal ışığı) yükselir ve ufuk çizgisi iki yana açılır. Diğer
      // cami varyantlarından farkı: gökyüzü DOĞUYORMUŞ gibi koyudan
      // aydınlığa geçen bir gradyan taşıması ve ışığın camiden önce,
      // camiyi arkadan aydınlatarak belirmesi — "gün doğumu" hissi.
      // ═══════════════════════════════════════════════════════════════════
      case 'ufuk-cizgisi':
        // Madde 4 (bu paket): dış `camiSahne` artık DİKEY ORTALANIYOR (cami
        // ekranın kenarına yapışmasın diye) — ama bu varyantın kendi iç
        // kompozisyonu (gökyüzü üstte, ufuk çizgisi + cami tam bu kutunun
        // ALTINDA) hâlâ birbirine göre sabit kalmalı. Bu yüzden kendi
        // pozisyon bağlamını taşıyan ayrı bir sarmalayıcı kutu kullanılıyor;
        // bu kutu camiSahne'nin ortasında durur, içeriği ise KENDİ İÇİNDE
        // alta yaslanır — mosque + ufuk çizgisi ilişkisi bozulmadan tüm
        // sahne yukarı taşınmış olur.
        return (
          <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Gökyüzü — koyudan aydınlığa geçiş hissi veren sabit gradyan
                zemin, sıcak tonun opaklığı animasyonla artıyor */}
            <Svg
              width={EKRAN_G}
              height={Math.min(EKRAN_G, 420)}
              viewBox="0 0 100 100"
              style={{ position: 'absolute', top: 0 }}
            >
              <Defs>
                <LinearGradient id="ufukGokyuzu" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={C.deep} />
                  <Stop offset="1" stopColor={C.bright} stopOpacity={0.35} />
                </LinearGradient>
              </Defs>
              <Rect width="100" height="100" fill="url(#ufukGokyuzu)" />
            </Svg>

            {/* Doğan ışık — cami siluetinin arkasından yükselen, büyüyen hale */}
            <Animated.View
              style={{
                position: 'absolute',
                opacity: a1,
                transform: [
                  {
                    translateY: a1.interpolate({ inputRange: [0, 1], outputRange: [46, 6] }),
                  },
                  { scale: a1.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.08] }) },
                ],
              }}
            >
              <Svg width={300} height={300} viewBox="0 0 100 100">
                <Defs>
                  <RadialGradient id="ufukIsik" cx="50%" cy="55%" r="55%">
                    <Stop offset="0" stopColor={C.coral} stopOpacity={0.55} />
                    <Stop offset="0.5" stopColor={C.glow} stopOpacity={0.22} />
                    <Stop offset="1" stopColor={C.glow} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle cx="50" cy="55" r="46" fill="url(#ufukIsik)" />
              </Svg>
            </Animated.View>

            {/* Ufuk çizgisi — cami tabanı hizasında iki yana açılır */}
            <Animated.View
              style={{
                position: 'absolute',
                bottom: spacing.xl + 2,
                height: 2,
                backgroundColor: C.coral,
                width: a2.interpolate({ inputRange: [0, 1], outputRange: [0, EKRAN_G * 0.86] }),
                opacity: a2,
              }}
            />

            {/* Cami silueti — ufuk çizgisinin üzerinde koyu bir siluet
                olarak alttan yükselir */}
            <Animated.View
              style={{
                opacity: a2,
                transform: [
                  { translateY: a2.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }) },
                ],
              }}
            >
              <Svg width={Math.min(EKRAN_G * 0.82, 300)} height={Math.min(EKRAN_G * 0.82, 300) * (200 / 300)} viewBox="0 0 300 200">
                <G fill={C.deep} stroke={C.deep} strokeWidth={1} strokeLinejoin="round">
                  <Path d={CAMI_SOL_MINARE} />
                  <Path d={CAMI_SAG_MINARE} />
                  <Path d={CAMI_GOVDE_YOL} />
                  <Path d={CAMI_YAN_KUBBE_SOL} />
                  <Path d={CAMI_YAN_KUBBE_SAG} />
                  <Path d={CAMI_KUBBE_YOL} />
                </G>
                <Path d={CAMI_KUBBE_ALEM} fill="none" stroke={C.deep} strokeWidth={2.4} strokeLinecap="round" />
                <Path d={CAMI_KAPI_YOL} fill={C.deep} />
              </Svg>
            </Animated.View>
          </View>
        );

      // ═══════════════════════════════════════════════════════════════════
      // VARYANT 3 — HATEM
      // Sekiz köşeli yıldız kendi ekseninde dönerek büyür; çevresinde ince
      // bir halka çizilir. En sade ve en hızlı algılanan varyant.
      // ═══════════════════════════════════════════════════════════════════
      case 'hatem':
        return (
          <>
            <Animated.View
              style={{
                position: 'absolute',
                opacity: a1.interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] }),
                transform: [
                  { scale: a1.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
                ],
              }}
            >
              <Svg width={250} height={250} viewBox="0 0 100 100">
                <Circle
                  cx="50" cy="50" r="46"
                  stroke={C.glow} strokeWidth="0.7" fill="none"
                />
                <Circle
                  cx="50" cy="50" r="38"
                  stroke={C.glow} strokeWidth="0.5" fill="none" opacity={0.6}
                />
              </Svg>
            </Animated.View>

            <Animated.View
              style={{
                opacity: a1,
                transform: [
                  { scale: a1.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }) },
                  {
                    rotate: a1.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-70deg', '0deg'],
                    }),
                  },
                ],
              }}
            >
              <Svg width={128} height={128} viewBox="0 0 100 100">
                <Path d={HATEM_YOL} fill={C.bright} />
                <Path
                  d="M50 20 L57 43 L80 50 L57 57 L50 80 L43 57 L20 50 L43 43 Z"
                  fill={C.deep}
                />
                <Circle cx="50" cy="50" r="7" fill={C.coral} />
              </Svg>
            </Animated.View>
          </>
        );
    }
  })();

  // Madde 4 (bu paket — ısrarla tekrar edilen şikayet): cami önceki
  // düzende ekranın en altına, kenara yapışık duruyordu ("çok altta
  // kalmış") ve ad/slogan üstteydi. Kullanıcı isteği üzerine SIRA
  // DEĞİŞTİRİLDİ: cami artık ekranın ÜST/ORTA bölgesinde, kenara
  // yapışmadan, daha fazla nefes payıyla duruyor; AzanAtlas adı ve
  // sloganı ise camiden SONRA, ekranın alt kısmında gösteriliyor. Girih/
  // şafak/hatem varyantlarında (aşağıdaki `else` dalı) motif zaten
  // ortada, ad altta kalmaya devam ediyor — bu üçü değişmedi.
  const camiVaryanti =
    varyant === 'cami-siluet' || varyant === 'cami-hilal' || varyant === 'cami-altin' || varyant === 'ufuk-cizgisi';

  return (
    <Animated.View style={[styles.wrap, { opacity: genel, backgroundColor: C.deep }]}>
      {camiVaryanti ? (
        <View style={styles.camiDuzen}>
          <View style={styles.camiSahne}>{govde}</View>

          <Animated.View
            style={[
              styles.yaziBlokAlt,
              {
                opacity: a3,
                transform: [
                  { translateY: a3.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
                ],
              },
            ]}
          >
            <Text style={[styles.adBuyuk, { color: C.cream }]}>AzanAtlas</Text>
            <Text style={[styles.slogan, { color: C.glow }]}>Namaz vakitleri, her yerde</Text>
          </Animated.View>
        </View>
      ) : (
        <>
          <View style={styles.sahne}>{govde}</View>

          <Animated.View
            style={[
              styles.yaziBlok,
              {
                opacity: a3,
                transform: [
                  { translateY: a3.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
                ],
              },
            ]}
          >
            <Text style={[styles.ad, { color: C.cream }]}>AzanAtlas</Text>
            <Text style={[styles.slogan, { color: C.glow }]}>Namaz vakitleri, her yerde</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sahne: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  merkez: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  yaziBlok: { alignItems: 'center', paddingBottom: spacing.xxl + spacing.xl },
  ad: {
    fontFamily: typography.displayFamily,
    fontSize: 34,
    letterSpacing: 0.5,
  },
  slogan: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.small,
    marginTop: spacing.xs,
  },

  // ---------- CAMİ VARYANTLARI: cami üstte/ortada, ad ve slogan altta ----------
  // Madde 4 (bu paket): sıra değişti — cami artık kenara yapışık değil,
  // kendi alanında DİKEY OLARAK ORTALANIYOR (justifyContent: 'center'),
  // ad/slogan bloğu ekranın alt kısmında ayrı bir sabit yükseklikte duruyor.
  camiDuzen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  camiSahne: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  yaziBlokAlt: { alignItems: 'center' },
  adBuyuk: {
    fontFamily: typography.displayFamily,
    fontSize: 40,
    letterSpacing: 0.6,
  },
});
