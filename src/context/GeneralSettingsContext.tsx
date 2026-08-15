// src/context/GeneralSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Ctx {
  vibrationEnabled: boolean;
  faceDownSilenceEnabled: boolean;
  notificationBarWidgetEnabled: boolean;
  setVibrationEnabled: (v: boolean) => void;
  setFaceDownSilenceEnabled: (v: boolean) => void;
  setNotificationBarWidgetEnabled: (v: boolean) => void;
}

const GeneralSettingsContext = createContext<Ctx | undefined>(undefined);

export function GeneralSettingsProvider({ children }: { children: ReactNode }) {
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [faceDownSilenceEnabled, setFaceDownSilenceEnabled] = useState(false);
  const [notificationBarWidgetEnabled, setNotificationBarWidgetEnabled] = useState(false);

  return (
    <GeneralSettingsContext.Provider
      value={{
        vibrationEnabled,
        faceDownSilenceEnabled,
        notificationBarWidgetEnabled,
        setVibrationEnabled,
        setFaceDownSilenceEnabled,
        setNotificationBarWidgetEnabled,
      }}
    >
      {children}
    </GeneralSettingsContext.Provider>
  );
}

export function useGeneralSettings() {
  const ctx = useContext(GeneralSettingsContext);
  if (!ctx) throw new Error('useGeneralSettings, GeneralSettingsProvider içinde kullanılmalı');
  return ctx;
}
