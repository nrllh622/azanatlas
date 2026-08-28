// src/components/SoundPickerModal.tsx
//
// Ses seçici alt sayfası — SimplePickerModal ile aynı görsel dil (koyu
// başlık şeridi + İslami doku, kart satırları) kullanılıyor ki uygulamadaki
// hiçbir popup diğerlerinden görsel olarak kopuk durmasın.

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { colors, spacing, typography, radius, fontSize } from '../theme';
import Icon from './Icon';
import IslamicPattern from './IslamicPattern';
import { SOUND_CATALOG, SoundOption } from '../data/soundCatalog';
import { useCeviri } from '../i18n/DilContext';

interface Props {
  visible: boolean;
  title: string;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function SoundPickerModal({ visible, title, selectedId, onSelect, onClose }: Props) {
  const { t, sesAdi } = useCeviri();
  // DÜZELTME (bu tur — madde 1): önceden her dokunuşta YENİ bir Audio.Sound
  // örneği oluşturuluyor ve HİÇBİRİ referansı tutulmuyordu — art arda birkaç
  // ses seçilince hepsi aynı anda çalmaya devam ediyordu (bir öncekini
  // durdurmak mümkün değildi). Şimdi o an çalan tek örnek `calanRef`'te
  // tutuluyor; yeni bir sese dokunulduğunda önce eskisi durdurulup
  // boşaltılıyor, SONRA yenisi başlatılıyor.
  const calanRef = useRef<Audio.Sound | null>(null);

  const oncekiniDurdur = async () => {
    const onceki = calanRef.current;
    calanRef.current = null;
    if (onceki) {
      try {
        await onceki.stopAsync();
      } catch {
        // Zaten durmuş/boşaltılmış olabilir — yok sayılır.
      }
      try {
        await onceki.unloadAsync();
      } catch {
        // Aynı şekilde yok sayılır.
      }
    }
  };

  // Modal kapanınca veya bileşen kaldırılınca çalmakta olan sesi durdur —
  // aksi halde kullanıcı "Kapat"a bassa bile ses arka planda çalmaya devam
  // ederdi.
  useEffect(() => {
    if (!visible) {
      oncekiniDurdur();
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      oncekiniDurdur();
    };
  }, []);

  const playPreview = async (sound: SoundOption) => {
    await oncekiniDurdur();
    if (!sound.file) return;
    try {
      const { sound: player } = await Audio.Sound.createAsync(sound.file);
      calanRef.current = player;
      await player.playAsync();
      player.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          player.unloadAsync();
          if (calanRef.current === player) calanRef.current = null;
        }
      });
    } catch (e) {
      console.warn('Ses önizlemesi çalınamadı:', e);
    }
  };

  // NOT: bu kontrol iki `useEffect`ten SONRA yapılıyor — Hook'lar her
  // render'da aynı sırada çağrılmalı, `visible=false` olduğunda erken
  // dönülürse yukarıdaki useEffect'ler atlanır ve React kural ihlali
  // (ve `visible` false olurken temizlik useEffect'inin hiç tetiklenmemesi)
  // ortaya çıkar.
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.baslikSeridi}>
          <IslamicPattern color={colors.cream} opacity={0.07} tile={36} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <FlatList
          data={SOUND_CATALOG}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.liste}
          renderItem={({ item }) => {
            const active = item.id === selectedId;
            return (
              <TouchableOpacity
                style={[styles.row, active && styles.rowActive]}
                onPress={() => {
                  playPreview(item);
                  onSelect(item.id);
                }}
                activeOpacity={0.8}
              >
                <Icon name="hatirlatici" size={18} color={active ? colors.primaryDark : colors.textMuted} />
                <Text style={[styles.rowText, active && styles.rowTextActive]}>{sesAdi(item.id, item.label)}</Text>
                {active && <Icon name="onay" size={20} color={colors.success} />}
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.footerBtn}>{t('vazgecBuyuk')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={[styles.footerBtn, styles.footerBtnPrimary]}>{t('tamamBuyuk')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay, justifyContent: 'flex-end', zIndex: 100 },
  sheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '75%',
    overflow: 'hidden',
  },
  baslikSeridi: {
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  title: { fontFamily: typography.displaySemibold, fontSize: fontSize.title, color: colors.textOnDark },
  liste: { padding: spacing.md, gap: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowActive: { borderColor: colors.success },
  rowText: { flex: 1, fontFamily: typography.bodyMedium, color: colors.textOnLight, fontSize: fontSize.body },
  rowTextActive: { fontFamily: typography.bodyBold, color: colors.primaryDark },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.lg,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerBtn: { fontFamily: typography.bodyBold, color: colors.copper, fontSize: fontSize.small, letterSpacing: 0.4 },
  footerBtnPrimary: { color: colors.primaryDark },
});
