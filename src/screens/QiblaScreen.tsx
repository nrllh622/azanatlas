// src/screens/QiblaScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceMotion } from 'expo-sensors';
import Svg, { Circle, G, Line, Text as SvgText, Polygon, Path } from 'react-native-svg';
import { colors, spacing, typography } from '../theme';
import { calculateQiblaBearing, calculateDistanceKm, calculateQiblaTime } from '../lib/qibla';
import { useLocationContext } from '../context/LocationContext';

interface Props {
  onClose: () => void;
}

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 24;

function RotateIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <Svg width={34} height={34} viewBox="0 0 32 32">
      <G transform={direction === 'left' ? 'scale(-1,1) translate(-32,0)' : undefined}>
        <Path
          d="M 26 16 A 10 10 0 1 0 17 26"
          stroke={colors.gold}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <Polygon points="17,26 24,25 20,32" fill={colors.gold} />
      </G>
    </Svg>
  );
}

export default function QiblaScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { location } = useLocationContext();
  const [heading, setHeading] = useState(0);

  const qiblaBearing = useMemo(
    () => calculateQiblaBearing(location.latitude, location.longitude),
    [location]
  );
  const distanceKm = useMemo(
    () => calculateDistanceKm(location.latitude, location.longitude),
    [location]
  );
  const qiblaTime = useMemo(
    () => calculateQiblaTime(location.latitude, location.longitude, new Date()),
    [location]
  );

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
    { label: 'K', angle: 0 },
    { label: 'D', angle: 90 },
    { label: 'G', angle: 180 },
    { label: 'B', angle: 270 },
  ];

  const kaabaRad = ((qiblaBearing - 90) * Math.PI) / 180;
  const kaabaX = CENTER + (RADIUS - 48) * Math.cos(kaabaRad);
  const kaabaY = CENTER + (RADIUS - 48) * Math.sin(kaabaRad);

  // Kırmızı ok, Kaabe işaretinin biraz dışında, merkeze doğru (içe) bakacak şekilde
  const arrowRad = ((qiblaBearing - 90) * Math.PI) / 180;
  const arrowX = CENTER + (RADIUS - 20) * Math.cos(arrowRad);
  const arrowY = CENTER + (RADIUS - 20) * Math.sin(arrowRad);
  const arrowRotateDeg = (qiblaBearing + 180) % 360;

  const tickMarks = Array.from({ length: 72 }, (_, i) => i * 5);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Kıble</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.hintRow}>
          {!aligned && <RotateIcon direction={diff > 0 ? 'right' : 'left'} />}
          {aligned && <Text style={styles.hintIcon}>✓</Text>}
          <Text style={styles.hintText}>{turnHint}</Text>
        </View>

        <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <Line x1={CENTER} y1={4} x2={CENTER} y2={22} stroke={colors.gold} strokeWidth={4} />

            <G transform={`rotate(${-heading} ${CENTER} ${CENTER})`}>
              <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke={colors.sand} strokeWidth={2} fill="none" />

              {/* Gerçek pusula hissi için ince açı çizgileri */}
              {tickMarks.map((deg) => {
                const isMajor = deg % 90 === 0;
                const isMid = deg % 30 === 0;
                const len = isMajor ? 14 : isMid ? 9 : 5;
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = CENTER + (RADIUS - 1) * Math.cos(rad);
                const y1 = CENTER + (RADIUS - 1) * Math.sin(rad);
                const x2 = CENTER + (RADIUS - 1 - len) * Math.cos(rad);
                const y2 = CENTER + (RADIUS - 1 - len) * Math.sin(rad);
                return (
                  <Line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={colors.sand}
                    strokeWidth={isMajor ? 2 : 1}
                    opacity={isMajor ? 0.9 : 0.4}
                  />
                );
              })}

              {cardinals.map((c) => {
                const rad = ((c.angle - 90) * Math.PI) / 180;
                const x = CENTER + (RADIUS - 26) * Math.cos(rad);
                const y = CENTER + (RADIUS - 26) * Math.sin(rad);
                return (
                  <SvgText
                    key={c.label}
                    x={x}
                    y={y + 6}
                    fontSize={17}
                    fontWeight="bold"
                    fill={colors.sand}
                    textAnchor="middle"
                  >
                    {c.label}
                  </SvgText>
                );
              })}

              <SvgText x={kaabaX} y={kaabaY + 10} fontSize={30} textAnchor="middle">
                🕋
              </SvgText>

              {/* Kırmızı yön oku: içe (merkeze) doğru bakar */}
              <G transform={`rotate(${arrowRotateDeg} ${arrowX} ${arrowY})`}>
                <Polygon
                  points={`${arrowX},${arrowY - 9} ${arrowX - 6},${arrowY + 6} ${arrowX + 6},${arrowY + 6}`}
                  fill="#D64545"
                />
              </G>
            </G>
          </Svg>
        </View>

        <Text style={styles.degreeText}>{Math.round(heading)}°</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Kıble Açısı: {qiblaBearing.toFixed(1)}°</Text>
          <Text style={styles.infoText}>
            Kıble Saati: {qiblaTime.getHours().toString().padStart(2, '0')}:
            {qiblaTime.getMinutes().toString().padStart(2, '0')}
          </Text>
          <Text style={styles.infoText}>{distanceKm} km</Text>
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
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hintIcon: { color: colors.gold, fontSize: 26 },
  hintText: { fontFamily: typography.bodyBold, color: colors.textOnDark, fontSize: 18 },
  degreeText: { fontFamily: typography.displayFamily, color: colors.textOnDark, fontSize: 40 },
  infoBox: { alignItems: 'center', gap: 2, marginTop: spacing.sm },
  infoText: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 14 },
});
