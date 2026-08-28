// src/context/NotificationSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PreAlertVakitKey = 'imsak' | 'gunes' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi';
export type OnTimeVakitKey = 'sabah' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi';

export interface PreAlertSetting {
  enabled: boolean;
  minutesBefore: number;
  soundId: string;
}

export interface OnTimeSetting {
  enabled: boolean;
  soundId: string;
}

export interface NotificationSettings {
  preAlerts: Record<PreAlertVakitKey, PreAlertSetting>;
  onTimeAlerts: Record<OnTimeVakitKey, OnTimeSetting>;
  kerahatNotifyEnabled: boolean;
  ezanDuasiEnabled: boolean;
  sabahAtImsakVaktinde: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  preAlerts: {
    imsak: { enabled: true, minutesBefore: 45, soundId: 'melodi1' },
    gunes: { enabled: true, minutesBefore: 30, soundId: 'melodi1' },
    ogle: { enabled: true, minutesBefore: 45, soundId: 'melodi1' },
    ikindi: { enabled: true, minutesBefore: 45, soundId: 'melodi1' },
    aksam: { enabled: true, minutesBefore: 45, soundId: 'melodi1' },
    yatsi: { enabled: true, minutesBefore: 45, soundId: 'melodi1' },
  },
  onTimeAlerts: {
    // DÜZELTME (7. tur — madde 1): eski varsayılan `essalatu_hayrun` (sentez)
    // kaldırıldı, kullanıcının yüklediği gerçek ezan kaydına (`esselatu_hayrun_minen_nevm`)
    // güncellendi — Sabah vakti için anlam olarak en uygun olanı bu.
    sabah: { enabled: true, soundId: 'esselatu_hayrun_minen_nevm' },
    ogle: { enabled: true, soundId: 'uyandirma3' },
    ikindi: { enabled: true, soundId: 'uyandirma3' },
    aksam: { enabled: true, soundId: 'uyandirma3' },
    yatsi: { enabled: true, soundId: 'uyandirma3' },
  },
  kerahatNotifyEnabled: true,
  ezanDuasiEnabled: false,
  sabahAtImsakVaktinde: false,
};

interface Ctx {
  settings: NotificationSettings;
  setPreAlert: (key: PreAlertVakitKey, patch: Partial<PreAlertSetting>) => void;
  setOnTime: (key: OnTimeVakitKey, patch: Partial<OnTimeSetting>) => void;
  setFlag: (key: 'kerahatNotifyEnabled' | 'ezanDuasiEnabled' | 'sabahAtImsakVaktinde', value: boolean) => void;
}

const NotificationSettingsContext = createContext<Ctx | undefined>(undefined);

export function NotificationSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  const setPreAlert = (key: PreAlertVakitKey, patch: Partial<PreAlertSetting>) => {
    setSettings((prev) => ({
      ...prev,
      preAlerts: { ...prev.preAlerts, [key]: { ...prev.preAlerts[key], ...patch } },
    }));
  };

  const setOnTime = (key: OnTimeVakitKey, patch: Partial<OnTimeSetting>) => {
    setSettings((prev) => ({
      ...prev,
      onTimeAlerts: { ...prev.onTimeAlerts, [key]: { ...prev.onTimeAlerts[key], ...patch } },
    }));
  };

  const setFlag = (key: 'kerahatNotifyEnabled' | 'ezanDuasiEnabled' | 'sabahAtImsakVaktinde', value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <NotificationSettingsContext.Provider value={{ settings, setPreAlert, setOnTime, setFlag }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
}

export function useNotificationSettings() {
  const ctx = useContext(NotificationSettingsContext);
  if (!ctx) throw new Error('useNotificationSettings, NotificationSettingsProvider içinde kullanılmalı');
  return ctx;
}
