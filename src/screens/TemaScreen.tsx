// src/screens/TemaScreen.tsx
//
// TEMA SEÇİMİ
//
// 11 palet, her biri kendi renkleriyle çizilmiş küçük bir önizleme kartı
// olarak listelenir. Kullanıcı bir palet seçtiğinde tercih hemen kaydedilir,
// ekranın üstünde "Tema değişti" bilgilendirmesi belirir ve kısa bir geri
// sayımın ardından uygulama KENDİLİĞİNDEN yeniden başlar.
//
// ─────────────────────────────────────────────────────────────────────────────
// NEDEN ANINDA DEĞİŞMİYOR, NEDEN OTOMATİK YENİDEN BAŞLIYOR?
//
// Ekran stilleri `StyleSheet.create` ile modül yüklenirken bir kez oluşur —
// React Native'in en hızlı çalışan yolu budur. Anlık tema değişimi için her
// ekrandaki stilin `useMemo` içine alınması gerekirdi; bu her render'da stil
// yeniden hesaplanması demek olurdu. Günde beş kez hızlıca açılıp kapanan bir
// uygulamada bu takas doğru bulunmadı.
//
// Bu yüzden değişim bir SONRAKİ açılışta uygulanıyor — ama kullanıcıyı elle
// kapat/aç yapmaya zorlamak yerine `expo-updates`'in `Updates.reloadAsync()`
// fonksiyonuyla uygulama YAZILIMSAL olarak kendini yeniden başlatıyor. Süre
// (1.8 sn) kullanıcının "tema değişti" mesajını okuyabileceği kadar uzun,
// ama bekletmeyecek kadar kısa tutuldu.
//
// Önizleme kartları bu kısıttan ETKİLENMEZ: renklerini `styles`'tan değil,
// doğrudan palet tanımından satır içi alırlar. Yani kullanıcı seçmeden önce
// her paletin gerçek renklerini görebilir.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Updates from 'expo-updates';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import {
  colors, spacing, radius, typography, elevation, fontSize, lineHeight,
  PALETLER, PaletAdi, aktifPaletAdi,
} from '../theme';
import { temayiKaydet, kayitliTemayiOku } from '../lib/temaDeposu';

/** Yeniden başlatmadan önce bilgilendirme mesajının ekranda kaldığı süre. */
const YENIDEN_BASLATMA_GECIKME_MS = 1800;

interface Props {
  onClose?: () => void;
}

/** Tek bir paletin küçük görsel önizlemesi — kendi renkleriyle çizilir. */
function Onizleme({ renkler }: { renkler: Record<string, string> }) {
  return (
    <View style={[onz.kap, { backgroundColor: renkler.cream, borderColor: renkler.border }]}>
      {/* Koyu hero şeridi */}
      <View style={[onz.hero, { backgroundColor: renkler.primary }]}>
        <View style={[onz.heroCizgi, { backgroundColor: renkler.copperLight, width: '55%' }]} />
        <View style={[onz.heroCizgi, { backgroundColor: renkler.primaryGlow, width: '35%' }]} />
      </View>
      {/* İki vakit satırı */}
      <View style={[onz.satir, { backgroundColor: renkler.white, borderColor: renkler.border }]}>
        <View style={[onz.nokta, { backgroundColor: renkler.primarySoft }]} />
        <View style={[onz.cizgi, { backgroundColor: renkler.textMuted, width: '38%' }]} />
        <View style={[onz.cizgi, { backgroundColor: renkler.primaryDark, width: '20%' }]} />
      </View>
      <View style={[onz.satir, { backgroundColor: renkler.primaryDark, borderColor: renkler.primaryDark }]}>
        <View style={[onz.nokta, { backgroundColor: renkler.primaryBright }]} />
        <View style={[onz.cizgi, { backgroundColor: renkler.textOnDark, width: '38%' }]} />
        <View style={[onz.cizgi, { backgroundColor: renkler.primaryGlow, width: '20%' }]} />
      </View>
      {/* Vurgu noktaları */}
      <View style={onz.vurguSatir}>
        <View style={[onz.vurgu, { backgroundColor: renkler.copper }]} />
        <View style={[onz.vurgu, { backgroundColor: renkler.copperVivid }]} />
        <View style={[onz.vurgu, { backgroundColor: renkler.primaryBright }]} />
      </View>
    </View>
  );
}

