// src/screens/KazaScreen.tsx
//
// KAZA TAKİBİ
//
// Kılınamamış namazların ve tutulamamış oruçların sayacı. Kullanıcı kaza
// borcunu buraya girer, kaza ettikçe eksiltir.
//
// Tasarım kararı: sayı azaltma butonu, artırma butonundan görsel olarak
// daha "olumlu" (turkuaz dolgu) — çünkü buradaki asıl hedef sayıyı
// düşürmektir. Artırma nötr bırakıldı.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import Icon, { IconName } from '../components/Icon';
import { colors, spacing, radius, typography, elevation } from '../theme';
import { useKaza } from '../context/KazaContext';
import { KazaCategory } from '../lib/kazaStorage';

interface Props {
  onClose?: () => void;
}

const KATEGORILER: { key: KazaCategory; label: string; ikon: IconName; grup: 'namaz' | 'oruc' }[] = [
  { key: 'sabah', label: 'Sabah', ikon: 'sabah', grup: 'namaz' },
  { key: 'ogle', label: 'Öğle', ikon: 'ogle', grup: 'namaz' },
  { key: 'ikindi', label: 'İkindi', ikon: 'ikindi', grup: 'namaz' },
  { key: 'aksam', label: 'Akşam', ikon: 'aksam', grup: 'namaz' },
  { key: 'yatsi', label: 'Yatsı', ikon: 'yatsi', grup: 'namaz' },
  { key: 'vitr', label: 'Vitir', ikon: 'hilal', grup: 'namaz' },
  { key: 'oruc', label: 'Oruç', ikon: 'imsak', grup: 'oruc' },
];

export default function KazaScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { counts, totalCount, increment, decrement } = useKaza();

  const namazlar = KATEGORILER.filter((k) => k.grup === 'namaz');
  const oruclar = KATEGORILER.filter((k) => k.grup === 'oruc');

  const satir = (k: (typeof KATEGORILER)[number]) => {
    const sayi = counts[k.key];
    const sifir = sayi === 0;
    return (
      <View key={k.key} style={styles.kart}>
        <View style={styles.ikonKap}>
          <Icon name={k.ikon} size={18} color={colors.primary} />
        </View>
        <Text style={styles.etiket}>{k.label}</Text>

        <View style={styles.sayacSatir}>
          <TouchableOpacity
            style={[styles.sayacBtn, styles.eksiBtn, sifir && styles.sayacBtnPasif]}
            onPress={() => decrement(k.key)}
            disabled={sifir}
            accessibilityRole="button"
            accessibilityLabel={`${k.label} kaza sayısını azalt`}
          >
            <Icon name="eksi" size={16} color={sifir ? colors.textFaint : colors.white} />
          </TouchableOpacity>

          <Text style={[styles.sayi, sifir && styles.sayiSifir]}>{sayi}</Text>

          <TouchableOpacity
            style={[styles.sayacBtn, styles.artiBtn]}
            onPress={() => increment(k.key)}
            accessibilityRole="button"
            accessibilityLabel={`${k.label} kaza sayısını artır`}
          >
            <Icon name="arti" size={16} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Kaza Takibi"
        subtitle={totalCount > 0 ? `Toplam ${totalCount} kaza` : 'Kaza borcu yok'}
        icon="kaza"
        onClose={onClose}
      />

      <ScrollView
        contentContainerStyle={[styles.icerik, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ozetKart}>
          <Text style={styles.ozetSayi}>{totalCount}</Text>
          <Text style={styles.ozetEtiket}>
            {totalCount > 0 ? 'toplam kaza borcu' : 'kaza borcunuz görünmüyor'}
          </Text>
        </View>

        <Text style={styles.grupBaslik}>Namaz</Text>
        <View style={styles.grup}>{namazlar.map(satir)}</View>

        <Text style={styles.grupBaslik}>Oruç</Text>
        <View style={styles.grup}>{oruclar.map(satir)}</View>

        <View style={styles.notKap}>
          <Icon name="bilgi" size={14} color={colors.textMuted} />
          <Text style={styles.notYazi}>
            Sayaçlar yalnızca bu cihazda tutulur. Kaza namazlarınızı kıldıkça
            eksi düğmesiyle sayıyı düşürün.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  icerik: { paddingHorizontal: spacing.md, paddingTop: spacing.md },

  ozetKart: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...elevation.card,
  },
  ozetSayi: { fontFamily: typography.displayFamily, fontSize: 44, color: colors.white, lineHeight: 54 },
  ozetEtiket: { fontFamily: typography.bodyMedium, fontSize: 12, color: colors.textOnDarkMuted },

  grupBaslik: {
    fontFamily: typography.displaySemibold,
    fontSize: 14,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  grup: { gap: spacing.sm, marginBottom: spacing.lg },

  kart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ikonKap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etiket: { flex: 1, fontFamily: typography.bodyBold, fontSize: 15, color: colors.textOnLight },

  sayacSatir: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sayacBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eksiBtn: { backgroundColor: colors.primary },
  artiBtn: { backgroundColor: colors.creamDeep, borderWidth: 1, borderColor: colors.border },
  sayacBtnPasif: { backgroundColor: colors.creamDeep },
  sayi: {
    fontFamily: typography.bodyBold,
    fontSize: 18,
    color: colors.primaryDark,
    minWidth: 34,
    textAlign: 'center',
  },
  sayiSifir: { color: colors.textFaint },

  notKap: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xs, alignItems: 'flex-start' },
  notYazi: {
    flex: 1,
    fontFamily: typography.bodyFamily,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
