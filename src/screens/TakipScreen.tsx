// src/screens/TakipScreen.tsx
//
// İBADET TAKİBİ
//
// Kullanıcının beş vakit namazını gün gün takip ettiği ekran. Üç bölümden
// oluşur:
//   1) Seri kartı — kesintisiz tam gün sayısı
//   2) Bugünün vakitleri — dokunarak kılındı/kılınmadı işaretleme
//   3) Son 4 hafta ızgarası — geçmişe bakış ve geçmiş günü düzeltme
//
// Tasarım kararı: bu ekran bir "başarı/rozet" sistemi DEĞİLDİR. İbadeti
// oyunlaştırmak (puan, seviye, rekabet) yerine yalnızca kullanıcının kendi
// düzenini görmesine yarar. Bu yüzden puan, rozet veya sıralama yoktur.

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import Icon, { vakitIcon } from '../components/Icon';
import IslamicPattern from '../components/IslamicPattern';
import { colors, spacing, radius, typography, elevation } from '../theme';
import { useIbadetTakibi } from '../context/IbadetTakibiContext';
import {
  TAKIP_VAKITLERI,
  TakipVakti,
  gunAnahtari,
  sonGunlerdeKilinan,
} from '../lib/ibadetTakibi';
import { useCeviri } from '../i18n/DilContext';
import { AY_ANAHTARLARI, GUN_ANAHTARLARI } from '../i18n/ceviriler';

interface Props {
  /** Tam ekran açıldığında geri dönüş. Sekme olarak kullanıldığında verilmez. */
  onClose?: () => void;
}

// NOT: `TAKIP_ETIKETLERI` (lib/ibadetTakibi.ts) artık kullanılmıyor —
// vakit adları için diğer ekranlarla aynı `vakitAdi()` çevirisi kullanılıyor.
// Gün kısaltmaları (Pt/Sa/Ça...) haftanın günü İZGARA BAŞLIĞI olduğu için
// GUN_ANAHTARLARI'ndan üretiliyor (kısaltma için `t(...).slice(0,2)`).
const GUN_KISALTMA_INDEKS = [1, 2, 3, 4, 5, 6, 0]; // Pazartesi..Pazar -> GUN_ANAHTARLARI indeksleri

/** Pazartesi'yi haftanın ilk günü kabul ederek, verilen günün hafta başını verir. */
function haftaBasi(d: Date): Date {
  const t = new Date(d);
  t.setHours(12, 0, 0, 0);
  // getDay(): 0=Pazar … 6=Cumartesi. Pazartesi'ye kaç gün geri gidileceği:
  const gecenGun = (t.getDay() + 6) % 7;
  t.setDate(t.getDate() - gecenGun);
  return t;
}

