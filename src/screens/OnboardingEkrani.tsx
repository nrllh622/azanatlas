// src/screens/OnboardingEkrani.tsx
//
// Madde 4 (önceki tur): İLK AÇILIŞ TANITIM + İZİN TALEBİ AKIŞI — Varyant A
// ("Doğrusal Karşılama"): Ezan Vakti Pro / Namaz Vakitleri tarzı, adım
// göstergesi olmadan art arda ilerleyen kartlar:
//   0) YENİ (bu tur — madde 5): Dil seçimi — kullanıcı 4 dilden birini
//      seçer, geri kalan TÜM adımlar o an seçilen dilde render edilir.
//   1) Karşılama — uygulamanın kısa tanıtımı
//   2) Konum izni — "Konumu Etkinleştir" (GPS) ya da "Listeden Seç" (atla)
//   3) Bildirim izni — vakit vakit aç/kapa anahtarlarıyla
//   4) Tamamlandı — onay ikonu + "Başla"
//
// YENİ (bu tur — madde 4): kullanıcı konum iznini reddedip "Listeden Seç"e
// basarsa (ya da GPS başarısız olursa), hesaplama yöntemi sessizce
// varsayılan (MWL) kalmak yerine, cihazın IP adresinden YAKLAŞIK bir ülke
// tahmini yapılıp (`lib/ulkeTespiti.ts`) o ülkenin resmi/yaygın yöntemine
// otomatik geçiliyor — kullanıcı yine de LocationPickerScreen'den istediği
// zaman kendi şehrini/ülkesini seçip bunu değiştirebilir, bu yalnızca "hiç
// seçim yapılmadan önceki" en iyi tahmin.
// NEREDE ÇALIŞIYOR: App.tsx'te açılış animasyonu (`AcilisEkrani`) bittikten
// SONRA, `AppGovde` yüklenmeden ÖNCE gösterilir — yalnızca kullanıcı daha
// önce bu akışı tamamlamamışsa (bkz. lib/onboardingDeposu.ts, App.tsx'teki
// kullanım). `AppGovde`'nin TÜM sağlayıcılarının (DilProvider,
// LocationProvider, CalculationSettingsProvider, NotificationSettingsProvider)
// İÇİNDE render edilir ki `useCeviri()`/`useLocationContext()` gibi hook'lar
// buradan da kullanılabilsin — konum/bildirim adımlarında gerçek veriyi
// (locations, addLocation, autoMethod) doğrudan güncelleyebilmek için bu
// şart.
//
// GPS AKIŞI: LocationPickerScreen.tsx ile AYNI ortak `lib/gpsKonum.ts`
// fonksiyonu (`konumAl`) kullanılıyor — retry'lı deneme + son bilinen
// konuma düşme dahil. Madde 1 (bu tur): "ikinci tıklamada çalışıyor"
// hatasının asıl kök nedeni bulunup (native diyalog kapanır kapanmaz konum
// sağlayıcının henüz ısınmamış olması) ortak yardımcıya taşındı — bkz. o
// dosyadaki ayrıntılı açıklama.
//
// BİLDİRİM İZNİ: `lib/notificationScheduler.ts`'teki mevcut
// `requestNotificationPermission()` çağrılıyor — bildirim planlamasıyla
// aynı, tek doğru kaynak; burada ayrıca bir kopya izin mantığı YAZILMADI.
//
// "Atla"/"Listeden Seç": kullanıcı izin vermek istemezse akış hiçbir zaman
// kilitlenmiyor — her adımda ilerlemenin bir yolu var, uygulama izinsiz de
// açılabiliyor (izinler daha sonra Ayarlar'dan istenebilir).

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import IslamicPattern from '../components/IslamicPattern';
import { colors, spacing, radius, typography, fontSize, lineHeight, elevation } from '../theme';
import { useCeviri } from '../i18n/DilContext';
import { DilKodu, DIL_ADLARI } from '../i18n/ceviriler';
import { useLocationContext } from '../context/LocationContext';
import { useCalculationSettings, CalcMethodId } from '../context/CalculationSettingsContext';
import { useNotificationSettings, OnTimeVakitKey } from '../context/NotificationSettingsContext';
import { requestNotificationPermission } from '../lib/notificationScheduler';
import { konumAl } from '../lib/gpsKonum';
import { ipdenUlkeTahminiYap } from '../lib/ulkeTespiti';

