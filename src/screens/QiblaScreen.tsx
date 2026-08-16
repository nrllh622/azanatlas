// src/screens/QiblaScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceMotion } from 'expo-sensors';
import Svg, { Circle, G, Line, Text as SvgText, Polygon, Path } from 'react-native-svg';
import { colors, spacing, typography } from '../theme';
import { calculateQiblaBearing, calculateDistanceKm, calculateQiblaTime } from '../lib/qibla';
import { useLocationContext } from '../context/LocationContext';
import { useCalculationSettings } from '../context/CalculationSettingsContext';

interface Props {
  onClose: () => void;
}

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 24;

function AnimatedArrow({ direction }: { direction: 'left' | 'right' }) {
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shift, { toValue: 1, duration: 550, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(shift, { toValue: 0, duration: 550, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shift]);

  const translateX = shift.interpolate({
    inputRange: [0, 1],
    outputRange: direction === 'right' ? [0, 10] : [0, -10],
  });

  return (
    <Animated.Text style={[styles.animArrow, { transform: [{ translateX }] }]}>
      {direction === 'right' ? '›' : '‹'}
    </Animated.Text>
  );
}

function CalibrationOverlay({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.calibOverlay}>
      <TouchableOpacity style={styles.calibCloseBtn} onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Text style={styles.calibCloseText}>Kapat</Text>
      </TouchableOpacity>
      <Svg width={180} height={120} viewBox="0 0 180 120">
        {/* Sekiz (sonsuzluk) şekli — kalibrasyon hareketini temsil ediyor */}
        <Path
          d="M 20 60 C 20 30, 70 30, 90 60 C 110 90, 160 90, 160 60 C 160 30, 110 30, 90 60 C 70 90, 20 90, 20 60 Z"
          stroke={colors.gold}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.calibText}>
        Pusula doğruluğu için cihazını sekiz çizer gibi havada hareket ettir, sonra tekrar dene.
      </Text>
    </View>
  );
}

