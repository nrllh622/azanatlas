// src/screens/LocationPickerScreen.tsx
//
// Madde 4 (devir dosyası — önceki tur): bu ekran hâlâ kendi özel başlığını
// çiziyordu (backArrow/header metinleri), ScreenHeader/IslamicPattern
// kullanmıyordu — anasayfa dışındaki ekranlar arasında görsel tutarsızlık
// yaratıyordu. Şimdi Ayarlar/Tesbih/Kıble gibi ekranlarla aynı ortak
// başlık bileşenine ve token ölçeğine geçirildi.
//
// YENİ (bu tur, madde 1) — GPS izin/konum tespiti akışı ortak
// `lib/gpsKonum.ts`'e taşındı (retry + son bilinen konuma düşme + görünür
// hata mesajı) — bkz. o dosyadaki ayrıntılı kök neden açıklaması.

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography, fontSize, lineHeight, elevation } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { TURKEY_PROVINCES, Province } from '../data/turkeyLocations';
import { DISTRICT_COORDS } from '../data/districtCoords';
import { GLOBAL_COUNTRIES, GlobalCountry } from '../data/globalLocations';
import { useLocationContext } from '../context/LocationContext';
import { useCalculationSettings } from '../context/CalculationSettingsContext';
import { useCeviri } from '../i18n/DilContext';
import { konumAl } from '../lib/gpsKonum';

interface Props {
  onDone: () => void;
}

// Gerçek ilçe koordinatı yoksa (henüz DISTRICT_COORDS'a eklenmemiş il), ilin
// yaklaşık merkezine düşer — bu 10 ilin il-geneli ortalama noktaları
const PROVINCE_FALLBACK: Record<string, { lat: number; lng: number }> = {
  'İstanbul': { lat: 41.0082, lng: 28.9784 },
  'Ankara': { lat: 39.9334, lng: 32.8597 },
  'İzmir': { lat: 38.4237, lng: 27.1428 },
  'Bursa': { lat: 40.1826, lng: 29.0669 },
  'Antalya': { lat: 36.8841, lng: 30.7056 },
  'Adana': { lat: 37.0, lng: 35.3213 },
  'Konya': { lat: 37.8667, lng: 32.4833 },
  'Gaziantep': { lat: 37.0662, lng: 37.3833 },
  'Kayseri': { lat: 38.7333, lng: 35.4833 },
  'Mersin': { lat: 36.8, lng: 34.6333 },
};
const DEFAULT_FALLBACK = { lat: 39.9208, lng: 32.8541 };

function getCoordsFor(il: string, ilce: string) {
  const exact = DISTRICT_COORDS[`${il}|${ilce}`];
  if (exact) return exact;
  return PROVINCE_FALLBACK[il] || DEFAULT_FALLBACK;
}

// Madde 9 (bu tur): Türkiye dışındaki Faz-1 ülkeleri için manuel ülke→şehir
// akışı eklendi. 'country' → 'city' yeni akış (globalLocations.ts); Türkiye
// seçilirse mevcut 'province' → 'district' akışına (il/ilçe düzeyi) yönlenir
// — o veri seti (TURKEY_PROVINCES/DISTRICT_COORDS) korunuyor, DEĞİŞMEDİ.
type Mode = 'list' | 'country' | 'province' | 'district' | 'city';

