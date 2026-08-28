// src/data/soundCatalog.ts
export interface SoundOption {
  id: string;
  label: string;
  file: any | null;
}

export const SOUND_CATALOG: SoundOption[] = [
  { id: 'none', label: 'Ses yok / Silence', file: null },
  { id: 'melodi1', label: 'Melodi 1', file: require('../../assets/sounds/melodi1.wav') },
  { id: 'melodi2', label: 'Melodi 2', file: require('../../assets/sounds/melodi2.wav') },
  { id: 'melodi3', label: 'Melodi 3', file: require('../../assets/sounds/melodi3.wav') },
  { id: 'uyandirma1', label: 'Uyandırma Sesi 1', file: require('../../assets/sounds/uyandirma1.wav') },
  { id: 'yuksek_siren', label: 'Yüksek Siren Sesi', file: require('../../assets/sounds/yuksek_siren.wav') },
  { id: 'uyandirma3', label: 'Uyandırma Ses 3', file: require('../../assets/sounds/uyandirma3.wav') },
  { id: 'kus_sesi1', label: 'Kuş Sesi 1', file: require('../../assets/sounds/kus_sesi1.wav') },
  { id: 'ding_dong', label: 'Ding Dong', file: require('../../assets/sounds/ding_dong.wav') },
  // DÜZELTME (7. tur — madde 1): "Kısa Ezan 1/2/3" ve "Essalatu Hayrun"
  // (sentezle üretilmiş yer tutucu sesler) tamamen kaldırıldı; kullanıcının
  // yüklediği 10 gerçek ses kaydı ekleniyor. Etiketler, kullanıcının
  // dosyaları isimlendirdiği haliyle BİREBİR aynı tutuldu (talimat gereği).
  { id: 'allah_akbar_tekbir', label: 'Allah Akbar Tekbir', file: require('../../assets/sounds/allah_akbar_tekbir.mp3') },
  { id: 'allahu_akbar_1', label: 'Allahu Akbar 1', file: require('../../assets/sounds/allahu_akbar_1.mp3') },
  { id: 'allahu_akbar_2', label: 'Allahu Akbar 2', file: require('../../assets/sounds/allahu_akbar_2.mp3') },
  { id: 'allahu_akbar_twice', label: 'Allahu Akbar Twice', file: require('../../assets/sounds/allahu_akbar_twice.mp3') },
  { id: 'alahu_akbar_kethira', label: 'Alahu Akbar Kethira', file: require('../../assets/sounds/alahu_akbar_kethira.mp3') },
  { id: 'lailaha_illallah', label: 'Lailaha illallah', file: require('../../assets/sounds/lailaha_illallah.mp3') },
  { id: 'esselatu_hayrun_minen_nevm', label: 'Esselatu hayrun minen nevm', file: require('../../assets/sounds/esselatu_hayrun_minen_nevm.mp3') },
  { id: 'adhanazan_short_1', label: 'AdhanAzan Short 1', file: require('../../assets/sounds/adhanazan_short_1.mp3') },
  { id: 'adhanazan_short_2', label: 'AdhanAzan Short 2', file: require('../../assets/sounds/adhanazan_short_2.mp3') },
  { id: 'ney_huzur', label: 'Ney Huzur', file: require('../../assets/sounds/ney_huzur.mp3') },
];

export function getSoundById(id: string): SoundOption {
  return SOUND_CATALOG.find((s) => s.id === id) || SOUND_CATALOG[0];
}
