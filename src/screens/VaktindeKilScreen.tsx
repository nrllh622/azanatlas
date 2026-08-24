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

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Vaktinde Kıl"
        icon="vaktindekil"
        onClose={onClose}
        rightIcon="bilgi"
        onRightPress={() => setInfoVisible((v) => !v)}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {infoVisible && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Vaktinde Kıl açıkken, bir namaz vakti girdikten belirlediğin gecikme süresi kadar sonra, eğer o vakti
              henüz kılmadıysan sana hatırlatma bildirimi gönderir. Bir sonraki vakit girene kadar, belirlediğin
              sıklıkla bu hatırlatma tekrarlanır. Bildirimdeki "Kıldım" butonuna dokunursan, o vakit için kalan
              hatırlatmalar durur.
            </Text>
          </View>
        )}

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "Allah katında en hayırlı amel, vaktinde kılınan namazdır. Sonra anne babaya iyilik, sonra da Allah
            yolunda cihad etmektir."
          </Text>
          <Text style={styles.quoteSource}>Buhari</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardLabelInline}>Vaktinde Kıl</Text>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ true: colors.primaryBright, false: undefined }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>İlk Uyarı Gecikmesi</Text>
        <TouchableOpacity style={styles.card} onPress={() => setDelayPickerVisible(true)} activeOpacity={0.75}>
          <Text style={styles.cardSubtext}>{firstDelayMinutes} dakika</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Uyarı Sıklığı</Text>
        <TouchableOpacity style={styles.card} onPress={() => setIntervalPickerVisible(true)} activeOpacity={0.75}>
          <Text style={styles.cardSubtext}>{repeatIntervalMinutes} dakikada bir</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Uyarı Sesi</Text>
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
            <Text style={styles.soundLabel}>Bip</Text>
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
            <Text style={styles.soundLabel}>Dong</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SimplePickerModal
        visible={delayPickerVisible}
        title="İlk Uyarı Gecikmesi"
        options={DELAY_OPTIONS.map((m) => ({ id: String(m), label: `${m} dakika` }))}
        selectedId={String(firstDelayMinutes)}
        onSelect={(id) => setFirstDelayMinutes(Number(id))}
        onClose={() => setDelayPickerVisible(false)}
      />
      <SimplePickerModal
        visible={intervalPickerVisible}
        title="Uyarı Sıklığı"
        options={INTERVAL_OPTIONS.map((m) => ({ id: String(m), label: `${m} dakikada bir` }))}
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
