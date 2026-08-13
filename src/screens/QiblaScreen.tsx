// src/screens/QiblaScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { colors, spacing, typography } from '../theme';
import { calculateQiblaBearing, calculateDistanceKm } from '../lib/qibla';
import { useLocationContext } from '../context/LocationContext';

interface Props {
  onClose: () => void;
}

export default function QiblaScreen({ onClose }: Props) {
  const { location } = useLocationContext();
  const [heading, setHeading] = useState(0);

  const qiblaBearing = calculateQiblaBearing(location.latitude, location.longitude);
  const distanceKm = calculateDistanceKm(location.latitude, location.longitude);

  useEffect(() => {
    Magnetometer.setUpdateInterval(150);
    const sub = Magnetometer.addListener(({ x, y }) => {
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      setHeading(angle);
    });
    return () => sub.remove();
  }, []);

  const needleRotation = (qiblaBearing - heading + 360) % 360;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Kıble</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.compassWrap}>
        <Svg width={260} height={260} viewBox="0 0 260 260">
          <Circle cx={130} cy={130} r={120} stroke={colors.gold} strokeWidth={2} fill="none" />
          <Circle cx={130} cy={130} r={2} fill={colors.gold} />
          <Polygon
            points="130,20 138,60 122,60"
            fill={colors.gold}
            transform={`rotate(${needleRotation} 130 130)`}
          />
          <Line
            x1={130}
            y1={130}
            x2={130}
            y2={60}
            stroke={colors.gold}
            strokeWidth={3}
            transform={`rotate(${needleRotation} 130 130)`}
          />
        </Svg>
        <Text style={styles.hintText}>Telefonu düz tutup çevirerek altın oku takip et</Text>
        <Text style={styles.distanceText}>Kâbe'ye uzaklık: {distanceKm} km</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  compassWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  hintText: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 14, textAlign: 'center', paddingHorizontal: spacing.lg },
  distanceText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 15 },
});
