// src/data/soundCatalog.ts
// Referans uygulamadaki ses listesiyle birebir aynı isimler.
// Her sesin gerçek ses dosyası assets/sounds/ altına eklenmeli (aşağıda not var).

export interface SoundOption {
  id: string;
  label: string;
  file: any | null; // null = "Ses yok / Silence"
}

export const SOUND_CATALOG: SoundOption[] = [
  { id: 'none', label: 'Ses yok / Silence', file: null },
  { id: 'melodi1', label: 'Melodi 1', file: require('../../assets/sounds/melodi1.mp3') },
  { id: 'melodi2', label: 'Melodi 2', file: require('../../assets/sounds/melodi2.mp3') },
  { id: 'melodi3', label: 'Melodi 3', file: require('../../assets/sounds/melodi3.mp3') },
  { id: 'uyandirma1', label: 'Uyandırma Sesi 1', file: require('../../assets/sounds/uyandirma1.mp3') },
  { id: 'yuksek_siren', label: 'Yüksek Siren Sesi', file: require('../../assets/sounds/yuksek_siren.mp3') },
  { id: 'uyandirma3', label: 'Uyandırma Ses 3', file: require('../../assets/sounds/uyandirma3.mp3') },
  { id: 'kisa_ezan1', label: 'Kısa Ezan 1', file: require('../../assets/sounds/kisa_ezan1.mp3') },
  { id: 'kisa_ezan2', label: 'Kısa Ezan 2', file: require('../../assets/sounds/kisa_ezan2.mp3') },
  { id: 'kisa_ezan3', label: 'Kısa Ezan 3', file: require('../../assets/sounds/kisa_ezan3.mp3') },
  { id: 'essalatu_hayrun', label: 'Essalatu Hayrun', file: require('../../assets/sounds/essalatu_hayrun.mp3') },
  { id: 'kus_sesi1', label: 'Kuş Sesi 1', file: require('../../assets/sounds/kus_sesi1.mp3') },
  { id: 'ding_dong', label: 'Ding Dong', file: require('../../assets/sounds/ding_dong.mp3') },
];

export function getSoundById(id: string): SoundOption {
  return SOUND_CATALOG.find((s) => s.id === id) || SOUND_CATALOG[0];
}
