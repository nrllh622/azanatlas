// src/context/IbadetTakibiContext.tsx
//
// Günlük ibadet takibinin uygulama genelindeki durumu. Ana Sayfa'daki vakit
// satırlarındaki işaretler, Takip ekranındaki seri ve haftalık ızgara aynı
// kaynaktan beslenir.

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { AppState } from 'react-native';
import {
  TakipKayitlari,
  TakipVakti,
  kayitlariYukle,
  vaktiIsaretleDegistir,
  gununVakitleri,
  gunTamam,
  seriHesapla,
} from '../lib/ibadetTakibi';

interface Ctx {
  kayitlar: TakipKayitlari;
  /** Bugün kılınmış vakitler */
  bugunKilinanlar: TakipVakti[];
  /** Kesintisiz tam gün serisi */
  seri: number;
  /** Bir vaktin işaretini aç/kapat */
  isaretiDegistir: (vakit: TakipVakti, tarih?: Date) => Promise<void>;
  /** Belirli bir günde kılınanlar */
  gunuGetir: (tarih: Date) => TakipVakti[];
  /** Belirli bir gün tam mı */
  gunTamamMi: (tarih: Date) => boolean;
  /** Depolamadan yeniden oku (bildirimden "Kıldım"a basıldıktan sonra gerekir) */
  yenile: () => Promise<void>;
}

const IbadetTakibiContext = createContext<Ctx | undefined>(undefined);

export function IbadetTakibiProvider({ children }: { children: ReactNode }) {
  const [kayitlar, setKayitlar] = useState<TakipKayitlari>({});
  const [bugun, setBugun] = useState(new Date());

  const yenile = useCallback(async () => {
    const yeni = await kayitlariYukle();
    setKayitlar(yeni);
  }, []);

  useEffect(() => {
    yenile();
  }, [yenile]);

  // Uygulama arka plandan öne geldiğinde kayıtları tazele. Kullanıcı bildirim
  // çubuğundaki "Kıldım" butonuna uygulama kapalıyken basmış olabilir; o işlem
  // depolamayı doğrudan güncellediği için buradaki state'in haberi olmaz.
  // Ayrıca gece yarısını geçmiş olabilir — "bugün" referansı da tazelenir.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (durum) => {
      if (durum === 'active') {
        setBugun(new Date());
        yenile();
      }
    });
    return () => sub.remove();
  }, [yenile]);

  const isaretiDegistir = useCallback(async (vakit: TakipVakti, tarih?: Date) => {
    const guncel = await vaktiIsaretleDegistir(tarih ?? new Date(), vakit);
    setKayitlar(guncel);
  }, []);

  const gunuGetir = useCallback((tarih: Date) => gununVakitleri(kayitlar, tarih), [kayitlar]);
  const gunTamamMi = useCallback((tarih: Date) => gunTamam(kayitlar, tarih), [kayitlar]);

  const bugunKilinanlar = gununVakitleri(kayitlar, bugun);
  const seri = seriHesapla(kayitlar, bugun);

  return (
    <IbadetTakibiContext.Provider
      value={{ kayitlar, bugunKilinanlar, seri, isaretiDegistir, gunuGetir, gunTamamMi, yenile }}
    >
      {children}
    </IbadetTakibiContext.Provider>
  );
}

export function useIbadetTakibi() {
  const ctx = useContext(IbadetTakibiContext);
  if (!ctx) throw new Error('useIbadetTakibi, IbadetTakibiProvider içinde kullanılmalı');
  return ctx;
}