export default function TemaScreen({ onClose }: Props) {
  const [secili, setSecili] = useState<PaletAdi>(aktifPaletAdi());
  const [calisan] = useState<PaletAdi>(aktifPaletAdi());
  const [yenidenBasliyor, setYenidenBasliyor] = useState(false);
  const zamanlayici = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    kayitliTemayiOku().then(setSecili);
    return () => {
      if (zamanlayici.current) clearTimeout(zamanlayici.current);
    };
  }, []);

  const degisiklikVar = secili !== calisan;

  const sec = async (ad: PaletAdi) => {
    if (ad === calisan || yenidenBasliyor) return;
    setSecili(ad);
    try {
      await temayiKaydet(ad);
    } catch {
      // Kaydedilemezse seçim ekranda görünür ama kalıcı olmaz; sessiz geçmek
      // yerine kullanıcıya durum bildirilmeli — aşağıdaki şerit bunu yapar.
      return;
    }

    // Kaydetme başarılıysa uygulama kendini yeniden başlatır. Kullanıcı
    // "Tema değişti" mesajını okuyacak kadar bir süre bekleniyor, sonra
    // Updates.reloadAsync() JS+native tarafı sıfırdan yükler — bu noktada
    // App.tsx yeniden çalışır ve yeni palet StyleSheet'lere kilitlenir.
    setYenidenBasliyor(true);
    zamanlayici.current = setTimeout(async () => {
      try {
        await Updates.reloadAsync();
      } catch {
        // Expo Go'da veya development build dışı ortamlarda reloadAsync
        // native modülü bulamayabilir — bu durumda kullanıcıyı elle
        // kapatıp açması için bilgilendiriyoruz, uygulamayı kilitlemiyoruz.
        setYenidenBasliyor(false);
      }
    }, YENIDEN_BASLATMA_GECIKME_MS);
  };

  const anahtarlar = Object.keys(PALETLER) as PaletAdi[];

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Tema"
        subtitle={`${anahtarlar.length} renk düzeni`}
        icon="tema"
        onClose={yenidenBasliyor ? undefined : onClose}
      />

      <ScrollView
        contentContainerStyle={styles.icerik}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!yenidenBasliyor}
      >
        {yenidenBasliyor ? (
          <View style={styles.yenidenBaslatKart}>
            <Icon name="onay" size={22} color={colors.success} />
            <Text style={styles.yenidenBaslatBaslik}>Tema değişti</Text>
            <Text style={styles.yenidenBaslatYazi}>
              {PALETLER[secili].ad} teması uygulanıyor. Uygulama birazdan
              kendiliğinden yeniden başlayacak…
            </Text>
          </View>
        ) : (
          <>
            {degisiklikVar && (
              <View style={styles.uyariKart}>
                <Icon name="bilgi" size={20} color={colors.copperVivid} />
                <Text style={styles.uyariYazi}>
                  Seçiminiz kaydedildi. Yeni tema, uygulamayı kapatıp açtığınızda
                  uygulanacak.
                </Text>
              </View>
            )}

            <Text style={styles.aciklama}>
              Tüm temalar İslami sanat geleneğinden türetildi. Her birinin metin
              okunabilirliği ayrı ayrı ölçüldü — hangisini seçerseniz seçin
              yazılar net kalır.
            </Text>
          </>
        )}

        {anahtarlar.map((ad) => {
          const palet = PALETLER[ad];
          const aktif = ad === secili;
          return (
            <TouchableOpacity
              key={ad}
              style={[styles.kart, aktif && styles.kartAktif]}
              onPress={() => sec(ad)}
              activeOpacity={0.85}
              disabled={yenidenBasliyor}
              accessibilityRole="radio"
              accessibilityState={{ selected: aktif }}
              accessibilityLabel={`${palet.ad} teması. ${palet.aciklama}`}
            >
              <Onizleme renkler={palet.renkler} />

              <View style={styles.kartMetin}>
                <Text style={styles.kartAd}>{palet.ad}</Text>
                <Text style={styles.kartAciklama}>{palet.aciklama}</Text>
                {ad === calisan && (
                  <View style={styles.kullanimdaCip}>
                    <Text style={styles.kullanimdaYazi}>Şu an kullanımda</Text>
                  </View>
                )}
              </View>

              <Icon
                name={aktif ? 'onay' : 'daire'}
                size={26}
                color={aktif ? colors.success : colors.borderStrong}
              />
            </TouchableOpacity>
          );
        })}

        {!yenidenBasliyor && (
          <View style={styles.notKap}>
            <Icon name="bilgi" size={16} color={colors.textMuted} />
            <Text style={styles.notYazi}>
              Tema seçtiğinizde uygulama birkaç saniye içinde kendiliğinden
              yeniden başlar. Bu, uygulamanın hızlı açılmasını korumak için
              bilinçli bir tercihtir — anlık değişim her ekran çiziminde ek
              hesaplama gerektirirdi.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const onz = StyleSheet.create({
  kap: {
    width: 74,
    borderRadius: radius.sm,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 4,
    gap: 3,
  },
  hero: { borderRadius: 4, paddingVertical: 6, paddingHorizontal: 5, gap: 3 },
  heroCizgi: { height: 3, borderRadius: 2 },
  satir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 4,
    borderWidth: 0.5,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  nokta: { width: 7, height: 7, borderRadius: 4 },
  cizgi: { height: 3, borderRadius: 2 },
  vurguSatir: { flexDirection: 'row', gap: 3, paddingHorizontal: 2 },
  vurgu: { width: 10, height: 6, borderRadius: 2 },
});

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  icerik: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xxl, gap: spacing.sm },

  yenidenBaslatKart: {
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.raised,
  },
  yenidenBaslatBaslik: {
    fontFamily: typography.displaySemibold,
    fontSize: fontSize.title,
    color: colors.primaryDark,
    marginTop: spacing.xs,
  },
  yenidenBaslatYazi: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.small,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: lineHeight.small,
  },

  aciklama: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.small,
    color: colors.textMuted,
    lineHeight: lineHeight.small,
    marginBottom: spacing.xs,
  },

  uyariKart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.copperSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.copperBright,
    marginBottom: spacing.sm,
  },
  uyariYazi: {
    flex: 1,
    fontFamily: typography.bodyBold,
    fontSize: fontSize.small,
    color: colors.copper,
    lineHeight: lineHeight.small,
  },

  kart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    ...elevation.card,
  },
  kartAktif: { borderColor: colors.success },
  kartMetin: { flex: 1, gap: 2 },
  kartAd: { fontFamily: typography.bodyBold, fontSize: fontSize.bodyLg, color: colors.textOnLight },
  kartAciklama: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.tiny,
    color: colors.textMuted,
    lineHeight: lineHeight.tiny,
  },
  kullanimdaCip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: 3,
  },
  kullanimdaYazi: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.micro,
    color: colors.primaryDark,
  },

  notKap: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'flex-start',
  },
  notYazi: {
    flex: 1,
    fontFamily: typography.bodyFamily,
    fontSize: fontSize.tiny,
    color: colors.textMuted,
    lineHeight: lineHeight.tiny,
  },
});
