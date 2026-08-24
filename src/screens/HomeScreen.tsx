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

import Icon, { IconName, vakitIcon } from '../components/Icon';
import DoluIkon, { DoluIkonAdi } from '../components/DoluIkon';
import IslamicPattern from '../components/IslamicPattern';

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

const AY_ADLARI = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const SEKMELER: { id: Tab; ad: string; ikon: DoluIkonAdi }[] = [
  { id: 'home', ad: 'Ana Sayfa', ikon: 'anasayfa' },
  { id: 'imsakiye', ad: 'İmsakiye', ikon: 'imsakiye' },
  { id: 'kesfet', ad: 'Keşfet', ikon: 'kesfet' },
  { id: 'qibla', ad: 'Kıble', ikon: 'kible' },
  { id: 'settings', ad: 'Ayarlar', ikon: 'ayarlar' },
];

/** Ana Sayfa'daki dört hızlı araç — en sık kullanılanlar.
 *  Madde 6: Kıble alt navigasyona taşındığı için burada Takip'e yer açıldı. */
const HIZLI_ARACLAR: { hedef: SubScreen; ad: string; ikon: DoluIkonAdi }[] = [
  { hedef: 'takip', ad: 'Takip', ikon: 'takip' },
  { hedef: 'tesbih', ad: 'Tesbih', ikon: 'tesbih' },
  { hedef: 'esma', ad: 'Esmâ', ikon: 'esma' },
  { hedef: 'kaza', ad: 'Kaza', ikon: 'kaza' },
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
      await configureAndroidChannels();
      await scheduleAllNotifications(vakitler, settings, kerahatMinutes, vibrationEnabled);
      if (vaktindeKil.enabled) {
        await scheduleVaktindeKil(
          current, next,
          vaktindeKil.firstDelayMinutes,
          vaktindeKil.repeatIntervalMinutes,
          vaktindeKil.sound,
          vibrationEnabled
        );
      }
      await scheduleReminders(
        location.latitude, location.longitude, location.countryCode,
        location.il, location.ilce, autoMethod, methodId, madhab, highLatRule,
        reminderSettings, vibrationEnabled
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.latitude, location.longitude, autoMethod, methodId, madhab, highLatRule,
    settings, kerahatMinutes, vibrationEnabled, vaktindeKil, reminderSettings,
    current.key, next.key,
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
            accessibilityLabel="Konumu değiştir"
          >
            <View style={styles.konumIkonKap}>
              <Icon name="konum" size={19} color={colors.copperLight} />
            </View>
            <View style={styles.konumMetin}>
              <Text style={styles.konumIl} numberOfLines={1}>
                {location.il}, {location.ilce}
              </Text>
              <Text style={styles.konumTarih} numberOfLines={1}>
                {now.getDate()} {AY_ADLARI[now.getMonth()]} · {hijri.day} {hijri.month} {hijri.year}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bildirimBtn}
            onPress={() => setTab('settings')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Bildirim ayarları"
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
                  accessibilityLabel="Önceki konum"
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
                  accessibilityLabel="Sonraki konum"
                >
                  <Icon name="sag" size={18} color={colors.copperLight} />
                </TouchableOpacity>
              )}
            </View>

            {/* Sıradaki vakit + geri sayım */}
            <View style={styles.siradakiKap}>
              <Text style={styles.siradakiEtiket}>SIRADAKİ VAKİT</Text>
              <View style={styles.siradakiAdSatir}>
                <Icon name={vakitIcon(next.key)} size={22} color={colors.copperLight} />
                <Text style={styles.siradakiAd}>{next.label}</Text>
                <Text style={styles.siradakiSaat}>{saatBicimle(next.date)}</Text>
              </View>
              {/* Madde 2 (bu tur): büyük sayacın ne olduğu etiketsiz belirsizdi
                  — artık "KALAN SÜRE" etiketiyle birlikte gösteriliyor. Sayaç
                  zaten her saniye `now` güncellendiği için otomatik azalıyor
                  (bkz. `kalanMs` hesaplaması) — bu yalnızca bir etiket ekliyor. */}
              <Text style={styles.kalanSureEtiket}>KALAN SÜRE</Text>
              <Text style={styles.geriSayim}>{geriSayimBicimle(kalanMs)}</Text>
            </View>

            {/* Mevcut vaktin ilerlemesi */}
            <View style={styles.ilerlemeRay}>
              <View style={[styles.ilerlemeDolu, { width: `${vakitIlerlemesi * 100}%` }]} />
            </View>
            <View style={styles.ilerlemeAltSatir}>
              <Text style={styles.ilerlemeUc}>
                {current.label} {saatBicimle(current.date)}
              </Text>
              <Text style={styles.ilerlemeUc}>
                {next.label} {saatBicimle(next.date)}
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
                {vakitKaynak === 'diyanet' ? 'Diyanet Takvimi' : 'Yerel hesaplama'}
              </Text>
            </View>

            {seri > 0 && (
              <TouchableOpacity
                style={styles.seriCip}
                onPress={() => setSub('takip')}
                accessibilityRole="button"
                accessibilityLabel={`${seri} günlük seri. Takip ekranını aç`}
              >
                <Icon name="yildiz" size={12} color={colors.copper} />
                <Text style={styles.seriCipYazi}>{seri} günlük seri</Text>
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
                {yaklasan.gun.ad}'a {yaklasan.kalanGun} gün kaldı
              </Text>
            </View>
          ) : null}

          {location.countryCode === 'TR' && vakitKaynak === 'yerel' && (
            <View style={styles.bilgiSerit}>
              <Icon name="bilgi" size={15} color={colors.textMuted} />
              <Text style={styles.bilgiSeritYazi}>
                Diyanet verisine ulaşılamadı, geçici olarak yerel hesaplama gösteriliyor.
              </Text>
            </View>
          )}

          {kerahat.active && (
            <View style={styles.uyariSerit}>
              <Icon name="uyari" size={15} color={colors.white} />
              <Text style={styles.uyariSeritYazi}>Mekruh vakti — {kerahat.reason}</Text>
            </View>
          )}

          {isRamazan && aksam && (
            <View style={styles.iftarSerit}>
              <Icon name="hilal" size={15} color={colors.primaryDeep} />
              <Text style={styles.iftarSeritYazi}>
                İftara kalan süre: {geriSayimBicimle(Math.max(0, aksam.date.getTime() - now.getTime()))}
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
                      accessibilityLabel={`${v.label} namazını kıldım olarak işaretle`}
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
                    {v.label}
                  </Text>

                  {suAnki && (
                    <View style={styles.simdiRozet}>
                      <Text style={styles.simdiRozetYazi}>Şimdi</Text>
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
                      accessibilityLabel={`${v.label} vakti bildirimi`}
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
                key={arac.ad}
                style={styles.hizliOge}
                onPress={() => setSub(arac.hedef)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={arac.ad}
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
                  {/* Bu nokta önceden alt navigasyondaki Takip ikonundaydı
                      (kazaTotal>0 iken küçük bir "bakılası bir şey var"
                      göstergesiydi). Takip alt navigasyondan kalktığı için
                      buraya, Takip hızlı-araç ikonuna taşındı. */}
                  {arac.hedef === 'takip' && kazaTotal > 0 && (
                    <View style={styles.hizliNokta} />
                  )}
                </View>
                <Text style={styles.hizliAd}>{arac.ad}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ============ REKLAM ALANI ============
              Banner reklam entegrasyonu (react-native-google-mobile-ads)
              henüz eklenmedi; bu, gerçek reklamın kaplayacağı sabit
              yüksekliği (standart banner 50dp) ayırarak yukarıdaki tüm
              içeriğin reklam eklendiğinde YER DEĞİŞTİRMEMESİNİ sağlıyor.
              Reklam kodu eklendiğinde bu View'in içi doldurulacak. */}
          <View style={styles.reklamAlani} />

          {/* ============ GÜNÜN AYETİ ============ */}
          <View style={styles.ayetKart}>
            <View style={styles.ayetBaslikSatir}>
              <Icon name="ayet" size={16} color={colors.copperLight} />
              <Text style={styles.ayetBaslik}>Günün Ayeti</Text>
            </View>
            <Text style={styles.ayetMetin}>{ayet.meal}</Text>
            <Text style={styles.ayetKaynak}>{ayet.kaynak}</Text>
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
                {tarihOlayi.bugunMu ? 'İslam Tarihinde Bugün' : 'İslam Tarihinden'}
              </Text>
            </View>
            <View style={styles.tarihIcerik}>
              <Text style={styles.tarihYil}>{tarihOlayi.olay.yil}</Text>
              <View style={styles.tarihMetin}>
                <Text style={styles.tarihOlayBaslik}>{tarihOlayi.olay.baslik}</Text>
                <Text style={styles.tarihAciklama}>{tarihOlayi.olay.aciklama}</Text>
                {!tarihOlayi.bugunMu && (
                  <Text style={styles.tarihGoreceli}>
                    {tarihOlayi.gunFarki > 0
                      ? `Yıl dönümüne ${tarihOlayi.gunFarki} gün var`
                      : `Yıl dönümü ${Math.abs(tarihOlayi.gunFarki)} gün önceydi`}
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
                accessibilityLabel={s.ad}
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
                  {s.ad}
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

  // ---------- HERO (düz koyu kart — kavis kaldırıldı) ----------
  // Madde 1 (ısrarla tekrar edilen şikayet): dikey boşluklar burada da
  // sıkıştırıldı — hero, Kıble/Tesbih/Esmâ/Kaza satırının scroll'suz
  // görünmesini engelleyen en büyük tek bloktu.
  hero: {
    backgroundColor: colors.primary,
    overflow: 'hidden',
    paddingVertical: spacing.xs + 2,
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
  siradakiAdSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  siradakiAd: {
    flex: 1,
    fontFamily: typography.displayFamily,
    fontSize: 22,
    color: colors.white,
    lineHeight: 30,
  },
  // Kullanıcı bu satırı iki pakettir "hâlâ küçük" diye tekrarladı. 26px
  // yetersiz kaldı — 32'ye çıkarıldı (vakit adı biraz küçültülerek satırın
  // taşması engellendi, iki metin artık daha net bir görsel hiyerarşi
  // kuruyor: isim ikincil, saat birincil vurgu). Renk copperLight'ta
  // kalıyor — her palette karşı ölçülen tek sıcak/parlak ton.
  siradakiSaat: {
    fontFamily: typography.displaySemibold,
    fontSize: 32,
    color: colors.copperLight,
  },
  kalanSureEtiket: {
    fontFamily: typography.bodyBold,
    fontSize: fontSize.micro,
    color: colors.copperLight,
    letterSpacing: 1.4,
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  geriSayim: {
    fontFamily: typography.displayFamily,
    fontSize: 38,
    color: colors.white,
    lineHeight: 46,
    marginTop: 0,
    letterSpacing: 1,
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
  // Satır aralığı ve dikey iç boşluk daha da sıkıştırıldı: yedi vaktin
  // TAMAMI (İmsak'tan Yatsı'ya) artı reklam alanı ve dört hızlı araç
  // scroll YAPILMADAN ilk ekranda görünsün diye. Yazı boyu küçültülmedi —
  // okunabilirlik korunuyor, kazanılan alan yalnızca boşluklardan geliyor.
  vakitListe: { gap: 3 },
  vakitSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
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
  // Standart banner reklam yüksekliği (50dp) + üst/alt boşluk kadar sabit
  // yer ayrılıyor; reklam kodu eklendiğinde içerik konumu değişmeyecek.
  reklamAlani: { height: 50, marginTop: spacing.sm },

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
  diniGunKart: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  diniGunIc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingVertical: spacing.md,
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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
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
  navYazi: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.micro,
    color: colors.textOnDarkMuted,
  },
  navYaziAktif: { fontFamily: typography.bodyBold, color: colors.copperLight },
});
