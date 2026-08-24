// src/screens/ImsakiyeScreen.tsx
//
// İMSAKİYE — 30 günlük vakit cetveli
//
// Bugünden başlayarak 30 günün vakitlerini listeler. Veri iki aşamalı gelir:
// önce cihazda hesaplanan yerel sonuç anında gösterilir, ardından Türkiye
// içindeyse Diyanet'in resmi verisiyle güncellenir (ilk gün için yapılan
// istek tüm ayı önbelleğe aldığı için kalan 29 gün ağ isteği üretmez).
//
// "Sabah" sütunu bilinçli olarak GİZLİ: Diyanet'in yayımladığı resmî
// imsakiyelerde de ayrı bir Sabah sütunu yoktur; sabah namazının vakti
// İmsak ile başlar. Ana Sayfa'da gösterilen ayrı "Sabah" satırı ise
// referans uygulamaların ana ekran gösterim kuralına uyum içindir.

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { colors, spacing, radius, typography, elevation } from '../theme';
import { calculateVakitler, getVakitlerWithDiyanetFallback } from '../lib/prayerCalculator';
import { useLocationContext } from '../context/LocationContext';
import { useCalculationSettings } from '../context/CalculationSettingsContext';
import { useCeviri } from '../i18n/DilContext';
import { AY_ANAHTARLARI, GUN_ANAHTARLARI } from '../i18n/ceviriler';

interface Props {
  /** Tam ekran açıldığında geri dönüş. Sekme olarak kullanıldığında verilmez. */
  onClose?: () => void;
}

interface GunSatiri {
  date: Date;
  vakitler: { key: string; label: string; time: string }[];
}

// NOT: gün/ay adları artık AY_ANAHTARLARI/GUN_ANAHTARLARI üzerinden t()
// ile çözülüyor — bkz. ceviriler.ts.
const GUN_SAYISI = 30;

