// src/screens/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import GeometricDivider from '../components/GeometricDivider';
import { calculateVakitler, VakitEntry } from '../lib/prayerCalculator';
import { useLocationContext } from '../context/LocationContext';
import { useNotificationSettings } from '../context/NotificationSettingsContext';
import { requestNotificationPermission, scheduleAllNotifications } from '../lib/notificationScheduler';
import LocationPickerScreen from './LocationPickerScreen';
import SettingsScreen from './SettingsScreen';

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function HomeScreen() {
  const { location } = useLocationContext();
  const { settings } = useNotificationSettings();
  const [now, setNow] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

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

  // Konum ya da bildirim tercihleri değiştiğinde bildirimleri yeniden kur
  useEffect(() => {
    (async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleAllNotifications(vakitler, settings);
      }
    })();
  }, [location.latitude, location.longitude, settings]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.locationRow} onPress={() => setPickerVisible(true)}>
            <Text style={styles.locationText}>
              {location.il} · {location.ilce}
            </Text>
            <Text style={styles.locationChevron}>▾</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
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

      <Modal visible={pickerVisible} animationType="slide">
        <LocationPickerScreen onDone={() => setPickerVisible(false)} />
      </Modal>

      <Modal visible={settingsVisible} animationType="slide">
        <SettingsScreen onClose={() => setSettingsVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  locationText: { color: colors.textOnDark, fontFamily: typography.bodyMedium, fontSize: 16 },
  locationChevron: { color: colors.gold, fontSize: 14 },
  settingsButton: { padding: spacing.xs },
  settingsIcon: { color: colors.gold, fontSize: 22 },
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
