// src/components/PilOptimizasyonuUyarisi.tsx
//
// PİL OPTİMİZASYONU UYARI MODALI (bu tur — madde 8 + 11)
//
// Kullanıcının referans verdiği "Ezan Vakti Pro" uygulamasındaki modalla
// aynı iki parçalı yapı: kısa bir açıklama + tek, net bir aksiyon satırı
// ("Pil kısıtlamasını kaldır"). Gerçek çalışma mantığı
// `lib/pilOptimizasyonu.ts`'te — bu bileşen yalnızca görünümden sorumlu.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors, spacing, typography, radius, fontSize, lineHeight, elevation } from '../theme';
import { useCeviri } from '../i18n/DilContext';
import Icon from './Icon';

interface Props {
  visible: boolean;
  onKaldir: () => void;
  onAnladim: () => void;
}

export default function PilOptimizasyonuUyarisi({ visible, onKaldir, onAnladim }: Props) {
  const { t } = useCeviri();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onAnladim}>
      <View style={styles.overlay}>
        <View style={styles.kart}>
          <View style={styles.ikonKap}>
            <Icon name="bildirimAcik" size={24} color={colors.primary} />
          </View>
          <Text style={styles.baslik}>{t('pilUyarisiBaslik')}</Text>
          <Text style={styles.aciklama}>{t('pilUyarisiAciklama')}</Text>

          <TouchableOpacity style={styles.aksiyonKart} onPress={onKaldir} activeOpacity={0.8}>
            <View style={styles.aksiyonIkonKap}>
              <Icon name="yenile" size={18} color={colors.primary} />
            </View>
            <View style={styles.aksiyonMetin}>
              <Text style={styles.aksiyonBaslik}>{t('pilKisitlamasiniKaldir')}</Text>
              <Text style={styles.aksiyonAltMetin}>{t('pilKisitlamasiniKaldirAciklama')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onAnladim} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.anladimBtn}>
            <Text style={styles.anladimText}>{t('anladim')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  kart: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    ...elevation.card,
  },
  ikonKap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBright + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  baslik: {
    fontFamily: typography.displaySemibold,
    fontSize: fontSize.title,
    lineHeight: lineHeight.title,
    color: colors.textOnLight,
    marginBottom: spacing.sm,
  },
  aciklama: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  aksiyonKart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  aksiyonIkonKap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aksiyonMetin: { flex: 1 },
  aksiyonBaslik: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnLight,
  },
  aksiyonAltMetin: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.tiny,
    lineHeight: lineHeight.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },
  anladimBtn: { alignItems: 'flex-end' },
  anladimText: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.small,
    color: colors.copper,
    letterSpacing: 0.3,
  },
});