export default function LocationPickerScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const { locations, activeId, setActiveId, addLocation, removeLocation } = useLocationContext();
  const { setAutoMethod } = useCalculationSettings();
  const { t } = useCeviri();
  const [mode, setMode] = useState<Mode>('list');
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<GlobalCountry | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsHata, setGpsHata] = useState<string | null>(null);

  // Madde 1 (bu tur): asıl GPS/izin/retry mantığı ortak `lib/gpsKonum.ts`'e
  // taşındı — bkz. o dosyadaki kök neden açıklaması ("ikinci tıklamada
  // çalışıyor" hatasının asıl sebebi: native "Konumu Etkinleştir" diyaloğu
  // kapanır kapanmaz konum sağlayıcının henüz ilk fix'i verememesiydi, önceki
  // kodda bu tek denemede sessizce hataya düşüp kullanıcıya hiçbir şey
  // göstermiyordu). Burada artık: retry'lı deneme + başarısızlıkta GÖRÜNÜR
  // hata mesajı (`gpsHata`) gösteriliyor.
  const useGps = async () => {
    setGpsLoading(true);
    setGpsHata(null);
    try {
      const sonuc = await konumAl(t('gpsKonumu'));
      if (!sonuc.basarili) {
        if (sonuc.hataTuru === 'konumAlinamadi') {
          setGpsHata(t('konumAlinamadi'));
        }
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
      // Madde 5 (önceki tur): konum GPS ile değiştirildiğinde Ayarlar'daki
      // "Otomatik" hesaplama yöntemi de otomatik açılır — uygulama yeni
      // konumun ülkesine göre doğru yöntemi (ör. Türkiye→Diyanet) kendiliğinden
      // seçip tüm vakitleri buna göre yeniden hesaplar.
      setAutoMethod(true);
      onDone();
    } finally {
      setGpsLoading(false);
    }
  };

  if (mode === 'list') {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title={t('sehriDegistir')} icon="konum" onClose={onDone} />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listIcerik}
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, item.id === activeId && styles.rowActive]}
              onPress={() => {
                setActiveId(item.id);
                onDone();
              }}
              activeOpacity={0.75}
            >
              <View style={styles.rowTextWrap}>
                {item.isGps && <Icon name="konum" size={15} color={colors.copper} />}
                <Text style={styles.rowText}>
                  {item.il} · {item.ilce}
                </Text>
              </View>
              {locations.length > 1 && (
                <TouchableOpacity onPress={() => removeLocation(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.deleteText}>{t('sil')}</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          {gpsHata && (
            <View style={styles.gpsHataKutusu}>
              <Icon name="bilgi" size={14} color={colors.textMuted} />
              <Text style={styles.gpsHataYazi}>{gpsHata}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.actionBtn} onPress={useGps} disabled={gpsLoading} activeOpacity={0.85}>
            <View style={styles.actionBtnInner}>
              <Icon name="konum" size={16} color={colors.textOnDark} />
              <Text style={styles.actionBtnText}>{gpsLoading ? t('konumAliniyor') : t('gpsIleEkle')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnIkincil} onPress={() => setMode('country')} activeOpacity={0.75}>
            <Text style={styles.actionBtnIkincilText}>{t('konumEkle')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Madde 9 (bu tur): ülke seçimi — en üstte Türkiye (kendi il/ilçe akışına
  // yönlenir), altında Faz-1'in diğer hedef ülkeleri (globalLocations.ts).
  if (mode === 'country') {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title={t('ulkeSec')} icon="konum" onClose={() => setMode('list')} />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listIcerik}
          data={GLOBAL_COUNTRIES}
          keyExtractor={(item) => item.code}
          ListHeaderComponent={
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.75}
              onPress={() => setMode('province')}
            >
              <Text style={styles.rowText}>{t('turkiyeIlIlceSecerek')}</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.75}
              onPress={() => {
                setSelectedCountry(item);
                setMode('city');
              }}
            >
              <Text style={styles.rowText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Madde 9 (bu tur): Türkiye dışı ülkeler için düz şehir listesi — il/ilçe
  // hiyerarşisi yerine (bkz. globalLocations.ts'teki kapsam açıklaması).
  if (mode === 'city') {
    return (
      <View style={styles.wrap}>
        <ScreenHeader
          title={t('sehirSec')}
          subtitle={selectedCountry?.name}
          icon="konum"
          onClose={() => setMode('country')}
        />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listIcerik}
          data={selectedCountry?.cities ?? []}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.75}
              onPress={() => {
                addLocation({
                  latitude: item.lat,
                  longitude: item.lng,
                  il: selectedCountry!.name,
                  ilce: item.name,
                  countryCode: selectedCountry!.code,
                });
                // Madde 5 (bu tur): bkz. useGps içindeki aynı satırın yorumu.
                setAutoMethod(true);
                onDone();
              }}
            >
              <Text style={styles.rowText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  if (mode === 'province') {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title={t('ilSec')} icon="konum" onClose={() => setMode('country')} />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listIcerik}
          data={TURKEY_PROVINCES}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.75}
              onPress={() => {
                setSelectedProvince(item);
                setMode('district');
              }}
            >
              <Text style={styles.rowText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title={t('ilceSec')}
        subtitle={selectedProvince?.name}
        icon="konum"
        onClose={() => setMode('province')}
      />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listIcerik}
        data={selectedProvince?.districts ?? []}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.75}
            onPress={() => {
              const coords = getCoordsFor(selectedProvince!.name, item.name);
              addLocation({
                latitude: coords.lat,
                longitude: coords.lng,
                il: selectedProvince!.name,
                ilce: item.name,
                countryCode: 'TR',
              });
              // Madde 5 (bu tur): bkz. useGps içindeki aynı satırın yorumu.
              setAutoMethod(true);
              onDone();
            }}
          >
            <Text style={styles.rowText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  list: { flex: 1 },
  listIcerik: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm },
  gpsHataKutusu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.creamDeep,
    borderRadius: radius.md,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
  },
  gpsHataYazi: { flex: 1, fontFamily: typography.bodyMedium, color: colors.textMuted, fontSize: fontSize.small },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowActive: { borderColor: colors.primaryBright, borderWidth: 2 },
  rowTextWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  rowText: {
    fontFamily: typography.bodyBold,
    color: colors.textOnLight,
    fontSize: fontSize.bodyLg,
    lineHeight: lineHeight.bodyLg,
    flexShrink: 1,
  },
  deleteText: { fontFamily: typography.bodyBold, color: colors.danger, fontSize: fontSize.small },
  actionBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    ...elevation.card,
  },
  actionBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  actionBtnText: { fontFamily: typography.bodyBold, color: colors.textOnDark, fontSize: fontSize.body },
  actionBtnIkincil: {
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  actionBtnIkincilText: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: fontSize.body },
});
