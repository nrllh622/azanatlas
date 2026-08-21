// src/components/GeometricDivider.tsx
//
// Bölüm ayırıcı: ortada sekiz köşeli yıldız (hatem), iki yana doğru incelen
// bakır çizgiler. Tezhipli el yazması sayfalardaki bölüm ayraçlarından esinli.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '../theme';

function EightPointStar({ size = 12, color = colors.copper }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 0 L14.5 7.5 L22 7 L16.5 12 L22 17 L14.5 16.5 L12 24 L9.5 16.5 L2 17 L7.5 12 L2 7 L9.5 7.5 Z"
        fill={color}
        opacity={0.9}
      />
    </Svg>
  );
}

interface Props {
  color?: string;
  lineColor?: string;
}

export default function GeometricDivider({
  color = colors.copper,
  lineColor = colors.sand,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      <EightPointStar size={7} color={color} />
      <EightPointStar size={11} color={color} />
      <EightPointStar size={7} color={color} />
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    maxWidth: 90,
    opacity: 0.7,
  },
});
