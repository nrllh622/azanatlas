// src/screens/VaktindeKilScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { useVaktindeKil } from '../context/VaktindeKilContext';
import SimplePickerModal from '../components/SimplePickerModal';

interface Props {
  onClose: () => void;
}

const DELAY_OPTIONS = [10, 15, 20, 30, 45];
const INTERVAL_OPTIONS = [5, 10, 15, 20, 30];

export default function VaktindeKilScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
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
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Vaktinde Kıl</Text>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <TouchableOpacity onPress={() => setInfoVisible(!infoVisible)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.infoLink}>Nedir?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {infoVisible && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Vaktinde Kıl açıkken, bir namaz vakti girdikten belirlediğin gecikme süresi kadar sonra, eğer o vakti
              henüz kılmadıysan sana hatırlatma bildirimi gönderir. Bir sonraki vakit girene kadar, belirlediğin
              sıklıkla bu hatırlatma tekrarlanır — böylece namazını vaktin içinde geciktirmeden kılmayı unutmazsın.
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
            <Switch value={enabled} onValueChange={setEnabled} trackColor={{ true: colors.gold, false: undefined }} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>İlk Uyarı Gecikmesi</Text>
        <TouchableOpacity style={styles.card} onPress={() => setDelayPickerVisible(true)}>
          <Text style={styles.cardSubtext}>{firstDelayMinutes} dakika</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Uyarı Sıklığı</Text>
        <TouchableOpacity style={styles.card} onPress={() => setIntervalPickerVisible(true)}>
          <Text style={styles.cardSubtext}>{repeatIntervalMinutes} dakikada bir</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Uyarı Sesi</Text>
        <View style={styles.soundRow}>
          <TouchableOpacity style={styles.soundOption} onPress={() => setSound('bip')}>
            <View style={[styles.checkbox, sound === 'bip' && styles.checkboxActive]}>
              {sound === 'bip' && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.soundLabel}>Bip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.soundOption} onPress={() => setSound('dong')}>
            <View style={[styles.checkbox, sound === 'dong' && styles.checkboxActive]}>
              {sound === 'dong' && <Text style={styles.checkmark}>✓</Text>}
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
  safeArea: { flex: 1, backgroundColor: colors.primary },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22 },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 16 },
  infoLink: { fontFamily: typography.bodyBold, color: colors.sand, fontSize: 14, textDecorationLine: 'underline' },
  scrollContent: { padding: spacing.lg },
  infoCard: { backgroundColor: 'rgba(250,246,236,0.12)', borderRadius: 14, padding: spacing.md, marginBottom: spacing.md },
  infoText: { fontFamily: typography.bodyMedium, color: colors.textOnDark, fontSize: 13, lineHeight: 19 },
  quoteCard: { backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: spacing.md },
  quoteText: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 14, fontStyle: 'italic', textAlign: 'center' },
  quoteSource: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 13, textAlign: 'right', marginTop: spacing.sm },
  sectionTitle: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 14, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: spacing.sm },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabelInline: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 16 },
  cardSubtext: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 15 },
  soundRow: { flexDirection: 'row', gap: spacing.lg },
  soundOption: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.white, borderRadius: 12, padding: spacing.md, flex: 1 },
  checkbox: { width: 20, height: 20, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.primary },
  checkmark: { color: colors.white, fontSize: 12 },
  soundLabel: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 15 },
});
