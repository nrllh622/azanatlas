// src/screens/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { calculateVakitler, VakitEntry } from '../lib/prayerCalculator';
import { useLocationContext } from '../context/LocationContext';
import { useNotificationSettings } from '../context/NotificationSettingsContext';
import { useCalculationSettings } from '../context/CalculationSettingsContext';
import { useGeneralSettings } from '../context/GeneralSettingsContext';
import { useVaktindeKil } from '../context/VaktindeKilContext';
import { useKaza } from '../context/KazaContext';
import { useReminders } from '../context/RemindersContext';
import {
  requestNotificationPermission,
  scheduleAllNotifications,
  configureAndroidChannels,
} from '../lib/notificationScheduler';
import { scheduleVaktindeKil } from '../lib/vaktindeKilScheduler';
import { setupVaktindeKilCategory, registerVaktindeKilResponseListener } from '../lib/vaktindeKilActions';
import { scheduleReminders } from '../lib/remindersScheduler';
import { toHijri } from '../lib/hijri';
import { getKerahatInfo } from '../lib/kerahat';
import LocationPickerScreen from './LocationPickerScreen';
import SettingsScreen from './SettingsScreen';
import QiblaScreen from './QiblaScreen';
import ImsakiyeScreen from './ImsakiyeScreen';
import KazaScreen from './KazaScreen';
import VaktindeKilScreen from './VaktindeKilScreen';
import RemindersScreen from './RemindersScreen';

