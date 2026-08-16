// src/screens/LocationPickerScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { colors, spacing, radius, typography } from '../theme';
import { TURKEY_PROVINCES, Province } from '../data/turkeyLocations';
import { useLocationContext } from '../context/LocationContext';

interface Props {
  onDone: () => void;
}

const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
  'İstanbul': { lat: 41.0082, lng: 28.9784 },
  'Ankara': { lat: 39.9334, lng: 32.8597 },
  'İzmir': { lat: 38.4237, lng: 27.1428 },
};

type Mode = 'list' | 'province' | 'district';

export default function LocationPickerScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const { locations, activeId, setActiveId, addLocation, removeLocation } = useLocationContext();
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
        il: place?.region || place?.city || 'GPS Konumu',
        ilce: place?.subregion || place?.district || place?.city || '',
        countryCode: place?.isoCountryCode || 'TR',
        isGps: true,
      });
      onDone();
    } catch (e) {
      // sessizce yut — kullanıcı tekrar deneyebilir
    } finally {
      setGpsLoading(false);
    }
  };

  if (mode === 'list') {
    return (
      <View style={[styles.safeArea, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.header}>Şehri Değiştir</Text>
        <FlatList
          style={styles.list}
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, item.id === activeId && styles.rowActive]}
              onPress={() => {
                setActiveId(item.id);
                onDone();
              }}
            >
              <Text style={styles.rowText}>
                {item.isGps ? '📍 ' : ''}
                {item.il} · {item.ilce}
              </Text>
              {locations.length > 1 && (
                <TouchableOpacity onPress={() => removeLocation(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.deleteText}>Sil</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={useGps} disabled={gpsLoading}>
            <Text style={styles.actionBtnText}>{gpsLoading ? 'Konum alınıyor…' : '📍 GPS ile Ekle'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setMode('province')}>
            <Text style={styles.actionBtnText}>+ İl/İlçe Seçerek Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDone} style={styles.closeBtn}>
            <Text style={styles.closeText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (mode === 'province') {
    return (
      <View style={[styles.safeArea, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => setMode('list')}>
          <Text style={styles.backText}>‹ Geri</Text>
        </TouchableOpacity>
        <Text style={styles.header}>İl Seç</Text>
        <FlatList
          style={styles.list}
          data={TURKEY_PROVINCES}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
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
    <View style={[styles.safeArea, { paddingTop: insets.top + spacing.md }]}>
      <TouchableOpacity onPress={() => setMode('province')}>
        <Text style={styles.backText}>‹ İllere dön</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{selectedProvince?.name} · İlçe Seç</Text>
      <FlatList
        style={styles.list}
        data={selectedProvince?.districts ?? []}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              const coords = PROVINCE_COORDS[selectedProvince!.name] || { lat: 39.9208, lng: 32.8541 };
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
  safeArea: { flex: 1, backgroundColor: colors.primary, paddingHorizontal: spacing.lg },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22, marginBottom: spacing.md },
  backText: { fontFamily: typography.bodyMedium, color: colors.gold, fontSize: 15, marginBottom: spacing.sm },
  list: { flex: 1 },
  footer: { paddingTop: spacing.sm },
  closeBtn: { alignItems: 'center', marginTop: spacing.sm, paddingVertical: spacing.sm },
  closeText: { fontFamily: typography.bodyBold, color: colors.gold, fontSize: 15 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(250,246,236,0.12)',
  },
  rowActive: { backgroundColor: 'rgba(201,162,39,0.15)' },
  rowText: { fontFamily: typography.bodyMedium, color: colors.textOnDark, fontSize: 17 },
  deleteText: { fontFamily: typography.bodyMedium, color: colors.danger, fontSize: 13 },
  actionBtn: { backgroundColor: colors.gold, borderRadius: radius.pill, paddingVertical: spacing.sm, alignItems: 'center', marginTop: spacing.sm },
  actionBtnText: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: 14 },
});
