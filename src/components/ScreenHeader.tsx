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
import { useCeviri } from '../i18n/DilContext';

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
  const { t } = useCeviri();

  return (
    // Kalıcı kural: hiçbir üst/alt buton ekran kenarına yapışık durmamalı.
    // `insets.top` üzerine önceden yalnızca `spacing.sm` (8dp) ekleniyordu;
    // görünürlüğü garanti altına almak için `spacing.md` (16dp) yapıldı.
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.md }]}>
      <IslamicPattern color={colors.cream} opacity={0.06} tile={40} />
      <View style={styles.row}>
        {onClose ? (
          // Geri butonu artık yalnızca ikon değil, yanında büyük fontlu
          // "Geri" yazısı da taşıyor — kullanıcı butonun daha belirgin ve
          // metinli olmasını istedi. `sideBtn` yerine kendi genişliğine
          // göre büyüyen `geriBtn` kullanılıyor; sağ taraf (rightIcon ya da
          // boş View) hâlâ `sideBtn` (40dp) olduğundan başlık artık tam
          // ortalanmıyor olabilir — bu, geri yazısının okunaklı olması için
          // kabul edilen bir görsel ödün.
          <TouchableOpacity
            onPress={onClose}
            style={styles.geriBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={t('geri')}
          >
            <Icon name="geri" size={27} color={colors.textOnDark} />
            <Text style={styles.geriYazi} numberOfLines={1}>
              {t('geri')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.sideBtn} />
        )}

        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            {icon && <Icon name={icon} size={21} color={colors.copperLight} />}
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
  // Geri butonu: ikon + büyük fontlu "Geri" yazısı yan yana, aynı hizada.
  // Madde 10b (bu tur): kullanıcı geri ok ikonunun ve yazısının hâlâ küçük
  // kaldığını bildirdi — ok 22→27, yazı 16→18 yapıldı; `minWidth`/`height`
  // 44'e çıkarılarak büyüyen ikonla dokunma alanı orantılı kaldı.
  geriBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 44,
    height: 44,
    paddingRight: spacing.xs,
  },
  geriYazi: {
    fontFamily: typography.bodyBold,
    fontSize: 18,
    color: colors.textOnDark,
  },
  titleWrap: { flex: 1, alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  // Madde 8 (bu tur): sayfa başlıkları (İmsakiye, Vaktinde Kıl, Kıble, Şehir
  // Değiştir vb.) ve yanlarındaki ikonlar okunurluk için büyütüldü (18→21).
  title: {
    fontFamily: typography.displaySemibold,
    color: colors.textOnDark,
    fontSize: 21,
  },
  subtitle: {
    fontFamily: typography.bodyMedium,
    color: colors.textOnDarkMuted,
    fontSize: 11.5,
    marginTop: 1,
  },
});
