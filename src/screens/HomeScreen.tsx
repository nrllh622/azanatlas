// src/screens/HomeScreen.tsx
//
// UYGULAMA KABUĞU + ANA SAYFA
//
// Bu dosya iki işi birden yapar:
//
//   1) KABUK (shell): Alt navigasyondaki beş sekme (Ana Sayfa, İmsakiye,
//      Keşfet, Kıble, Ayarlar) arasında geçişi yönetir ve alt navigasyonu
//      KALICI olarak ekranda tutar — Muslim Pro'daki gibi, sekme değişse de
//      alt çubuk yerinde kalır. Takip/Tesbih/Kaza gibi araçlar ise tam ekran
//      açılır (alt çubuk gizlenir), çünkü bunlar bir "sekme" değil, bir
//      görevin içine girmektir. (Kıble ile Takip'in rolleri kullanıcı
//      isteğiyle değiştirildi — Kıble artık kalıcı sekme, Takip tam ekran araç.)
//
//      Alt çubuk `position: absolute` DEĞİL, normal akışta duruyor: içerik
//      flex:1 ile üstte, çubuk altında. Böylece hiçbir ekranın son satırı
//      çubuğun altında kalmıyor — her ekrana ayrı ayrı alt boşluk vermeye
//      gerek kalmıyor.
//
//   2) ANA SAYFA içeriği: sıradaki vakit kartı, günün yedi vakti (kılındı
//      işareti ve vakit bazlı bildirim düğmesiyle), dört hızlı araç butonu
//      ve Günün Ayeti kartı.
//
// Vakit verisi iki aşamalı gelir: önce cihazda anında hesaplanan yerel
// sonuç gösterilir (kullanıcı asla boş ekran görmez), ardından Türkiye
// içindeyse Diyanet'in resmi verisi çekilip üzerine yazılır.

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography, elevation, fontSize, lineHeight } from '../theme';
import {
  calculateVakitler,
  getVakitlerWithDiyanetFallback,
  VakitEntry,
  VakitKaynak,
} from '../lib/prayerCalculator';
import { useLocationContext } from '../context/LocationContext';
import { useNotificationSettings, OnTimeVakitKey } from '../context/NotificationSettingsContext';
import { useCalculationSettings } from '../context/CalculationSettingsContext';
import { useGeneralSettings } from '../context/GeneralSettingsContext';
import { useVaktindeKil } from '../context/VaktindeKilContext';
import { useKaza } from '../context/KazaContext';
import { useReminders } from '../context/RemindersContext';
import { useIbadetTakibi } from '../context/IbadetTakibiContext';
import {
  requestNotificationPermission,
  scheduleAllNotifications,
  configureAndroidChannels,
} from '../lib/notificationScheduler';
import { scheduleVaktindeKil, cancelVaktindeKilForVakit } from '../lib/vaktindeKilScheduler';
import { setupVaktindeKilCategory, registerVaktindeKilResponseListener } from '../lib/vaktindeKilActions';
import { scheduleReminders } from '../lib/remindersScheduler';
import { toHijri } from '../lib/hijri';
import { getKerahatInfo } from '../lib/kerahat';
import { takipEdilebilir, TakipVakti } from '../lib/ibadetTakibi';
import { getGununAyeti } from '../data/ayetler';
import { getDiniGun, getYaklasanDiniGun } from '../data/diniGunler';
import { getTariheEnYakinOlay } from '../data/tariheBugun';
import { widgetVerisiniGuncelle } from '../lib/widgetVeriDeposu';
import { useCeviri } from '../i18n/DilContext';
import { AY_ANAHTARLARI } from '../i18n/ceviriler';

import Icon, { IconName, vakitIcon } from '../components/Icon';
import DoluIkon, { DoluIkonAdi } from '../components/DoluIkon';
import IslamicPattern from '../components/IslamicPattern';
import BannerReklam from '../components/BannerReklam';

import LocationPickerScreen from './LocationPickerScreen';
import SettingsScreen from './SettingsScreen';
import QiblaScreen from './QiblaScreen';
import ImsakiyeScreen from './ImsakiyeScreen';
import KazaScreen from './KazaScreen';
import VaktindeKilScreen from './VaktindeKilScreen';
import RemindersScreen from './RemindersScreen';
import TesbihScreen from './TesbihScreen';
import EsmaulHusnaScreen from './EsmaulHusnaScreen';
import KesfetScreen, { KesfetHedef } from './KesfetScreen';
import TakipScreen from './TakipScreen';
import TemaScreen from './TemaScreen';

/** Alt navigasyondaki kalıcı sekmeler.
 *  Madde 6 (bu tur): Kıble artık burada, Takip ise tam ekran araca taşındı
 *  — kullanıcı bu iki özelliğin alt navigasyon/hızlı-araç konumlarını
 *  birbiriyle değiştirmek istedi. */
type Tab = 'home' | 'imsakiye' | 'kesfet' | 'qibla' | 'settings';

/** Tam ekran açılan, alt navigasyonu gizleyen araç ekranları. */
type SubScreen =
  | null
  | 'location'
  | 'takip'
  | 'kaza'
  | 'vaktindekil'
  | 'reminders'
  | 'tesbih'
  | 'esma'
  | 'tema';

// Madde 2 (i18n paketi): bu iki dizi eskiden görüntülenecek Türkçe metni
// (`ad`) doğrudan taşıyordu — ama bu dizi MODÜL YÜKLENİRKEN bir kez
// oluşuyor, `useCeviri()` ise bir React hook'u (render içinde çağrılmalı).
// Bu yüzden `ad` yerine bir çeviri ANAHTARI (`adAnahtari`) tutuluyor;
// gerçek metin render sırasında `t(s.adAnahtari)` ile alınıyor — dil
// değiştiğinde bu diziler yeniden oluşmaya gerek kalmadan doğru metni
// gösterir.
const SEKMELER: { id: Tab; adAnahtari: 'sekmeAnaSayfa' | 'sekmeImsakiye' | 'sekmeKesfet' | 'sekmeKible' | 'sekmeAyarlar'; ikon: DoluIkonAdi }[] = [
  { id: 'home', adAnahtari: 'sekmeAnaSayfa', ikon: 'anasayfa' },
  { id: 'imsakiye', adAnahtari: 'sekmeImsakiye', ikon: 'imsakiye' },
  { id: 'kesfet', adAnahtari: 'sekmeKesfet', ikon: 'kesfet' },
  { id: 'qibla', adAnahtari: 'sekmeKible', ikon: 'kible' },
  { id: 'settings', adAnahtari: 'sekmeAyarlar', ikon: 'ayarlar' },
];

