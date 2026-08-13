// src/screens/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import GeometricDivider from '../components/GeometricDivider';
import { calculateVakitler, VakitEntry } from '../lib/prayerCalculator';
import { useLocationContext } from '../context/LocationContext';
import { useNotificationSettings } from '../context/NotificationSettingsContext';
import { requestNotificationPermission, scheduleAllNotifications } from '../lib/notificationScheduler';
import LocationPickerScreen from './LocationPickerScreen';
import SettingsScreen from './SettingsScreen';
import QiblaScreen from './QiblaScreen';

type Screen = 'home' | 'location' | 'settings' | 'qibla';

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { location } = useLocationContext();
  const { settings } = useNotificationSettings();
  const [now, setNow] = useState(new Date());
  const [screen, setScreen] = useState<Screen>('home');

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const vakitler: VakitEntry[] = useMemo(() => {
    return calculateVakitler(location.latitude, location.longitude, now, location.countryCode);
  }, [location.latitude, location.longitude, location.countryCode, now.toDateString()]);

  const next = useMemo(() => {
    const upcoming = vakitler.find((v) => v.date.getTime() > now.getTime());
    if (upcoming) return upcoming;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowVakitler = calculateVakitler(location.latitude, location.longitude, tomorrow, location.countryCode);
    return tomorrowVakitler[0];
  }, [vakitler, now, location]);

  const remainingMs = next.date.getTime() - now.getTime();

  useEffect(() => {
    (async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleAllNotifications(vakitler, settings);
      }
    })();
  }, [location.latitude, location.longitude, settings]);

  if (screen === 'location') {
    return <LocationPickerScreen onDone={() => setScreen('home')} />;
  }
  if (screen === 'settings') {
    return <SettingsScreen onClose={() => setScreen('home')} />;
  }
  if (screen === 'qibla') {
    return <QiblaScreen onClose={() => setScreen('home')} />;
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => setScreen('location')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.locationText}>
              {location.il} · {location.ilce}
            </Text>
            <Text style={styles.locationChevron}>▾</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setScreen('qibla')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.headerIcon}>🧭</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setScreen('settings')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.headerIcon}>⚙</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.nextLabel}>Sonraki Vakit · {next.label}</Text>
          <Text style={styles.bigClock}>
            {next.date.getHours().toString().padStart(2, '0')}:
            {next.date.getMinutes().toString().padStart(2, '0')}
          </Text>
          <View style={styles.countdownPill}>
            <Text style={styles.countdownText}>{formatCountdown(remainingMs)}</Text>
          </View>
        </View>

        <GeometricDivider />

        <View style={styles.timesRow}>
          {vakitler.map((v) => (
            <View key={v.key} style={[styles.timeItem, v.key === next.key && styles.timeItemActive]}>
              <Text style={[styles.timeLabel, v.key === next.key && styles.timeLabelActive]}>{v.label}</Text>
              <Text style={[styles.timeValue, v.key === next.key && styles.timeValueActive]}>
                {v.date.getHours().toString().padStart(2, '0')}:
                {v.date.getMinutes().toString().padStart(2, '0')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg, minHeight: 44 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
  locationText: { color: colors.textOnDark, fontFamily: typography.bodyMedium, fontSize: 17 },
  locationChevron: { color: colors.gold, fontSize: 16 },
  headerIcons: { flexDirection: 'row', gap: spacing.sm },
  iconButton: { padding: spacing.sm },
  headerIcon: { color: colors.gold, fontSize: 24 },
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
  bigClock: { fontFamily: typography.displayFamily, color: colors.textOnLight, fontSize: 56, marginTop: spacing.xs },
  countdownPill: { marginTop: spacing.sm, backgroundColor: colors.sand, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  countdownText: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: 16, letterSpacing: 0.5 },
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
