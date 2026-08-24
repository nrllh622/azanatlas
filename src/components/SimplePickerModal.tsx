// src/components/SimplePickerModal.tsx
//
// Tüm ayar seçicilerinin (hesaplama yöntemi, kerahat süresi, ölçü birimi...)
// ortak alt sayfası. Diğer ekranlarla aynı görsel dilde durması için başlık
// şeridi `ScreenHeader` ile aynı koyu zemin + İslami dokuyu kullanıyor;
// seçenek satırları Ana Sayfa'daki kart diliyle (radius.md, border) eşleşiyor.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { colors, spacing, typography, radius, fontSize, elevation } from '../theme';
import Icon from './Icon';
import IslamicPattern from './IslamicPattern';

interface Option {
  id: string;
  label: string;
}

interface Props {
  visible: boolean;
  title: string;
  options: Option[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function SimplePickerModal({ visible, title, options, selectedId, onSelect, onClose }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.baslikSeridi}>
          <IslamicPattern color={colors.cream} opacity={0.07} tile={36} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.liste}
          renderItem={({ item }) => {
            const active = item.id === selectedId;
            return (
              <TouchableOpacity
                style={[styles.row, active && styles.rowActive]}
                onPress={() => { onSelect(item.id); onClose(); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.rowText, active && styles.rowTextActive]}>{item.label}</Text>
                <Icon
                  name={active ? 'onay' : 'daire'}
                  size={22}
                  color={active ? colors.success : colors.borderStrong}
                />
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.footerBtn}>KAPAT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay, justifyContent: 'flex-end', zIndex: 100 },
  sheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '75%',
    overflow: 'hidden',
  },
  baslikSeridi: {
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  title: { fontFamily: typography.displaySemibold, fontSize: fontSize.title, color: colors.textOnDark },
  liste: { padding: spacing.md, gap: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowActive: { borderColor: colors.success },
  rowText: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: fontSize.body, flex: 1 },
  rowTextActive: { fontFamily: typography.bodyBold, color: colors.primaryDark },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'flex-end' },
  footerBtn: { fontFamily: typography.bodyBold, color: colors.copper, fontSize: fontSize.small, letterSpacing: 0.4 },
});
