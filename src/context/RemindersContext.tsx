// src/context/RemindersContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const STORAGE_KEY = 'azanatlas_reminders_v1';

export interface Reminder {
  id: string;
  title: string;
  date: string; // ISO string
  notificationId?: string;
}

interface Ctx {
  reminders: Reminder[];
  addReminder: (title: string, date: Date) => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
}

const RemindersContext = createContext<Ctx | undefined>(undefined);

export function RemindersProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setReminders(JSON.parse(raw));
    });
  }, []);

  const persist = async (next: Reminder[]) => {
    setReminders(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addReminder = async (title: string, date: Date) => {
    let notificationId: string | undefined;
    if (date.getTime() > Date.now()) {
      notificationId = await Notifications.scheduleNotificationAsync({
        content: { title: 'Hatırlatıcı', body: title, sound: 'default' },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
      });
    }
    const newReminder: Reminder = { id: `rem-${Date.now()}`, title, date: date.toISOString(), notificationId };
    await persist([...reminders, newReminder]);
  };

  const removeReminder = async (id: string) => {
    const target = reminders.find((r) => r.id === id);
    if (target?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(target.notificationId);
    }
    await persist(reminders.filter((r) => r.id !== id));
  };

  return (
    <RemindersContext.Provider value={{ reminders, addReminder, removeReminder }}>
      {children}
    </RemindersContext.Provider>
  );
}

export function useReminders() {
  const ctx = useContext(RemindersContext);
  if (!ctx) throw new Error('useReminders, RemindersProvider içinde kullanılmalı');
  return ctx;
}
