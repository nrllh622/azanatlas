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
    sabah: { enabled: true, soundId: 'essalatu_hayrun' },
    ogle: { enabled: true, soundId: 'uyandirma3' },
    ikindi: { enabled: true, soundId: 'uyandirma3' },
    aksam: { enabled: true, soundId: 'uyandirma3' },
    yatsi: { enabled: true, soundId: 'uyandirma3' },
  },
};

interface Ctx {
  settings: NotificationSettings;
  setPreAlert: (key: PreAlertVakitKey, patch: Partial<PreAlertSetting>) => void;
  setOnTime: (key: OnTimeVakitKey, patch: Partial<OnTimeSetting>) => void;
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

  return (
    <NotificationSettingsContext.Provider value={{ settings, setPreAlert, setOnTime }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
}

export function useNotificationSettings() {
  const ctx = useContext(NotificationSettingsContext);
  if (!ctx) throw new Error('useNotificationSettings, NotificationSettingsProvider içinde kullanılmalı');
  return ctx;
}
