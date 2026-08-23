// src/screens/HomeScreen.tsx
//
// UYGULAMA KABUĞU + ANA SAYFA
//
// Bu dosya iki işi birden yapar:
//
//   1) KABUK (shell): Alt navigasyondaki beş sekme (Ana Sayfa, İmsakiye,
//      Keşfet, Takip, Ayarlar) arasında geçişi yönetir ve alt navigasyonu
//      KALICI olarak ekranda tutar — Muslim Pro'daki gibi, sekme değişse de
//      alt çubuk yerinde kalır. Kıble/Tesbih/Kaza gibi araçlar ise tam ekran
//      açılır (alt çubuk gizlenir), çünkü bunlar bir "sekme" değil, bir
//      görevin içine girmektir.
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
import { colors, spacing, radius, typography, elevation } from '../theme';
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
import { scheduleVaktindeKil } from '../lib/vaktindeKilScheduler';
import { setupVaktindeKilCategory, registerVaktindeKilResponseListener } from '../lib/vaktindeKilActions';
import { scheduleReminders } from '../lib/remindersScheduler';
import { toHijri } from '../lib/hijri';
import { getKerahatInfo } from '../lib/kerahat';
import { takipEdilebilir, TakipVakti } from '../lib/ibadetTakibi';
import { getGununAyeti } from '../data/ayetler';

import Icon, { IconName, vakitIcon } from '../components/Icon';
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

/** Alt navigasyondaki kalıcı sekmeler. */
type Tab = 'home' | 'imsakiye' | 'kesfet' | 'takip' | 'settings';

/** Tam ekran açılan, alt navigasyonu gizleyen araç ekranları. */
type SubScreen =
  | null
  | 'location'
  | 'qibla'
  | 'kaza'
  | 'vaktindekil'
  | 'reminders'
  | 'tesbih'
  | 'esma';

const AY_ADLARI = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const SEKMELER: { id: Tab; ad: string; ikon: IconName }[] = [
  { id: 'home', ad: 'Ana Sayfa', ikon: 'anasayfa' },
  { id: 'imsakiye', ad: 'İmsakiye', ikon: 'imsakiye' },
  { id: 'kesfet', ad: 'Keşfet', ikon: 'kesfet' },
  { id: 'takip', ad: 'Takip', ikon: 'takip' },
  { id: 'settings', ad: 'Ayarlar', ikon: 'ayarlar' },
];

