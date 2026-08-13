// src/context/NotificationSettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VakitKey } from '../lib/prayerCalculator';

export type NotificationMode = 'none' | 'silent' | 'sound' | 'alarm' | 'adhan';

export interface VakitNotificationSetting {
  mode: NotificationMode;
}

export type NotificationSettingsMap = Record<VakitKey, VakitNotificationSetting>;

// Varsayılan: her vakitte sesli bildirim (kullanıcı istediği gibi değiştirebilir)
const DEFAULT_SETTINGS: NotificationSettingsMap = {
  imsak: { mode: 'adhan' },
  sabah: { mode: 'adhan' },
  gunes: { mode: 'silent' },
  ogle: { mode: 'adhan' },
  ikindi: { mode: 'adhan' },
  aksam: { mode: 'adhan' },
  yatsi: { mode: 'adhan' },
};

interface Ctx {
  settings: NotificationSettingsMap;
  setVakitMode: (key: VakitKey, mode: NotificationMode) => void;
}

const NotificationSettingsContext = createContext<Ctx | undefined>(undefined);

export function NotificationSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettingsMap>(DEFAULT_SETTINGS);

  const setVakitMode = (key: VakitKey, mode: NotificationMode) => {
    setSettings((prev) => ({ ...prev, [key]: { mode } }));
  };

  return (
    <NotificationSettingsContext.Provider value={{ settings, setVakitMode }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
}

export function useNotificationSettings() {
  const ctx = useContext(NotificationSettingsContext);
  if (!ctx) throw new Error('useNotificationSettings, NotificationSettingsProvider içinde kullanılmalı');
  return ctx;
}
