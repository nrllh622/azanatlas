// src/screens/LocationPickerScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { TURKEY_PROVINCES, Province } from '../data/turkeyLocations';
import { useLocationContext } from '../context/LocationContext';

interface Props {
  onDone: () => void;
}

// İl merkezlerinin yaklaşık koordinatları (ileride tam veri setiyle değiştirilecek) —
// şimdilik İstanbul koordinatı sabit, diğerleri için basit bir varsayılan kullanılıyor
const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
  'İstanbul': { lat: 41.0082, lng: 28.9784 },
  'Ankara': { lat: 39.9334, lng: 32.8597 },
  'İzmir': { lat: 38.4237, lng: 27.1428 },
};

export default function LocationPickerScreen({ onDone }: Props) {
  const { setLocation } = useLocationContext();
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);

  if (!selectedProvince) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.header}>İl Seç</Text>
        <FlatList
          data={TURKEY_PROVINCES}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => setSelectedProvince(item)}>
              <Text style={styles.rowText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity onPress={() => setSelectedProvince(null)}>
        <Text style={styles.backText}>‹ İllere dön</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{selectedProvince.name} · İlçe Seç</Text>
      <FlatList
        data={selectedProvince.districts}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              const coords = PROVINCE_COORDS[selectedProvince.name] || { lat: 39.9208, lng: 32.8541 };
              setLocation({
                latitude: coords.lat,
                longitude: coords.lng,
                il: selectedProvince.name,
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  header: { fontFamily: typography.displaySemibold, color: colors.textOnDark, fontSize: 22, marginBottom: spacing.md },
  backText: { fontFamily: typography.bodyMedium, color: colors.gold, fontSize: 15, marginBottom: spacing.sm },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(250,246,236,0.12)',
  },
  rowText: { fontFamily: typography.bodyMedium, color: colors.textOnDark, fontSize: 17 },
});
