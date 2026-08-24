// src/screens/QiblaScreen.tsx
//
// KIBLE PUSULASI
//
// ─────────────────────────────────────────────────────────────────────────────
// DOĞRULUK HATASI VE ÇÖZÜMÜ
//
// Önceki sürüm yönü `DeviceMotion.rotation.alpha` değerinden okuyordu. Bu
// DEĞER BİR PUSULA DEĞİLDİR: cihazın kendi başlangıç eksenine göre dönüşünü
// verir, manyetik kuzeyle doğrudan ilgisi yoktur ve zamanla sürüklenir.
// Kıblenin yanlış gösterilmesinin sebebi buydu.
//
// Doğrusu `expo-location`'ın `watchHeadingAsync` API'sidir. İki değer döner:
//   • trueHeading — GERÇEK (coğrafi) kuzeye göre, manyetik sapma düzeltilmiş
//   • magHeading  — manyetik kuzeye göre, ham değer
//
// Kıble açımız (`calculateQiblaBearing`) büyük daire hesabıyla bulunur, yani
// GERÇEK kuzeye göredir. Dolayısıyla `trueHeading` ile eşleşmesi gerekir.
// İstanbul'da manyetik sapma ~+6°; yanlışını kullanmak kıbleyi 6° kaydırır.
//
// `trueHeading` yalnızca konum izni varsa ve cihaz sapmayı hesaplayabiliyorsa
// gelir; gelmezse (-1) magHeading'e düşülür ve kullanıcıya durum bildirilir.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import Svg, {
  Circle, G, Line, Text as SvgText, Polygon, Rect, Path,
  Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { colors, spacing, radius, typography, elevation } from '../theme';
import { calculateQiblaBearing, calculateDistanceKm, calculateQiblaTime } from '../lib/qibla';
import { useLocationContext } from '../context/LocationContext';
import { useCalculationSettings } from '../context/CalculationSettingsContext';

interface Props {
  onClose?: () => void;
}

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 26;

/** Kıbleye bu kadar dereceden yakınsak "hizalı" sayılır. */
const HIZA_TOLERANSI = 6;

