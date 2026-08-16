// src/context/LocationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SavedLocation {
  id: string;
  latitude: number;
  longitude: number;
  il: string;
  ilce: string;
  countryCode: string;
  isGps?: boolean;
}

interface Ctx {
  locations: SavedLocation[];
  activeId: string;
  location: SavedLocation; // aktif konum — mevcut ekranların çoğu bunu kullanıyor
  setActiveId: (id: string) => void;
  addLocation: (loc: Omit<SavedLocation, 'id'>) => string;
  removeLocation: (id: string) => void;
}

const DEFAULT_LOCATION: SavedLocation = {
  id: 'default-istanbul',
  latitude: 41.0422,
  longitude: 29.0083,
  il: 'İstanbul',
  ilce: 'Beşiktaş',
  countryCode: 'TR',
};

const LocationContext = createContext<Ctx | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<SavedLocation[]>([DEFAULT_LOCATION]);
  const [activeId, setActiveId] = useState<string>(DEFAULT_LOCATION.id);

  const addLocation = (loc: Omit<SavedLocation, 'id'>) => {
    const id = `loc-${Date.now()}`;
    setLocations((prev) => [...prev, { ...loc, id }]);
    setActiveId(id);
    return id;
  };

  const removeLocation = (id: string) => {
    setLocations((prev) => {
      const filtered = prev.filter((l) => l.id !== id);
      const finalList = filtered.length > 0 ? filtered : [DEFAULT_LOCATION];
      setActiveId((prevActive) => (prevActive === id ? finalList[0].id : prevActive));
      return finalList;
    });
  };

  const location = locations.find((l) => l.id === activeId) ?? locations[0] ?? DEFAULT_LOCATION;

  return (
    <LocationContext.Provider value={{ locations, activeId, location, setActiveId, addLocation, removeLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationContext, LocationProvider içinde kullanılmalı');
  return ctx;
}