type Screen = 'home' | 'location' | 'settings' | 'qibla' | 'imsakiye' | 'kaza' | 'vaktindekil' | 'reminders';

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
  const { location, locations, activeId, setActiveId } = useLocationContext();
  const { settings } = useNotificationSettings();
  const { autoMethod, methodId, kerahatMinutes, madhab, highLatRule, hijriAdjustmentDays, hijriSwitchAtMaghrib } = useCalculationSettings();
  const { vibrationEnabled } = useGeneralSettings();
  const vaktindeKil = useVaktindeKil();
  const { totalCount: kazaTotal } = useKaza();
  const { settings: reminderSettings } = useReminders();
  const [now, setNow] = useState(new Date());
  const [screen, setScreen] = useState<Screen>('home');

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // "Kıldım" bildirim aksiyonu bir kez kuruluyor (kategori + yanıt dinleyicisi)
  useEffect(() => {
    setupVaktindeKilCategory();
    const sub = registerVaktindeKilResponseListener();
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen !== 'home') {
        setScreen('home');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [screen]);

  const vakitler: VakitEntry[] = useMemo(() => {
    return calculateVakitler(location.latitude, location.longitude, now, location.countryCode, autoMethod, methodId, madhab, highLatRule);
  }, [location.latitude, location.longitude, location.countryCode, autoMethod, methodId, madhab, highLatRule, now.toDateString()]);

  const next = useMemo(() => {
    const upcoming = vakitler.find((v) => v.date.getTime() > now.getTime());
    if (upcoming) return upcoming;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowVakitler = calculateVakitler(location.latitude, location.longitude, tomorrow, location.countryCode, autoMethod, methodId, madhab, highLatRule);
    return tomorrowVakitler[0];
  }, [vakitler, now, location, autoMethod, methodId, madhab, highLatRule]);

  const current = useMemo(() => {
    const passed = [...vakitler].reverse().find((v) => v.date.getTime() <= now.getTime());
    return passed ?? vakitler[vakitler.length - 1];
  }, [vakitler, now]);

  const kerahat = useMemo(() => getKerahatInfo(vakitler, now, kerahatMinutes), [vakitler, now, kerahatMinutes]);

  const hijriBaseDate = useMemo(() => {
    const aksamVakit = vakitler.find((v) => v.key === 'aksam');
    if (hijriSwitchAtMaghrib && aksamVakit && now.getTime() >= aksamVakit.date.getTime()) {
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    return now;
  }, [now, vakitler, hijriSwitchAtMaghrib]);

  const hijri = useMemo(() => toHijri(hijriBaseDate, hijriAdjustmentDays), [hijriBaseDate, hijriAdjustmentDays]);
  const isRamazan = hijri.month === 'Ramazan';
  const aksam = vakitler.find((v) => v.key === 'aksam');

  const remainingMs = next.date.getTime() - now.getTime();

  useEffect(() => {
    (async () => {
      const granted = await requestNotificationPermission();
      if (!granted) return;
      await configureAndroidChannels();
      await scheduleAllNotifications(vakitler, settings, kerahatMinutes, vibrationEnabled);
      if (vaktindeKil.enabled) {
        await scheduleVaktindeKil(
          current,
          next,
          vaktindeKil.firstDelayMinutes,
          vaktindeKil.repeatIntervalMinutes,
          vaktindeKil.sound,
          vibrationEnabled
        );
      }
      await scheduleReminders(
        location.latitude,
        location.longitude,
        location.countryCode,
        autoMethod,
        methodId,
        madhab,
        highLatRule,
        reminderSettings
      );
    })();
  }, [location.latitude, location.longitude, autoMethod, methodId, madhab, highLatRule, settings, kerahatMinutes, vibrationEnabled, vaktindeKil, reminderSettings]);

  const cycleLocation = (dir: 1 | -1) => {
    if (locations.length < 2) return;
    const idx = locations.findIndex((l) => l.id === activeId);
    const nextIdx = (idx + dir + locations.length) % locations.length;
    setActiveId(locations[nextIdx].id);
  };

  if (screen === 'location') return <LocationPickerScreen onDone={() => setScreen('home')} />;
  if (screen === 'settings')
    return (
      <SettingsScreen
        onClose={() => setScreen('home')}
        onOpenVaktindeKil={() => setScreen('vaktindekil')}
        onOpenReminders={() => setScreen('reminders')}
      />
    );
  if (screen === 'qibla') return <QiblaScreen onClose={() => setScreen('home')} />;
  if (screen === 'imsakiye') return <ImsakiyeScreen onClose={() => setScreen('home')} />;
  if (screen === 'kaza') return <KazaScreen onClose={() => setScreen('home')} />;
  if (screen === 'vaktindekil') return <VaktindeKilScreen onClose={() => setScreen('home')} />;
  if (screen === 'reminders') return <RemindersScreen onClose={() => setScreen('home')} />;

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.locationSwitcher}>
          {locations.length > 1 && (
            <TouchableOpacity onPress={() => cycleLocation(-1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.chevronBtn}>‹</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.locationRow} onPress={() => setScreen('location')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.locationText} numberOfLines={1}>
              {location.il} · {location.ilce}
            </Text>
            <Text style={styles.locationChevron}>▾</Text>
          </TouchableOpacity>
          {locations.length > 1 && (
            <TouchableOpacity onPress={() => cycleLocation(1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.chevronBtn}>›</Text>
            </TouchableOpacity>
          )}
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

      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + spacing.xs }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => setScreen('kaza')}>
          <View>
            <Text style={styles.navIcon}>🕌</Text>
            {kazaTotal > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{kazaTotal}</Text>
              </View>
            )}
          </View>
          <Text style={styles.navLabel}>Kazalar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setScreen('imsakiye')}>
          <Text style={styles.navIcon}>🗓</Text>
          <Text style={styles.navLabel}>İmsakiye</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setScreen('qibla')}>
          <Text style={styles.navIcon}>🧭</Text>
          <Text style={styles.navLabel}>Kıble</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setScreen('settings')}>
          <Text style={styles.navIcon}>⚙</Text>
          <Text style={styles.navLabel}>Ayarlar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  scrollContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  locationSwitcher: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.md },
  chevronBtn: { color: colors.gold, fontSize: 24, paddingHorizontal: spacing.xs },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, flexShrink: 1 },
  locationText: { color: colors.textOnDark, fontFamily: typography.bodyMedium, fontSize: 16, flexShrink: 1 },
  locationChevron: { color: colors.gold, fontSize: 16 },
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(250,246,236,0.15)',
    paddingTop: spacing.sm,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 22, color: colors.gold },
  navLabel: { fontFamily: typography.bodyMedium, color: colors.sand, fontSize: 10 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.white, fontSize: 10, fontFamily: typography.bodyBold },
});
