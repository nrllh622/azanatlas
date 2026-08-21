// src/components/ScreenHeader.tsx
//
// Tüm alt ekranların (Kıble, Tesbih, Esmaül Hüsna, Kaza, Ayarlar...) ortak
// başlığı. Koyu turkuaz zemin + üzerinde çok hafif geometrik desen + solda
// geri ikonu. Her ekranın kendi başlığını yazması yerine tek yerden gelmesi,
// uygulamanın baştan sona aynı görsel dilde durmasını sağlıyor.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon, { IconName } from './Icon';
import IslamicPattern from './IslamicPattern';
import { colors, spacing, typography, radius } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  icon?: IconName;
  /** Sağ üstte gösterilecek ek aksiyon (ör. sıfırla, kaydet) */
  rightIcon?: IconName;
  onRightPress?: () => void;
}

export default function ScreenHeader({
  title,
  subtitle,
  onClose,
  icon,
  rightIcon,
  onRightPress,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      <IslamicPattern color={colors.cream} opacity={0.06} tile={40} />
      <View style={styles.row}>
        {onClose ? (
          <TouchableOpacity
            onPress={onClose}
            style={styles.sideBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Geri"
          >
            <Icon name="geri" size={22} color={colors.textOnDark} />
          </TouchableOpacity>
        ) : (
          <View style={styles.sideBtn} />
        )}

        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            {icon && <Icon name={icon} size={18} color={colors.copperLight} />}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightIcon && onRightPress ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.sideBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
          >
            <Icon name={rightIcon} size={20} color={colors.copperLight} />
          </TouchableOpacity>
        ) : (
          <View style={styles.sideBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primaryDark,
    paddingBottom: spacing.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  sideBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1, alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  title: {
    fontFamily: typography.displaySemibold,
    color: colors.textOnDark,
    fontSize: 18,
  },
  subtitle: {
    fontFamily: typography.bodyMedium,
    color: colors.textOnDarkMuted,
    fontSize: 11.5,
    marginTop: 1,
  },
});