export default function TakipScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { kayitlar, seri, isaretiDegistir, gunuGetir } = useIbadetTakibi();
  const { t, vakitAdi } = useCeviri();
  const GUN_KISALTMA = GUN_KISALTMA_INDEKS.map((i) => t(GUN_ANAHTARLARI[i]).slice(0, 2));
  const [bugun] = useState(() => new Date());
  const [secilenGun, setSecilenGun] = useState<Date>(() => new Date());

  const secilenKilinanlar = gunuGetir(secilenGun);
  const bugunMu = gunAnahtari(secilenGun) === gunAnahtari(bugun);
  // Gelecek günler işaretlenemez — henüz girmemiş bir vakti "kıldım" demek
  // anlamsız olurdu.
  const gelecekMi = secilenGun.getTime() > bugun.getTime() && !bugunMu;

  const son28 = useMemo(() => sonGunlerdeKilinan(kayitlar, bugun, 28), [kayitlar, bugun]);

  // Son 4 haftanın günleri, hafta hafta (en eski hafta üstte).
  const haftalar = useMemo(() => {
    const buHaftaBasi = haftaBasi(bugun);
    const sonuc: Date[][] = [];
    for (let h = 3; h >= 0; h--) {
      const basi = new Date(buHaftaBasi);
      basi.setDate(basi.getDate() - h * 7);
      const gunler: Date[] = [];
      for (let g = 0; g < 7; g++) {
        const gun = new Date(basi);
        gun.setDate(gun.getDate() + g);
        gunler.push(gun);
      }
      sonuc.push(gunler);
    }
    return sonuc;
  }, [bugun]);

  const vakitDurumu = (vakit: TakipVakti) => secilenKilinanlar.includes(vakit);

  return (
    <View style={styles.wrap}>
      <ScreenHeader title={t('adIbadetTakibi')} subtitle={t('besVaktiNamaz')} icon="takip" onClose={onClose} />

      <ScrollView
        contentContainerStyle={[styles.icerik, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- SERİ KARTI --- */}
        <View style={styles.seriKart}>
          <IslamicPattern color={colors.cream} opacity={0.07} tile={40} />
          <View style={styles.seriIcerik}>
            <View style={styles.seriSol}>
              <Text style={styles.seriEtiket}>{t('kesintisizSeri')}</Text>
              <View style={styles.seriRakamSatir}>
                <Text style={styles.seriRakam}>{seri}</Text>
                <Text style={styles.seriBirim}>{t('gun')}</Text>
              </View>
              <Text style={styles.seriAciklama}>
                {seri === 0 ? t('seriBaslarSonrasi') : t('seriDevamAciklama')}
              </Text>
            </View>
            <View style={styles.seriSag}>
              <Text style={styles.seriIkinciDeger}>{son28}</Text>
              <Text style={styles.seriIkinciEtiket}>{t('son28GundeKilinanVakit')}</Text>
            </View>
          </View>
        </View>

        {/* --- SEÇİLEN GÜNÜN VAKİTLERİ --- */}
        <View style={styles.bolumBaslikSatir}>
          <Text style={styles.bolumBaslik}>
            {bugunMu
              ? t('bugun')
              : `${secilenGun.getDate()} ${t(AY_ANAHTARLARI[secilenGun.getMonth()])}`}
          </Text>
          {!bugunMu && (
            <TouchableOpacity
              onPress={() => setSecilenGun(new Date())}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
            >
              <Text style={styles.bugunDon}>{t('bugüneDon')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.vakitListe}>
          {TAKIP_VAKITLERI.map((vakit) => {
            const kilindi = vakitDurumu(vakit);
            const ad = vakitAdi(vakit);
            return (
              <TouchableOpacity
                key={vakit}
                style={[styles.vakitSatir, kilindi && styles.vakitSatirKilindi]}
                onPress={() => !gelecekMi && isaretiDegistir(vakit, secilenGun)}
                disabled={gelecekMi}
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: kilindi, disabled: gelecekMi }}
                accessibilityLabel={t('namaziEtiketi', ad)}
              >
                <View style={[styles.vakitIkonKap, kilindi && styles.vakitIkonKapKilindi]}>
                  <Icon
                    name={vakitIcon(vakit)}
                    size={18}
                    color={kilindi ? colors.white : colors.primary}
                  />
                </View>
                <Text style={[styles.vakitAd, kilindi && styles.vakitAdKilindi]}>
                  {ad}
                </Text>
                <Icon
                  name={kilindi ? 'onay' : 'daire'}
                  size={24}
                  color={kilindi ? colors.success : colors.borderStrong}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {gelecekMi && (
          <View style={styles.uyariSatir}>
            <Icon name="bilgi" size={15} color={colors.textMuted} />
            <Text style={styles.uyariYazi}>{t('gelecekGunUyarisi')}</Text>
          </View>
        )}

        {/* --- SON 4 HAFTA IZGARASI --- */}
        <Text style={[styles.bolumBaslik, { marginTop: spacing.lg }]}>{t('son4Hafta')}</Text>
        <View style={styles.izgaraKart}>
          <View style={styles.izgaraBaslikSatir}>
            {GUN_KISALTMA.map((g) => (
              <Text key={g} style={styles.izgaraBaslik}>
                {g}
              </Text>
            ))}
          </View>

          {haftalar.map((hafta, hi) => (
            <View key={hi} style={styles.izgaraSatir}>
              {hafta.map((gun) => {
                const kilinan = gunuGetir(gun).length;
                const ileride = gun.getTime() > bugun.getTime() && gunAnahtari(gun) !== gunAnahtari(bugun);
                const seciliMi = gunAnahtari(gun) === gunAnahtari(secilenGun);
                const tam = kilinan === TAKIP_VAKITLERI.length;

                return (
                  <TouchableOpacity
                    key={gunAnahtari(gun)}
                    style={[
                      styles.izgaraHucre,
                      ileride && styles.izgaraHucreIleride,
                      !ileride && kilinan > 0 && !tam && styles.izgaraHucreKismi,
                      tam && styles.izgaraHucreTam,
                      seciliMi && styles.izgaraHucreSecili,
                    ]}
                    onPress={() => !ileride && setSecilenGun(gun)}
                    disabled={ileride}
                    accessibilityRole="button"
                    accessibilityLabel={t('gunVakitKilindiEtiketi', gun.getDate(), t(AY_ANAHTARLARI[gun.getMonth()]), kilinan)}
                  >
                    <Text
                      style={[
                        styles.izgaraGunNo,
                        tam && styles.izgaraGunNoTam,
                        ileride && styles.izgaraGunNoIleride,
                      ]}
                    >
                      {gun.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Renk açıklaması — ızgaradaki tonların ne anlama geldiği */}
          <View style={styles.aciklamaSatir}>
            <View style={styles.aciklamaOge}>
              <View style={[styles.aciklamaKutu, styles.izgaraHucreTam]} />
              <Text style={styles.aciklamaYazi}>{t('besVaktiTam')}</Text>
            </View>
            <View style={styles.aciklamaOge}>
              <View style={[styles.aciklamaKutu, styles.izgaraHucreKismi]} />
              <Text style={styles.aciklamaYazi}>{t('kismen')}</Text>
            </View>
            <View style={styles.aciklamaOge}>
              <View style={[styles.aciklamaKutu, { backgroundColor: colors.creamDeep, borderColor: colors.border, borderWidth: 1 }]} />
              <Text style={styles.aciklamaYazi}>{t('kayitYok')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.notKap}>
          <Icon name="bilgi" size={14} color={colors.textMuted} />
          <Text style={styles.notYazi}>{t('takipNotu')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  icerik: { paddingHorizontal: spacing.md, paddingTop: spacing.md },

  seriKart: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...elevation.card,
  },
  seriIcerik: { flexDirection: 'row', padding: spacing.lg, alignItems: 'center' },
  seriSol: { flex: 1 },
  seriEtiket: {
    fontFamily: typography.bodyMedium,
    fontSize: 11.5,
    color: colors.copperLight,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  seriRakamSatir: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginTop: 2 },
  seriRakam: { fontFamily: typography.displayFamily, fontSize: 44, color: colors.white, lineHeight: 54 },
  seriBirim: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.textOnDarkMuted },
  seriAciklama: {
    fontFamily: typography.bodyFamily,
    fontSize: 11.5,
    color: colors.textOnDarkMuted,
    marginTop: 2,
    lineHeight: 17,
  },
  seriSag: {
    alignItems: 'center',
    paddingLeft: spacing.md,
    marginLeft: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(253,250,241,0.2)',
  },
  seriIkinciDeger: { fontFamily: typography.displayFamily, fontSize: 26, color: colors.copperLight },
  seriIkinciEtiket: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 14,
  },

  bolumBaslikSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  bolumBaslik: {
    fontFamily: typography.displaySemibold,
    fontSize: 15,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  bugunDon: { fontFamily: typography.bodyBold, fontSize: 12.5, color: colors.copper },

  vakitListe: { gap: spacing.sm },
  vakitSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vakitSatirKilindi: { borderColor: colors.success, backgroundColor: '#F2FAF6' },
  vakitIkonKap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vakitIkonKapKilindi: { backgroundColor: colors.success },
  vakitAd: { flex: 1, fontFamily: typography.bodyBold, fontSize: 15, color: colors.textOnLight },
  vakitAdKilindi: { color: colors.primaryDark },

  uyariSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  uyariYazi: { fontFamily: typography.bodyMedium, fontSize: 11.5, color: colors.textMuted },

  izgaraKart: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...elevation.card,
  },
  izgaraBaslikSatir: { flexDirection: 'row', marginBottom: spacing.sm },
  izgaraBaslik: {
    flex: 1,
    textAlign: 'center',
    fontFamily: typography.bodyMedium,
    fontSize: 10.5,
    color: colors.textFaint,
  },
  izgaraSatir: { flexDirection: 'row', marginBottom: spacing.xs },
  izgaraHucre: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 2,
    borderRadius: radius.xs,
    backgroundColor: colors.creamDeep,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  izgaraHucreKismi: { backgroundColor: '#CDE7DF', borderColor: '#B4D9CF' },
  izgaraHucreTam: { backgroundColor: colors.primary, borderColor: colors.primary },
  izgaraHucreSecili: { borderColor: colors.copper, borderWidth: 2 },
  izgaraHucreIleride: { backgroundColor: colors.cream, borderColor: colors.border, opacity: 0.5 },
  izgaraGunNo: { fontFamily: typography.bodyMedium, fontSize: 11, color: colors.textOnLight },
  izgaraGunNoTam: { color: colors.white, fontFamily: typography.bodyBold },
  izgaraGunNoIleride: { color: colors.textFaint },

  aciklamaSatir: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  aciklamaOge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  aciklamaKutu: { width: 12, height: 12, borderRadius: 3 },
  aciklamaYazi: { fontFamily: typography.bodyMedium, fontSize: 10.5, color: colors.textMuted },

  notKap: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
    alignItems: 'flex-start',
  },
  notYazi: {
    flex: 1,
    fontFamily: typography.bodyFamily,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
