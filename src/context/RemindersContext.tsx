// src/context/RemindersContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ReminderTypeSetting {
  enabled: boolean;
  minutesBefore: number;
  soundId: string;
}

export interface OrucReminderSetting extends ReminderTypeSetting {
  remindDayBefore: boolean;
}

export interface RemindersSettings {
  sahur: ReminderTypeSetting;
  teheccut: ReminderTypeSetting;
  pazartesiPersembeOrucu: OrucReminderSetting;
  cumaNamazi: ReminderTypeSetting;
}

const DEFAULT_SETTINGS: RemindersSettings = {
  sahur: { enabled: false, minutesBefore: 90, soundId: 'melodi1' },
  teheccut: { enabled: false, minutesBefore: 120, soundId: 'melodi1' },
  pazartesiPersembeOrucu: { enabled: false, minutesBefore: 60, soundId: 'melodi1', remindDayBefore: false },
  cumaNamazi: { enabled: false, minutesBefore: 60, soundId: 'melodi1' },
};

interface Ctx {
  settings: RemindersSettings;
  setSahur: (patch: Partial<ReminderTypeSetting>) => void;
  setTeheccut: (patch: Partial<ReminderTypeSetting>) => void;
  setOruc: (patch: Partial<OrucReminderSetting>) => void;
  setCuma: (patch: Partial<ReminderTypeSetting>) => void;
}

const RemindersContext = createContext<Ctx | undefined>(undefined);

export function RemindersProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<RemindersSettings>(DEFAULT_SETTINGS);

  const setSahur = (patch: Partial<ReminderTypeSetting>) =>
    setSettings((prev) => ({ ...prev, sahur: { ...prev.sahur, ...patch } }));
  const setTeheccut = (patch: Partial<ReminderTypeSetting>) =>
    setSettings((prev) => ({ ...prev, teheccut: { ...prev.teheccut, ...patch } }));
  const setOruc = (patch: Partial<OrucReminderSetting>) =>
    setSettings((prev) => ({ ...prev, pazartesiPersembeOrucu: { ...prev.pazartesiPersembeOrucu, ...patch } }));
  const setCuma = (patch: Partial<ReminderTypeSetting>) =>
    setSettings((prev) => ({ ...prev, cumaNamazi: { ...prev.cumaNamazi, ...patch } }));

  return (
    <RemindersContext.Provider value={{ settings, setSahur, setTeheccut, setOruc, setCuma }}>
      {children}
    </RemindersContext.Provider>
  );
}

export function useReminders() {
  const ctx = useContext(RemindersContext);
  if (!ctx) throw new Error('useReminders, RemindersProvider içinde kullanılmalı');
  return ctx;
}
