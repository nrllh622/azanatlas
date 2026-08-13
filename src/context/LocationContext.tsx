// src/context/LocationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SelectedLocation {
  latitude: number;
  longitude: number;
  il: string;
  ilce: string;
  countryCode: string;
}

// Varsayılan: İstanbul · Beşiktaş — uygulama GPS izni istemeden bununla açılır
const DEFAULT_LOCATION: SelectedLocation = {
  latitude: 41.0422,
  longitude: 29.0083,
  il: 'İstanbul',
  ilce: 'Beşiktaş',
  countryCode: 'TR',
};

interface LocationContextValue {
  location: SelectedLocation;
  setLocation: (loc: SelectedLocation) => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<SelectedLocation>(DEFAULT_LOCATION);
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationContext, LocationProvider içinde kullanılmalı');
  return ctx;
}
