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
import DoluIkon, { DoluIkonAdi } from '../components/DoluIkon';
import { colors, spacing, radius, typography, elevation, fontSize, lineHeight } from '../theme';
import { useKaza } from '../context/KazaContext';
import { useIbadetTakibi } from '../context/IbadetTakibiContext';
import { useCeviri } from '../i18n/DilContext';
import { CeviriAnahtari } from '../i18n/ceviriler';
import BannerReklam from '../components/BannerReklam';
import { REKLAM_KESFET } from '../config/reklamKimlikleri';

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
  | 'settings'
  | 'tema';

// NOT: ad/aciklama artık düz metin değil ÇEVİRİ ANAHTARI — bu dizi modül
// yüklenirken bir kez oluşturulduğu için React hook'u (useCeviri)
// çağıramaz, gerçek metin render sırasında t(anahtar) ile çözülüyor
// (HomeScreen'deki SEKMELER/HIZLI_ARACLAR ile aynı desen).
interface Arac {
  hedef: KesfetHedef;
  adAnahtari: CeviriAnahtari;
  aciklamaAnahtari: CeviriAnahtari;
  ikon: DoluIkonAdi;
}

interface Grup {
  baslikAnahtari: CeviriAnahtari;
  araclar: Arac[];
}

const GRUPLAR: Grup[] = [
  {
    baslikAnahtari: 'grupIbadet',
    araclar: [
      { hedef: 'kible', adAnahtari: 'sekmeKible', aciklamaAnahtari: 'aciklamaYonBul', ikon: 'kible' },
      { hedef: 'tesbih', adAnahtari: 'aracTesbih', aciklamaAnahtari: 'aciklamaZikirmatik', ikon: 'tesbih' },
      { hedef: 'esma', adAnahtari: 'adEsmaulHusna', aciklamaAnahtari: 'aciklama99GuzelIsim', ikon: 'esma' },
      { hedef: 'imsakiye', adAnahtari: 'sekmeImsakiye', aciklamaAnahtari: 'aciklamaAylikTakvim', ikon: 'imsakiye' },
    ],
  },
  {
    baslikAnahtari: 'aracTakip',
    araclar: [
      { hedef: 'takip', adAnahtari: 'adIbadetTakibi', aciklamaAnahtari: 'aciklamaGunlukSeri', ikon: 'takip' },
      { hedef: 'kaza', adAnahtari: 'kazaTakibi', aciklamaAnahtari: 'aciklamaBorcSayaci', ikon: 'kaza' },
    ],
  },
  {
    baslikAnahtari: 'grupHatirlatmaAyarlar',
    araclar: [
      { hedef: 'vaktindekil', adAnahtari: 'vaktindeKil', aciklamaAnahtari: 'aciklamaTekrarliUyari', ikon: 'vaktindekil' },
      { hedef: 'reminders', adAnahtari: 'hatirlaticilar', aciklamaAnahtari: 'aciklamaOzelUyarilar', ikon: 'hatirlatici' },
      { hedef: 'tema', adAnahtari: 'adTema', aciklamaAnahtari: 'aciklamaRenkDuzeni', ikon: 'tema' },
      { hedef: 'location', adAnahtari: 'adKonum', aciklamaAnahtari: 'aciklamaSehirSec', ikon: 'konum' },
      { hedef: 'settings', adAnahtari: 'ayarlar', aciklamaAnahtari: 'aciklamaTumAyarlar', ikon: 'ayarlar' },
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
  const { t } = useCeviri();

  /** Bazı kutularda sağ üstte küçük bir bilgi rozeti gösteriliyor. */
  const rozet = (hedef: KesfetHedef): string | null => {
    if (hedef === 'kaza' && kazaTotal > 0) return String(kazaTotal);
    if (hedef === 'takip' && seri > 0) return t('kesfetSeriRozeti', seri);
    return null;
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title={t('sekmeKesfet')} subtitle={t('kesfetAltBaslik')} icon="kesfet" onClose={onClose} />

      <ScrollView
        contentContainerStyle={[styles.icerik, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {GRUPLAR.map((grup, index) => (
          <React.Fragment key={grup.baslikAnahtari}>
            <View style={styles.grup}>
              <Text style={styles.grupBaslik}>{t(grup.baslikAnahtari)}</Text>
              <View style={styles.izgara}>
                {grup.araclar.map((arac) => {
                  const r = rozet(arac.hedef);
                  const ad = t(arac.adAnahtari);
                  const aciklama = t(arac.aciklamaAnahtari);
                  return (
                    <TouchableOpacity
                      key={arac.hedef}
                      style={styles.kutu}
                      onPress={() => onNavigate(arac.hedef)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={`${ad}. ${aciklama}`}
                    >
                      <View style={styles.ikonKap}>
                        <DoluIkon ad={arac.ikon} boyut={34} zemin={colors.primarySoft} />
                      </View>
                      {r && (
                        <View style={styles.rozet}>
                          <Text style={styles.rozetYazi}>{r}</Text>
                        </View>
                      )}
                      <Text style={styles.kutuAd} numberOfLines={1}>
                        {ad}
                      </Text>
                      <Text style={styles.kutuAciklama} numberOfLines={1}>
                        {aciklama}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ============ REKLAM ALANI — KEŞFET ============
                Kullanıcının isteği: "İbadet" grubu (index 0) ile "Takip"
                grubu (index 1) arasına — GRUPLAR dizisindeki sıra tam olarak
                bu, o yüzden ilk grubun hemen ardına ekleniyor. */}
            {index === 0 && <BannerReklam unitId={REKLAM_KESFET} style={styles.reklamAlani} />}
          </React.Fragment>
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
    fontSize: fontSize.title,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  izgara: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  reklamAlani: { marginBottom: spacing.lg },
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  kutuAd: { fontFamily: typography.bodyBold, fontSize: fontSize.bodyLg, color: colors.textOnLight },
  kutuAciklama: { fontFamily: typography.bodyMedium, fontSize: fontSize.small, color: colors.textMuted, marginTop: 2 },

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
  rozetYazi: { fontFamily: typography.bodyBold, fontSize: fontSize.micro, color: colors.white },
});
