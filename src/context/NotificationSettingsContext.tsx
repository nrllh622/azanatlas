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
    sabah: { soundId: 'essalatu_hayrun' },
    ogle: { soundId: 'uyandirma3' },
    ikindi: { soundId: 'uyandirma3' },
    aksam: { soundId: 'uyandirma3' },
    yatsi: { soundId: 'uyandirma3' },
  },
};

interface Ctx {
  settings: NotificationSettings;
  setPreAlert: (key: PreAlertVakitKey, patch: Partial<PreAlertSetting>) => void;
  setOnTimeSound: (key: OnTimeVakitKey, soundId: string) => void;
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

  const setOnTimeSound = (key: OnTimeVakitKey, soundId: string) => {
    setSettings((prev) => ({
      ...prev,
      onTimeAlerts: { ...prev.onTimeAlerts, [key]: { soundId } },
    }));
  };

  return (
    <NotificationSettingsContext.Provider value={{ settings, setPreAlert, setOnTimeSound }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
}

export function useNotificationSettings() {
  const ctx = useContext(NotificationSettingsContext);
  if (!ctx) throw new Error('useNotificationSettings, NotificationSettingsProvider içinde kullanılmalı');
  return ctx;
}
