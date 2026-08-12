// src/components/GeometricDivider.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

function EightPointStar({ size = 14, color = colors.gold }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 0 L14.5 7.5 L22 7 L16.5 12 L22 17 L14.5 16.5 L12 24 L9.5 16.5 L2 17 L7.5 12 L2 7 L9.5 7.5 Z"
        fill={color}
        opacity={0.85}
      />
    </Svg>
  );
}

export default function GeometricDivider() {
  const stars = Array.from({ length: 9 });
  return (
    <View style={styles.row}>
      {stars.map((_, i) => (
        <EightPointStar key={i} size={i % 2 === 0 ? 10 : 6} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
});
