// src/screens/KazaScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { useKaza } from '../context/KazaContext';

interface Props {
  onClose: () => void;
}

const AY_ADLARI = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export default function KazaScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { missed, markCompensated } = useKaza();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Kazalar ({missed.length})</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {missed.length === 0 && <Text style={styles.emptyText}>Son 14 günde kaza namazın görünmüyor 🎉</Text>}
        {missed.map((m) => (
          <View key={m.key} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{m.vakitLabel}</Text>
              <Text style={styles.cardDate}>
                {m.date.getDate()} {AY_ADLARI[m.date.getMonth()]} {m.date.getFullYear()}
              </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => markCompensated(m.key)}>
              <Text style={styles.buttonText}>Kaza Kıldım</Text>
            </TouchableOpacity>
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
  emptyText: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 15, textAlign: 'center', marginTop: spacing.xl },
  card: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm,
  },
  cardTitle: { fontFamily: typography.bodyBold, color: colors.textOnLight, fontSize: 16 },
  cardDate: { fontFamily: typography.bodyMedium, color: colors.primary, fontSize: 13, marginTop: 2 },
  button: { backgroundColor: colors.gold, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  buttonText: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: 13 },
});
