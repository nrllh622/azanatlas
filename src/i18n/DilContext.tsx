// src/i18n/DilContext.tsx
//
// DİL SAĞLAYICISI (Provider) ve `useCeviri()` HOOK'U
//
// Ekranlar bu hook'u çağırıp dönen `t()` fonksiyonuyla metin alır:
//
//   const { t } = useCeviri();
//   <Text>{t('kapat')}</Text>
//
// Parametreli çeviriler (ör. "5 gün kaldı") sözlükte fonksiyon olarak
// tanımlı — `t()` hem düz string hem fonksiyon anahtarlarını otomatik
// ayırt eder:
//
//   <Text>{t('gunlukSeri', 5)}</Text>   // → "5 günlük seri" / "5-day streak"
//
// Dil, `AppGovde.tsx`'te en dış sağlayıcı olarak sarmalanmalı ki HER ekran
// erişebilsin (tema gibi App.tsx'te açılıştan önce okunmuyor — çünkü
// metinler StyleSheet'e kilitlenmiyor, normal bir React state yeterli).

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DilKodu, VARSAYILAN_DIL, SOZLUK, CeviriAnahtari, sesAdiDil } from './ceviriler';
import { kayitliDiliOku, diliKaydet } from './dilDeposu';

type VakitKodu = keyof typeof SOZLUK['tr']['vakit'];

interface Ctx {
  dil: DilKodu;
  hazir: boolean;
  diliDegistir: (yeni: DilKodu) => Promise<void>;
  t: (anahtar: CeviriAnahtari, ...args: any[]) => string;
  /** Vakit adları ("imsak"→"İmsak"/"Imsak") ayrı tutuluyor çünkü `t()`
      düz string/fonksiyon anahtarları için tasarlandı, `vakit` ise bir
      alt-nesne. */
  vakitAdi: (kod: VakitKodu) => string;
  /** Bildirim sesi kataloğundaki bir `id`'nin seçili dile göre adı — bkz.
      `sesAdiDil()`. `yedekEtiket` sözlükte karşılık yoksa (yeni eklenmiş,
      henüz çevrilmemiş bir ses) gösterilir. */
  sesAdi: (id: string, yedekEtiket: string) => string;
}

const DilContext = createContext<Ctx | undefined>(undefined);

export function DilProvider({ children }: { children: ReactNode }) {
  const [dil, setDil] = useState<DilKodu>(VARSAYILAN_DIL);
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    kayitliDiliOku().then((d) => {
      setDil(d);
      setHazir(true);
    });
  }, []);

  const diliDegistir = async (yeni: DilKodu) => {
    setDil(yeni);
    await diliKaydet(yeni);
  };

  const t = (anahtar: CeviriAnahtari, ...args: any[]): string => {
    const deger = (SOZLUK[dil] as any)[anahtar] ?? (SOZLUK[VARSAYILAN_DIL] as any)[anahtar];
    if (typeof deger === 'function') return deger(...args);
    if (typeof deger === 'string') return deger;
    // Anahtar sözlükte yoksa (unutulmuş bir çeviri) sessizce boş metin
    // yerine anahtarın kendisini göstermek hatayı fark etmeyi kolaylaştırır.
    return String(anahtar);
  };

  const vakitAdi = (kod: VakitKodu): string => {
    return SOZLUK[dil].vakit[kod] ?? SOZLUK[VARSAYILAN_DIL].vakit[kod] ?? String(kod);
  };

  const sesAdi = (id: string, yedekEtiket: string): string => sesAdiDil(dil, id, yedekEtiket);

  return (
    <DilContext.Provider value={{ dil, hazir, diliDegistir, t, vakitAdi, sesAdi }}>
      {children}
    </DilContext.Provider>
  );
}

export function useCeviri() {
  const ctx = useContext(DilContext);
  if (!ctx) throw new Error('useCeviri, DilProvider içinde kullanılmalı');
  return ctx;
}
