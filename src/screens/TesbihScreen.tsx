// src/screens/TesbihScreen.tsx
//
// ZİKİRMATİK / TESBİH
//
// Namaz sonrası tesbihat için dijital sayaç. Ekranın tamamı dokunma alanıdır;
// kullanıcı telefona bakmadan, baş parmağıyla sayabilsin diye büyük bir alan
// bırakıldı. Hedefe (33 / 99 / serbest) ulaşıldığında titreşim uyarısı verir
// ve tur sayacı bir artar.
//
// Sayaç ve seçili zikir cihazda saklanır; uygulama kapatılıp açıldığında
// kullanıcı kaldığı yerden devam eder.

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { colors, spacing, radius, typography, elevation } from '../theme';
import { useGeneralSettings } from '../context/GeneralSettingsContext';

const STORAGE_KEY = 'azanatlas_tesbih_v1';

/** Namaz sonrası tesbihatta okunan zikirler ve alışılmış sayıları. */
const ZIKIRLER = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللّٰه', latin: 'Sübhânallâh', anlam: 'Allah her türlü eksiklikten uzaktır', hedef: 33 },
  { id: 'elhamdulillah', arabic: 'اَلْحَمْدُ لِلّٰه', latin: 'Elhamdülillâh', anlam: 'Hamd Allah’a mahsustur', hedef: 33 },
  { id: 'allahuekber', arabic: 'اَللّٰهُ اَكْبَر', latin: 'Allâhü ekber', anlam: 'Allah en büyüktür', hedef: 33 },
  { id: 'lailahe', arabic: 'لَا إِلٰهَ إِلَّا اللّٰه', latin: 'Lâ ilâhe illallâh', anlam: 'Allah’tan başka ilah yoktur', hedef: 100 },
  { id: 'istigfar', arabic: 'أَسْتَغْفِرُ اللّٰه', latin: 'Estağfirullâh', anlam: 'Allah’tan bağışlanma dilerim', hedef: 100 },
  { id: 'salavat', arabic: 'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّد', latin: 'Allâhümme salli alâ Muhammed', anlam: 'Peygamber’e salât ü selam', hedef: 100 },
];

interface Props {
  onClose: () => void;
}

