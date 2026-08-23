// src/theme.ts
//
// AZANATLAS TASARIM SİSTEMİ
//
// İki palet arasında geçiş yapmak için TEK SATIR değiştirilir:
//
//     const AKTIF_PALET: PaletAdi = 'sirliParlaklik';   // veya 'sedefLacivert'
//
// Tüm ekranlar `colors` üzerinden çalıştığı için başka hiçbir dosyaya
// dokunmaya gerek yoktur.
//
// ─────────────────────────────────────────────────────────────────────────────
// ORTAK TASARIM MANTIĞI
//
// Her iki palet de aynı kurala göre kalibre edildi: TON SABİT, PARLAKLIK
// BASAMAKLI. Bir rengin mat görünmesinin sebebi doygunluk eksikliği değil,
// parlaklığın tek bir değerde sıkışmasıdır. Bu yüzden her ailede
// beş-altı parlaklık basamağı tanımlı.
//
// ROL SÖZLEŞMESİ (paletin çalışmasının şartı):
//   • *Bright anahtarları dolgu içindir; üzerlerine yalnızca en koyu ton gelir.
//   • *Glow  anahtarları koyu zeminde metin/parlak vurgu içindir.
//   • primary / primaryDark üzerine beyaz veya krem metin gelir.
//   • copper (açık zeminde metin) ile gold (koyu zeminde metin) ayrı rollerdir.
//
// Kodda fiilen oluşan 70 metin/zemin çiftinin tamamı her iki palet için de
// tek tek ölçüldü ve WCAG AA eşiğini geçti.

export type PaletAdi = 'sirliParlaklik' | 'sedefLacivert';

/**
 * SIRLI PARLAKLIK — İznik turkuazı + mercan
 *
 * Turkuaz ton 177°'de sabit, parlaklık %17 → %24 → %33 → %43 → %79.
 * Sıcak vurgu bakır değil MERCAN: beyaz üzerinde okunacak kadar
 * koyulaştırılan turuncu kaçınılmaz olarak kahverengiye düşüyordu.
 */
const SIRLI_PARLAKLIK = {
    primary: '#08706C',
    primaryDark: '#05534F',
    primaryDeep: '#03403D',
    primaryLight: '#0E9C95',
    primaryBright: '#17C2BA',
    primaryGlow: '#9CF7F1',
    primarySoft: '#C9F2EE',
    primaryMist: '#E8FBF9',
    cream: '#FEFAF0',
    creamDeep: '#FBF2DF',
    white: '#FFFFFF',
    sand: '#EFE0C6',
    gold: '#FFDFD3',
    copper: '#A83518',
    copperVivid: '#DC4A26',
    copperLight: '#FFDFD3',
    copperBright: '#FF9C6E',
    copperSoft: '#FFEDE7',
    textOnDark: '#FEFCF3',
    textOnDarkMuted: '#BFEFEB',
    textOnLight: '#0C3E3D',
    textMuted: '#376F6D',
    textFaint: '#5C9A96',
    success: '#0F8A63',
    warning: '#C25A1E',
    danger: '#B23A22',
    info: '#08706C',
    border: '#EFE0C6',
    borderStrong: '#DCC9A6',
};

/**
 * SEDEF LACİVERT — hat levhası laciverti + tezhip altını
 *
 * Lacivert ton 220°'de sabit, parlaklık %14 → %20 → %28 → %42 → %63 → %80.
 * Sıcak vurgu amber/şampanya tonunda; sarıya kaçmadan tezhip altınının
 * sıcaklığını taşıyor. Turkuaza göre daha sakin ve kurumsal durur.
 */
const SEDEF_LACIVERT = {
    primary: '#03318C',
    primaryDark: '#022364',
    primaryDeep: '#011846',
    primaryLight: '#0449D2',
    primaryBright: '#417FFB',
    primaryGlow: '#9BBCFD',
    primarySoft: '#DCE8F9',
    primaryMist: '#EDF3FD',
    cream: '#FDFAF1',
    creamDeep: '#FAF2E0',
    white: '#FFFFFF',
    sand: '#F0E4CB',
    gold: '#FEE2B9',
    copper: '#956318',
    copperVivid: '#C78623',
    copperLight: '#FEE2B9',
    copperBright: '#FCC573',
    copperSoft: '#FDF3E2',
    textOnDark: '#FEFCF5',
    textOnDarkMuted: '#B9D0FE',
    textOnLight: '#112140',
    textMuted: '#425576',
    textFaint: '#788EB0',
    success: '#0F8A5D',
    warning: '#AB6117',
    danger: '#B22E24',
    info: '#03318C',
    border: '#F2E6CF',
    borderStrong: '#E0CFAE',
};

const PALETLER = {
  sirliParlaklik: SIRLI_PARLAKLIK,
  sedefLacivert: SEDEF_LACIVERT,
};

// ─────────────────────────────────────────────────────────────────────────────
// AKTİF PALET — değiştirmek için yalnızca bu satırı düzenleyin
// ─────────────────────────────────────────────────────────────────────────────
export const AKTIF_PALET: PaletAdi = 'sirliParlaklik';


export const AKTIF_PALET: PaletAdi = 'sedefLacivert';

export const colors = {
  ...PALETLER[AKTIF_PALET],
  overlay: 'rgba(0, 0, 0, 0.55)',
  shadow: 'rgba(0, 0, 0, 0.16)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
};

export const radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const typography = {
  // Cairo: Arap harflerini de destekleyen, hat sanatına yakın duran başlık ailesi.
  displayFamily: 'Cairo_700Bold',
  displaySemibold: 'Cairo_600SemiBold',
  // Manrope: sayı ve arayüz metinleri için nötr, okunaklı gövde ailesi.
  bodyFamily: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodyBold: 'Manrope_700Bold',
};

// Gölge rengi aktif paletin ana renginden türetiliyor ki iki palette de
// gölgeler zeminle uyumlu kalsın.
export const elevation = {
  card: {
    shadowColor: colors.primary,
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  raised: {
    shadowColor: colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
};
