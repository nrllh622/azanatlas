// src/screens/ImsakiyeScreen.tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { calculateVakitler } from '../lib/prayerCalculator';
import { useLocationContext } from '../context/LocationContext';

interface Props {
  onClose: () => void;
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

const GUN_ADLARI = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const AY_ADLARI = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export default function ImsakiyeScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { location } = useLocationContext();

  const days = useMemo(() => {
    const result: { date: Date; week: number; vakitler: { label: string; time: string }[] }[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const vakitler = calculateVakitler(location.latitude, location.longitude, d, location.countryCode)
        .filter((v) => v.key !== 'sabah')
        .map((v) => ({
          label: v.label,
          time: `${v.date.getHours().toString().padStart(2, '0')}:${v.date.getMinutes().toString().padStart(2, '0')}`,
        }));
      result.push({ date: d, week: getWeekNumber(d), vakitler });
    }
    return result;
  }, [location]);

  let lastWeek: number | null = null;

  return (
<View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>İmsakiye</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {days.map((d) => {
          const showWeek = d.week !== lastWeek;
          lastWeek = d.week;
          return (
            <View key={d.date.toDateString()}>
              {showWeek && <Text style={styles.weekLabel}>{d.week}. Hafta</Text>}
              <View style={styles.dayCard}>
                <Text style={styles.dayTitle}>
                  {d.date.getDate()} {AY_ADLARI[d.date.getMonth()]} {GUN_ADLARI[d.date.getDay()]}
                </Text>
                <View style={styles.timesRow}>
                  {d.vakitler.map((v) => (
                    <View key={v.label} style={styles.timeCol}>
                      <Text style={styles.timeLabel}>{v.label}</Text>
                      <Text style={styles.timeValue}>{v.time}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  scrollContent: { padding: spacing.lg },
  weekLabel: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 14, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: spacing.xs },
  dayCard: { backgroundColor: colors.cream, borderRadius: 14, padding: spacing.md, marginBottom: spacing.sm },
  dayTitle: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: 15, marginBottom: spacing.xs },
  timesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeCol: { alignItems: 'center' },
  timeLabel: { fontFamily: typography.bodyMedium, color: colors.primary, fontSize: 11 },
  timeValue: { fontFamily: typography.bodySemibold ?? typography.bodyBold, color: colors.textOnLight, fontSize: 13 },
});
