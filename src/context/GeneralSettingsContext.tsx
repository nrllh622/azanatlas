// src/context/GeneralSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Ctx {
  vibrationEnabled: boolean;
  faceDownSilenceEnabled: boolean;
  notificationBarWidgetEnabled: boolean;
  // 7. tur — madde 7: "otomatik güncelleme" kullanıcı tercihi. `true` iken
  // güncelleme bulunduğunda Play Core'un FLEXIBLE (arka planda indir, kullanıcı
  // isterse hemen yeniden başlat) akışı otomatik başlatılır — kullanıcıya soru
  // sormadan. `false` iken (varsayılan) her zaman referans ekrandaki gibi bir
  // onay diyaloğu (Şimdi Güncelle / Sonra Hatırlat) gösterilir. Bkz.
  // `lib/guncellemeKontrol.ts` ve `components/GuncellemeUyarisi.tsx`.
  otomatikGuncellemeEnabled: boolean;
  setVibrationEnabled: (v: boolean) => void;
  setFaceDownSilenceEnabled: (v: boolean) => void;
  setNotificationBarWidgetEnabled: (v: boolean) => void;
  setOtomatikGuncellemeEnabled: (v: boolean) => void;
}

const GeneralSettingsContext = createContext<Ctx | undefined>(undefined);

export function GeneralSettingsProvider({ children }: { children: ReactNode }) {
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [faceDownSilenceEnabled, setFaceDownSilenceEnabled] = useState(false);
  const [notificationBarWidgetEnabled, setNotificationBarWidgetEnabled] = useState(false);
  const [otomatikGuncellemeEnabled, setOtomatikGuncellemeEnabled] = useState(false);

  return (
    <GeneralSettingsContext.Provider
      value={{
        vibrationEnabled,
        faceDownSilenceEnabled,
        notificationBarWidgetEnabled,
        otomatikGuncellemeEnabled,
        setVibrationEnabled,
        setFaceDownSilenceEnabled,
        setNotificationBarWidgetEnabled,
        setOtomatikGuncellemeEnabled,
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
