// src/context/VaktindeKilContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type VaktindeKilSound = 'bip' | 'dong';

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
  const [enabled, setEnabled] = useState(true);
  const [firstDelayMinutes, setFirstDelayMinutes] = useState(20);
  const [repeatIntervalMinutes, setRepeatIntervalMinutes] = useState(10);
  const [sound, setSound] = useState<VaktindeKilSound>('bip');

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
