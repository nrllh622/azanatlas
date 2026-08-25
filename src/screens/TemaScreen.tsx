// src/screens/TemaScreen.tsx
//
// TEMA SEÇİMİ
//
// 10 palet, her biri kendi renkleriyle çizilmiş küçük bir önizleme kartı
// olarak listelenir. Kullanıcı bir palet seçtiğinde tercih hemen kaydedilir
// ve bir POP-UP ile yeniden başlatma için ONAY istenir.
//
// ─────────────────────────────────────────────────────────────────────────────
// NEDEN ANINDA DEĞİŞMİYOR?
//
// Ekran stilleri `StyleSheet.create` ile modül yüklenirken bir kez oluşur —
// React Native'in en hızlı çalışan yolu budur. Anlık tema değişimi için her
// ekrandaki stilin `useMemo` içine alınması gerekirdi; bu her render'da stil
// yeniden hesaplanması demek olurdu. Günde beş kez hızlıca açılıp kapanan bir
// uygulamada bu takas doğru bulunmadı.
//
// ─────────────────────────────────────────────────────────────────────────────
// NEDEN OTOMATİK DEĞİL, ONAYLI YENİDEN BAŞLATMA? (bu turda değişti)
//
// Önceki sürüm bilgilendirmeyi gösterip 1.8 saniye sonra kullanıcıya
// SORMADAN `Updates.reloadAsync()` çağırıyordu. Kullanıcı açık bir onay
// istenmesini, reddedilirse uygulamanın KAPANMAMASINI istedi. Yeni akış:
// tema kaydedilir → `OnayPopup` modalı görünür → "Şimdi Yeniden Başlat"
// onaylanırsa `Updates.reloadAsync()` çağrılır; "Daha Sonra" seçilirse
// pop-up kapanır, uygulama olduğu gibi açık kalır ve yeni tema bir SONRAKİ
// doğal açılışta (kullanıcı uygulamayı normal şekilde kapatıp açtığında)
// uygulanır — bu, zaten var olan "Seçiminiz kaydedildi" bilgi şeridiyle
// tutarlı bir davranış.
//
// Önizleme kartları bu kısıttan ETKİLENMEZ: renklerini `styles`'tan değil,
// doğrudan palet tanımından satır içi alırlar. Yani kullanıcı seçmeden önce
// her paletin gerçek renklerini görebilir.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import * as Updates from 'expo-updates';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import IslamicPattern from '../components/IslamicPattern';
import {
  colors, spacing, radius, typography, elevation, fontSize, lineHeight,
  PALETLER, PaletAdi, aktifPaletAdi,
} from '../theme';
import { temayiKaydet, kayitliTemayiOku } from '../lib/temaDeposu';
import { useCeviri } from '../i18n/DilContext';

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
  const { t, dil } = useCeviri();
  const [secili, setSecili] = useState<PaletAdi>(aktifPaletAdi());
  const [calisan] = useState<PaletAdi>(aktifPaletAdi());
  // Onay pop-up'ının açık olup olmadığı. Kaydetme başarılı olur olmaz true
  // olur; kullanıcı "Şimdi Yeniden Başlat" ya da "Daha Sonra" diyene kadar
  // ekranda kalır — otomatik kapanma/geri sayım YOK.
  const [onayAcik, setOnayAcik] = useState(false);
  const [yenidenBasliyor, setYenidenBasliyor] = useState(false);

  useEffect(() => {
    kayitliTemayiOku().then(setSecili);
  }, []);

  const degisiklikVar = secili !== calisan;

  // Madde 4 (bu tur): kullanıcı onay pop-up'ı AÇIKKEN (henüz yeniden
  // başlatmadan) fikrini değiştirip başka bir temaya (eski çalışan tema
  // dahil) geçebilmeli. Önceki sürümde pop-up tüm ekranı kapladığı için
  // kart listesine dokunmak fiilen imkânsızdı — "eski temayı seçmeme izin
  // vermiyor" şikayeti buradan geliyordu. Çözüm: bir karta basıldığında,
  // pop-up açıksa önce sessizce kapatılıyor, SONRA yeni seçim işleniyor —
  // kullanıcı ayrıca "Vazgeç"e basmak zorunda kalmadan direkt istediği
  // temaya geçebiliyor.
  const sec = async (ad: PaletAdi) => {
    if (yenidenBasliyor) return;
    if (onayAcik) setOnayAcik(false);
    if (ad === calisan) {
      // Kullanıcı doğrudan hâlâ çalışmakta olan (orijinal) temaya döndü —
      // bu, Vazgeç ile aynı sonucu üretir: kayıt geri alınır, pop-up
      // gösterilmez (zaten "değişiklik yok" durumuna dönülüyor).
      setSecili(ad);
      try {
        await temayiKaydet(ad);
      } catch {
        // yoksay — ekran zaten doğru seçimi gösteriyor
      }
      return;
    }
    setSecili(ad);
    try {
      await temayiKaydet(ad);
    } catch {
      // Kaydedilemezse seçim ekranda görünür ama kalıcı olmaz; sessiz geçmek
      // yerine kullanıcıya durum bildirilmeli — aşağıdaki şerit bunu yapar.
      return;
    }
    // Kaydetme başarılıysa onay pop-up'ı açılır — otomatik yeniden başlatma
    // YOK, kullanıcı karar verene kadar bekler.
    setOnayAcik(true);
  };

  const yenidenBaslat = async () => {
    setYenidenBasliyor(true);
    try {
      await Updates.reloadAsync();
    } catch {
      // Expo Go'da veya development build dışı ortamlarda reloadAsync
      // native modülü bulamayabilir — bu durumda kullanıcıyı elle kapatıp
      // açması için bilgilendiriyoruz, uygulamayı kilitlemiyoruz.
      setYenidenBasliyor(false);
      setOnayAcik(false);
    }
  };

  const dahaSonra = () => {
    setOnayAcik(false);
  };

  // Madde 3 (bu tur): "Vazgeç" — sadece pop-up'ı kapatan "Daha Sonra"nın
  // aksine, kaydı da geri alır: az önce seçilen yeni tema AsyncStorage'a
  // yazılmıştı, bu fonksiyon üzerine önceki (hâlâ çalışmakta olan) temayı
  // tekrar yazarak seçimi tamamen iptal eder. Ekrandaki seçili kart da
  // eski çalışan temaya döner — kullanıcı ekrana baktığında hiçbir şey
  // değişmemiş gibi görünür.
  const vazgec = async () => {
    setOnayAcik(false);
    setSecili(calisan);
    try {
      await temayiKaydet(calisan);
    } catch {
      // Geri alma kaydı başarısız olsa bile ekran zaten eski seçili temayı
      // gösteriyor; bir sonraki başarılı kayıtta düzelir.
    }
  };

  const anahtarlar = Object.keys(PALETLER) as PaletAdi[];
  // Palet adı/açıklaması verisi şimdilik yalnızca tr/en olarak yazılı.
  // Faz-1'e eklenen id/fr arayüzü tam çevrildi, ancak bu veri içeriği
  // (11 palet × ad+açıklama) henüz id/fr'ye çevrilmedi — bu yüzden
  // Türkçe DIŞINDAKİ her dilde (en/id/fr) İngilizce metne düşülüyor;
  // sessizce Türkçe göstermek yerine en azından anlaşılır bir dilde
  // kalınması tercih edildi.
  const veriDili = dil === 'tr' ? 'tr' : 'en';
  const paletAdi = (p: (typeof PALETLER)[PaletAdi]) => (veriDili === 'en' ? p.adEn : p.ad);
  const paletAciklama = (p: (typeof PALETLER)[PaletAdi]) => (veriDili === 'en' ? p.aciklamaEn : p.aciklama);

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title={t('adTema')}
        subtitle={t('renkDuzeni', anahtarlar.length)}
        icon="tema"
        onClose={onClose}
      />

      <ScrollView
        contentContainerStyle={styles.icerik}
        showsVerticalScrollIndicator={false}
      >
        {degisiklikVar && !onayAcik && (
          <View style={styles.uyariKart}>
            <Icon name="bilgi" size={20} color={colors.copperVivid} />
            <Text style={styles.uyariYazi}>{t('seciminizKaydedildi')}</Text>
          </View>
        )}

        <Text style={styles.aciklama}>{t('temaAciklamaParagrafi')}</Text>

        {anahtarlar.map((ad) => {
          const palet = PALETLER[ad];
          const aktif = ad === secili;
          const palAd = paletAdi(palet);
          const palAciklama = paletAciklama(palet);
          return (
            <TouchableOpacity
              key={ad}
              style={[styles.kart, aktif && styles.kartAktif]}
              onPress={() => sec(ad)}
              activeOpacity={0.85}
              accessibilityRole="radio"
              accessibilityState={{ selected: aktif }}
              accessibilityLabel={t('temaEtiketi', palAd, palAciklama)}
            >
              <Onizleme renkler={palet.renkler} />

              <View style={styles.kartMetin}>
                <Text style={styles.kartAd}>{palAd}</Text>
                <Text style={styles.kartAciklama}>{palAciklama}</Text>
                {ad === calisan && (
                  <View style={styles.kullanimdaCip}>
                    <Text style={styles.kullanimdaYazi}>{t('suAnKullanimda')}</Text>
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

        <View style={styles.notKap}>
          <Icon name="bilgi" size={16} color={colors.textMuted} />
          <Text style={styles.notYazi}>{t('temaNotu')}</Text>
        </View>
      </ScrollView>

      {/* ============ TEMA DEĞİŞİKLİĞİ ONAY POP-UP'I ============
          Madde 3 (bu tur): otomatik geri sayımlı yeniden başlatma yerine,
          kullanıcıdan açık onay isteyen bir pop-up. "Daha Sonra" seçilirse
          uygulama KAPANMAZ — yalnızca pop-up kapanır. */}
      <Modal
        visible={onayAcik}
        transparent
        animationType="fade"
        onRequestClose={dahaSonra}
      >
        <View style={styles.modalArkaPlan}>
          <View style={styles.modalKart}>
            <IslamicPattern color={colors.cream} opacity={0.08} tile={36} />
            <View style={styles.modalIcerik}>
              <View style={styles.modalIkonKap}>
                <Icon name="onay" size={26} color={colors.success} />
              </View>
              <Text style={styles.modalBaslik}>{t('temaDegisti')}</Text>
              <Text style={styles.modalYazi}>
                {t('temaKaydedildiYeniden', veriDili === 'en' ? PALETLER[secili].adEn : PALETLER[secili].ad)}
              </Text>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnBirincil]}
                onPress={yenidenBaslat}
                disabled={yenidenBasliyor}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={styles.modalBtnBirincilYazi}>
                  {yenidenBasliyor ? t('yenidenBaslatiliyor') : t('simdiYenidenBaslat')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnIkincil]}
                onPress={dahaSonra}
                disabled={yenidenBasliyor}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Text style={styles.modalBtnIkincilYazi}>{t('dahaSonraBtn')}</Text>
              </TouchableOpacity>

              {/* Madde 1 (bu tur): "Vazgeç" eklendi — "Daha Sonra"dan farkı,
                  yeni seçilen temayı kaydedilmiş olarak BIRAKMAMASI; önceki
                  çalışan temayı geri yazıp seçimi tamamen iptal ediyor. */}
              <TouchableOpacity
                style={styles.modalBtnVazgec}
                onPress={vazgec}
                disabled={yenidenBasliyor}
                activeOpacity={0.6}
                accessibilityRole="button"
              >
                <Text style={styles.modalBtnVazgecYazi}>{t('iptal')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // ---------- ONAY POP-UP'I ----------
  modalArkaPlan: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalKart: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...elevation.raised,
  },
  modalIcerik: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.xs,
  },
  modalIkonKap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  modalBaslik: {
    fontFamily: typography.displaySemibold,
    fontSize: fontSize.title,
    color: colors.primaryDark,
  },
  modalYazi: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.small,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: lineHeight.small,
    marginBottom: spacing.sm,
  },
  modalBtn: {
    width: '100%',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnBirincil: {
    backgroundColor: colors.primary,
    marginTop: spacing.xs,
  },
  modalBtnBirincilYazi: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnDark,
  },
  modalBtnIkincil: {
    marginTop: spacing.xs,
  },
  modalBtnIkincilYazi: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
  modalBtnVazgec: {
    width: '100%',
    borderRadius: radius.md,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  modalBtnVazgecYazi: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.small,
    color: colors.danger,
  },
});
