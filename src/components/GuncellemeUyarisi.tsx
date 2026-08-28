// src/components/GuncellemeUyarisi.tsx
//
// GÜNCELLEME UYARISI MODALI (7. tur — madde 7)
//
// Kullanıcının referans gösterdiği ekran görüntüsündeki Play Store'un kendi
// "Uygulamanın yeni versiyonu bulundu." diyaloğuyla aynı iki aksiyonlu
// düzeni izliyor: "SONRA HATIRLAT" (soluk, solda) / "ŞİMDİ GÜNCELLE" (vurgulu,
// sağda). Bkz. `lib/guncellemeKontrol.ts` — bu bileşen yalnızca GÖRÜNÜMDEN
// sorumlu, güncelleme mantığı orada.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors, spacing, typography, radius, fontSize, elevation } from '../theme';
import { useCeviri } from '../i18n/DilContext';

interface Props {
  visible: boolean;
  onSimdiGuncelle: () => void;
  onSonraHatirlat: () => void;
}

export default function GuncellemeUyarisi({ visible, onSimdiGuncelle, onSonraHatirlat }: Props) {
  const { t } = useCeviri();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSonraHatirlat}>
      <View style={styles.overlay}>
        <View style={styles.kart}>
          <Text style={styles.mesaj}>{t('guncellemeBulunduMesaji')}</Text>
          <View style={styles.butonSatiri}>
            <TouchableOpacity onPress={onSonraHatirlat} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.ikincilBtn}>{t('sonraHatirlat')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSimdiGuncelle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.birincilBtn}>{t('simdiGuncelle')}</Text>
            </TouchableOpacity>
          </View>
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
    borderRadius: radius.md,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 340,
    ...elevation.card,
  },
  mesaj: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.body,
    color: colors.textOnLight,
    marginBottom: spacing.lg,
  },
  butonSatiri: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.lg,
  },
  ikincilBtn: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.small,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  birincilBtn: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.small,
    color: colors.copper,
    letterSpacing: 0.3,
  },
});
