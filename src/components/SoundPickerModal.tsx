// src/components/SoundPickerModal.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { colors, spacing, typography, radius } from '../theme';
import Icon from './Icon';
import { SOUND_CATALOG, SoundOption } from '../data/soundCatalog';

interface Props {
  visible: boolean;
  title: string;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function SoundPickerModal({ visible, title, selectedId, onSelect, onClose }: Props) {
  if (!visible) return null;

  const playPreview = async (sound: SoundOption) => {
    if (!sound.file) return;
    try {
      const { sound: player } = await Audio.Sound.createAsync(sound.file);
      await player.playAsync();
      player.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          player.unloadAsync();
        }
      });
    } catch (e) {
      console.warn('Ses önizlemesi çalınamadı:', e);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>
        <FlatList
          data={SOUND_CATALOG}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const active = item.id === selectedId;
            return (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  playPreview(item);
                  onSelect(item.id);
                }}
              >
                <View style={[styles.checkbox, active && styles.checkboxActive]}>
                  {active && <Icon name="onay" size={16} color={colors.white} />}
                </View>
                <Text style={styles.rowText}>{item.label}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.footerBtn}>VAZGEÇ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={[styles.footerBtn, styles.footerBtnPrimary]}>TAMAM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  sheet: { backgroundColor: colors.cream, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, maxHeight: '75%', paddingTop: spacing.md },
  title: { fontFamily: typography.bodyBold, fontSize: 18, color: colors.primaryDark, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  checkbox: { width: 22, height: 22, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.primary },
  checkmark: { color: colors.cream, fontSize: 14 },
  rowText: { fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.lg, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.sand },
  footerBtn: { fontFamily: typography.bodyBold, color: colors.primary, fontSize: 14 },
  footerBtnPrimary: { color: colors.gold },
});
