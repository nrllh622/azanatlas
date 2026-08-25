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
import { colors, spacing, radius, typography, elevation, fontSize, lineHeight } from '../theme';
import { useGeneralSettings } from '../context/GeneralSettingsContext';
import { useCeviri } from '../i18n/DilContext';
import { veriSec } from '../lib/veriSec';

const STORAGE_KEY = 'azanatlas_tesbih_v1';

/** Namaz sonrası tesbihatta okunan zikirler ve alışılmış sayıları.
    `anlam`/`anlamEn`/`anlamId`/`anlamFr`: Arapça/Latin yazılış DEĞİŞMEZ (her
    dilde aynı), yalnızca kısa anlam açıklaması aktif dile göre seçiliyor
    (madde 10a/13 — bu tur: id/fr alanları da eklendi, bkz. `veriSec()`). */
const ZIKIRLER = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللّٰه', latin: 'Sübhânallâh', anlam: 'Allah her türlü eksiklikten uzaktır', anlamEn: 'Glory be to Allah, free from all imperfection', anlamId: 'Mahasuci Allah dari segala kekurangan', anlamFr: 'Gloire à Allah, exempt de toute imperfection', hedef: 33 },
  { id: 'elhamdulillah', arabic: 'اَلْحَمْدُ لِلّٰه', latin: 'Elhamdülillâh', anlam: 'Hamd Allah’a mahsustur', anlamEn: 'All praise belongs to Allah', anlamId: 'Segala puji hanya milik Allah', anlamFr: 'Toute louange appartient à Allah', hedef: 33 },
  { id: 'allahuekber', arabic: 'اَللّٰهُ اَكْبَر', latin: 'Allâhü ekber', anlam: 'Allah en büyüktür', anlamEn: 'Allah is the greatest', anlamId: 'Allah Mahabesar', anlamFr: 'Allah est le plus grand', hedef: 33 },
  { id: 'lailahe', arabic: 'لَا إِلٰهَ إِلَّا اللّٰه', latin: 'Lâ ilâhe illallâh', anlam: 'Allah’tan başka ilah yoktur', anlamEn: 'There is no god but Allah', anlamId: 'Tiada Tuhan selain Allah', anlamFr: 'Il n’y a de divinité qu’Allah', hedef: 100 },
  { id: 'istigfar', arabic: 'أَسْتَغْفِرُ اللّٰه', latin: 'Estağfirullâh', anlam: 'Allah’tan bağışlanma dilerim', anlamEn: 'I seek forgiveness from Allah', anlamId: 'Aku memohon ampun kepada Allah', anlamFr: 'Je demande pardon à Allah', hedef: 100 },
  { id: 'salavat', arabic: 'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّد', latin: 'Allâhümme salli alâ Muhammed', anlam: 'Peygamber’e salât ü selam', anlamEn: 'O Allah, send blessings upon Muhammad', anlamId: 'Ya Allah, limpahkanlah selawat kepada Muhammad', anlamFr: 'Ô Allah, envoie Tes bénédictions sur Muhammad', hedef: 100 },
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
  const { t, dil } = useCeviri();
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
        title={t('aracTesbih')}
        subtitle={t('aciklamaZikirmatik')}
        icon="tesbih"
        onClose={onClose}
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
          <Text style={styles.zikirAnlam}>{veriSec(dil, zikir.anlam, zikir.anlamEn, zikir.anlamId, zikir.anlamFr)}</Text>
        </View>

        {/* Sayaç — ekranın büyük bölümü dokunma alanı.
            Madde 3 (bu tur): kullanıcı "Geri Al"/"Sıfırla" butonlarının
            ekranın altına scroll yapmadan sığmadığını bildirdi — dairesel
            sayaç 208dp'lik sabit boyutuyla en büyük tek bloktu. Aşağıda
            `boyut={172}` ile küçültüldü, `sayacAlan`'ın dikey iç boşluğu ve
            üst boşlukları da daraltıldı — toplamda ekranın tamamı artık
            scroll'suz sığıyor (ScrollView yine de en küçük telefonlar için
            güvenlik ağı olarak duruyor). */}
        <Pressable
          onPress={artir}
          style={({ pressed }) => [styles.sayacAlan, pressed && styles.sayacAlanBasili]}
          accessibilityRole="button"
          accessibilityLabel={t('sayaciArtirEtiketi', sayac, zikir.hedef)}
        >
          <View style={styles.halkaKap}>
            <IlerlemeHalkasi oran={sayac / zikir.hedef} boyut={172} />
            <View style={styles.sayacIc}>
              <Text style={styles.sayacRakam}>{sayac}</Text>
              <Text style={styles.sayacHedef}>/ {zikir.hedef}</Text>
            </View>
          </View>
          <Text style={styles.dokunIpucu}>{t('dokunSaymakIcin')}</Text>
        </Pressable>

        {/* Tur sayacı */}
        <View style={styles.turKart}>
          <Icon name="yildiz" size={20} color={colors.copper} />
          <Text style={styles.turEtiket}>{t('tamamlananTur')}</Text>
          <Text style={styles.turDeger}>{tur}</Text>
        </View>

        {/* ─────────────────────────────────────────────────────────────
            BÜYÜK, YAZILI EYLEM BUTONLARI

            Önceki sürümde sıfırlama, ekranın en üstünde küçük bir ikondu ve
            ne işe yaradığı anlaşılmıyordu. Artık ikisi de altta, parmakla
            rahat basılacak büyüklükte, HEM İKON HEM YAZI taşıyor. Sıfırlama
            geri alınamaz olduğu için dolgulu bakır renkle ayrıştırıldı;
            kazara basılma ihtimali görsel olarak azaltıldı.
            ───────────────────────────────────────────────────────────── */}
        <View style={styles.eylemSatir}>
          <TouchableOpacity
            style={styles.geriAlBtn}
            onPress={azalt}
            accessibilityRole="button"
            accessibilityLabel={t('sonSayimiGeriAlEtiketi')}
          >
            <Icon name="eksi" size={24} color={colors.primaryDark} />
            <Text style={styles.geriAlYazi}>{t('geriAl')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sifirlaBtn}
            onPress={sifirla}
            accessibilityRole="button"
            accessibilityLabel={t('sayaciSifirlaEtiketi')}
          >
            <Icon name="yenile" size={24} color={colors.white} />
            <Text style={styles.sifirlaYazi}>{t('sifirla')}</Text>
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
  zikirCipYazi: { fontFamily: typography.bodyBold, fontSize: fontSize.body, color: colors.textOnLight },
  zikirCipYaziSecili: { color: colors.white },
  zikirCipHedef: { fontFamily: typography.bodyBold, fontSize: fontSize.tiny, color: colors.textMuted },
  zikirCipHedefSecili: { color: colors.copperLight },

  zikirKart: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...elevation.card,
  },
  zikirArapca: {
    fontFamily: typography.displayFamily,
    fontSize: 24,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 38,
  },
  zikirLatin: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.title,
    color: colors.copper,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  zikirAnlam: {
    fontFamily: typography.bodyFamily,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
    lineHeight: lineHeight.small,
  },

  sayacAlan: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    ...elevation.card,
  },
  sayacAlanBasili: { backgroundColor: colors.primarySoft },
  halkaKap: {
    width: 172,
    height: 172,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sayacIc: { alignItems: 'center' },
  sayacRakam: {
    fontFamily: typography.displayFamily,
    fontSize: 52,
    color: colors.primaryDark,
    lineHeight: 60,
  },
  sayacHedef: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.bodyLg,
    color: colors.textMuted,
    marginTop: -spacing.xs,
  },
  dokunIpucu: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },

  turKart: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    ...elevation.card,
  },
  turEtiket: { flex: 1, fontFamily: typography.bodyMedium, fontSize: fontSize.body, color: colors.textMuted },
  turDeger: { fontFamily: typography.bodyBold, fontSize: fontSize.title, color: colors.primaryDark },

  eylemSatir: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  geriAlBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  geriAlYazi: { fontFamily: typography.bodyBold, fontSize: fontSize.bodyLg, color: colors.primaryDark },
  sifirlaBtn: {
    flex: 1,
    backgroundColor: colors.copper,
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  sifirlaYazi: { fontFamily: typography.bodyBold, fontSize: fontSize.bodyLg, color: colors.white },
});
