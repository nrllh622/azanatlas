// src/screens/EsmaulHusnaScreen.tsx
//
// ESMÂÜ'L-HÜSNÂ
//
// Allah'ın 99 güzel isminin Arapça yazılışı, Türkçe okunuşu ve kısa anlamı.
// Uzun bir liste olduğu için FlatList ile sanallaştırılmış olarak çiziliyor;
// 99 kartın tamamı aynı anda oluşturulmuyor, kaydırma akıcı kalıyor.
//
// Arama kutusu hem okunuşta hem anlamda arar (ör. "rahmet" yazınca
// Er-Rahmân ve Er-Rahîm gelir).

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { colors, spacing, radius, typography, elevation } from '../theme';
import { ESMAUL_HUSNA, LAFZA_I_CELAL, EsmaItem } from '../data/esmaulHusna';
import { useCeviri } from '../i18n/DilContext';

interface Props {
  onClose: () => void;
}

/**
 * Türkçe arama için metni sadeleştirir: küçük harfe indirir ve şapkalı /
 * aksanlı harfleri sade karşılıklarına çevirir. Böylece "azim" yazan kullanıcı
 * "El-Azîm" sonucunu bulabilir.
 */
function sadelestir(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/[âäà]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/[ûü]/g, 'u')
    .replace(/[ôö]/g, 'o')
    .replace(/[êë]/g, 'e')
    .replace(/[’']/g, '');
}

function EsmaKart({ item }: { item: EsmaItem }) {
  return (
    <View style={styles.kart}>
      <View style={styles.noKap}>
        <Text style={styles.noYazi}>{item.no}</Text>
      </View>
      <View style={styles.kartIcerik}>
        <View style={styles.kartUst}>
          <Text style={styles.latin}>{item.latin}</Text>
          <Text style={styles.arapca}>{item.arabic}</Text>
        </View>
        <Text style={styles.anlam}>{item.meaning}</Text>
      </View>
    </View>
  );
}

export default function EsmaulHusnaScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [arama, setArama] = useState('');
  const { t } = useCeviri();
  // NOT: isim/anlam metinleri (`item.meaning`, Lafza-i celâl) VERİ içeriği —
  // Ana Sayfa'daki ayet/tarih verileri gibi bu paketin kapsamı dışında,
  // yalnızca çevre metinler (başlık, arama kutusu, boş durum) çevrildi.

  const liste = useMemo(() => {
    const q = sadelestir(arama.trim());
    if (!q) return ESMAUL_HUSNA;
    return ESMAUL_HUSNA.filter(
      (e) => sadelestir(e.latin).includes(q) || sadelestir(e.meaning).includes(q)
    );
  }, [arama]);

  return (
    <View style={styles.wrap}>
      {/* Madde 12 (bu tur): başlık `t('adEsmaulHusna')` yerine sabit Türkçe
          "Esmâü'l-Hüsnâ" metniydi — sözlükte doğru çeviriler (EN "Names of
          Allah", ID "Asmaul Husna", FR "Noms d'Allah") zaten tanımlıyken bu
          ekran onları hiç okumuyordu. */}
      <ScreenHeader
        title={t('adEsmaulHusna')}
        subtitle={t('esmaAltBaslik')}
        icon="esma"
        onClose={onClose}
      />

      <FlatList
        data={liste}
        keyExtractor={(item) => String(item.no)}
        renderItem={({ item }) => <EsmaKart item={item} />}
        contentContainerStyle={[styles.icerik, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            {/* Lafza-i celâl — 99 ismi kapsayan ism-i a'zam, listenin dışında */}
            <View style={styles.celalKart}>
              <Text style={styles.celalArapca}>{LAFZA_I_CELAL.arabic}</Text>
              <Text style={styles.celalLatin}>{LAFZA_I_CELAL.latin}</Text>
              <Text style={styles.celalAnlam}>{LAFZA_I_CELAL.meaning}</Text>
            </View>

            <View style={styles.aramaKap}>
              <Icon name="kesfet" size={17} color={colors.textMuted} />
              <TextInput
                value={arama}
                onChangeText={setArama}
                placeholder={t('esmaAramaYerTutucu')}
                placeholderTextColor={colors.textFaint}
                style={styles.aramaGirdi}
                autoCorrect={false}
              />
              {arama.length > 0 && (
                <TouchableOpacity
                  onPress={() => setArama('')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={t('esmaAramayiTemizle')}
                >
                  <Icon name="kapat" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.bosKap}>
            <Icon name="bilgi" size={26} color={colors.textFaint} />
            <Text style={styles.bosYazi}>{t('esmaSonucBulunamadi')}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  icerik: { paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: spacing.sm },

  celalKart: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  celalArapca: {
    fontFamily: typography.displayFamily,
    fontSize: 40,
    color: colors.copperLight,
    lineHeight: 62,
  },
  celalLatin: {
    fontFamily: typography.displaySemibold,
    fontSize: 18,
    color: colors.textOnDark,
    marginTop: spacing.xs,
  },
  celalAnlam: {
    fontFamily: typography.bodyFamily,
    fontSize: 12,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 18,
  },

  aramaKap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  aramaGirdi: {
    flex: 1,
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.textOnLight,
    padding: 0,
  },

  kart: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'flex-start',
    ...elevation.card,
  },
  noKap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.copperSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noYazi: { fontFamily: typography.bodyBold, fontSize: 12, color: colors.copper },
  kartIcerik: { flex: 1 },
  kartUst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  latin: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.primaryDark, flexShrink: 1 },
  arapca: {
    fontFamily: typography.displayFamily,
    fontSize: 19,
    color: colors.copper,
    lineHeight: 32,
  },
  anlam: {
    fontFamily: typography.bodyFamily,
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 3,
    lineHeight: 18,
  },

  bosKap: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  bosYazi: { fontFamily: typography.bodyMedium, fontSize: 13, color: colors.textMuted },
});
