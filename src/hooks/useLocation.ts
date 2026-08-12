// src/hooks/useLocation.ts
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  latitude: number;
  longitude: number;
  il: string;
  ilce: string;
  countryCode: string;
  loading: boolean;
  error: string | null;
}

const DEFAULT_LOCATION: LocationState = {
  latitude: 41.0082,
  longitude: 28.9784,
  il: 'İstanbul',
  ilce: 'Beşiktaş',
  countryCode: 'TR',
  loading: true,
  error: null,
};

export function useLocation() {
  const [state, setState] = useState<LocationState>(DEFAULT_LOCATION);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setState((s) => ({
            ...s,
            loading: false,
            error: 'Konum izni verilmedi, İstanbul varsayılan olarak kullanılıyor.',
          }));
          return;
        }
        const position = await Location.getCurrentPositionAsync({});
        const [place] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          il: place?.region || place?.city || 'Bilinmiyor',
          ilce: place?.subregion || place?.district || place?.city || '',
          countryCode: place?.isoCountryCode || 'TR',
          loading: false,
          error: null,
        });
      } catch (e) {
        setState((s) => ({
          ...s,
          loading: false,
          error: 'Konum alınamadı, İstanbul varsayılan olarak kullanılıyor.',
        }));
      }
    })();
  }, []);

  return state;
}
