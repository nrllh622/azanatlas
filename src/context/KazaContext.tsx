// src/context/KazaContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadKazaCounts, saveKazaCounts, KazaCounts, KazaCategory } from '../lib/kazaStorage';

interface Ctx {
  counts: KazaCounts;
  totalCount: number;
  increment: (cat: KazaCategory) => void;
  decrement: (cat: KazaCategory) => void;
}

const KazaContext = createContext<Ctx | undefined>(undefined);

export function KazaProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<KazaCounts>({
    sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitr: 0, oruc: 0,
  });

  useEffect(() => {
    loadKazaCounts().then(setCounts);
  }, []);

  const update = (cat: KazaCategory, delta: number) => {
    setCounts((prev) => {
      const next = { ...prev, [cat]: Math.max(0, prev[cat] + delta) };
      saveKazaCounts(next);
      return next;
    });
  };

  const increment = (cat: KazaCategory) => update(cat, 1);
  const decrement = (cat: KazaCategory) => update(cat, -1);

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <KazaContext.Provider value={{ counts, totalCount, increment, decrement }}>
      {children}
    </KazaContext.Provider>
  );
}

export function useKaza() {
  const ctx = useContext(KazaContext);
  if (!ctx) throw new Error('useKaza, KazaProvider içinde kullanılmalı');
  return ctx;
}