/** Ana Sayfa'daki dört hızlı araç — en sık kullanılanlar.
 *  Madde 6: Kıble alt navigasyona taşındığı için burada Takip'e yer açıldı. */
const HIZLI_ARACLAR: { hedef: SubScreen; adAnahtari: 'aracTakip' | 'aracTesbih' | 'aracEsma' | 'aracKaza'; ikon: DoluIkonAdi }[] = [
  { hedef: 'takip', adAnahtari: 'aracTakip', ikon: 'takip' },
  { hedef: 'tesbih', adAnahtari: 'aracTesbih', ikon: 'tesbih' },
  { hedef: 'esma', adAnahtari: 'aracEsma', ikon: 'esma' },
  { hedef: 'kaza', adAnahtari: 'aracKaza', ikon: 'kaza' },
];

function ikiHane(n: number): string {
  return String(n).padStart(2, '0');
}

function saatBicimle(d: Date): string {
  return `${ikiHane(d.getHours())}:${ikiHane(d.getMinutes())}`;
}

function geriSayimBicimle(ms: number): string {
  const toplamSaniye = Math.max(0, Math.floor(ms / 1000));
  const s = Math.floor(toplamSaniye / 3600);
  const d = Math.floor((toplamSaniye % 3600) / 60);
  const sn = toplamSaniye % 60;
  return `${ikiHane(s)}:${ikiHane(d)}:${ikiHane(sn)}`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t, vakitAdi, dil } = useCeviri();
  const { location, locations, activeId, setActiveId } = useLocationContext();
  const { settings, setOnTime } = useNotificationSettings();
  const {
    autoMethod, methodId, kerahatMinutes, madhab, highLatRule,
    hijriAdjustmentDays, hijriSwitchAtMaghrib,
  } = useCalculationSettings();
  const { vibrationEnabled } = useGeneralSettings();
  const vaktindeKil = useVaktindeKil();
  const { totalCount: kazaTotal } = useKaza();
  const { settings: reminderSettings } = useReminders();
  const { bugunKilinanlar, seri, isaretiDegistir } = useIbadetTakibi();

  const [now, setNow] = useState(new Date());
  const [tab, setTab] = useState<Tab>('home');
  const [sub, setSub] = useState<SubScreen>(null);
  const [vakitKaynak, setVakitKaynak] = useState<VakitKaynak>('yerel');

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // "Kıldım" bildirim aksiyonu bir kez kuruluyor (kategori + yanıt dinleyicisi)
  useEffect(() => {
    setupVaktindeKilCategory();
    const sub2 = registerVaktindeKilResponseListener();
    return () => sub2.remove();
  }, []);

  // Donanım geri tuşu: önce açık aracı kapat, sonra Ana Sayfa'ya dön,
  // en sonunda uygulamadan çıkışa izin ver.
  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sub !== null) {
        setSub(null);
        return true;
      }
      if (tab !== 'home') {
        setTab('home');
        return true;
      }
      return false;
    });
    return () => listener.remove();
  }, [sub, tab]);

  const [vakitler, setVakitler] = useState<VakitEntry[]>(() =>
    calculateVakitler(
      location.latitude, location.longitude, now, location.countryCode,
      autoMethod, methodId, madhab, highLatRule
    )
  );

  useEffect(() => {
    let iptalEdildi = false;
    const yerel = calculateVakitler(
      location.latitude, location.longitude, now, location.countryCode,
      autoMethod, methodId, madhab, highLatRule
    );
    setVakitler(yerel);
    setVakitKaynak('yerel');

    getVakitlerWithDiyanetFallback(
      location.latitude, location.longitude, now, location.countryCode,
      location.il, location.ilce, autoMethod, methodId, madhab, highLatRule
    ).then((sonuc) => {
      if (iptalEdildi) return;
      setVakitler(sonuc.vakitler);
      setVakitKaynak(sonuc.kaynak);
    });

    return () => {
      iptalEdildi = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.latitude, location.longitude, location.countryCode,
    location.il, location.ilce, autoMethod, methodId, madhab, highLatRule,
    now.toDateString(),
  ]);

  const next = useMemo(() => {
    const yaklasan = vakitler.find((v) => v.date.getTime() > now.getTime());
    if (yaklasan) return yaklasan;
    const yarin = new Date(now);
    yarin.setDate(yarin.getDate() + 1);
    const yarinkiler = calculateVakitler(
      location.latitude, location.longitude, yarin, location.countryCode,
      autoMethod, methodId, madhab, highLatRule
    );
    return yarinkiler[0];
  }, [vakitler, now, location, autoMethod, methodId, madhab, highLatRule]);

  const current = useMemo(() => {
    const gecen = [...vakitler].reverse().find((v) => v.date.getTime() <= now.getTime());
    return gecen ?? vakitler[vakitler.length - 1];
  }, [vakitler, now]);

  const kerahat = useMemo(
    () => getKerahatInfo(vakitler, now, kerahatMinutes),
    [vakitler, now, kerahatMinutes]
  );

  const hijriBaseDate = useMemo(() => {
    const aksamVakit = vakitler.find((v) => v.key === 'aksam');
    if (hijriSwitchAtMaghrib && aksamVakit && now.getTime() >= aksamVakit.date.getTime()) {
      const ertesi = new Date(now);
      ertesi.setDate(ertesi.getDate() + 1);
      return ertesi;
    }
    return now;
  }, [now, vakitler, hijriSwitchAtMaghrib]);

  const hijri = useMemo(() => toHijri(hijriBaseDate, hijriAdjustmentDays), [hijriBaseDate, hijriAdjustmentDays]);
  const isRamazan = hijri.month === 'Ramazan';
  const aksam = vakitler.find((v) => v.key === 'aksam');
  const ayet = useMemo(() => getGununAyeti(now), [now.toDateString()]);

  // Bugün özel bir dini gün mü? Değilse en yakın olanı göster.
  const diniGun = useMemo(
    () => getDiniGun(hijriBaseDate, hijri.month, hijri.day),
    [hijriBaseDate.toDateString(), hijri.month, hijri.day]
  );
  const yaklasan = useMemo(
    () => (diniGun ? null : getYaklasanDiniGun(now, (d) => toHijri(d, hijriAdjustmentDays))),
    [diniGun, now.toDateString(), hijriAdjustmentDays]
  );
  // Madde 3 (devir dosyası — kullanıcı ısrarla tekrarladı): kart artık HER
  // GÜN görünüyor. Tam eşleşme yoksa takvimdeki en yakın gerçek olay,
  // "bugün" değil kendi tarihiyle ("X gün sonra/önce yaşandı" gibi)
  // gösteriliyor — bkz. tariheBugun.ts içindeki açıklama.
  const tarihOlayi = useMemo(() => getTariheEnYakinOlay(now), [now.toDateString()]);

  // Widget (madde 10, devir dosyası §7): vakitler her yeniden hesaplandığında
  // (konum/gün/yöntem değiştiğinde) AsyncStorage'a yazılıyor ki widget'ın
  // kendi arka plan görevi karmaşık hesap yapmadan hazır veriyi okusun.
  // Expo Go'da veya widget hiç eklenmemişse bu çağrı zararsızdır — sadece
  // kullanılmayan bir AsyncStorage anahtarı yazar.
  useEffect(() => {
    widgetVerisiniGuncelle(
      vakitler,
      `${location.il}, ${location.ilce}`,
      `${hijri.day} ${hijri.month}`,
      current.key
    );
  }, [vakitler, location.il, location.ilce, hijri.day, hijri.month, current.key]);

  const kalanMs = next.date.getTime() - now.getTime();

  /**
   * İçinde bulunulan vaktin ne kadarının geçtiği (0–1).
   * Hero kartındaki ilerleme çubuğunu besler.
   */
  const vakitIlerlemesi = useMemo(() => {
    const bas = current.date.getTime();
    const son = next.date.getTime();
    if (son <= bas) return 0;
    return Math.min(1, Math.max(0, (now.getTime() - bas) / (son - bas)));
  }, [current, next, now]);

  useEffect(() => {
    (async () => {
      const izin = await requestNotificationPermission();
      if (!izin) return;
      await configureAndroidChannels(dil);
      await scheduleAllNotifications(vakitler, settings, kerahatMinutes, vibrationEnabled, dil);
      if (vaktindeKil.enabled) {
        await scheduleVaktindeKil(
          current, next,
          vaktindeKil.firstDelayMinutes,
          vaktindeKil.repeatIntervalMinutes,
          vaktindeKil.sound,
          vibrationEnabled,
          dil
        );
      }
      await scheduleReminders(
        location.latitude, location.longitude, location.countryCode,
        location.il, location.ilce, autoMethod, methodId, madhab, highLatRule,
        reminderSettings, vibrationEnabled, dil
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.latitude, location.longitude, autoMethod, methodId, madhab, highLatRule,
    settings, kerahatMinutes, vibrationEnabled, vaktindeKil, reminderSettings,
    current.key, next.key, dil,
  ]);

  const konumDegistir = (yon: 1 | -1) => {
    if (locations.length < 2) return;
    const idx = locations.findIndex((l) => l.id === activeId);
    const yeniIdx = (idx + yon + locations.length) % locations.length;
    setActiveId(locations[yeniIdx].id);
  };

  const kesfetYonlendir = useCallback((hedef: KesfetHedef) => {
    // Keşfet ızgarasındaki bazı kutular bir SEKMEYE, bazıları tam ekran bir
    // ARACA gider. İkisini burada ayırıyoruz.
    //
    // Madde 6 (bu tur): Kıble/Takip'in Tab/SubScreen rolleri değişti —
    // Kıble artık bir SEKME ('qibla' → Tab), Takip artık tam ekran bir
    // ARAÇ ('takip' → SubScreen). Keşfet ızgarasındaki 'kible'/'takip'
    // literal string'leri DEĞİŞMEDİ (KesfetScreen.tsx aynen duruyor), yalnızca
    // bu dispatch mantığı hangi hedefin Tab hangisinin SubScreen olduğunu
    // güncellendi.
    if (hedef === 'imsakiye' || hedef === 'kible' || hedef === 'settings') {
      const SEKME_ESLEME: Record<string, Tab> = {
        imsakiye: 'imsakiye',
        kible: 'qibla',
        settings: 'settings',
      };
      setTab(SEKME_ESLEME[hedef]);
      return;
    }
    const ALT_EKRAN_ESLEME: Record<string, SubScreen> = {
      takip: 'takip',
      tesbih: 'tesbih',
      esma: 'esma',
      kaza: 'kaza',
      vaktindekil: 'vaktindekil',
      reminders: 'reminders',
      location: 'location',
      tema: 'tema',
    };
    const altEkran = ALT_EKRAN_ESLEME[hedef];
    if (altEkran) setSub(altEkran);
  }, []);

  // -------------------------------------------------------------------
  // TAM EKRAN ARAÇLAR — alt navigasyon gizlenir
  // -------------------------------------------------------------------
  if (sub === 'location') return <LocationPickerScreen onDone={() => setSub(null)} />;
  if (sub === 'takip') return <TakipScreen onClose={() => setSub(null)} />;
  if (sub === 'kaza') return <KazaScreen onClose={() => setSub(null)} />;
  if (sub === 'vaktindekil') return <VaktindeKilScreen onClose={() => setSub(null)} />;
  if (sub === 'reminders') return <RemindersScreen onClose={() => setSub(null)} />;
  if (sub === 'tesbih') return <TesbihScreen onClose={() => setSub(null)} />;
  if (sub === 'esma') return <EsmaulHusnaScreen onClose={() => setSub(null)} />;
  if (sub === 'tema') return <TemaScreen onClose={() => setSub(null)} />;

  // -------------------------------------------------------------------
  // SEKME İÇERİKLERİ
  // -------------------------------------------------------------------
  let sekmeIcerigi: React.ReactNode;

  if (tab === 'imsakiye') {
    sekmeIcerigi = <ImsakiyeScreen />;
  } else if (tab === 'kesfet') {
    sekmeIcerigi = <KesfetScreen onNavigate={kesfetYonlendir} />;
  } else if (tab === 'qibla') {
    sekmeIcerigi = <QiblaScreen />;
  } else if (tab === 'settings') {
    sekmeIcerigi = (
      <SettingsScreen
        onClose={() => setTab('home')}
        onOpenVaktindeKil={() => setSub('vaktindekil')}
        onOpenReminders={() => setSub('reminders')}
      />
    );
  } else {
    sekmeIcerigi = (
      <ScrollView
        style={styles.anaAkis}
        contentContainerStyle={styles.anaIcerik}
        showsVerticalScrollIndicator={false}
      >
        {/* ============ ÜST BLOK: konum, tarih, sıradaki vakit ============ */}
        {/* Madde 1 (bu tur): kullanıcı üst şeridin krem zeminini, hemen
            altındaki hero ile aynı ana renge (primary) boyanmasını istedi —
            böylece üst şerit + hero tek parça koyu bir blok gibi görünüyor.
            Konum/bildirim ikonları koyu zemine uygun biçimde yeniden
            tasarlandı: dolgulu daireler yerine ince kenarlıklı, yarı saydam
            "cam" düğmeler — parlak beyaz dolgu koyu zeminde çok sert
            dururdu, bu yumuşak versiyon hem okunaklı hem tema rengine sadık. */}
        <View style={[styles.ustSerit, { paddingTop: insets.top + spacing.xs }]}>
          <IslamicPattern color={colors.cream} opacity={0.07} tile={44} />
          <TouchableOpacity
            style={styles.konumBlok}
            onPress={() => setSub('location')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('konumDegistirEtiketi')}
          >
            <View style={styles.konumIkonKap}>
              <Icon name="konum" size={19} color={colors.copperLight} />
            </View>
            <View style={styles.konumMetin}>
              <Text style={styles.konumIl} numberOfLines={1}>
                {location.il}, {location.ilce}
              </Text>
              <Text style={styles.konumTarih} numberOfLines={1}>
                {now.getDate()} {t(AY_ANAHTARLARI[now.getMonth()])} · {hijri.day} {hijri.month} {hijri.year}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bildirimBtn}
            onPress={() => setTab('settings')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('bildirimAyarlariEtiketi')}
          >
            <Icon name="hatirlatici" size={20} color={colors.copperLight} />
          </TouchableOpacity>
        </View>

        {/* HERO KARTI — düz (köşesiz) kart. Önceki sürümde alt kenarları
            büyük yarıçapla kavisliydi; kullanıcı geri bildirimiyle düz
            dikdörtgen forma dönüldü. Üst şerit artık aynı ana renkte
            olduğu için aradaki sınır kasıtlı olarak belirsizleştirildi
            (hero'nun üst iç boşluğu azaltıldı) — ikisi tek blok okunuyor. */}
        <View style={styles.hero}>
          <IslamicPattern color={colors.cream} opacity={0.09} tile={44} />

          <View style={styles.heroIc}>
            <View style={styles.eskiKonumSatir}>
              {locations.length > 1 && (
                <TouchableOpacity
                  onPress={() => konumDegistir(-1)}
                  hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={t('oncekiKonum')}
                >
                  <Icon name="sol" size={18} color={colors.copperLight} />
                </TouchableOpacity>
              )}

              {/* Konum artık üst şeritte; burada yalnızca çoklu konum
                  kullananlar için ileri/geri okları kalıyor. */}

              {locations.length > 1 && (
                <TouchableOpacity
                  onPress={() => konumDegistir(1)}
                  hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={t('sonrakiKonum')}
                >
                  <Icon name="sag" size={18} color={colors.copperLight} />
                </TouchableOpacity>
              )}
            </View>

            {/* Sıradaki vakit + geri sayım
                DÜZELTME (bu tur — kullanıcı geri bildirimi 2. tur):
                1) İkon artık "Akşam" vakit adının HEMEN YANINDA (solunda),
                   ayrı bir satırda değil — tek satırda "🌆 Akşam  19:57".
                2) Vakit adı + saat + "KALAN SÜRE" etiketi + geri sayımın
                   TAMAMI artık `typography.displaySemibold` (Cairo SemiBold)
                   kullanıyor. Önceki turda "aynı fontSize" yeterli
                   sanılmıştı ama `kalanSureEtiket` (Manrope/bodyBold) ile
                   `geriSayim` (Cairo/displayFamily) FARKLI FONT AİLESİ
                   kullanıyordu — aynı punto olsa da iki farklı yazı tipi
                   göze belirgin boyut farkı gibi görünüyordu. Şimdi dördü
                   de aynı font ailesi + aynı fontSize + aynı lineHeight. */}
            <View style={styles.siradakiKap}>
              <Text style={styles.siradakiEtiket}>{t('siradakiVakit')}</Text>
              <View style={styles.siradakiAdSatir}>
                <Icon name={vakitIcon(next.key)} size={22} color={colors.copperLight} />
                <Text style={styles.siradakiAd}>{vakitAdi(next.key)}</Text>
                <Text style={styles.siradakiSaat}>{saatBicimle(next.date)}</Text>
              </View>
              <View style={styles.kalanSureSatir}>
                <Text style={styles.kalanSureEtiket}>{t('kalanSure')}</Text>
                <Text style={styles.geriSayim}>{geriSayimBicimle(kalanMs)}</Text>
              </View>
            </View>

            {/* Mevcut vaktin ilerlemesi */}
            <View style={styles.ilerlemeRay}>
              <View style={[styles.ilerlemeDolu, { width: `${vakitIlerlemesi * 100}%` }]} />
            </View>
            <View style={styles.ilerlemeAltSatir}>
              <Text style={styles.ilerlemeUc}>
                {vakitAdi(current.key)} {saatBicimle(current.date)}
              </Text>
              <Text style={styles.ilerlemeUc}>
                {vakitAdi(next.key)} {saatBicimle(next.date)}
              </Text>
            </View>
          </View>
        </View>

        {/* ============ KAYNAK ve UYARI ŞERİTLERİ ============ */}
        <View style={styles.govde}>
          <View style={styles.cipSatir}>
            <View style={styles.kaynakCip}>
              <Icon
                name={vakitKaynak === 'diyanet' ? 'onay' : 'bilgi'}
                size={13}
                color={vakitKaynak === 'diyanet' ? colors.success : colors.textMuted}
              />
              <Text style={styles.kaynakCipYazi}>
                {vakitKaynak === 'diyanet' ? t('diyanetTakvimi') : t('yerelHesaplama')}
              </Text>
            </View>

            {seri > 0 && (
              <TouchableOpacity
                style={styles.seriCip}
                onPress={() => setSub('takip')}
                accessibilityRole="button"
                accessibilityLabel={t('gunlukSeriEtiketi', seri)}
              >
                <Icon name="yildiz" size={12} color={colors.copper} />
                <Text style={styles.seriCipYazi}>{t('gunlukSeri', seri)}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── DİNİ GÜN ──
              Bugün kandil/bayram ise vurgulu kart; değilse yaklaşan günü
              sade bir satır olarak gösteriyoruz. Böylece kart her gün
              görünüyor ama yalnızca gerçekten özel günlerde öne çıkıyor. */}
          {diniGun ? (
            <View style={styles.diniGunKart}>
              <IslamicPattern color={colors.cream} opacity={0.10} tile={38} />
              <View style={styles.diniGunIc}>
                <Icon name="hilal" size={22} color={colors.copperLight} />
                <View style={styles.diniGunMetin}>
                  <Text style={styles.diniGunAd}>{diniGun.ad}</Text>
                  <Text style={styles.diniGunAciklama}>{diniGun.aciklama}</Text>
                </View>
              </View>
            </View>
          ) : yaklasan ? (
            <View style={styles.yaklasanSatir}>
              <Icon name="hilal" size={17} color={colors.copper} />
              <Text style={styles.yaklasanYazi}>
                {t('kalanGunKaldi', yaklasan.gun.ad, yaklasan.kalanGun)}
              </Text>
            </View>
          ) : null}

          {location.countryCode === 'TR' && vakitKaynak === 'yerel' && (
            <View style={styles.bilgiSerit}>
              <Icon name="bilgi" size={15} color={colors.textMuted} />
              <Text style={styles.bilgiSeritYazi}>
                {t('diyanetUlasilamadi')}
              </Text>
            </View>
          )}

          {kerahat.active && (
            <View style={styles.uyariSerit}>
              <Icon name="uyari" size={15} color={colors.white} />
              <Text style={styles.uyariSeritYazi}>{t('mekruhVakti', kerahat.reason)}</Text>
            </View>
          )}

          {isRamazan && aksam && (
            <View style={styles.iftarSerit}>
              <Icon name="hilal" size={15} color={colors.primaryDeep} />
              <Text style={styles.iftarSeritYazi}>
                {t('iftaraKalan', geriSayimBicimle(Math.max(0, aksam.date.getTime() - now.getTime())))}
              </Text>
            </View>
          )}

          {/* ============ VAKİT LİSTESİ ============ */}
          <View style={styles.vakitListe}>
            {vakitler.map((v) => {
              const suAnki = v.key === current.key;
              const takipli = takipEdilebilir(v.key);
              const kilindi = takipli && bugunKilinanlar.includes(v.key as TakipVakti);
              // Vakit bazlı bildirim düğmesi yalnızca "vakit girdi" bildirimi
              // olan beş farz namaz için anlamlı. İmsak ve Güneş için bu
              // bildirim türü tanımlı değil (onlar yalnızca ön uyarı olarak
              // ayarlanabiliyor), o yüzden düğme gösterilmiyor.
              const bildirimliMi = Object.prototype.hasOwnProperty.call(
                settings.onTimeAlerts, v.key
              );
              const bildirimAcik =
                bildirimliMi && (settings.onTimeAlerts as any)[v.key]?.enabled;

              return (
                <View
                  key={v.key}
                  style={[styles.vakitSatir, suAnki && styles.vakitSatirAktif]}
                >
                  {/* Kılındı işareti */}
                  {takipli ? (
                    <TouchableOpacity
                      onPress={async () => {
                        const simdiKilindi = !kilindi;
                        await isaretiDegistir(v.key as TakipVakti);
                        // Uygulama içinden "kılındı" işaretlendiğinde, o vakte ait
                        // bekleyen Vaktinde Kıl hatırlatmaları da anında iptal
                        // edilmeli; aksi halde kullanıcı vakti kıldığını belirtmesine
                        // rağmen hatırlatma almaya devam ederdi.
                        if (simdiKilindi) cancelVaktindeKilForVakit(v.key, v.date);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                      activeOpacity={0.6}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: kilindi }}
                      accessibilityLabel={t('kilindiOlarakIsaretle', vakitAdi(v.key))}
                    >
                      <Icon
                        name={kilindi ? 'onay' : 'daire'}
                        size={20}
                        color={kilindi ? colors.success : colors.borderStrong}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.isaretBosluk} />
                  )}

                  <View style={[styles.vakitIkonKap, suAnki && styles.vakitIkonKapAktif]}>
                    <Icon
                      name={vakitIcon(v.key)}
                      size={13}
                      color={suAnki ? colors.primaryDeep : colors.primary}
                    />
                  </View>

                  <Text
                    style={[styles.vakitAd, suAnki && styles.vakitAdAktif]}
                    numberOfLines={1}
                  >
                    {vakitAdi(v.key)}
                  </Text>

                  {suAnki && (
                    <View style={styles.simdiRozet}>
                      <Text style={styles.simdiRozetYazi}>{t('simdi')}</Text>
                    </View>
                  )}

                  <Text style={[styles.vakitSaat, suAnki && styles.vakitSaatAktif]}>
                    {saatBicimle(v.date)}
                  </Text>

                  {bildirimliMi ? (
                    <TouchableOpacity
                      onPress={() =>
                        setOnTime(v.key as OnTimeVakitKey, { enabled: !bildirimAcik })
                      }
                      hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                      style={styles.zilBtn}
                      activeOpacity={0.6}
                      accessibilityRole="switch"
                      accessibilityState={{ checked: !!bildirimAcik }}
                      accessibilityLabel={t('vaktiBildirimi', vakitAdi(v.key))}
                    >
                      <Icon
                        name={bildirimAcik ? 'bildirimAcik' : 'bildirimKapali'}
                        size={19}
                        color={bildirimAcik ? colors.copperVivid : colors.textFaint}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.zilBtn} />
                  )}
                </View>
              );
            })}
          </View>

          {/* ============ HIZLI ARAÇLAR (Muslim Pro'daki dörtlü satır) ============
              Bu kart bilinçli olarak REKLAM ALANININ ÜSTÜNDE, ilk ekranda
              kalacak şekilde konumlandı — Kıble/Tesbih/Esmâ/Kaza'ya scroll
              yapmadan ulaşmak (madde 1) reklam şeridinden önce garanti
              edilmiş oluyor. */}
          <View style={styles.hizliKart}>
            {HIZLI_ARACLAR.map((arac) => (
              <TouchableOpacity
                key={arac.adAnahtari}
                style={styles.hizliOge}
                onPress={() => setSub(arac.hedef)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={t(arac.adAnahtari)}
              >
                <View style={styles.hizliIkonKap}>
                  <DoluIkon ad={arac.ikon} boyut={21} zemin={colors.primarySoft} />
                  {arac.hedef === 'kaza' && kazaTotal > 0 && (
                    <View style={styles.hizliRozet}>
                      <Text style={styles.hizliRozetYazi}>
                        {kazaTotal > 99 ? '99+' : kazaTotal}
                      </Text>
                    </View>
                  )}
                  {/* DÜZELTME (2. tur): önceki turda bu nokta yanlışlıkla
                      kazaTotal'a (Kaza borcuna) bağlıydı, o yüzden tamamen
                      kaldırılmıştı. Kullanıcı şimdi netleştirdi: Takip
                      ikonunda KENDİ değerine (namaz takip serisi, `seri`)
                      bağlı bir gösterge istiyor — seri > 0 iken (yani
                      kullanıcı en az bir gün namaz işaretlemişse) nokta
                      görünsün. */}
                  {arac.hedef === 'takip' && seri > 0 && (
                    <View style={styles.hizliNokta} />
                  )}
                </View>
                <Text style={styles.hizliAd}>{t(arac.adAnahtari)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ============ REKLAM ALANI ============
              Madde 3 (i18n+reklam paketi): react-native-google-mobile-ads
              entegre edildi. `BannerReklam` bileşeni Expo Go'da (native
              modül bulunamadığında) sessizce aynı yükseklikte boş bir View
              render eder — içerik konumu hiçbir durumda değişmiyor. Şu an
              Google'ın herkese açık TEST kimliği kullanılıyor; gerçek
              AdMob birim kimliği alınınca `BannerReklam.tsx`'teki
              `BANNER_UNIT_ID` güncellenmeli (bkz. o dosyadaki uyarı). */}
          <BannerReklam style={styles.reklamAlani} />

          {/* ============ GÜNÜN AYETİ ============ */}
          <View style={styles.ayetKart}>
            <View style={styles.ayetBaslikSatir}>
              <Icon name="ayet" size={16} color={colors.copperLight} />
              <Text style={styles.ayetBaslik}>{t('gununAyeti')}</Text>
            </View>
            <Text style={styles.ayetMetin}>{dil === 'en' ? ayet.mealEn : ayet.meal}</Text>
            <Text style={styles.ayetKaynak}>{dil === 'en' ? ayet.kaynakEn : ayet.kaynak}</Text>
          </View>

          {/* ── İSLAM TARİHİNDE BUGÜN ──
              Madde 3: kart artık HER GÜN görünüyor. Tam eşleşme varsa
              "İslam Tarihinde Bugün" başlığıyla; yoksa takvimdeki en yakın
              olay "İslam Tarihinden" başlığı + göreceli tarih ibaresiyle
              gösteriliyor — böylece hiçbir gün kart kaybolmuyor ama hiçbir
              olay da gerçek tarihi dışında "bugün" diye sunulmuyor. */}
          <View style={styles.tarihKart}>
            <View style={styles.tarihBaslikSatir}>
              <Icon name="imsakiye" size={17} color={colors.copper} />
              <Text style={styles.tarihBaslik}>
                {tarihOlayi.bugunMu ? t('islamTarihindeBugun') : t('islamTarihinden')}
              </Text>
            </View>
            <View style={styles.tarihIcerik}>
              <Text style={styles.tarihYil}>{tarihOlayi.olay.yil}</Text>
              <View style={styles.tarihMetin}>
                <Text style={styles.tarihOlayBaslik}>{dil === 'en' ? tarihOlayi.olay.baslikEn : tarihOlayi.olay.baslik}</Text>
                <Text style={styles.tarihAciklama}>{dil === 'en' ? tarihOlayi.olay.aciklamaEn : tarihOlayi.olay.aciklama}</Text>
                {!tarihOlayi.bugunMu && (
                  <Text style={styles.tarihGoreceli}>
                    {tarihOlayi.gunFarki > 0
                      ? t('yilDonumineGunVar', tarihOlayi.gunFarki)
                      : t('yilDonumuGunOnceydi', Math.abs(tarihOlayi.gunFarki))}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // -------------------------------------------------------------------
  // KABUK: içerik + kalıcı alt navigasyon
  // -------------------------------------------------------------------
  return (
    <View style={styles.kabuk}>
      <View style={styles.icerikAlani}>{sekmeIcerigi}</View>

      {/* ============ ALT NAVİGASYON — "Zümrüt Şerit" (Varyant C) ============
          Kullanıcıya 3 varyant sunuldu (Yumuşak Cam / Yükselen Nokta /
          Zümrüt Şerit), Zümrüt Şerit onaylandı: aktif sekmenin üstünde ince
          bir bakır (copperLight) şerit + dolgulu pil daralıp dikdörtgene
          dönüşüyor. Şerit, her sekmenin kendi genişliğine eşit bölünmüş bir
          üst satırda, yalnızca aktif sekmenin payında görünür oluyor. */}
      <View style={[styles.altNavKap, { paddingBottom: insets.bottom + spacing.xs }]}>
        <View style={styles.serit}>
          {SEKMELER.map((s) => (
            <View key={s.id} style={styles.seritPay}>
              {s.id === tab && <View style={styles.seritCizgi} />}
            </View>
          ))}
        </View>

        <View style={styles.altNav}>
          {SEKMELER.map((s) => {
            const aktif = s.id === tab;
            return (
              <TouchableOpacity
                key={s.id}
                style={styles.navOge}
                onPress={() => setTab(s.id)}
                activeOpacity={0.75}
                accessibilityRole="tab"
                accessibilityState={{ selected: aktif }}
                accessibilityLabel={t(s.adAnahtari)}
              >
                <View style={[styles.navIkonKap, aktif && styles.navIkonKapAktif]}>
                  {/* Aktif sekmede ikon dolgulu dikdörtgen üzerinde
                      durduğu için gövde rengi koyuya çevriliyor; pasiflerde
                      koyu navigasyon zemininde okunacak açık tonlar
                      kullanılıyor. "Keşfet" ikonunun tıklanınca bozuk
                      görünme sorununun kök nedeni DoluIkon.tsx içindeydi
                      (bkz. o dosyadaki not) ve orada kalıcı çözüldü. */}
                  <DoluIkon
                    ad={s.ikon}
                    boyut={24}
                    govde={aktif ? colors.primaryDeep : colors.textOnDarkMuted}
                    vurgu={aktif ? colors.primaryDark : colors.copperLight}
                    zemin={aktif ? colors.copperLight : colors.primaryDark}
                  />
                </View>
                <Text style={[styles.navYazi, aktif && styles.navYaziAktif]} numberOfLines={1}>
                  {t(s.adAnahtari)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kabuk: { flex: 1, backgroundColor: colors.cream },
  icerikAlani: { flex: 1 },

  anaAkis: { flex: 1, backgroundColor: colors.cream },
  anaIcerik: { paddingBottom: spacing.lg },

  // ---------- ÜST ŞERİT (artık krem değil, temanın ana rengi) ----------
  // Not: ustSerit + hero araya boşluk koymadan bitişik render edilip TEK
  // koyu blok gibi görünüyor (bkz. hero'nun üstündeki yorum). Bu yüzden
  // köşe yuvarlama ustSerit'te değil, bloğun GERÇEKTEN bittiği yer olan
  // hero'nun altında uygulanıyor — bkz. aşağıdaki `hero` stili.
  ustSerit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  konumBlok: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2, flex: 1 },
  // Koyu zeminde artık dolgulu değil, ince kenarlıklı yarı saydam bir
  // "cam" daire — parlak dolgu koyu zeminde aşırı sert dururdu.
  konumIkonKap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  konumMetin: { flex: 1 },
  konumIl: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnDark,
    lineHeight: lineHeight.body,
  },
  konumTarih: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.micro,
    color: colors.textOnDarkMuted,
    lineHeight: lineHeight.micro,
  },
  bildirimBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },

  // ---------- HERO (koyu kart — alt köşeler kavisli) ----------
  // Madde 1 (ısrarla tekrar edilen şikayet): dikey boşluklar burada da
  // sıkıştırıldı — hero, Kıble/Tesbih/Esmâ/Kaza satırının scroll'suz
  // görünmesini engelleyen en büyük tek bloktu.
  // Madde 2 (bu tur): kullanıcı üst yeşil bloğun tamamen kare/köşeli
  // durmasından rahatsız oldu — "diğer bütün sayfalardaki gibi" alt sağ/sol
  // köşelerin kavisli olmasını istedi. `ustSerit` + `hero` görsel olarak
  // TEK blok okunduğu için (aralarında boşluk yok), yuvarlama bloğun asıl
  // bittiği yer olan hero'nun ALT köşelerine uygulandı — ScreenHeader'daki
  // (`borderBottomLeftRadius`/`borderBottomRightRadius: radius.lg`) ile
  // birebir aynı değer, uygulama genelinde tutarlı bir "alt köşe kavisi"
  // dili oluşsun diye.
  hero: {
    backgroundColor: colors.primary,
    overflow: 'hidden',
    paddingVertical: spacing.xs + 2,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  heroIc: { paddingHorizontal: spacing.lg },

  eskiKonumSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  siradakiKap: { marginTop: 2 },
  siradakiEtiket: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.tiny,
    color: colors.copperLight,
    letterSpacing: 1.4,
  },
  // İkon artık "Akşam" vakit adının hemen solunda, aynı satırda.
  siradakiAdSatir: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  // DÜZELTME (2. tur): vakit adı ve saat AYNI font ailesi (displaySemibold),
  // AYNI fontSize VE AYNI lineHeight kullanıyor — sadece fontSize eşitlemek
  // yetmiyordu, satır yüksekliği farklı kaldığı sürece taban çizgisi yine
  // kayabiliyordu. `includeFontPadding: false` (Android) fontun kendi iç
  // boşluğundan kaynaklanan görünmez kaymayı da ortadan kaldırıyor.
  siradakiAd: {
    fontFamily: typography.displaySemibold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.white,
    includeFontPadding: false,
  },
  siradakiSaat: {
    fontFamily: typography.displaySemibold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.copperLight,
    includeFontPadding: false,
  },
  // DÜZELTME (2. tur): "KALAN SÜRE" etiketi ile geri sayım artık İKİSİ DE
  // `displaySemibold` (önceden etiket Manrope/bodyBold, sayaç Cairo/
  // displayFamily kullanıyordu — aynı fontSize'da bile farklı font ailesi
  // göze belirgin boyut farkı gibi görünüyordu). Aynı lineHeight ile de
  // taban çizgisi kayması engellendi.
  kalanSureSatir: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  kalanSureEtiket: {
    fontFamily: typography.displaySemibold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.copperLight,
    letterSpacing: 0.4,
    includeFontPadding: false,
  },
  geriSayim: {
    fontFamily: typography.displaySemibold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.white,
    letterSpacing: 0.6,
    includeFontPadding: false,
  },

  ilerlemeRay: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(253,250,241,0.22)',
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  // Koyu hero üzerinde dolgu; metin taşımadığı için en canlı ton kullanılabilir.
  // Hero zemini `primary`; dolgunun ondan net ayrışması için bir basamak
  // daha parlak olan primaryGlow kullanılıyor (primaryBright 2.67'de kalıyordu).
  ilerlemeDolu: { height: 5, borderRadius: 3, backgroundColor: colors.primaryGlow },
  ilerlemeAltSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  // Şimdiki/sonraki vakit yazısı da aynı sebeple textOnDarkMuted'dan
  // copperLight'a taşındı — hero zemininde her palette karşı test edilmiş,
  // belirgin kalan tek sıcak ton bu.
  ilerlemeUc: { fontFamily: typography.bodyBold, fontSize: fontSize.tiny, color: colors.copperLight },

  // ---------- GÖVDE ----------
  govde: { paddingHorizontal: spacing.md, marginTop: spacing.xs },

  cipSatir: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs, flexWrap: 'wrap' },
  kaynakCip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kaynakCipYazi: { fontFamily: typography.bodyBold, fontSize: fontSize.tiny, color: colors.textOnLight },
  seriCip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.copperSoft,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#EBD5BE',
  },
  seriCipYazi: { fontFamily: typography.bodyBold, fontSize: fontSize.tiny, color: colors.copper },

  bilgiSerit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.creamDeep,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  bilgiSeritYazi: {
    flex: 1,
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.small,
    color: colors.textMuted,
    lineHeight: lineHeight.small,
  },
  uyariSerit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  uyariSeritYazi: { flex: 1, fontFamily: typography.bodyBold, fontSize: fontSize.small, color: colors.white },
  iftarSerit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.copperLight,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  iftarSeritYazi: { flex: 1, fontFamily: typography.bodyBold, fontSize: fontSize.small, color: colors.primaryDeep },

  // ---------- VAKİT LİSTESİ ----------
  // Madde 1 (bu tur, tekrarlanan şikayet): Yatsı satırı hâlâ tam
  // sığmıyordu — özel gün kartı eklenince liste bir miktar daha aşağı
  // kaymıştı. Satır dikey iç boşluğu 4dp'den 3dp'ye indirildi, satırlar
  // arası boşluk 3dp'den 2dp'ye indirildi (7 satırda toplam ~8dp daha
  // kazanılıyor). Yazı boyu YİNE küçültülmedi — okunabilirlik kuralı
  // korunuyor, kazanım yalnızca boşluklardan geliyor.
  vakitListe: { gap: 2 },
  vakitSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs - 1,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vakitSatirAktif: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  isaretBosluk: { width: 20 },
  vakitIkonKap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vakitIkonKapAktif: { backgroundColor: colors.primaryBright },
  vakitAd: { flex: 1, fontFamily: typography.bodyBold, fontSize: fontSize.body, color: colors.textOnLight },
  vakitAdAktif: { color: colors.textOnDark },
  simdiRozet: {
    backgroundColor: colors.copperBright,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  simdiRozetYazi: { fontFamily: typography.bodyBold, fontSize: fontSize.micro, color: colors.primaryDeep },
  vakitSaat: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.primaryDark,
    minWidth: 52,
    textAlign: 'right',
  },
  vakitSaatAktif: { color: colors.primaryGlow },
  zilBtn: { width: 26, alignItems: 'center' },

  // ---------- HIZLI ARAÇLAR ----------
  hizliKart: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs + 2,
    marginTop: spacing.xs + 2,
    ...elevation.card,
  },
  hizliOge: { flex: 1, alignItems: 'center', gap: 3 },
  hizliIkonKap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hizliAd: { fontFamily: typography.bodyBold, fontSize: fontSize.tiny, color: colors.textOnLight },
  hizliRozet: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: colors.copper,
    borderRadius: radius.pill,
    minWidth: 19,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  hizliRozetYazi: { fontFamily: typography.bodyBold, fontSize: 9, color: colors.white },
  hizliNokta: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.copperVivid,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  // ---------- REKLAM ALANI ----------
  // Artık gerçek `BannerReklam` bileşenine geçirilen konum stili — yükseklik
  // artık BannerReklam'ın kendi minHeight'inden geliyor, burada yalnızca
  // üstteki boşluk (marginTop) kalıyor.
  reklamAlani: { marginTop: spacing.sm },

  // ---------- GÜNÜN AYETİ ----------
  ayetKart: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  ayetBaslikSatir: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  ayetBaslik: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.tiny,
    color: colors.copperLight,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  ayetMetin: {
    fontFamily: typography.displaySemibold,
    fontSize: fontSize.bodyLg,
    color: colors.textOnDark,
    lineHeight: 28,
    marginTop: spacing.sm,
  },
  ayetKaynak: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.small,
    color: colors.textOnDarkMuted,
    marginTop: spacing.sm,
  },

  // ---------- DİNİ GÜN ----------
  // Madde 1 (bu tur): özel gün/yaklaşan gün kartı, hero ile vakit listesi
  // ARASINA giriyor — yalnızca bu kart göründüğü günlerde Yatsı satırı
  // kesiliyordu. Dikey iç boşluk sm+2'ye indirildi (md idi); ikon/yazı
  // boyutu DEĞİŞMEDİ, yalnızca kartın çevresindeki boşluk azaldı.
  diniGunKart: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.xs + 2,
  },
  diniGunIc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  diniGunMetin: { flex: 1 },
  diniGunAd: {
    fontFamily: typography.displaySemibold,
    fontSize: fontSize.bodyLg,
    color: colors.textOnDark,
  },
  diniGunAciklama: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.tiny,
    color: colors.copperLight,
    marginTop: 1,
  },
  yaklasanSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.copperSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs + 2,
  },
  yaklasanYazi: {
    flex: 1,
    fontFamily: typography.bodyBold,
    fontSize: fontSize.small,
    color: colors.copper,
  },

  // ---------- İSLAM TARİHİNDE BUGÜN ----------
  tarihKart: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tarihBaslikSatir: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  tarihBaslik: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.tiny,
    color: colors.copper,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  tarihIcerik: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  tarihYil: {
    fontFamily: typography.displayFamily,
    fontSize: fontSize.title,
    color: colors.primaryDark,
    minWidth: 46,
  },
  tarihMetin: { flex: 1 },
  tarihOlayBaslik: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnLight,
    lineHeight: lineHeight.body,
  },
  tarihAciklama: {
    fontFamily: typography.bodyFamily,
    fontSize: fontSize.small,
    color: colors.textMuted,
    lineHeight: lineHeight.small,
    marginTop: 3,
  },
  tarihGoreceli: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.micro,
    color: colors.copper,
    marginTop: 4,
  },

  // ---------- ALT NAVİGASYON — "Zümrüt Şerit" (onaylanan Varyant C) ----------
  // 3 sunulan varyanttan (Yumuşak Cam / Yükselen Nokta / Zümrüt Şerit)
  // kullanıcının onayladığı: dolgulu pil daralıp DİKDÖRTGENE dönüşüyor,
  // aktif sekmenin üstünde ince bir bakır (copperLight) şerit beliriyor.
  altNavKap: { backgroundColor: colors.primaryDark },
  serit: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  seritPay: { flex: 1, alignItems: 'center' },
  seritCizgi: {
    width: '34%',
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: colors.copperLight,
  },
  altNav: {
    flexDirection: 'row',
    paddingTop: spacing.xs + 2,
    paddingHorizontal: spacing.xs,
  },
  navOge: { flex: 1, alignItems: 'center', gap: 4 },
  navIkonKap: {
    width: 58,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Dolgu artık primaryBright değil, copperLight'ın yumuşak/saydam bir
  // katmanı — DoluIkon'daki A1 çakışma düzeltmesiyle de uyumlu, çünkü
  // zemin artık primaryBright olmadığından o çakışma senaryosu hiç
  // oluşmuyor bile (bkz. DoluIkon.tsx'teki A1 notu).
  navIkonKapAktif: { backgroundColor: colors.copperLight },
  // Madde 5 (bu tur): alt navigasyon yazıları fontSize.micro (11) çok küçük
  // kalıyordu — fontSize.tiny (12.5) ile büyütüldü. En uzun etiket
  // ("İmsakiye") 58dp'lik navIkonKap genişliğinde bu boyutta hâlâ rahat
  // sığıyor, taşma riski yok.
  navYazi: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.tiny,
    color: colors.textOnDarkMuted,
  },
  navYaziAktif: { fontFamily: typography.bodyBold, color: colors.copperLight },
});