function AnimasyonluOk({ yon }: { yon: 'sol' | 'sag' }) {
  const kayma = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dongu = Animated.loop(
      Animated.sequence([
        Animated.timing(kayma, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(kayma, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    dongu.start();
    return () => dongu.stop();
  }, [kayma]);

  const translateX = kayma.interpolate({
    inputRange: [0, 1],
    outputRange: yon === 'sag' ? [0, 9] : [0, -9],
  });

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      <Icon name={yon === 'sag' ? 'sag' : 'sol'} size={26} color={colors.copperVivid} />
    </Animated.View>
  );
}

export default function QiblaScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { location } = useLocationContext();
  const { distanceUnit } = useCalculationSettings();

  const [heading, setHeading] = useState<number | null>(null);
  const [gercekKuzey, setGercekKuzey] = useState(true);
  const [sensorHatasi, setSensorHatasi] = useState<string | null>(null);
  const [rehberAcik, setRehberAcik] = useState(false);

  const qiblaBearing = useMemo(
    () => calculateQiblaBearing(location.latitude, location.longitude),
    [location.latitude, location.longitude]
  );
  const distanceKm = useMemo(
    () => calculateDistanceKm(location.latitude, location.longitude),
    [location.latitude, location.longitude]
  );
  const qiblaTime = useMemo(
    () => calculateQiblaTime(location.latitude, location.longitude, new Date()),
    [location.latitude, location.longitude]
  );

  const mesafe =
    distanceUnit === 'mi' ? `${Math.round(distanceKm * 0.621371)} mil` : `${distanceKm} km`;

  useEffect(() => {
    // Tip adı expo-location sürümleri arasında değiştiği için gevşek bırakıldı;
    // kullandığımız tek üye `.remove()`.
    let abone: { remove: () => void } | null = null;
    let iptal = false;

    (async () => {
      try {
        // trueHeading için konum izni gerekiyor; izin yoksa magHeading gelir.
        await Location.requestForegroundPermissionsAsync();
        abone = await Location.watchHeadingAsync((h: any) => {
          if (iptal) return;
          const gecerliTrue = typeof h.trueHeading === 'number' && h.trueHeading >= 0;
          setGercekKuzey(gecerliTrue);
          const deger = gecerliTrue ? h.trueHeading : h.magHeading;
          if (typeof deger === 'number' && !isNaN(deger)) {
            setHeading(((deger % 360) + 360) % 360);
          }
        });
      } catch {
        if (!iptal) setSensorHatasi('Pusula sensörüne erişilemedi.');
      }
    })();

    return () => {
      iptal = true;
      if (abone) abone.remove();
    };
  }, []);

  const hazir = heading !== null;
  const h = heading ?? 0;

  const sapma = ((qiblaBearing - h + 540) % 360) - 180;
  const hizali = hazir && Math.abs(sapma) < HIZA_TOLERANSI;
  const ipucu = !hazir
    ? 'Pusula hazırlanıyor…'
    : hizali
    ? 'Kıble yönündesiniz'
    : sapma > 0
    ? 'Sağa dönün'
    : 'Sola dönün';

  const yonler = [
    { etiket: 'K', aci: 0, renk: colors.copperVivid },
    { etiket: 'D', aci: 90, renk: colors.textOnDarkMuted },
    { etiket: 'G', aci: 180, renk: colors.textOnDarkMuted },
    { etiket: 'B', aci: 270, renk: colors.textOnDarkMuted },
  ];

  const kaabaRad = ((qiblaBearing - 90) * Math.PI) / 180;
  const kaabaX = CENTER + (RADIUS - 46) * Math.cos(kaabaRad);
  const kaabaY = CENTER + (RADIUS - 46) * Math.sin(kaabaRad);
  const okX = CENTER + (RADIUS - 16) * Math.cos(kaabaRad);
  const okY = CENTER + (RADIUS - 16) * Math.sin(kaabaRad);

  const cizgiler = Array.from({ length: 72 }, (_, i) => i * 5);
  const vurgu = hizali ? colors.success : colors.copperVivid;

  if (rehberAcik) {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title="Pusula Doğruluğu" icon="kible" onClose={() => setRehberAcik(false)} />
        <ScrollView contentContainerStyle={[styles.rehberIcerik, { paddingBottom: insets.bottom + spacing.xl }]}>
          <Text style={styles.rehberGiris}>
            Pusulanın doğruluğu tamamen telefonunuzun manyetik sensörüne bağlıdır.
            Aşağıdaki adımlar çoğu telefonda doğruluğu belirgin şekilde artırır.
          </Text>
          {[
            'Telefonu mıknatıs, hoparlör ve metal yüzeylerden uzaklaştırın. Mıknatıslı kılıflar pusulayı en çok bozan etkendir.',
            'Telefonu düz tutarak havada sekiz (8) çizer gibi birkaç kez çevirin. Bu, cihazın sensörü yeniden kalibre etmesini sağlar.',
            'Mümkünse açık alanda kullanın. Bina içi, asansör ve otopark manyetik alanı bozar.',
            'Telefonu yere paralel (masaya koyar gibi) tutun. Eğik tutmak okumayı kaydırır.',
          ].map((metin, i) => (
            <View key={i} style={styles.rehberAdim}>
              <View style={styles.rehberNo}>
                <Text style={styles.rehberNoYazi}>{i + 1}</Text>
              </View>
              <Text style={styles.rehberMetin}>{metin}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Kıble"
        subtitle={`${location.il} · ${location.ilce}`}
        icon="kible"
        onClose={onClose}
        rightIcon="bilgi"
        onRightPress={() => setRehberAcik(true)}
      />

      <ScrollView
        contentContainerStyle={[styles.icerik, { paddingBottom: insets.bottom + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.ipucuSatir, hizali && styles.ipucuSatirHizali]}>
          {hazir && !hizali && <AnimasyonluOk yon={sapma > 0 ? 'sag' : 'sol'} />}
          {hizali && <Icon name="onay" size={24} color={colors.success} />}
          <Text style={[styles.ipucuYazi, hizali && styles.ipucuYaziHizali]}>{ipucu}</Text>
          {hazir && !hizali && <AnimasyonluOk yon={sapma > 0 ? 'sag' : 'sol'} />}
        </View>

        <View style={styles.pusulaKap}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <Defs>
              {/* Dış çerçeve: madeni, hafif kabartma hissi veren gradyan */}
              <LinearGradient id="cerceve" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={colors.copperLight} />
                <Stop offset="0.5" stopColor={vurgu} />
                <Stop offset="1" stopColor={colors.copperVivid} />
              </LinearGradient>
              {/* Kadran zemini: merkezden kenara doğru koyulaşan radyal
                  gradyan — düz tek renk yerine cam/metal derinliği verir. */}
              <RadialGradient id="kadran" cx="50%" cy="42%" r="75%">
                <Stop offset="0" stopColor={colors.primaryLight} stopOpacity={0.9} />
                <Stop offset="0.55" stopColor={colors.primary} />
                <Stop offset="1" stopColor={colors.primaryDark} />
              </RadialGradient>
              {/* Kâbe küpü: üstten aydınlık, altta gölgeli — düz siyah
                  dikdörtgen yerine hacim hissi. */}
              <LinearGradient id="kaabeGovde" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#2A2A2A" />
                <Stop offset="0.4" stopColor="#161616" />
                <Stop offset="1" stopColor="#050505" />
              </LinearGradient>
              <LinearGradient id="kaabeKisve" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={colors.gold} />
                <Stop offset="0.5" stopColor={colors.copperBright} />
                <Stop offset="1" stopColor={colors.gold} />
              </LinearGradient>
            </Defs>

            {/* Dış madeni çerçeve */}
            <Circle
              cx={CENTER} cy={CENTER} r={RADIUS + 17}
              stroke="url(#cerceve)" strokeWidth={5} fill={colors.primaryDark}
            />
            <Circle
              cx={CENTER} cy={CENTER} r={RADIUS + 17}
              stroke={colors.primaryDeep} strokeWidth={1} fill="none" opacity={0.5}
            />
            <Circle
              cx={CENTER} cy={CENTER} r={RADIUS + 9}
              stroke={colors.textOnDarkMuted} strokeWidth={1} fill="none" opacity={0.3}
            />

            {/* Sabit üst işaret — telefonun baktığı yön (madalyon biçimli) */}
            <G>
              <Circle cx={CENTER} cy={14} r={11} fill={colors.primaryDark} stroke={vurgu} strokeWidth={2} />
              <Polygon points={`${CENTER},7 ${CENTER - 5},19 ${CENTER + 5},19`} fill={vurgu} />
            </G>

            {/* Dönen kadran */}
            <G transform={`rotate(${-h} ${CENTER} ${CENTER})`}>
              <Circle
                cx={CENTER} cy={CENTER} r={RADIUS}
                stroke={colors.textOnDarkMuted} strokeWidth={1.5}
                fill="url(#kadran)"
              />

              {/* İç ince tali halka — kadrana gravür hissi katar */}
              <Circle
                cx={CENTER} cy={CENTER} r={RADIUS - 40}
                stroke={colors.textOnDarkMuted} strokeWidth={0.75} fill="none" opacity={0.25}
              />

              {cizgiler.map((deg) => {
                const anaYon = deg % 90 === 0;
                const orta = deg % 30 === 0;
                const uzunluk = anaYon ? 17 : orta ? 11 : 5;
                const rad = ((deg - 90) * Math.PI) / 180;
                return (
                  <Line
                    key={deg}
                    x1={CENTER + (RADIUS - 1) * Math.cos(rad)}
                    y1={CENTER + (RADIUS - 1) * Math.sin(rad)}
                    x2={CENTER + (RADIUS - 1 - uzunluk) * Math.cos(rad)}
                    y2={CENTER + (RADIUS - 1 - uzunluk) * Math.sin(rad)}
                    stroke={anaYon ? colors.copperLight : colors.textOnDarkMuted}
                    strokeWidth={anaYon ? 2.5 : 1}
                    opacity={anaYon ? 1 : 0.45}
                  />
                );
              })}

              {yonler.map((y) => {
                const rad = ((y.aci - 90) * Math.PI) / 180;
                const mx = CENTER + (RADIUS - 33) * Math.cos(rad);
                const my = CENTER + (RADIUS - 33) * Math.sin(rad);
                const ana = y.etiket === 'K';
                return (
                  <G key={y.etiket}>
                    {/* Ana yön etiketleri (özellikle Kuzey) küçük bir
                        madalyon zemini üzerinde durur — Muslim Pro tarzı
                        pusulalardaki gibi metnin kadrana "yapışık" değil,
                        hafifçe öne çıkmış görünmesini sağlar. */}
                    {ana && <Circle cx={mx} cy={my} r={13} fill={colors.primaryDeep} opacity={0.55} />}
                    <SvgText
                      x={mx} y={my + (ana ? 7 : 7)}
                      fontSize={ana ? 22 : 18} fontWeight="bold"
                      fill={y.renk} textAnchor="middle"
                    >
                      {y.etiket}
                    </SvgText>
                  </G>
                );
              })}

              {/* Kıble ışını — hafif ışıma efektiyle iki katman */}
              <Line
                x1={CENTER} y1={CENTER}
                x2={CENTER + (RADIUS - 28) * Math.cos(kaabaRad)}
                y2={CENTER + (RADIUS - 28) * Math.sin(kaabaRad)}
                stroke={vurgu} strokeWidth={6} opacity={0.18}
                strokeLinecap="round"
              />
              <Line
                x1={CENTER} y1={CENTER}
                x2={CENTER + (RADIUS - 28) * Math.cos(kaabaRad)}
                y2={CENTER + (RADIUS - 28) * Math.sin(kaabaRad)}
                stroke={vurgu} strokeWidth={2.5} opacity={0.7}
                strokeLinecap="round"
              />

              <G transform={`rotate(${(qiblaBearing + 180) % 360} ${okX} ${okY})`}>
                <Polygon
                  points={`${okX},${okY - 13} ${okX - 8},${okY + 8} ${okX},${okY + 3} ${okX + 8},${okY + 8}`}
                  fill={vurgu}
                  stroke={colors.primaryDark}
                  strokeWidth={0.6}
                  strokeLinejoin="round"
                />
              </G>

              {/* ── KÂBE İLLÜSTRASYONU ──
                  Önceki sürüm tek bir düz siyah kare + iki çizgiydi ve
                  "ne olduğu anlaşılmıyor" geri bildirimi aldı. Yeni çizim:
                  gradyanlı gövde (hacim), Kiswa'nın altın kuşağını (hizam)
                  gerçek oranıyla veren bir bant, kapı (Kâbe kapısı/mültezem)
                  detayı ve hafif bir taban gölgesi. Kadranla birlikte döner
                  ama kendi içinde her zaman dik durur. */}
              <G transform={`rotate(${h} ${kaabaX} ${kaabaY})`}>
                {/* Taban gölgesi */}
                <Rect
                  x={kaabaX - 12} y={kaabaY + 12.5} width={24} height={3} rx={1.5}
                  fill={colors.primaryDeep} opacity={0.4}
                />
                {/* Gövde */}
                <Rect
                  x={kaabaX - 11} y={kaabaY - 13} width={22} height={26} rx={1.5}
                  fill="url(#kaabeGovde)" stroke={colors.gold} strokeWidth={1}
                />
                {/* Kiswa kuşağı (hizam) — üst üçte birde altın bant */}
                <Rect
                  x={kaabaX - 11} y={kaabaY - 5.5} width={22} height={4.5}
                  fill="url(#kaabeKisve)"
                />
                <Line
                  x1={kaabaX - 11} y1={kaabaY - 5.5} x2={kaabaX + 11} y2={kaabaY - 5.5}
                  stroke={colors.gold} strokeWidth={0.5} opacity={0.8}
                />
                <Line
                  x1={kaabaX - 11} y1={kaabaY - 1} x2={kaabaX + 11} y2={kaabaY - 1}
                  stroke={colors.gold} strokeWidth={0.5} opacity={0.8}
                />
                {/* Kapı (mültezem) — altın çerçeveli küçük dikdörtgen */}
                <Rect
                  x={kaabaX - 3} y={kaabaY + 1.5} width={6} height={9} rx={0.6}
                  fill="#0A0A0A" stroke={colors.gold} strokeWidth={0.7}
                />
                {/* Sol yüzey highlight — hacim hissini güçlendirir */}
                <Line
                  x1={kaabaX - 9} y1={kaabaY - 11.5} x2={kaabaX - 9} y2={kaabaY + 11.5}
                  stroke={colors.copperLight} strokeWidth={0.6} opacity={0.35}
                />
              </G>

              <Circle cx={CENTER} cy={CENTER} r={5.5} fill={colors.copperVivid} stroke={colors.primaryDark} strokeWidth={1.2} />
            </G>
          </Svg>
        </View>

        <View style={styles.dereceKap}>
          <Text style={styles.dereceDeger}>{Math.round(qiblaBearing)}°</Text>
          <Text style={styles.dereceEtiket}>Kıble açısı</Text>
        </View>

        <View style={styles.kartlar}>
          <View style={styles.kart}>
            <Icon name="kabe" size={20} color={colors.primary} />
            <View style={styles.kartMetin}>
              <Text style={styles.kartEtiket}>Kâbe'ye uzaklık</Text>
              <Text style={styles.kartDeger}>{mesafe}</Text>
            </View>
          </View>
          <View style={styles.kart}>
            <Icon name="gunes" size={20} color={colors.primary} />
            <View style={styles.kartMetin}>
              <Text style={styles.kartEtiket}>Güneşle kıble anı</Text>
              <Text style={styles.kartDeger}>
                {String(qiblaTime.getHours()).padStart(2, '0')}:
                {String(qiblaTime.getMinutes()).padStart(2, '0')}
              </Text>
            </View>
          </View>
        </View>

        {sensorHatasi ? (
          <View style={styles.uyariKart}>
            <Icon name="uyari" size={18} color={colors.danger} />
            <Text style={styles.uyariYazi}>{sensorHatasi}</Text>
          </View>
        ) : !hazir ? (
          <View style={styles.bilgiKart}>
            <Icon name="bilgi" size={18} color={colors.textMuted} />
            <Text style={styles.bilgiYazi}>
              Pusula okuması bekleniyor. Telefonu düz tutup hafifçe çevirin.
            </Text>
          </View>
        ) : !gercekKuzey ? (
          <View style={styles.bilgiKart}>
            <Icon name="bilgi" size={18} color={colors.textMuted} />
            <Text style={styles.bilgiYazi}>
              Manyetik kuzeye göre gösteriliyor. Konum izni verilirse gerçek
              kuzeye göre daha isabetli olur.
            </Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.rehberBtn} onPress={() => setRehberAcik(true)}>
          <Icon name="bilgi" size={18} color={colors.primaryDark} />
          <Text style={styles.rehberBtnYazi}>Pusula doğru göstermiyor mu?</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  icerik: { paddingHorizontal: spacing.md, paddingTop: spacing.md, alignItems: 'center' },

  ipucuSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.md,
    minWidth: 240,
    ...elevation.card,
  },
  ipucuSatirHizali: { borderColor: colors.success, backgroundColor: '#F1FBF6' },
  ipucuYazi: { fontFamily: typography.bodyBold, fontSize: 17, color: colors.textOnLight },
  ipucuYaziHizali: { color: colors.success },

  pusulaKap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },

  dereceKap: { alignItems: 'center', marginBottom: spacing.lg },
  dereceDeger: { fontFamily: typography.displayFamily, fontSize: 40, color: colors.primaryDark, lineHeight: 50 },
  dereceEtiket: { fontFamily: typography.bodyMedium, fontSize: 14, color: colors.textMuted },

  kartlar: { flexDirection: 'row', gap: spacing.sm, width: '100%', marginBottom: spacing.md },
  kart: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, borderRadius: radius.md,
    paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  kartMetin: { flex: 1 },
  kartEtiket: { fontFamily: typography.bodyMedium, fontSize: 12, color: colors.textMuted },
  kartDeger: { fontFamily: typography.bodyBold, fontSize: 17, color: colors.primaryDark, marginTop: 1 },

  bilgiKart: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.creamDeep, borderRadius: radius.md,
    padding: spacing.md, width: '100%', marginBottom: spacing.md,
  },
  bilgiYazi: { flex: 1, fontFamily: typography.bodyMedium, fontSize: 13.5, color: colors.textMuted, lineHeight: 20 },
  uyariKart: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#FDEDEA', borderRadius: radius.md,
    padding: spacing.md, width: '100%', marginBottom: spacing.md,
  },
  uyariYazi: { flex: 1, fontFamily: typography.bodyBold, fontSize: 13.5, color: colors.danger },

  rehberBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.creamDeep, borderRadius: radius.pill,
    paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
    borderWidth: 1, borderColor: colors.borderStrong, width: '100%',
  },
  rehberBtnYazi: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.primaryDark },

  rehberIcerik: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  rehberGiris: { fontFamily: typography.bodyMedium, fontSize: 15, color: colors.textMuted, lineHeight: 23, marginBottom: spacing.lg },
  rehberAdim: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg, alignItems: 'flex-start' },
  rehberNo: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  rehberNoYazi: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.white },
  rehberMetin: { flex: 1, fontFamily: typography.bodyFamily, fontSize: 15, color: colors.textOnLight, lineHeight: 23 },
});