function saatBicimle(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function ayniGunMu(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function ImsakiyeScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { location } = useLocationContext();
  const { autoMethod, methodId, madhab, highLatRule } = useCalculationSettings();
  const [bugun] = useState(() => new Date());
  const { t, vakitAdi } = useCeviri();

  const yerelGunler = useMemo((): GunSatiri[] => {
    const sonuc: GunSatiri[] = [];
    for (let i = 0; i < GUN_SAYISI; i++) {
      const d = new Date(bugun);
      d.setDate(d.getDate() + i);
      const vakitler = calculateVakitler(
        location.latitude, location.longitude, d, location.countryCode,
        autoMethod, methodId, madhab, highLatRule
      )
        .filter((v) => v.key !== 'sabah')
        .map((v) => ({ key: v.key, label: vakitAdi(v.key as any), time: saatBicimle(v.date) }));
      sonuc.push({ date: d, vakitler });
    }
    return sonuc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, autoMethod, methodId, madhab, highLatRule, bugun]);

  const [gunler, setGunler] = useState<GunSatiri[]>(yerelGunler);
  const [kaynak, setKaynak] = useState<'diyanet' | 'yerel'>('yerel');

  useEffect(() => {
    setGunler(yerelGunler);
    let iptalEdildi = false;

    (async () => {
      const hepsi = await Promise.all(
        Array.from({ length: GUN_SAYISI }, (_, i) => {
          const d = new Date(bugun);
          d.setDate(d.getDate() + i);
          return getVakitlerWithDiyanetFallback(
            location.latitude, location.longitude, d, location.countryCode,
            location.il, location.ilce, autoMethod, methodId, madhab, highLatRule
          ).then((s) => ({
            satir: {
              date: d,
              vakitler: s.vakitler
                .filter((v) => v.key !== 'sabah')
                .map((v) => ({ key: v.key, label: vakitAdi(v.key as any), time: saatBicimle(v.date) })),
            } as GunSatiri,
            kaynak: s.kaynak,
          }));
        })
      );
      if (iptalEdildi) return;
      setGunler(hepsi.map((h) => h.satir));
      // Cetvelin kaynağı, ilk günün kaynağıyla temsil ediliyor; tüm günler
      // aynı çağrıdan (aynı aylık veriden) geldiği için bu yeterli.
      setKaynak(hepsi[0]?.kaynak === 'diyanet' ? 'diyanet' : 'yerel');
    })();

    return () => {
      iptalEdildi = true;
    };
  }, [
    yerelGunler, location.latitude, location.longitude, location.countryCode,
    location.il, location.ilce, autoMethod, methodId, madhab, highLatRule, bugun,
  ]);

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title={t('sekmeImsakiye')}
        subtitle={`${location.il} · ${location.ilce}`}
        icon="imsakiye"
        onClose={onClose}
      />

      <FlatList
        data={gunler}
        keyExtractor={(g) => g.date.toDateString()}
        contentContainerStyle={[styles.icerik, { paddingBottom: insets.bottom + spacing.lg }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.kaynakCip}>
            <Icon
              name={kaynak === 'diyanet' ? 'onay' : 'bilgi'}
              size={13}
              color={kaynak === 'diyanet' ? colors.success : colors.textMuted}
            />
            <Text style={styles.kaynakCipYazi}>
              {kaynak === 'diyanet'
                ? t('diyanetTakvimiVerisi')
                : t('yerelHesaplamaUlasilamadi')}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const bugunMu = ayniGunMu(item.date, bugun);
          return (
            <View style={[styles.gunKart, bugunMu && styles.gunKartBugun]}>
              <View style={styles.gunBaslikSatir}>
                <Text style={[styles.gunBaslik, bugunMu && styles.gunBaslikBugun]}>
                  {item.date.getDate()} {t(AY_ANAHTARLARI[item.date.getMonth()])}
                </Text>
                <Text style={[styles.gunAdi, bugunMu && styles.gunAdiBugun]}>
                  {t(GUN_ANAHTARLARI[item.date.getDay()])}
                </Text>
                {bugunMu && (
                  <View style={styles.bugunRozet}>
                    <Text style={styles.bugunRozetYazi}>{t('bugun')}</Text>
                  </View>
                )}
              </View>

              <View style={styles.vakitSatir}>
                {item.vakitler.map((v) => (
                  <View key={v.key} style={styles.vakitSutun}>
                    <Text
                      style={[styles.vakitEtiket, bugunMu && styles.vakitEtiketBugun]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {v.label}
                    </Text>
                    <Text
                      style={[styles.vakitDeger, bugunMu && styles.vakitDegerBugun]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {v.time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  icerik: { paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: spacing.sm },

  kaynakCip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  kaynakCipYazi: { fontFamily: typography.bodyMedium, fontSize: 11, color: colors.textOnLight },

  gunKart: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.card,
  },
  gunKartBugun: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },

  gunBaslikSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  gunBaslik: { fontFamily: typography.bodyBold, fontSize: 14, color: colors.primaryDark },
  gunBaslikBugun: { color: colors.textOnDark },
  gunAdi: { flex: 1, fontFamily: typography.bodyMedium, fontSize: 12, color: colors.textMuted },
  gunAdiBugun: { color: colors.textOnDarkMuted },
  bugunRozet: {
    backgroundColor: colors.primaryBright,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  bugunRozetYazi: { fontFamily: typography.bodyBold, fontSize: 9.5, color: colors.primaryDeep },

  vakitSatir: { flexDirection: 'row', justifyContent: 'space-between' },
  vakitSutun: { flex: 1, alignItems: 'center', paddingHorizontal: 1 },
  vakitEtiket: { fontFamily: typography.bodyMedium, fontSize: 10.5, color: colors.textMuted },
  vakitEtiketBugun: { color: colors.copperLight },
  vakitDeger: { fontFamily: typography.bodyBold, fontSize: 13, color: colors.textOnLight, marginTop: 2 },
  vakitDegerBugun: { color: colors.textOnDark },
});
