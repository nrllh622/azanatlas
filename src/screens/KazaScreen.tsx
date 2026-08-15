// src/screens/KazaScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { useKaza } from '../context/KazaContext';
import { KazaCategory } from '../lib/kazaStorage';

interface Props {
  onClose: () => void;
}

const CATEGORIES: { key: KazaCategory; label: string }[] = [
  { key: 'sabah', label: 'Sabah' },
  { key: 'ogle', label: 'Öğle' },
  { key: 'ikindi', label: 'İkindi' },
  { key: 'aksam', label: 'Akşam' },
  { key: 'yatsi', label: 'Yatsı' },
  { key: 'vitr', label: 'Vitr' },
  { key: 'oruc', label: 'Oruç Tutma' },
];

export default function KazaScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { counts, totalCount, increment, decrement } = useKaza();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Kazalar ({totalCount})</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {CATEGORIES.map((c) => (
          <View key={c.key} style={styles.card}>
            <Text style={styles.cardLabel}>{c.label}</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity style={styles.counterBtn} onPress={() => decrement(c.key)}>
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.countText}>{counts[c.key]}</Text>
              <TouchableOpacity style={styles.counterBtn} onPress={() => increment(c.key)}>
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  scrollContent: { padding: spacing.lg },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardLabel: { fontFamily: typography.bodyBold, color: colors.textOnLight, fontSize: 17 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: { color: colors.white, fontSize: 18, fontFamily: typography.bodyBold },
  countText: { fontFamily: typography.displaySemibold, color: colors.primaryDark, fontSize: 20, minWidth: 24, textAlign: 'center' },
});