/** Ana Sayfa'daki dört hızlı araç — en sık kullanılanlar. */
const HIZLI_ARACLAR: { hedef: SubScreen; ad: string; ikon: IconName }[] = [
  { hedef: 'qibla', ad: 'Kıble', ikon: 'kible' },
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
    if (hedef === 'imsakiye' || hedef === 'takip' || hedef === 'settings') {
      setTab(hedef as Tab);
      return;
    }
    setSub(hedef as SubScreen);
  }, []);

  // -------------------------------------------------------------------
  // TAM EKRAN ARAÇLAR — alt navigasyon gizlenir
  // -------------------------------------------------------------------
  if (sub === 'location') return <LocationPickerScreen onDone={() => setSub(null)} />;
  if (sub === 'qibla') return <QiblaScreen onClose={() => setSub(null)} />;
  if (sub === 'kaza') return <KazaScreen onClose={() => setSub(null)} />;
  if (sub === 'vaktindekil') return <VaktindeKilScreen onClose={() => setSub(null)} />;
  if (sub === 'reminders') return <RemindersScreen onClose={() => setSub(null)} />;
  if (sub === 'tesbih') return <TesbihScreen onClose={() => setSub(null)} />;
  if (sub === 'esma') return <EsmaulHusnaScreen onClose={() => setSub(null)} />;

  // -------------------------------------------------------------------
  // SEKME İÇERİKLERİ
  // -------------------------------------------------------------------
  let sekmeIcerigi: React.ReactNode;

  if (tab === 'imsakiye') {
    sekmeIcerigi = <ImsakiyeScreen />;
  } else if (tab === 'kesfet') {
    sekmeIcerigi = <KesfetScreen onNavigate={kesfetYonlendir} />;
  } else if (tab === 'takip') {
    sekmeIcerigi = <TakipScreen />;
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
        <View style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
          <IslamicPattern color={colors.cream} opacity={0.07} tile={44} />

          <View style={styles.heroIc}>
            {/* Konum satırı */}
            <View style={styles.konumSatir}>
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

              <TouchableOpacity
                style={styles.konumOrta}
                onPress={() => setSub('location')}
                accessibilityRole="button"
                accessibilityLabel="Konumu değiştir"
              >
                <Icon name="konum" size={15} color={colors.copperLight} />
                <Text style={styles.konumYazi} numberOfLines={1}>
                  {location.il} · {location.ilce}
                </Text>
                <Icon name="asagi" size={13} color={colors.textOnDarkMuted} />
              </TouchableOpacity>

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

            {/* Tarih: miladi + hicri */}
            <Text style={styles.miladiTarih}>
              {now.getDate()} {AY_ADLARI[now.getMonth()]} {now.getFullYear()}
            </Text>
            <Text style={styles.hicriTarih}>
              {hijri.day} {hijri.month} {hijri.year}
            </Text>

            {/* Sıradaki vakit + geri sayım */}
            <View style={styles.siradakiKap}>
              <View style={styles.siradakiEtiketSatir}>
                <Icon name={vakitIcon(next.key)} size={15} color={colors.copperLight} />
                <Text style={styles.siradakiEtiket}>Sıradaki · {next.label}</Text>
              </View>
              <Text style={styles.geriSayim}>{geriSayimBicimle(kalanMs)}</Text>
              <Text style={styles.siradakiSaat}>{saatBicimle(next.date)}</Text>
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
                onPress={() => setTab('takip')}
                accessibilityRole="button"
                accessibilityLabel={`${seri} günlük seri. Takip ekranını aç`}
              >
                <Icon name="yildiz" size={12} color={colors.copper} />
                <Text style={styles.seriCipYazi}>{seri} günlük seri</Text>
              </TouchableOpacity>
            )}
          </View>

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
                      onPress={() => isaretiDegistir(v.key as TakipVakti)}
                      hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: kilindi }}
                      accessibilityLabel={`${v.label} namazını kıldım olarak işaretle`}
                    >
                      <Icon
                        name={kilindi ? 'onay' : 'daire'}
                        size={22}
                        color={kilindi ? colors.success : colors.borderStrong}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.isaretBosluk} />
                  )}

                  <View style={[styles.vakitIkonKap, suAnki && styles.vakitIkonKapAktif]}>
                    <Icon
                      name={vakitIcon(v.key)}
                      size={17}
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
                      accessibilityRole="switch"
                      accessibilityState={{ checked: !!bildirimAcik }}
                      accessibilityLabel={`${v.label} vakti bildirimi`}
                    >
                      <Icon
                        name={bildirimAcik ? 'bildirimAcik' : 'bildirimKapali'}
                        size={17}
                        color={bildirimAcik ? colors.copper : colors.textFaint}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.zilBtn} />
                  )}
                </View>
              );
            })}
          </View>

          {/* ============ HIZLI ARAÇLAR (Muslim Pro'daki dörtlü satır) ============ */}
          <View style={styles.hizliKart}>
            {HIZLI_ARACLAR.map((arac) => (
              <TouchableOpacity
                key={arac.ad}
                style={styles.hizliOge}
                onPress={() => setSub(arac.hedef)}
                accessibilityRole="button"
                accessibilityLabel={arac.ad}
              >
                <View style={styles.hizliIkonKap}>
                  <Icon name={arac.ikon} size={21} color={colors.primary} />
                  {arac.hedef === 'kaza' && kazaTotal > 0 && (
                    <View style={styles.hizliRozet}>
                      <Text style={styles.hizliRozetYazi}>
                        {kazaTotal > 99 ? '99+' : kazaTotal}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.hizliAd}>{arac.ad}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ============ GÜNÜN AYETİ ============ */}
          <View style={styles.ayetKart}>
            <View style={styles.ayetBaslikSatir}>
              <Icon name="ayet" size={16} color={colors.copperLight} />
              <Text style={styles.ayetBaslik}>Günün Ayeti</Text>
            </View>
            <Text style={styles.ayetMetin}>{ayet.meal}</Text>
            <Text style={styles.ayetKaynak}>{ayet.kaynak}</Text>
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

      <View style={[styles.altNav, { paddingBottom: insets.bottom + spacing.xs }]}>
        {SEKMELER.map((s) => {
          const aktif = s.id === tab;
          return (
            <TouchableOpacity
              key={s.id}
              style={styles.navOge}
              onPress={() => setTab(s.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: aktif }}
              accessibilityLabel={s.ad}
            >
              <View style={[styles.navIkonKap, aktif && styles.navIkonKapAktif]}>
                <Icon
                  name={s.ikon}
                  size={20}
                  color={aktif ? colors.primaryDeep : colors.textOnDarkMuted}
                />
                {s.id === 'takip' && kazaTotal > 0 && (
                  <View style={styles.navNokta} />
                )}
              </View>
              <Text style={[styles.navYazi, aktif && styles.navYaziAktif]} numberOfLines={1}>
                {s.ad}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kabuk: { flex: 1, backgroundColor: colors.cream },
  icerikAlani: { flex: 1 },

  anaAkis: { flex: 1, backgroundColor: colors.cream },
  anaIcerik: { paddingBottom: spacing.lg },

  // ---------- HERO ----------
  hero: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
    paddingBottom: spacing.lg,
  },
  heroIc: { paddingHorizontal: spacing.lg },

  konumSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  konumOrta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    flexShrink: 1,
  },
  konumYazi: {
    fontFamily: typography.bodyBold,
    fontSize: 14,
    color: colors.textOnDark,
    flexShrink: 1,
  },

  miladiTarih: {
    fontFamily: typography.bodyMedium,
    fontSize: 12.5,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  hicriTarih: {
    fontFamily: typography.bodyMedium,
    fontSize: 11.5,
    color: colors.copperLight,
    textAlign: 'center',
    marginTop: 1,
  },

  siradakiKap: { alignItems: 'center', marginTop: spacing.md },
  siradakiEtiketSatir: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  siradakiEtiket: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.copperLight,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  geriSayim: {
    fontFamily: typography.displayFamily,
    fontSize: 46,
    color: colors.white,
    lineHeight: 58,
    marginTop: spacing.xs,
  },
  siradakiSaat: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.textOnDarkMuted,
    marginTop: -spacing.xs,
  },

  ilerlemeRay: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(253,250,241,0.22)',
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  // Koyu hero üzerinde dolgu; metin taşımadığı için en canlı ton kullanılabilir.
  // Hero zemini `primary`; dolgunun ondan net ayrışması için bir basamak
  // daha parlak olan primaryGlow kullanılıyor (primaryBright 2.67'de kalıyordu).
  ilerlemeDolu: { height: 4, borderRadius: 2, backgroundColor: colors.primaryGlow },
  ilerlemeAltSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  ilerlemeUc: { fontFamily: typography.bodyMedium, fontSize: 10.5, color: colors.textOnDarkMuted },

  // ---------- GÖVDE ----------
  govde: { paddingHorizontal: spacing.md, marginTop: spacing.md },

  cipSatir: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, flexWrap: 'wrap' },
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
  kaynakCipYazi: { fontFamily: typography.bodyMedium, fontSize: 11, color: colors.textOnLight },
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
  seriCipYazi: { fontFamily: typography.bodyBold, fontSize: 11, color: colors.copper },

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
    fontSize: 11.5,
    color: colors.textMuted,
    lineHeight: 16,
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
  uyariSeritYazi: { flex: 1, fontFamily: typography.bodyBold, fontSize: 12.5, color: colors.white },
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
  iftarSeritYazi: { flex: 1, fontFamily: typography.bodyBold, fontSize: 12.5, color: colors.primaryDeep },

  // ---------- VAKİT LİSTESİ ----------
  vakitListe: { gap: 6 },
  vakitSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 3,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vakitSatirAktif: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  isaretBosluk: { width: 22 },
  vakitIkonKap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vakitIkonKapAktif: { backgroundColor: colors.primaryBright },
  vakitAd: { flex: 1, fontFamily: typography.bodyBold, fontSize: 14.5, color: colors.textOnLight },
  vakitAdAktif: { color: colors.textOnDark },
  simdiRozet: {
    backgroundColor: colors.copperBright,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  simdiRozetYazi: { fontFamily: typography.bodyBold, fontSize: 9.5, color: colors.primaryDeep },
  vakitSaat: {
    fontFamily: typography.bodyBold,
    fontSize: 15.5,
    color: colors.primaryDark,
    minWidth: 48,
    textAlign: 'right',
  },
  vakitSaatAktif: { color: colors.primaryGlow },
  zilBtn: { width: 24, alignItems: 'center' },

  // ---------- HIZLI ARAÇLAR ----------
  hizliKart: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    ...elevation.card,
  },
  hizliOge: { flex: 1, alignItems: 'center', gap: spacing.xs + 2 },
  hizliIkonKap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hizliAd: { fontFamily: typography.bodyBold, fontSize: 11.5, color: colors.textOnLight },
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

  // ---------- GÜNÜN AYETİ ----------
  ayetKart: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  ayetBaslikSatir: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  ayetBaslik: {
    fontFamily: typography.bodyBold,
    fontSize: 11,
    color: colors.copperLight,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  ayetMetin: {
    fontFamily: typography.displaySemibold,
    fontSize: 15,
    color: colors.textOnDark,
    lineHeight: 26,
    marginTop: spacing.sm,
  },
  ayetKaynak: {
    fontFamily: typography.bodyMedium,
    fontSize: 11.5,
    color: colors.textOnDarkMuted,
    marginTop: spacing.sm,
  },

  // ---------- ALT NAVİGASYON ----------
  altNav: {
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  navOge: { flex: 1, alignItems: 'center', gap: 3 },
  navIkonKap: {
    width: 44,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIkonKapAktif: { backgroundColor: colors.primaryBright },
  navYazi: { fontFamily: typography.bodyMedium, fontSize: 9.5, color: colors.textOnDarkMuted },
  navYaziAktif: { fontFamily: typography.bodyBold, color: colors.copperLight },
  navNokta: {
    position: 'absolute',
    top: 3,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
  },
});
