// src/screens/KesfetScreen.tsx
//
// KEŞFET
//
// Uygulamadaki tüm araçların tek bir ızgarada toplandığı ekran. Ana Sayfa
// yalnızca en sık kullanılan dört aracı gösteriyor; geri kalan her şeye
// buradan ulaşılır.
//
// Araçlar amaçlarına göre gruplandı: "İbadet", "Takip" ve "Ayarlar".
// Bu gruplama, listeyi 9-10 kutuluk tek bir yığın olmaktan çıkarıp
// kullanıcının aradığını göz gezdirerek bulmasını sağlıyor.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import Icon, { IconName } from '../components/Icon';
import { colors, spacing, radius, typography, elevation } from '../theme';
import { useKaza } from '../context/KazaContext';
import { useIbadetTakibi } from '../context/IbadetTakibiContext';

export type KesfetHedef =
  | 'kible'
  | 'tesbih'
  | 'esma'
  | 'imsakiye'
  | 'kaza'
  | 'takip'
  | 'vaktindekil'
  | 'reminders'
  | 'location'
  | 'settings';

interface Arac {
  hedef: KesfetHedef;
  ad: string;
  aciklama: string;
  ikon: IconName;
}

interface Grup {
  baslik: string;
  araclar: Arac[];
}

const GRUPLAR: Grup[] = [
  {
    baslik: 'İbadet',
    araclar: [
      { hedef: 'kible', ad: 'Kıble', aciklama: 'Yön bul', ikon: 'kible' },
      { hedef: 'tesbih', ad: 'Tesbih', aciklama: 'Zikirmatik', ikon: 'tesbih' },
      { hedef: 'esma', ad: 'Esmâü’l-Hüsnâ', aciklama: '99 güzel isim', ikon: 'esma' },
      { hedef: 'imsakiye', ad: 'İmsakiye', aciklama: 'Aylık takvim', ikon: 'imsakiye' },
    ],
  },
  {
    baslik: 'Takip',
    araclar: [
      { hedef: 'takip', ad: 'İbadet Takibi', aciklama: 'Günlük seri', ikon: 'takip' },
      { hedef: 'kaza', ad: 'Kaza Takibi', aciklama: 'Borç sayacı', ikon: 'kaza' },
    ],
  },
  {
    baslik: 'Hatırlatma ve Ayarlar',
    araclar: [
      { hedef: 'vaktindekil', ad: 'Vaktinde Kıl', aciklama: 'Tekrarlı uyarı', ikon: 'vaktindekil' },
      { hedef: 'reminders', ad: 'Hatırlatıcılar', aciklama: 'Özel uyarılar', ikon: 'hatirlatici' },
      { hedef: 'location', ad: 'Konum', aciklama: 'Şehir seç', ikon: 'konum' },
      { hedef: 'settings', ad: 'Ayarlar', aciklama: 'Tüm ayarlar', ikon: 'ayarlar' },
    ],
  },
];

interface Props {
  /** Tam ekran açıldığında geri dönüş. Sekme olarak kullanıldığında verilmez. */
  onClose?: () => void;
  onNavigate: (hedef: KesfetHedef) => void;
}

export default function KesfetScreen({ onClose, onNavigate }: Props) {
  const insets = useSafeAreaInsets();
  const { totalCount: kazaTotal } = useKaza();
  const { seri } = useIbadetTakibi();

  /** Bazı kutularda sağ üstte küçük bir bilgi rozeti gösteriliyor. */
  const rozet = (hedef: KesfetHedef): string | null => {
    if (hedef === 'kaza' && kazaTotal > 0) return String(kazaTotal);
    if (hedef === 'takip' && seri > 0) return `${seri}g`;
    return null;
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Keşfet" subtitle="Tüm araçlar" icon="kesfet" onClose={onClose} />

      <ScrollView
        contentContainerStyle={[styles.icerik, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {GRUPLAR.map((grup) => (
          <View key={grup.baslik} style={styles.grup}>
            <Text style={styles.grupBaslik}>{grup.baslik}</Text>
            <View style={styles.izgara}>
              {grup.araclar.map((arac) => {
                const r = rozet(arac.hedef);
                return (
                  <TouchableOpacity
                    key={arac.hedef}
                    style={styles.kutu}
                    onPress={() => onNavigate(arac.hedef)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`${arac.ad}. ${arac.aciklama}`}
                  >
                    <View style={styles.ikonKap}>
                      <Icon name={arac.ikon} size={22} color={colors.primary} />
                    </View>
                    {r && (
                      <View style={styles.rozet}>
                        <Text style={styles.rozetYazi}>{r}</Text>
                      </View>
                    )}
                    <Text style={styles.kutuAd} numberOfLines={1}>
                      {arac.ad}
                    </Text>
                    <Text style={styles.kutuAciklama} numberOfLines={1}>
                      {arac.aciklama}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  icerik: { paddingHorizontal: spacing.md, paddingTop: spacing.md },

  grup: { marginBottom: spacing.lg },
  grupBaslik: {
    fontFamily: typography.displaySemibold,
    fontSize: 14,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  izgara: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  kutu: {
    // İki sütunlu ızgara: (%50 - yarım boşluk). gap zaten aradaki boşluğu
    // verdiği için yüzdeyi ona göre kısıyoruz.
    width: '48.5%',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    ...elevation.card,
  },
  ikonKap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  kutuAd: { fontFamily: typography.bodyBold, fontSize: 13.5, color: colors.textOnLight },
  kutuAciklama: { fontFamily: typography.bodyFamily, fontSize: 11, color: colors.textMuted, marginTop: 1 },

  rozet: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.copper,
    borderRadius: radius.pill,
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
  },
  rozetYazi: { fontFamily: typography.bodyBold, fontSize: 10, color: colors.white },
});
