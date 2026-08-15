// src/screens/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { calculateVakitler, VakitEntry } from '../lib/prayerCalculator';
import { useLocationContext } from '../context/LocationContext';
import { useNotificationSettings } from '../context/NotificationSettingsContext';
import { useCalculationSettings } from '../context/CalculationSettingsContext';
import { useKaza } from '../context/KazaContext';
import { requestNotificationPermission, scheduleAllNotifications } from '../lib/notificationScheduler';
import { toHijri } from '../lib/hijri';
import { getKerahatInfo } from '../lib/kerahat';
import LocationPickerScreen from './LocationPickerScreen';
import SettingsScreen from './SettingsScreen';
import QiblaScreen from './QiblaScreen';
import ImsakiyeScreen from './ImsakiyeScreen';
import KazaScreen from './KazaScreen';

type Screen = 'home' | 'location' | 'settings' | 'qibla' | 'imsakiye' | 'kaza';

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const AY_ADLARI = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { location } = useLocationContext();
  const { settings } = useNotificationSettings();
  const { methodId, kerahatMinutes } = useCalculationSettings();
  const { missed } = useKaza();
  const [now, setNow] = useState(new Date());
  const [screen, setScreen] = useState<Screen>('home');

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const vakitler: VakitEntry[] = useMemo(() => {
    return calculateVakitler(location.latitude, location.longitude, now, location.countryCode, methodId);
  }, [location.latitude, location.longitude, location.countryCode, methodId, now.toDateString()]);

  const next = useMemo(() => {
    const upcoming = vakitler.find((v) => v.date.getTime() > now.getTime());
    if (upcoming) return upcoming;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowVakitler = calculateVakitler(location.latitude, location.longitude, tomorrow, location.countryCode, methodId);
    return tomorrowVakitler[0];
  }, [vakitler, now, location, methodId]);

  const current = useMemo(() => {
    const passed = [...vakitler].reverse().find((v) => v.date.getTime() <= now.getTime());
    return passed ?? vakitler[vakitler.length - 1];
  }, [vakitler, now]);

  const kerahat = useMemo(() => getKerahatInfo(vakitler, now, kerahatMinutes), [vakitler, now, kerahatMinutes]);
  const hijri = useMemo(() => toHijri(now), [now.toDateString()]);
  const isRamazan = hijri.month === 'Ramazan';
  const aksam = vakitler.find((v) => v.key === 'aksam');

  const remainingMs = next.date.getTime() - now.getTime();

  useEffect(() => {
    (async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleAllNotifications(vakitler, settings, kerahatMinutes);
      }
    })();
  }, [location.latitude, location.longitude, methodId, settings, kerahatMinutes]);

  if (screen === 'location') return <LocationPickerScreen onDone={() => setScreen('home')} />;
  if (screen === 'settings') return <SettingsScreen onClose={() => setScreen('home')} />;
  if (screen === 'qibla') return <QiblaScreen onClose={() => setScreen('home')} />;
  if (screen === 'imsakiye') return <ImsakiyeScreen onClose={() => setScreen('home')} />;
  if (screen === 'kaza') return <KazaScreen onClose={() => setScreen('home')} />;

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.locationRow} onPress={() => setScreen('location')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.locationText}>
              {location.il} · {location.ilce}
            </Text>
            <Text style={styles.locationChevron}>▾</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setScreen('kaza')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.headerIcon}>🕌</Text>
              {missed.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{missed.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setScreen('imsakiye')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.headerIcon}>🗓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setScreen('qibla')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.headerIcon}>🧭</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setScreen('settings')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.headerIcon}>⚙</Text>
            </TouchableOpacity>
          </View>
        </View>

        {kerahat.active && (
          <View style={styles.kerahatBanner}>
            <Text style={styles.kerahatText}>⚠ Mekruh vakti — {kerahat.reason}</Text>
          </View>
        )}

        {isRamazan && aksam && (
          <View style={styles.iftarBanner}>
            <Text style={styles.iftarText}>
              🌙 İftara kalan süre: {formatCountdown(Math.max(0, aksam.date.getTime() - now.getTime()))}
            </Text>
          </View>
        )}

        <View style={styles.timeBlock}>
          <Text style={styles.nextLabel}>Sonraki Vakit · {next.label}</Text>
          <Text style={styles.bigClock}>
            {next.date.getHours().toString().padStart(2, '0')}:{next.date.getMinutes().toString().padStart(2, '0')}
          </Text>
          <Text style={styles.countdownText}>{formatCountdown(remainingMs)}</Text>
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>
              {now.getDate()} {AY_ADLARI[now.getMonth()]} {now.getFullYear()} · {hijri.day} {hijri.month} {hijri.year}
            </Text>
          </View>
        </View>

        <View style={styles.timesCard}>
          {vakitler.map((v) => (
            <View key={v.key} style={styles.timeCol}>
              <Text style={[styles.timeLabel, v.key === current.key && styles.timeLabelActive]} numberOfLines={1} adjustsFontSizeToFit>
                {v.label}
              </Text>
              <Text style={[styles.timeValue, v.key === current.key && styles.timeValueActive]} numberOfLines={1} adjustsFontSizeToFit>
                {v.date.getHours().toString().padStart(2, '0')}:{v.date.getMinutes().toString().padStart(2, '0')}
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
  scrollContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md, minHeight: 44, paddingHorizontal: spacing.xs },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
  locationText: { color: colors.textOnDark, fontFamily: typography.bodyMedium, fontSize: 17 },
  locationChevron: { color: colors.gold, fontSize: 16 },
  headerIcons: { flexDirection: 'row', gap: spacing.xs },
  iconButton: { padding: spacing.sm, position: 'relative' },
  headerIcon: { color: colors.gold, fontSize: 22 },
  badge: {
    position: 'absolute', top: 2, right: 2, backgroundColor: colors.danger,
    borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: colors.white, fontSize: 10, fontFamily: typography.bodyBold },
  kerahatBanner: { backgroundColor: colors.danger, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  kerahatText: { fontFamily: typography.bodyBold, color: colors.white, fontSize: 13, textAlign: 'center' },
  iftarBanner: { backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  iftarText: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: 13, textAlign: 'center' },
  timeBlock: { alignItems: 'center', marginBottom: spacing.lg },
  nextLabel: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' },
  bigClock: { fontFamily: typography.displayFamily, color: colors.textOnDark, fontSize: 64, marginTop: spacing.xs },
  countdownText: { fontFamily: typography.bodyMedium, color: colors.textOnDark, fontSize: 18, marginTop: spacing.xs },
  datePill: { marginTop: spacing.sm, borderWidth: 1, borderColor: colors.gold, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  datePillText: { fontFamily: typography.bodyMedium, color: colors.textOnDark, fontSize: 12 },
  timesCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.white, borderRadius: radius.lg, paddingVertical: spacing.md, paddingHorizontal: spacing.xs },
  timeCol: { alignItems: 'center', flex: 1, paddingHorizontal: 2 },
  timeLabel: { fontFamily: typography.bodyMedium, color: colors.primary, fontSize: 12 },
  timeLabelActive: { color: colors.gold, fontFamily: typography.bodyBold },
  timeValue: { fontFamily: typography.bodyBold, color: colors.textOnLight, fontSize: 15, marginTop: 3 },
  timeValueActive: { color: colors.gold },
});