/** Sayacın etrafındaki ilerleme halkası. */
function IlerlemeHalkasi({ oran, boyut = 208 }: { oran: number; boyut?: number }) {
  const kalinlik = 10;
  const r = (boyut - kalinlik) / 2;
  const cevre = 2 * Math.PI * r;
  // Tam dolduğunda halkanın kaybolmaması için üst sınır uygulanıyor.
  const dolu = Math.min(oran, 1) * cevre;

  return (
    <Svg width={boyut} height={boyut} style={StyleSheet.absoluteFill}>
      <Circle
        cx={boyut / 2}
        cy={boyut / 2}
        r={r}
        stroke={colors.sand}
        strokeWidth={kalinlik}
        fill="none"
      />
      <Circle
        cx={boyut / 2}
        cy={boyut / 2}
        r={r}
        stroke={colors.copper}
        strokeWidth={kalinlik}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dolu} ${cevre}`}
        // Halkanın saat 12 yönünden başlaması için 90° geri döndürülüyor.
        transform={`rotate(-90 ${boyut / 2} ${boyut / 2})`}
      />
    </Svg>
  );
}

export default function TesbihScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { vibrationEnabled } = useGeneralSettings();
  const [zikirId, setZikirId] = useState(ZIKIRLER[0].id);
  const [sayac, setSayac] = useState(0);
  const [tur, setTur] = useState(0);
  const [yuklendi, setYuklendi] = useState(false);

  const zikir = ZIKIRLER.find((z) => z.id === zikirId) ?? ZIKIRLER[0];

  // Kaydedilmiş durumu geri yükle
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const d = JSON.parse(raw);
          if (typeof d.sayac === 'number') setSayac(d.sayac);
          if (typeof d.tur === 'number') setTur(d.tur);
          if (typeof d.zikirId === 'string' && ZIKIRLER.some((z) => z.id === d.zikirId)) {
            setZikirId(d.zikirId);
          }
        }
      } catch {
        // Okunamazsa sıfırdan başla.
      } finally {
        setYuklendi(true);
      }
    })();
  }, []);

  // Durumu sakla. `yuklendi` bekleniyor — aksi halde ilk render'daki sıfır
  // değerleri, henüz okunmamış gerçek kaydın üzerine yazardı.
  useEffect(() => {
    if (!yuklendi) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ sayac, tur, zikirId })).catch(() => {});
  }, [sayac, tur, zikirId, yuklendi]);

  const artir = useCallback(() => {
    setSayac((onceki) => {
      const yeni = onceki + 1;
      if (yeni >= zikir.hedef) {
        // Hedefe ulaşıldı: tur tamamlandı, sayaç başa döner.
        if (vibrationEnabled) Vibration.vibrate([0, 60, 70, 60]);
        setTur((t) => t + 1);
        return 0;
      }
      if (vibrationEnabled) Vibration.vibrate(18);
      return yeni;
    });
  }, [zikir.hedef, vibrationEnabled]);

  const azalt = () => setSayac((o) => Math.max(0, o - 1));

  const sifirla = () => {
    setSayac(0);
    setTur(0);
    if (vibrationEnabled) Vibration.vibrate(40);
  };

  const zikirDegistir = (id: string) => {
    setZikirId(id);
    setSayac(0);
    setTur(0);
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Tesbih"
        subtitle="Zikirmatik"
        icon="tesbih"
        onClose={onClose}
        rightIcon="yenile"
        onRightPress={sifirla}
      />

      <ScrollView
        contentContainerStyle={[styles.icerik, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Zikir seçici */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.zikirSeritIcerik}
          style={styles.zikirSerit}
        >
          {ZIKIRLER.map((z) => {
            const secili = z.id === zikirId;
            return (
              <TouchableOpacity
                key={z.id}
                onPress={() => zikirDegistir(z.id)}
                style={[styles.zikirCip, secili && styles.zikirCipSecili]}
                accessibilityRole="button"
                accessibilityState={{ selected: secili }}
              >
                <Text style={[styles.zikirCipYazi, secili && styles.zikirCipYaziSecili]}>
                  {z.latin}
                </Text>
                <Text style={[styles.zikirCipHedef, secili && styles.zikirCipHedefSecili]}>
                  {z.hedef}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Seçili zikrin künyesi */}
        <View style={styles.zikirKart}>
          <Text style={styles.zikirArapca}>{zikir.arabic}</Text>
          <Text style={styles.zikirLatin}>{zikir.latin}</Text>
          <Text style={styles.zikirAnlam}>{zikir.anlam}</Text>
        </View>

        {/* Sayaç — ekranın büyük bölümü dokunma alanı */}
        <Pressable
          onPress={artir}
          style={({ pressed }) => [styles.sayacAlan, pressed && styles.sayacAlanBasili]}
          accessibilityRole="button"
          accessibilityLabel={`Sayacı artır. Şu an ${sayac}, hedef ${zikir.hedef}`}
        >
          <View style={styles.halkaKap}>
            <IlerlemeHalkasi oran={sayac / zikir.hedef} />
            <View style={styles.sayacIc}>
              <Text style={styles.sayacRakam}>{sayac}</Text>
              <Text style={styles.sayacHedef}>/ {zikir.hedef}</Text>
            </View>
          </View>
          <Text style={styles.dokunIpucu}>Saymak için dokunun</Text>
        </Pressable>

        {/* Tur ve geri alma */}
        <View style={styles.altSatir}>
          <View style={styles.turKart}>
            <Icon name="yildiz" size={16} color={colors.copper} />
            <View>
              <Text style={styles.turEtiket}>Tamamlanan tur</Text>
              <Text style={styles.turDeger}>{tur}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.geriAlBtn}
            onPress={azalt}
            accessibilityRole="button"
            accessibilityLabel="Bir geri al"
          >
            <Icon name="eksi" size={18} color={colors.primaryDark} />
            <Text style={styles.geriAlYazi}>Geri al</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  icerik: { paddingHorizontal: spacing.md, paddingTop: spacing.md },

  zikirSerit: { marginHorizontal: -spacing.md },
  zikirSeritIcerik: { paddingHorizontal: spacing.md, gap: spacing.sm },
  zikirCip: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  zikirCipSecili: { backgroundColor: colors.primary, borderColor: colors.primary },
  zikirCipYazi: { fontFamily: typography.bodyBold, fontSize: 12.5, color: colors.textOnLight },
  zikirCipYaziSecili: { color: colors.white },
  zikirCipHedef: { fontFamily: typography.bodyMedium, fontSize: 11, color: colors.textMuted },
  zikirCipHedefSecili: { color: colors.copperLight },

  zikirKart: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    ...elevation.card,
  },
  zikirArapca: {
    fontFamily: typography.displayFamily,
    fontSize: 28,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 46,
  },
  zikirLatin: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: colors.copper,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  zikirAnlam: {
    fontFamily: typography.bodyFamily,
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  sayacAlan: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    ...elevation.card,
  },
  sayacAlanBasili: { backgroundColor: colors.primarySoft },
  halkaKap: {
    width: 208,
    height: 208,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sayacIc: { alignItems: 'center' },
  sayacRakam: {
    fontFamily: typography.displayFamily,
    fontSize: 64,
    color: colors.primaryDark,
    lineHeight: 76,
  },
  sayacHedef: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: -spacing.xs,
  },
  dokunIpucu: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.textFaint,
    marginTop: spacing.md,
  },

  altSatir: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  turKart: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...elevation.card,
  },
  turEtiket: { fontFamily: typography.bodyMedium, fontSize: 11, color: colors.textMuted },
  turDeger: { fontFamily: typography.bodyBold, fontSize: 18, color: colors.primaryDark },
  geriAlBtn: {
    backgroundColor: colors.creamDeep,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  geriAlYazi: { fontFamily: typography.bodyBold, fontSize: 13, color: colors.primaryDark },
});