export default function QiblaScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { location } = useLocationContext();
  const { distanceUnit } = useCalculationSettings();
  const [heading, setHeading] = useState(0);
  const [calibrationVisible, setCalibrationVisible] = useState(false);

  const qiblaBearing = useMemo(() => calculateQiblaBearing(location.latitude, location.longitude), [location]);
  const distanceKm = useMemo(() => calculateDistanceKm(location.latitude, location.longitude), [location]);
  const qiblaTime = useMemo(() => calculateQiblaTime(location.latitude, location.longitude, new Date()), [location]);

  const distanceDisplay =
    distanceUnit === 'mi' ? `${Math.round(distanceKm * 0.621371)} mi` : `${distanceKm} km`;

  useEffect(() => {
    DeviceMotion.setUpdateInterval(150);
    const sub = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        const alphaDeg = (data.rotation.alpha * 180) / Math.PI;
        let h = (360 - alphaDeg) % 360;
        if (h < 0) h += 360;
        setHeading(h);
      }
    });
    return () => sub && sub.remove();
  }, []);

  const diff = ((qiblaBearing - heading + 540) % 360) - 180;
  const aligned = Math.abs(diff) < 5;
  const turnHint = aligned ? 'Kıble yönündesiniz' : diff > 0 ? 'Sağa dönün' : 'Sola dönün';

  const cardinals = [
    { label: 'N', angle: 0, color: '#D64545' },
    { label: 'E', angle: 90, color: colors.sand },
    { label: 'S', angle: 180, color: colors.sand },
    { label: 'W', angle: 270, color: colors.sand },
  ];

  const kaabaRad = ((qiblaBearing - 90) * Math.PI) / 180;
  const kaabaX = CENTER + (RADIUS - 48) * Math.cos(kaabaRad);
  const kaabaY = CENTER + (RADIUS - 48) * Math.sin(kaabaRad);

  const arrowX = CENTER + (RADIUS - 20) * Math.cos(kaabaRad);
  const arrowY = CENTER + (RADIUS - 20) * Math.sin(kaabaRad);
  const arrowRotateDeg = (qiblaBearing + 180) % 360;

  const tickMarks = Array.from({ length: 72 }, (_, i) => i * 5);

  if (calibrationVisible) {
    return <CalibrationOverlay onClose={() => setCalibrationVisible(false)} />;
  }

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Kıble</Text>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <TouchableOpacity onPress={() => setCalibrationVisible(true)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.calibrateLink}>Kalibre Et</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.closeText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.hintRow}>
          {!aligned && <AnimatedArrow direction={diff > 0 ? 'right' : 'left'} />}
          {aligned && <Text style={styles.hintIcon}>✓</Text>}
          <Text style={styles.hintText}>{turnHint}</Text>
          {!aligned && <AnimatedArrow direction={diff > 0 ? 'right' : 'left'} />}
        </View>

        <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <Circle cx={CENTER} cy={CENTER} r={RADIUS + 14} stroke={colors.gold} strokeWidth={3} fill={colors.primaryDark} />
            <Circle cx={CENTER} cy={CENTER} r={RADIUS + 8} stroke={colors.sand} strokeWidth={1} fill="none" opacity={0.4} />

            <Line x1={CENTER} y1={2} x2={CENTER} y2={18} stroke={colors.gold} strokeWidth={4} />

            <G transform={`rotate(${-heading} ${CENTER} ${CENTER})`}>
              <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke={colors.sand} strokeWidth={1.5} fill={colors.primary} />

              {tickMarks.map((deg) => {
                const isMajor = deg % 90 === 0;
                const isMid = deg % 30 === 0;
                const len = isMajor ? 16 : isMid ? 10 : 5;
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = CENTER + (RADIUS - 1) * Math.cos(rad);
                const y1 = CENTER + (RADIUS - 1) * Math.sin(rad);
                const x2 = CENTER + (RADIUS - 1 - len) * Math.cos(rad);
                const y2 = CENTER + (RADIUS - 1 - len) * Math.sin(rad);
                return (
                  <Line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.sand} strokeWidth={isMajor ? 2.5 : 1} opacity={isMajor ? 1 : 0.45} />
                );
              })}

              {cardinals.map((c) => {
                const rad = ((c.angle - 90) * Math.PI) / 180;
                const x = CENTER + (RADIUS - 30) * Math.cos(rad);
                const y = CENTER + (RADIUS - 30) * Math.sin(rad);
                return (
                  <SvgText key={c.label} x={x} y={y + 7} fontSize={19} fontWeight="bold" fill={c.color} textAnchor="middle">
                    {c.label}
                  </SvgText>
                );
              })}

              <Circle cx={CENTER} cy={CENTER} r={4} fill={colors.gold} />

              <SvgText x={kaabaX} y={kaabaY + 10} fontSize={30} textAnchor="middle">
                🕋
              </SvgText>

              <G transform={`rotate(${arrowRotateDeg} ${arrowX} ${arrowY})`}>
                <Polygon points={`${arrowX},${arrowY - 9} ${arrowX - 6},${arrowY + 6} ${arrowX + 6},${arrowY + 6}`} fill="#D64545" />
              </G>
            </G>
          </Svg>
        </View>

        <Text style={styles.degreeText}>{Math.round(heading)}°</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Kıble Açısı: {qiblaBearing.toFixed(1)}°</Text>
          <Text style={styles.infoText}>
            Kıble Saati: {qiblaTime.getHours().toString().padStart(2, '0')}:{qiblaTime.getMinutes().toString().padStart(2, '0')}
          </Text>
          <Text style={styles.infoText}>{distanceDisplay}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  calibrateLink: { fontFamily: typography.bodyBold, color: colors.sand, fontSize: 14, textDecorationLine: 'underline' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hintIcon: { color: colors.gold, fontSize: 26 },
  hintText: { fontFamily: typography.bodyBold, color: colors.textOnDark, fontSize: 18 },
  animArrow: { color: colors.gold, fontSize: 30, fontWeight: 'bold' },
  degreeText: { fontFamily: typography.displayFamily, color: colors.textOnDark, fontSize: 40 },
  infoBox: { alignItems: 'center', gap: 2, marginTop: spacing.sm },
  infoText: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 14 },
  calibOverlay: { flex: 1, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  calibCloseBtn: { position: 'absolute', top: 50, right: 20 },
  calibCloseText: { fontFamily: typography.bodyBold, color: colors.white, fontSize: 16 },
  calibText: { fontFamily: typography.bodyMedium, color: colors.white, fontSize: 16, textAlign: 'center', marginTop: spacing.lg },
});
