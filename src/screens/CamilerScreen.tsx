// src/screens/CamilerScreen.tsx
//
// CAMİ BUL (bu tur — madde 3)
//
// Kullanıcının aktif konumuna (LocationContext) en yakın camileri listeler
// (OpenStreetMap Overpass API — bkz. `lib/camiBul.ts` başındaki kaynak
// gerekçesi) ve her birine dokunulduğunda Google Haritalar'da yol tarifi
// açar. Basit üç durumlu ekran: yükleniyor / hata (ağ ya da bulunamadı) /
// liste.

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { colors, spacing, radius, typography, elevation, fontSize, lineHeight } from '../theme';
import { useLocationContext } from '../context/LocationContext';
import { yakinCamileriBul, yolTarifiUrlleri, mesafeMetni, CamiSonucu } from '../lib/camiBul';
import { useCeviri } from '../i18n/DilContext';

interface Props {
  onClose?: () => void;
}

export default function CamilerScreen({ onClose }: Props) {
  const { location } = useLocationContext();
  const { t } = useCeviri();

  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(false);
  const [camiler, setCamiler] = useState<CamiSonucu[]>([]);

  const veriYukle = useCallback(() => {
    setYukleniyor(true);
    setHata(false);
    yakinCamileriBul(location.latitude, location.longitude)
      .then((sonuc) => {
        setCamiler(sonuc);
        setHata(sonuc.length === 0);
      })
      .catch(() => setHata(true))
      .finally(() => setYukleniyor(false));
  }, [location.latitude, location.longitude]);

  useEffect(() => {
    veriYukle();
  }, [veriYukle]);

  // Yol tarifi: önce Google Haritalar uygulamasının native şemasını dener
  // (kuruluysa doğrudan navigasyon ekranını açar); uygulama kurulu değilse
  // (`canOpenURL` false döner) web linkine düşer — kullanıcı her durumda bir
  // yol tarifi ekranına ulaşır.
  const yolTarifiAc = async (cami: CamiSonucu) => {
    const { nativeUrl, webUrl } = yolTarifiUrlleri(cami);
    try {
      const acilabilirMi = await Linking.canOpenURL(nativeUrl);
      if (acilabilirMi) {
        await Linking.openURL(nativeUrl);
        return;
      }
    } catch {
      // canOpenURL bazı cihazlarda manifest sorgu izni olmadan false/hata
      // dönebilir — bu durumda doğrudan web linkine düşülür.
    }
    Linking.openURL(webUrl);
  };

  // Google Haritalar'da genel "yakın camiler" aramasını açan yedek buton —
  // Overpass verisi hiç gelmezse (ağ hatası) kullanıcı en azından bu yolla
  // devam edebilir.
  const haritadaAra = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('cami')}&query_place_id=`;
    const yakinUrl = `geo:${location.latitude},${location.longitude}?q=cami`;
    Linking.canOpenURL(yakinUrl)
      .then((ok) => Linking.openURL(ok ? yakinUrl : url))
      .catch(() => Linking.openURL(url));
  };

  return (
    <View style={styles.wrap}>
      <ScreenHeader title={t('camiBul')} subtitle={`${location.il}, ${location.ilce}`} icon="cami" onClose={onClose} />

      {yukleniyor && (
        <View style={styles.ortaKap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.durumMetni}>{t('camilerAraniyor')}</Text>
        </View>
      )}

      {!yukleniyor && hata && (
        <View style={styles.ortaKap}>
          <Icon name="uyari" size={32} color={colors.warning} />
          <Text style={styles.durumMetni}>{t('camiBulunamadi')}</Text>
          <TouchableOpacity style={styles.tekrarBtn} onPress={veriYukle} activeOpacity={0.8}>
            <Icon name="yenile" size={16} color={colors.white} />
            <Text style={styles.tekrarBtnMetin}>{t('tekrarDene')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={haritadaAra} activeOpacity={0.8} style={{ marginTop: spacing.md }}>
            <Text style={styles.haritadaAraLink}>{t('googleHaritalardaAra')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!yukleniyor && !hata && (
        <FlatList
          data={camiler}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.liste}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.kart} onPress={() => yolTarifiAc(item)} activeOpacity={0.8}>
              <View style={styles.kartIkonKap}>
                <Icon name="cami" size={22} color={colors.primary} />
              </View>
              <View style={styles.kartMetin}>
                <Text style={styles.kartBaslik} numberOfLines={1}>
                  {item.ad || t('camiAdiBilinmiyor')}
                </Text>
                <Text style={styles.kartMesafe}>{mesafeMetni(item.mesafeMetre)}</Text>
              </View>
              <Icon name="sag" size={18} color={colors.copperLight} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  ortaKap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  durumMetni: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  tekrarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  tekrarBtnMetin: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.small,
    color: colors.white,
  },
  haritadaAraLink: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.small,
    color: colors.copper,
    textDecorationLine: 'underline',
  },
  liste: { padding: spacing.md, gap: spacing.sm },
  kart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.card,
  },
  kartIkonKap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kartMetin: { flex: 1 },
  kartBaslik: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnLight,
  },
  kartMesafe: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.small,
    color: colors.copper,
    marginTop: 2,
  },
});
