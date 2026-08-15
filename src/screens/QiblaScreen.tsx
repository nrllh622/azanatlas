// src/screens/QiblaScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Magnetometer } from 'expo-sensors';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { colors, spacing, typography } from '../theme';
import { calculateQiblaBearing, calculateDistanceKm, calculateQiblaTime } from '../lib/qibla';
import { useLocationContext } from '../context/LocationContext';

interface Props {
  onClose: () => void;
}

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 20;

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
    Magnetometer.setUpdateInterval(150);
    const sub = Magnetometer.addListener(({ x, y }) => {
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      angle = (angle + 90 + 360) % 360; // telefonun üstünü 0° kabul et
      setHeading(angle);
    });
    return () => sub.remove();
  }, []);

  // diff > 0: kıble sağda, kullanıcı sağa dönmeli. diff < 0: sola dönmeli.
  const diff = ((qiblaBearing - heading + 540) % 360) - 180;
  const aligned = Math.abs(diff) < 5;
  const turnHint = aligned ? 'Kıble yönündesiniz' : diff > 0 ? 'Sağa dönün' : 'Sola dönün';

  const cardinals = [
    { label: 'N', angle: 0 },
    { label: 'E', angle: 90 },
    { label: 'S', angle: 180 },
    { label: 'W', angle: 270 },
  ];

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Kıble</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.hintRow}>
          <Text style={styles.hintIcon}>{aligned ? '✓' : diff > 0 ? '↻' : '↺'}</Text>
          <Text style={styles.hintText}>{turnHint}</Text>
        </View>

        <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {/* Sabit üst gösterge - kullanıcının baktığı yön */}
            <Line x1={CENTER} y1={8} x2={CENTER} y2={26} stroke={colors.gold} strokeWidth={4} />

            <G transform={`rotate(${-heading} ${CENTER} ${CENTER})`}>
              <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke={colors.sand} strokeWidth={2} fill="none" />
              {cardinals.map((c) => {
                const rad = ((c.angle - 90) * Math.PI) / 180;
                const x = CENTER + (RADIUS - 18) * Math.cos(rad);
                const y = CENTER + (RADIUS - 18) * Math.sin(rad);
                return (
                  <SvgText
                    key={c.label}
                    x={x}
                    y={y + 6}
                    fontSize={16}
                    fontWeight="bold"
                    fill={colors.sand}
                    textAnchor="middle"
                  >
                    {c.label}
                  </SvgText>
                );
              })}
              {/* Kıble yönü göstergesi */}
              {(() => {
                const rad = ((qiblaBearing - 90) * Math.PI) / 180;
                const x = CENTER + (RADIUS - 45) * Math.cos(rad);
                const y = CENTER + (RADIUS - 45) * Math.sin(rad);
                return (
                  <SvgText x={x} y={y + 10} fontSize={30} textAnchor="middle">
                    🕋
                  </SvgText>
                );
              })()}
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  hintIcon: { color: colors.gold, fontSize: 22 },
  hintText: { fontFamily: typography.bodyBold, color: colors.textOnDark, fontSize: 16 },
  degreeText: { fontFamily: typography.displayFamily, color: colors.textOnDark, fontSize: 40 },
  infoBox: { alignItems: 'center', gap: 2, marginTop: spacing.sm },
  infoText: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 14 },
});
