// src/screens/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import GeometricDivider from '../components/GeometricDivider';

const MOCK_LOCATION = { il: 'İstanbul', ilce: 'Beşiktaş' };

// MOCK VERİ — gerçek hesaplama motoru (adhan npm) bir sonraki adımda bağlanacak
// Artık 7 vakit: İmsak, Sabah, Güneş, Öğle, İkindi, Akşam, Yatsı
const MOCK_TIMES = [
  { key: 'imsak', label: 'İmsak', time: '04:26' },
  { key: 'sabah', label: 'Sabah', time: '05:04' },
  { key: 'gunes', label: 'Güneş', time: '06:04' },
  { key: 'ogle', label: 'Öğle', time: '13:15' },
  { key: 'ikindi', label: 'İkindi', time: '17:05' },
  { key: 'aksam', label: 'Akşam', time: '20:16' },
  { key: 'yatsi', label: 'Yatsı', time: '21:48' },
];

function parseTimeToday(hhmm: string, baseDate: Date): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function HomeScreen() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const next = useMemo(() => {
    const todays = MOCK_TIMES.map((t) => ({
      ...t,
      date: parseTimeToday(t.time, now),
    }));
    const upcoming = todays.find((t) => t.date.getTime() > now.getTime());
    if (upcoming) return upcoming;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const firstTomorrow = MOCK_TIMES[0];
    return { ...firstTomorrow, date: parseTimeToday(firstTomorrow.time, tomorrow) };
  }, [now]);

  const remainingMs = next.date.getTime() - now.getTime();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.locationRow}>
          <Text style={styles.locationText}>
            {MOCK_LOCATION.il} · {MOCK_LOCATION.ilce}
          </Text>
          <Text style={styles.locationChevron}>▾</Text>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.nextLabel}>Sonraki Vakit · {next.label}</Text>
          <Text style={styles.countdown}>{formatCountdown(remainingMs)}</Text>
          <View style={styles.targetRow}>
            <Text style={styles.targetClock}>⏰ {next.time}</Text>
          </View>
        </View>

        <GeometricDivider />

        <View style={styles.timesRow}>
          {MOCK_TIMES.map((t) => (
            <View
              key={t.key}
              style={[
                styles.timeItem,
                t.key === next.key && styles.timeItemActive,
              ]}
            >
              <Text
                style={[
                  styles.timeLabel,
                  t.key === next.key && styles.timeLabelActive,
                ]}
              >
                {t.label}
              </Text>
              <Text
                style={[
                  styles.timeValue,
                  t.key === next.key && styles.timeValueActive,
                ]}
              >
                {t.time}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, gap: spacing.xs },
  locationText: { color: colors.textOnDark, fontFamily: typography.bodyMedium, fontSize: 16 },
  locationChevron: { color: colors.gold, fontSize: 14 },
  mainCard: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  nextLabel: { fontFamily: typography.bodyMedium, color: colors.primary, fontSize: 15, letterSpacing: 1, textTransform: 'uppercase' },
  countdown: { fontFamily: typography.displayFamily, color: colors.textOnLight, fontSize: 48, marginTop: spacing.xs, letterSpacing: 1 },
  targetRow: { marginTop: spacing.xs, backgroundColor: colors.sand, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  targetClock: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: 15 },
  timesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  timeItem: {
    minWidth: 90,
    backgroundColor: 'rgba(250,246,236,0.08)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.25)',
  },
  timeItemActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  timeLabel: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 13 },
  timeLabelActive: { color: colors.primaryDark },
  timeValue: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 17, marginTop: 2 },
  timeValueActive: { color: colors.primaryDark },
});
