// src/context/VaktindeKilContext.tsx
//
// DÜZELTME (bu tur — madde 4): bu dosya AsyncStorage'a hiç yazmıyordu —
// "Vaktinde Kıl" tekrarlı uyarı ayarları uygulama kapatılıp açıldığında
// sıfırlanıyordu. Kök neden ve genel çözüm için `src/lib/ayarDeposu.ts`
// başındaki yorum.
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ayarYukle, ayarKaydet } from '../lib/ayarDeposu';

const STORAGE_KEY = 'azanatlas_vaktinde_kil_v1';

export type VaktindeKilSound = 'bip' | 'dong';

interface StoredSettings {
  enabled: boolean;
  firstDelayMinutes: number;
  repeatIntervalMinutes: number;
  sound: VaktindeKilSound;
}

const DEFAULT_SETTINGS: StoredSettings = {
  enabled: true,
  firstDelayMinutes: 20,
  repeatIntervalMinutes: 10,
  sound: 'bip',
};

interface Ctx {
  enabled: boolean;
  firstDelayMinutes: number;
  repeatIntervalMinutes: number;
  sound: VaktindeKilSound;
  setEnabled: (v: boolean) => void;
  setFirstDelayMinutes: (v: number) => void;
  setRepeatIntervalMinutes: (v: number) => void;
  setSound: (v: VaktindeKilSound) => void;
}

const VaktindeKilContext = createContext<Ctx | undefined>(undefined);

export function VaktindeKilProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(DEFAULT_SETTINGS.enabled);
  const [firstDelayMinutes, setFirstDelayMinutes] = useState(DEFAULT_SETTINGS.firstDelayMinutes);
  const [repeatIntervalMinutes, setRepeatIntervalMinutes] = useState(DEFAULT_SETTINGS.repeatIntervalMinutes);
  const [sound, setSound] = useState<VaktindeKilSound>(DEFAULT_SETTINGS.sound);

  useEffect(() => {
    ayarYukle(STORAGE_KEY, DEFAULT_SETTINGS).then((s) => {
      setEnabled(s.enabled);
      setFirstDelayMinutes(s.firstDelayMinutes);
      setRepeatIntervalMinutes(s.repeatIntervalMinutes);
      setSound(s.sound);
    });
  }, []);

  const hazirRef = useRef(false);
  useEffect(() => {
    if (!hazirRef.current) {
      hazirRef.current = true;
      return;
    }
    ayarKaydet(STORAGE_KEY, { enabled, firstDelayMinutes, repeatIntervalMinutes, sound } as StoredSettings);
  }, [enabled, firstDelayMinutes, repeatIntervalMinutes, sound]);

  return (
    <VaktindeKilContext.Provider
      value={{
        enabled,
        firstDelayMinutes,
        repeatIntervalMinutes,
        sound,
        setEnabled,
        setFirstDelayMinutes,
        setRepeatIntervalMinutes,
        setSound,
      }}
    >
      {children}
    </VaktindeKilContext.Provider>
  );
}

export function useVaktindeKil() {
  const ctx = useContext(VaktindeKilContext);
  if (!ctx) throw new Error('useVaktindeKil, VaktindeKilProvider içinde kullanılmalı');
  return ctx;
}
