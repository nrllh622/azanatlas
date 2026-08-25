// src/lib/veriSec.ts
//
// VERİ İÇERİĞİ DİL SEÇİCİ (madde 10a/13 — bu tur)
//
// Uygulama metinleri `ceviriler.ts`/`useCeviri()` ile 4 dilde tam çevrili
// (tr/en/id/fr). Ama Günün Ayeti, İslam Tarihinde Bugün, zikir anlamları ve
// tema paleti açıklamaları gibi VERİ içerikleri (ayetler.ts, tariheBugun.ts,
// TesbihScreen.tsx'in ZIKIRLER'i, theme.ts'in PALETLER'i) önceki turlarda
// yalnızca tr/en alanlarıyla (`x`, `xEn`) tutuluyordu — id/fr kullanıcılar
// bu içerikleri İngilizce görüyordu.
//
// Bu tur id/fr alanları da (`xId`, `xFr`) eklendi. Ekranların hepsinin aynı
// `dil === 'en' ? x.foo Bar : x.foo` ikili deseni yerine tek bir yerden,
// tutarlı şekilde 4 dili seçmesi için bu küçük yardımcı fonksiyon eklendi.
//
// id/fr alanı bir noktada eksik kalırsa (ör. ileride yeni bir veri girilip
// unutulursa) sessizce Türkçe'ye DEĞİL, İngilizce'ye düşer — bu, önceki
// turlarda kullanıcıya da açıklanan kasıtlı bir tercih.

import { DilKodu } from '../i18n/ceviriler';

export function veriSec(
  dil: DilKodu,
  tr: string,
  en: string,
  id?: string,
  fr?: string
): string {
  if (dil === 'tr') return tr;
  if (dil === 'id') return id || en;
  if (dil === 'fr') return fr || en;
  return en;
}
