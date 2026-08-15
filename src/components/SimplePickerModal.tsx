// src/components/SimplePickerModal.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

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
        <Text style={styles.title}>{title}</Text>
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const active = item.id === selectedId;
            return (
              <TouchableOpacity style={styles.row} onPress={() => { onSelect(item.id); onClose(); }}>
                <View style={[styles.checkbox, active && styles.checkboxActive]}>
                  {active && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rowText}>{item.label}</Text>
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
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100 },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, maxHeight: '75%', paddingTop: spacing.md },
  title: { fontFamily: typography.bodyBold, fontSize: 18, color: colors.primaryDark, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  checkbox: { width: 22, height: 22, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.primary },
  checkmark: { color: colors.white, fontSize: 14 },
  rowText: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 16 },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.sand, alignItems: 'flex-end' },
  footerBtn: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 14 },
});
