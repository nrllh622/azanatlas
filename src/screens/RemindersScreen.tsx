// src/screens/RemindersScreen.tsx
//
// Madde 4 (devir dosyası — bu tur): kendi özel başlığını çiziyordu, artık
// ortak ScreenHeader kullanıyor; hardcoded punto/köşe değerleri theme.ts
// token'larına (fontSize/radius/elevation) taşındı.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors, spacing, radius, typography, fontSize, elevation } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { useReminders, ReminderTypeSetting } from '../context/RemindersContext';
import SoundPickerModal from '../components/SoundPickerModal';
import SimplePickerModal from '../components/SimplePickerModal';
import { useCeviri } from '../i18n/DilContext';

interface Props {
  onClose: () => void;
}

const MINUTE_OPTIONS = [15, 30, 45, 60, 90, 120, 150];

type ReminderKey = 'sahur' | 'teheccut' | 'pazartesiPersembeOrucu' | 'cumaNamazi';

export default function RemindersScreen({ onClose }: Props) {
  const { settings, setSahur, setTeheccut, setOruc, setCuma } = useReminders();
  const [minutePickerFor, setMinutePickerFor] = useState<ReminderKey | null>(null);
  const [soundPickerFor, setSoundPickerFor] = useState<ReminderKey | null>(null);
  const { t } = useCeviri();

  const setters: Record<ReminderKey, (patch: Partial<ReminderTypeSetting>) => void> = {
    sahur: setSahur,
    teheccut: setTeheccut,
    pazartesiPersembeOrucu: setOruc,
    cumaNamazi: setCuma,
  };

  const renderRow = (key: ReminderKey, title: string, baseLabel: string) => {
    const s = settings[key];
    return (
      <View key={key} style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Switch
              value={s.enabled}
              onValueChange={(v) => setters[key]({ enabled: v })}
              trackColor={{ true: colors.primaryBright, false: undefined }}
              thumbColor={colors.white}
            />
            <Text style={styles.baseLabel}>{baseLabel}</Text>
            <TouchableOpacity onPress={() => setMinutePickerFor(key)}>
              <Text style={styles.minutesLink}>{t('dkOnce', s.minutesBefore)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSoundPickerFor(key)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="bildirimAcik" size={17} color={colors.copper} />
            </TouchableOpacity>
          </View>
          {key === 'pazartesiPersembeOrucu' && (
            <TouchableOpacity
              style={styles.checkboxRow}
              activeOpacity={0.75}
              onPress={() => setOruc({ remindDayBefore: !settings.pazartesiPersembeOrucu.remindDayBefore })}
            >
              <View style={[styles.checkbox, settings.pazartesiPersembeOrucu.remindDayBefore && styles.checkboxActive]}>
                {settings.pazartesiPersembeOrucu.remindDayBefore && <Icon name="onay" size={16} color={colors.white} />}
              </View>
              <Text style={styles.checkboxLabel}>{t('birGunOnceHatirlat')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const activeMinutePicker = minutePickerFor ? settings[minutePickerFor] : null;
  const activeSoundPicker = soundPickerFor ? settings[soundPickerFor] : null;

  return (
    <View style={styles.wrap}>
      <ScreenHeader title={t('hatirlaticilar')} icon="hatirlatici" onClose={onClose} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderRow('sahur', t('sahurUyarisi'), t('fromImsak'))}
        {renderRow('teheccut', t('teheccutUyandirma'), t('fromImsak'))}
        {renderRow('pazartesiPersembeOrucu', t('pazartesiPersembeOrucuBaslik'), t('fromImsak'))}
        {renderRow('cumaNamazi', t('cumaNamaziHatirlatma'), t('fromOgle'))}
      </ScrollView>

      <SimplePickerModal
        visible={minutePickerFor !== null}
        title={t('kacDakikaOnce')}
        options={MINUTE_OPTIONS.map((m) => ({ id: String(m), label: t('dakika', m) }))}
        selectedId={activeMinutePicker ? String(activeMinutePicker.minutesBefore) : ''}
        onSelect={(id) => {
          if (minutePickerFor) setters[minutePickerFor]({ minutesBefore: Number(id) });
        }}
        onClose={() => setMinutePickerFor(null)}
      />

      <SoundPickerModal
        visible={soundPickerFor !== null}
        title={t('uyariSesiBaslik')}
        selectedId={activeSoundPicker ? activeSoundPicker.soundId : 'none'}
        onSelect={(id) => {
          if (soundPickerFor) setters[soundPickerFor]({ soundId: id });
        }}
        onClose={() => setSoundPickerFor(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scrollContent: { padding: spacing.lg },
  section: { marginBottom: spacing.md },
  sectionTitle: {
    fontFamily: typography.bodyBold,
    color: colors.copper,
    fontSize: fontSize.tiny,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.card,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  baseLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: fontSize.body, flex: 1 },
  minutesLink: {
    fontFamily: typography.bodyBold,
    color: colors.primaryDark,
    fontSize: fontSize.small,
    textDecorationLine: 'underline',
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  checkbox: {
    width: 20, height: 20, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.primary },
  checkboxLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: fontSize.small },
});