interface Props {
  onTamamlandi: () => void;
}

// YENİ (bu tur — madde 5): 'dil' adımı akışın en başına eklendi.
type Adim = 'dil' | 'karsilama' | 'konum' | 'bildirim' | 'tamam';

const ONTIME_VAKITLER: OnTimeVakitKey[] = ['sabah', 'ogle', 'ikindi', 'aksam', 'yatsi'];

// YENİ (bu tur — madde 4): IP'den tahmin edilen ülke koduna göre otomatik
// seçilecek CalcMethodId — `prayerCalculator.ts`'teki `getMethodForCountry`
// ile AYNI ülke/yöntem eşleştirmesini, manuel modda gösterilebilecek somut
// bir `CalcMethodId`'ye çeviriyor (otomatik mod zaten ülke koduna göre kendi
// içinde hesaplıyor — bu liste yalnızca kullanıcı SettingsScreen'de "hangi
// yöntemi kullanıyorum" diye baktığında görünecek etiket için).
function ulkeKodundanYontem(ulkeKodu: string): CalcMethodId {
  switch (ulkeKodu) {
    case 'TR': return 'Turkey';
    case 'US': case 'CA': return 'NorthAmerica';
    case 'SA': return 'UmmAlQura';
    case 'EG': return 'Egyptian';
    case 'PK': case 'IN': case 'BD': return 'Karachi';
    case 'KW': return 'Kuwait';
    case 'QA': return 'Qatar';
    case 'SG': return 'Singapore';
    case 'AE': return 'Dubai';
    case 'IR': return 'Tehran';
    case 'MY': case 'BN': return 'Jakim';
    case 'FR': return 'Uoif';
    case 'ID': return 'Kemenag';
    case 'MA': case 'EH': return 'Morocco';
    case 'TN': return 'Tunisia';
    case 'DZ': return 'Algeria';
    case 'RU': case 'KZ': case 'KG': case 'TJ': case 'UZ': case 'TM': case 'AZ': return 'Russia';
    case 'BH': case 'OM': return 'Gulf';
    default: return 'MuslimWorldLeague';
  }
}

