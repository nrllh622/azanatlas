// src/screens/LocationPickerScreen.tsx
//
// Madde 4 (devir dosyası — bu tur): bu ekran hâlâ kendi özel başlığını
// çiziyordu (backArrow/header metinleri), ScreenHeader/IslamicPattern
// kullanmıyordu — anasayfa dışındaki ekranlar arasında görsel tutarsızlık
// yaratıyordu. Şimdi Ayarlar/Tesbih/Kıble gibi ekranlarla aynı ortak
// başlık bileşenine ve token ölçeğine geçirildi.

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { colors, spacing, radius, typography, fontSize, lineHeight, elevation } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { TURKEY_PROVINCES, Province } from '../data/turkeyLocations';
import { DISTRICT_COORDS } from '../data/districtCoords';
import { useLocationContext } from '../context/LocationContext';
import { useCeviri } from '../i18n/DilContext';

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

type Mode = 'list' | 'province' | 'district';

export default function LocationPickerScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const { locations, activeId, setActiveId, addLocation, removeLocation } = useLocationContext();
  const { t } = useCeviri();
  const [mode, setMode] = useState<Mode>('list');
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const useGps = async () => {
    setGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsLoading(false);
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      addLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        il: place?.region || place?.city || t('gpsKonumu'),
        ilce: place?.subregion || place?.district || place?.city || '',
        countryCode: place?.isoCountryCode || 'TR',
        isGps: true,
      });
      onDone();
    } catch (e) {
      // sessizce yut
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
          <TouchableOpacity style={styles.actionBtn} onPress={useGps} disabled={gpsLoading} activeOpacity={0.85}>
            <View style={styles.actionBtnInner}>
              <Icon name="konum" size={16} color={colors.textOnDark} />
              <Text style={styles.actionBtnText}>{gpsLoading ? t('konumAliniyor') : t('gpsIleEkle')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnIkincil} onPress={() => setMode('province')} activeOpacity={0.75}>
            <Text style={styles.actionBtnIkincilText}>{t('ilIlceSecerekEkle')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (mode === 'province') {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title={t('ilSec')} icon="konum" onClose={() => setMode('list')} />
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
