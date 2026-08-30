// src/context/GeneralSettingsContext.tsx
//
// DÜZELTME (bu tur — madde 4): bu dosya AsyncStorage'a hiç yazmıyordu —
// "bildirim çubuğu widget" seçeneği dahil tüm genel ayarlar uygulama
// kapatılıp açıldığında sıfırlanıyordu. Kök neden ve genel çözüm için
// `src/lib/ayarDeposu.ts` başındaki yorum.
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ayarYukle, ayarKaydet } from '../lib/ayarDeposu';

const STORAGE_KEY = 'azanatlas_general_settings_v1';

interface StoredSettings {
  vibrationEnabled: boolean;
  faceDownSilenceEnabled: boolean;
  notificationBarWidgetEnabled: boolean;
  otomatikGuncellemeEnabled: boolean;
}

const DEFAULT_SETTINGS: StoredSettings = {
  vibrationEnabled: true,
  faceDownSilenceEnabled: false,
  notificationBarWidgetEnabled: false,
  otomatikGuncellemeEnabled: false,
};

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
  const [vibrationEnabled, setVibrationEnabled] = useState(DEFAULT_SETTINGS.vibrationEnabled);
  const [faceDownSilenceEnabled, setFaceDownSilenceEnabled] = useState(DEFAULT_SETTINGS.faceDownSilenceEnabled);
  const [notificationBarWidgetEnabled, setNotificationBarWidgetEnabled] = useState(DEFAULT_SETTINGS.notificationBarWidgetEnabled);
  const [otomatikGuncellemeEnabled, setOtomatikGuncellemeEnabled] = useState(DEFAULT_SETTINGS.otomatikGuncellemeEnabled);

  useEffect(() => {
    ayarYukle(STORAGE_KEY, DEFAULT_SETTINGS).then((s) => {
      setVibrationEnabled(s.vibrationEnabled);
      setFaceDownSilenceEnabled(s.faceDownSilenceEnabled);
      setNotificationBarWidgetEnabled(s.notificationBarWidgetEnabled);
      setOtomatikGuncellemeEnabled(s.otomatikGuncellemeEnabled);
    });
  }, []);

  const hazirRef = useRef(false);
  useEffect(() => {
    if (!hazirRef.current) {
      hazirRef.current = true;
      return;
    }
    ayarKaydet(STORAGE_KEY, {
      vibrationEnabled, faceDownSilenceEnabled, notificationBarWidgetEnabled, otomatikGuncellemeEnabled,
    } as StoredSettings);
  }, [vibrationEnabled, faceDownSilenceEnabled, notificationBarWidgetEnabled, otomatikGuncellemeEnabled]);

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
