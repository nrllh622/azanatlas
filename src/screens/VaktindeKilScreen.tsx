// src/screens/VaktindeKilScreen.tsx
//
// Madde 4 (devir dosyası — bu tur): kendi özel başlığını çiziyordu, artık
// ortak ScreenHeader kullanıyor; hardcoded punto/köşe değerleri theme.ts
// token'larına (fontSize/radius/elevation) taşındı.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Audio } from 'expo-av';
import { colors, spacing, radius, typography, fontSize, lineHeight, elevation } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { useVaktindeKil, VaktindeKilSound } from '../context/VaktindeKilContext';
import SimplePickerModal from '../components/SimplePickerModal';
import { useCeviri } from '../i18n/DilContext';

interface Props {
  onClose: () => void;
}

const DELAY_OPTIONS = [10, 15, 20, 30, 45];
const INTERVAL_OPTIONS = [5, 10, 15, 20, 30];

const SOUND_FILES: Record<VaktindeKilSound, any> = {
  bip: require('../../assets/sounds/bip.wav'),
  dong: require('../../assets/sounds/dong.wav'),
};

async function playPreview(sound: VaktindeKilSound) {
  try {
    const { sound: player } = await Audio.Sound.createAsync(SOUND_FILES[sound]);
    await player.playAsync();
    player.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        player.unloadAsync();
      }
    });
  } catch (e) {
    console.warn('Ses önizlemesi çalınamadı:', e);
  }
}

export default function VaktindeKilScreen({ onClose }: Props) {
  const {
    enabled,
    firstDelayMinutes,
    repeatIntervalMinutes,
    sound,
    setEnabled,
    setFirstDelayMinutes,
    setRepeatIntervalMinutes,
    setSound,
  } = useVaktindeKil();
  const [delayPickerVisible, setDelayPickerVisible] = useState(false);
  const [intervalPickerVisible, setIntervalPickerVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const { t } = useCeviri();

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title={t('vaktindeKil')}
        icon="vaktindekil"
        onClose={onClose}
        rightIcon="bilgi"
        onRightPress={() => setInfoVisible((v) => !v)}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {infoVisible && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{t('vaktindeKilBilgi')}</Text>
          </View>
        )}

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{t('vaktindeKilHadis')}"</Text>
          <Text style={styles.quoteSource}>{t('vaktindeKilHadisKaynak')}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardLabelInline}>{t('vaktindeKil')}</Text>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ true: colors.primaryBright, false: undefined }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('ilkUyariGecikmesi')}</Text>
        <TouchableOpacity style={styles.card} onPress={() => setDelayPickerVisible(true)} activeOpacity={0.75}>
          <Text style={styles.cardSubtext}>{t('dakika', firstDelayMinutes)}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('uyariSikligi')}</Text>
        <TouchableOpacity style={styles.card} onPress={() => setIntervalPickerVisible(true)} activeOpacity={0.75}>
          <Text style={styles.cardSubtext}>{t('dakikadaBir', repeatIntervalMinutes)}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('uyariSesiBaslik')}</Text>
        <View style={styles.soundRow}>
          <TouchableOpacity
            style={styles.soundOption}
            activeOpacity={0.75}
            onPress={() => {
              setSound('bip');
              playPreview('bip');
            }}
          >
            <View style={[styles.checkbox, sound === 'bip' && styles.checkboxActive]}>
              {sound === 'bip' && <Icon name="onay" size={16} color={colors.white} />}
            </View>
            <Text style={styles.soundLabel}>{t('bip')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.soundOption}
            activeOpacity={0.75}
            onPress={() => {
              setSound('dong');
              playPreview('dong');
            }}
          >
            <View style={[styles.checkbox, sound === 'dong' && styles.checkboxActive]}>
              {sound === 'dong' && <Icon name="onay" size={16} color={colors.white} />}
            </View>
            <Text style={styles.soundLabel}>{t('dong')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SimplePickerModal
        visible={delayPickerVisible}
        title={t('ilkUyariGecikmesi')}
        options={DELAY_OPTIONS.map((m) => ({ id: String(m), label: t('dakika', m) }))}
        selectedId={String(firstDelayMinutes)}
        onSelect={(id) => setFirstDelayMinutes(Number(id))}
        onClose={() => setDelayPickerVisible(false)}
      />
      <SimplePickerModal
        visible={intervalPickerVisible}
        title={t('uyariSikligi')}
        options={INTERVAL_OPTIONS.map((m) => ({ id: String(m), label: t('dakikadaBir', m) }))}
        selectedId={String(repeatIntervalMinutes)}
        onSelect={(id) => setRepeatIntervalMinutes(Number(id))}
        onClose={() => setIntervalPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  scrollContent: { padding: spacing.lg },
  infoCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  infoText: {
    fontFamily: typography.bodyMedium,
    color: colors.textOnLight,
    fontSize: fontSize.small,
    lineHeight: lineHeight.small,
  },
  quoteCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  quoteText: {
    fontFamily: typography.bodyMedium,
    color: colors.textOnDark,
    fontSize: fontSize.small,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: lineHeight.small,
  },
  quoteSource: {
    fontFamily: typography.bodyBold,
    color: colors.copperLight,
    fontSize: fontSize.tiny,
    textAlign: 'right',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.bodyBold,
    color: colors.copper,
    fontSize: fontSize.tiny,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.card,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabelInline: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: fontSize.bodyLg },
  cardSubtext: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: fontSize.body },
  soundRow: { flexDirection: 'row', gap: spacing.md },
  soundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 20, height: 20, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.primary },
  soundLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: fontSize.body },
});