export default function OnboardingEkrani({ onTamamlandi }: Props) {
  const insets = useSafeAreaInsets();
  const { t, dil, diliDegistir, vakitAdi } = useCeviri();
  const { addLocation } = useLocationContext();
  const { setAutoMethod, setMethodId } = useCalculationSettings();
  const { settings, setOnTime } = useNotificationSettings();

  const [adim, setAdim] = useState<Adim>('dil');
  const [konumYukleniyor, setKonumYukleniyor] = useState(false);
  const [konumHata, setKonumHata] = useState<string | null>(null);

  const dilSecildi = async (secilenDil: DilKodu) => {
    await diliDegistir(secilenDil);
    setAdim('karsilama');
  };

  // YENİ (bu tur — madde 4): kullanıcı konum iznini reddedip "Listeden
  // Seç"e bastığında (aşağıdaki `onPress={() => { ... setAdim('bildirim');
  // }}`), GPS koordinatı olmadığı için `getMethodForCountry` çağrılamaz —
  // bunun yerine IP'den YAKLAŞIK bir ülke tahmini yapılıp otomatik olarak o
  // ülkenin yöntemi (manuel modda görünecek etiket için) ayarlanıyor. Bu,
  // yalnızca "hiçbir şey seçilmemiş"ten daha iyi bir varsayılan; kullanıcı
  // LocationPickerScreen'den istediği an kendi şehrini seçip değiştirebilir.
  // Otomatik mod (`autoMethod`) AÇIK bırakılıyor — bu sayede kullanıcı
  // sonradan gerçek bir konum eklerse (GPS ya da listeden), o konumun ülke
  // koduna göre doğru yöntem zaten otomatik uygulanır; IP tahmini yalnızca
  // "konum hiç seçilmeden önceki" ilk birkaç gün için bir iyileştirmedir.
  const konumReddedildiIpTahminiDene = async () => {
    try {
      const ulkeKodu = await ipdenUlkeTahminiYap();
      if (ulkeKodu) {
        setMethodId(ulkeKodundanYontem(ulkeKodu));
      }
    } catch {
      // Sessizce yoksay — varsayılan MWL zaten geçerli olmaya devam eder.
    }
  };

  // Madde 1 (bu tur): ortak `konumAl()` — retry'lı deneme + son bilinen
  // konuma düşme (bkz. lib/gpsKonum.ts). Onboarding akışı hiçbir zaman
  // kilitlenmiyor: başarısız olursa da bir sonraki adıma geçilir, ama artık
  // kullanıcı NEDEN geçildiğini görebiliyor (`konumHata`) — sessizce
  // yutulmuyor.
  const konumuEtkinlestir = async () => {
    setKonumYukleniyor(true);
    setKonumHata(null);
    try {
      const sonuc = await konumAl(t('gpsKonumu'));
      if (!sonuc.basarili) {
        if (sonuc.hataTuru === 'konumAlinamadi') {
          setKonumHata(t('konumAlinamadi'));
        }
        // YENİ (bu tur — madde 4): GPS başarısız olduğunda da (izin
        // reddedildi ya da konum hiç alınamadı) IP tahminini dene.
        konumReddedildiIpTahminiDene();
        return;
      }
      addLocation({
        latitude: sonuc.latitude!,
        longitude: sonuc.longitude!,
        il: sonuc.il!,
        ilce: sonuc.ilce!,
        countryCode: sonuc.countryCode!,
        isGps: true,
      });
      setAutoMethod(true);
      setAdim('bildirim');
    } finally {
      setKonumYukleniyor(false);
    }
  };

  const bildirimIzniIste = async () => {
    await requestNotificationPermission();
    setAdim('tamam');
  };

  return (
    <View style={styles.wrap}>
      <IslamicPattern color={colors.copper} opacity={0.05} tile={48} />

      {/* YENİ (bu tur — madde 5): dil seçimi — akışın ilk adımı. `t()`
          henüz hiç dil seçilmediyse VARSAYILAN_DIL (İngilizce) ile
          çalışır; kullanıcı bir seçenek seçtiği an `diliDegistir()`
          çağrılır ve bu ekran DAHİL tüm metinler o dile geçer. */}
      {adim === 'dil' && (
        <View style={[styles.icerik, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
          {/* NOT: proje simge setinde (Icon.tsx) ayrı bir "dil/küre" ikonu
              yok — yeni bir SVG çizmek yerine mevcut 'bilgi' ikonu
              kullanıldı (nötr, anlamı zorlamıyor). İstenirse ileride
              Icon.tsx'e özel bir "dil" ikonu eklenebilir. */}
          <View style={styles.ikonKap}>
            <Icon name="bilgi" size={40} color={colors.primaryBright} />
          </View>
          <Text style={styles.baslik}>{t('dilSecBaslik')}</Text>
          <Text style={styles.metin}>{t('dilSecMetin')}</Text>
          <View style={styles.dilListe}>
            {(Object.keys(DIL_ADLARI) as DilKodu[]).map((kod) => (
              <TouchableOpacity
                key={kod}
                style={[styles.dilSatir, dil === kod && styles.dilSatirSecili]}
                onPress={() => dilSecildi(kod)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dilYazi, dil === kod && styles.dilYaziSecili]}>
                  {DIL_ADLARI[kod]}
                </Text>
                {dil === kod && <Icon name="onay" size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {adim === 'karsilama' && (
        <View style={[styles.icerik, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.ikonKap}>
            <Icon name="cami" size={44} color={colors.primaryBright} />
          </View>
          <Text style={styles.baslik}>{t('onbKarsilamaBaslik')}</Text>
          <Text style={styles.metin}>{t('onbKarsilamaMetin')}</Text>
          <View style={styles.altBosluk} />
          <TouchableOpacity style={styles.btn} onPress={() => setAdim('konum')} activeOpacity={0.85}>
            <Text style={styles.btnYazi}>{t('onbDevamEt')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {adim === 'konum' && (
        <View style={[styles.icerik, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={[styles.ikonKap, { backgroundColor: colors.copper }]}>
            <Icon name="konum" size={40} color={colors.textOnDark} />
          </View>
          <Text style={styles.baslik}>{t('onbKonumBaslik')}</Text>
          <Text style={styles.metin}>{t('onbKonumMetin')}</Text>
          {konumHata && <Text style={styles.konumHataYazi}>{konumHata}</Text>}
          <View style={styles.altBosluk} />
          <TouchableOpacity
            style={styles.btn}
            onPress={konumuEtkinlestir}
            disabled={konumYukleniyor}
            activeOpacity={0.85}
          >
            <Text style={styles.btnYazi}>
              {konumYukleniyor ? t('konumAliniyor') : t('onbKonumEtkinlestir')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // YENİ (bu tur — madde 4): kullanıcı GPS'i atlayıp listeden
              // seçmeyi tercih ettiğinde de IP tahminini dene — konum
              // reddedildiği/atlandığı HER durumda (yalnızca hata mesajı
              // gösterilen senaryoda değil) devreye giriyor.
              konumReddedildiIpTahminiDene();
              setAdim('bildirim');
            }}
            activeOpacity={0.7}
            style={styles.linkBtn}
          >
            <Text style={styles.link}>{t('onbListedenSec')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {adim === 'bildirim' && (
        <View style={[styles.icerik, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.ikonKap}>
            <Icon name="hatirlatici" size={40} color={colors.primaryBright} />
          </View>
          <Text style={styles.baslik}>{t('onbBildirimBaslik')}</Text>
          <Text style={styles.metin}>{t('onbBildirimMetin')}</Text>

          <View style={styles.toggleListe}>
            {ONTIME_VAKITLER.map((vk, i) => (
              <View
                key={vk}
                style={[styles.toggleSatir, i === ONTIME_VAKITLER.length - 1 && styles.toggleSatirSon]}
              >
                <Text style={styles.toggleYazi}>{vakitAdi(vk)}</Text>
                <TouchableOpacity
                  onPress={() => setOnTime(vk, { enabled: !settings.onTimeAlerts[vk].enabled })}
                  style={[styles.toggle, settings.onTimeAlerts[vk].enabled && styles.toggleAcik]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View style={[styles.toggleTopuz, settings.onTimeAlerts[vk].enabled && styles.toggleTopuzAcik]} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.altBosluk} />
          <TouchableOpacity style={styles.btn} onPress={bildirimIzniIste} activeOpacity={0.85}>
            <Text style={styles.btnYazi}>{t('onbBildirimIzinVer')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAdim('tamam')} activeOpacity={0.7} style={styles.linkBtn}>
            <Text style={styles.link}>{t('onbAtla')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {adim === 'tamam' && (
        <View style={[styles.icerik, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.onayDaire}>
            <Icon name="onay" size={30} color={colors.success} />
          </View>
          <Text style={styles.baslik}>{t('onbTamamBaslik')}</Text>
          <Text style={styles.metin}>{t('onbTamamMetin')}</Text>
          <View style={styles.altBosluk} />
          <TouchableOpacity style={styles.btn} onPress={onTamamlandi} activeOpacity={0.85}>
            <Text style={styles.btnYazi}>{t('onbBasla')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  icerik: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  ikonKap: {
    width: 84,
    height: 84,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    ...elevation.card,
  },
  onayDaire: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl * 1.5,
    marginBottom: spacing.lg,
  },
  baslik: {
    fontFamily: typography.displaySemibold,
    fontSize: fontSize.heading,
    color: colors.textOnLight,
    textAlign: 'center',
    lineHeight: lineHeight.heading,
    marginBottom: spacing.sm,
  },
  metin: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: lineHeight.body,
    paddingHorizontal: spacing.sm,
  },
  konumHataYazi: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  altBosluk: { flex: 1, minHeight: spacing.xl },
  btn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...elevation.card,
  },
  btnYazi: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnDark,
  },
  linkBtn: { marginTop: spacing.md, padding: spacing.xs },
  link: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.small,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  // YENİ (bu tur — madde 5): dil seçim listesi stilleri.
  dilListe: {
    width: '100%',
    marginTop: spacing.lg,
  },
  dilSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  dilSatirSecili: {
    borderColor: colors.primary,
    backgroundColor: colors.creamDeep,
  },
  dilYazi: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnLight,
  },
  dilYaziSecili: {
    color: colors.primaryDark,
  },
  toggleListe: {
    width: '100%',
    marginTop: spacing.lg,
  },
  toggleSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleSatirSon: { borderBottomWidth: 0 },
  toggleYazi: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnLight,
  },
  toggle: {
    width: 42,
    height: 24,
    borderRadius: 13,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleAcik: { backgroundColor: colors.primary },
  toggleTopuz: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  toggleTopuzAcik: { alignSelf: 'flex-end' },
});
