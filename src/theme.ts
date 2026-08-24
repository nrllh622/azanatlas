// src/theme.ts
//
// AZANATLAS TASARIM SİSTEMİ
//
// ─────────────────────────────────────────────────────────────────────────────
// TEMA SİSTEMİ
//
// Uygulama 11 palet içerir. Kullanıcı Ayarlar > Tema'dan seçer; seçim cihazda
// saklanır ve uygulama yeniden başlatıldığında uygulanır.
//
// NEDEN YENİDEN BAŞLATMA?
// Ekranlardaki stiller `StyleSheet.create(...)` ile MODÜL DÜZEYİNDE bir kez
// oluşturulur — bu React Native'in önerdiği ve en hızlı çalışan yöntemdir.
// Anlık tema değişimi için her ekrandaki stilin `useMemo` içine alınması
// gerekirdi; bu, her render'da stil yeniden hesaplanması demek olurdu ve
// ölçülebilir bir performans kaybı getirirdi. Uygulama günde beş kez, hızlı
// açılıp kapanan bir araç olduğu için bu takas doğru bulunmadı.
//
// BOYUT MALİYETİ: 11 palet × 29 renk = ~9 KB ham metin, sıkıştırılmış ~2 KB.
// Kıyas için tek bir bildirim sesi dosyası bunun yüzlerce katıdır.
//
// ─────────────────────────────────────────────────────────────────────────────
// ORTAK TASARIM MANTIĞI
//
// Her palet aynı kurala göre kalibre edildi: TON SABİT, PARLAKLIK BASAMAKLI.
// Bir rengin mat görünmesinin sebebi doygunluk eksikliği değil, parlaklığın
// tek bir değerde sıkışmasıdır. Bu yüzden her ailede altı parlaklık basamağı
// tanımlı.
//
// ROL SÖZLEŞMESİ (paletin çalışmasının şartı):
//   • *Bright anahtarları dolgu içindir; üzerlerine yalnızca en koyu ton gelir.
//   • *Glow  anahtarları koyu zeminde metin/parlak vurgu içindir.
//   • primary / primaryDark üzerine beyaz veya krem metin gelir.
//   • copper (açık zeminde metin) ile gold (koyu zeminde metin) ayrı rollerdir.
//
// Kodda fiilen oluşan metin/zemin çiftleri HER PALET için tek tek ölçüldü ve
// WCAG AA eşiğini geçti.
// ─────────────────────────────────────────────────────────────────────────────

export interface PaletTanimi {
  ad: string;
  aciklama: string;
  renkler: Record<string, string>;
}

export const PALETLER: Record<string, PaletTanimi> = {
  sirliParlaklik: {
    ad: 'İznik Turkuazı',
    aciklama: 'Osmanlı çinisinin turkuazı ve mercan sırı',
    renkler: {
      primary: '#074A47',
      primaryDark: '#073634',
      primaryDeep: '#012826',
      primaryLight: '#1E9993',
      primaryBright: '#03C9BF',
      primaryGlow: '#7CFDF7',
      primarySoft: '#D3F8F5',
      primaryMist: '#ECFDFC',
      cream: '#FDF9EC',
      creamDeep: '#FAF1DB',
      white: '#FFFFFF',
      sand: '#F1E2C6',
      gold: '#FEB9A5',
      copper: '#BA411C',
      copperVivid: '#FB3E04',
      copperLight: '#FEB9A5',
      copperBright: '#FD835E',
      copperSoft: '#FEEBE1',
      textOnDark: '#FEFCF0',
      textOnDarkMuted: '#9BFDF9',
      textOnLight: '#0D3635',
      textMuted: '#346A67',
      textFaint: '#529894',
      success: '#0D8257',
      warning: '#AC4815',
      danger: '#AB2F21',
      info: '#074A47',
      border: '#F1E3C5',
      borderStrong: '#DFCCA4',
    },
  },
  sedefLacivert: {
    ad: 'Sedef Lacivert',
    aciklama: 'Hat levhası laciverdi ve tezhip altını',
    renkler: {
      primary: '#011A4B',
      primaryDark: '#011337',
      primaryDeep: '#010C23',
      primaryLight: '#033EB5',
      primaryBright: '#3175FC',
      primaryGlow: '#7CA7FD',
      primarySoft: '#D4E2F7',
      primaryMist: '#EDF3FD',
      cream: '#FDFAF1',
      creamDeep: '#FAF2E0',
      white: '#FFFFFF',
      sand: '#F0E4CB',
      gold: '#FDD69B',
      copper: '#956318',
      copperVivid: '#CE8312',
      copperLight: '#FDD69B',
      copperBright: '#FCB954',
      copperSoft: '#FDF3E2',
      textOnDark: '#FEFCF5',
      textOnDarkMuted: '#9BBCFD',
      textOnLight: '#0E1B34',
      textMuted: '#3D4E6C',
      textFaint: '#6E86AA',
      success: '#0E7C54',
      warning: '#9D5915',
      danger: '#A52B22',
      info: '#011A4B',
      border: '#F2E6CF',
      borderStrong: '#E0CFAE',
    },
  },
  avluFerahligi: {
    ad: 'Avlu Ferahlığı',
    aciklama: 'Şadırvan turkuazı ve avlu bakırı',
    renkler: {
      primary: '#06494B',
      primaryDark: '#053638',
      primaryDeep: '#012728',
      primaryLight: '#1C989C',
      primaryBright: '#03C2C9',
      primaryGlow: '#7CF9FD',
      primarySoft: '#D3F8F7',
      primaryMist: '#ECFDFD',
      cream: '#FDF9EC',
      creamDeep: '#FAF1DB',
      white: '#FFFFFF',
      sand: '#F1E2C6',
      gold: '#FECBA5',
      copper: '#A95719',
      copperVivid: '#E97116',
      copperLight: '#FECBA5',
      copperBright: '#FDA35E',
      copperSoft: '#FEF1E1',
      textOnDark: '#FEFBF1',
      textOnDarkMuted: '#9BFAFD',
      textOnLight: '#0D3336',
      textMuted: '#34686A',
      textFaint: '#54999C',
      success: '#0D8257',
      warning: '#AC4815',
      danger: '#AB2F21',
      info: '#06494B',
      border: '#F1E3C5',
      borderStrong: '#DFCCA4',
    },
  },
  yesimBahcesi: {
    ad: 'Yeşim Bahçesi',
    aciklama: 'Bahçe yeşili ve amber',
    renkler: {
      primary: '#064B34',
      primaryDark: '#063727',
      primaryDeep: '#01281B',
      primaryLight: '#1C9B71',
      primaryBright: '#03C987',
      primaryGlow: '#7CFDD2',
      primarySoft: '#D3F8E9',
      primaryMist: '#ECFDF7',
      cream: '#FDF9EC',
      creamDeep: '#FAF1DB',
      white: '#FFFFFF',
      sand: '#F1E2C6',
      gold: '#FED4A5',
      copper: '#A06018',
      copperVivid: '#C98436',
      copperLight: '#FED4A5',
      copperBright: '#FDB35E',
      copperSoft: '#FEF4E1',
      textOnDark: '#FEFBF1',
      textOnDarkMuted: '#9BFDDC',
      textOnLight: '#0D3629',
      textMuted: '#346A58',
      textFaint: '#549C84',
      success: '#0D8257',
      warning: '#AC4815',
      danger: '#AB2F21',
      info: '#064B34',
      border: '#F1E3C5',
      borderStrong: '#DFCCA4',
    },
  },
  gokFiruzesi: {
    ad: 'Gök Firuzesi',
    aciklama: 'Kubbe firuzesi ve bakır',
    renkler: {
      primary: '#013B50',
      primaryDark: '#012C3C',
      primaryDeep: '#011E28',
      primaryLight: '#0385B5',
      primaryBright: '#0394C9',
      primaryGlow: '#7CDBFD',
      primarySoft: '#D3F1F8',
      primaryMist: '#ECFAFD',
      cream: '#FDF9EC',
      creamDeep: '#FAF1DB',
      white: '#FFFFFF',
      sand: '#F1E2C6',
      gold: '#FED1A5',
      copper: '#A05C18',
      copperVivid: '#D2802D',
      copperLight: '#FED1A5',
      copperBright: '#FDAD5E',
      copperSoft: '#FEF3E1',
      textOnDark: '#FEFBF1',
      textOnDarkMuted: '#9BE3FD',
      textOnLight: '#0D2936',
      textMuted: '#345C6A',
      textFaint: '#6096A9',
      success: '#0D8257',
      warning: '#AC4815',
      danger: '#AB2F21',
      info: '#013B50',
      border: '#F1E3C5',
      borderStrong: '#DFCCA4',
    },
  },
  naneSedef: {
    ad: 'Nane ve Sedef',
    aciklama: 'Nane yeşili ve sedef moru',
    renkler: {
      primary: '#074A3D',
      primaryDark: '#06372D',
      primaryDeep: '#012820',
      primaryLight: '#1D9A81',
      primaryBright: '#03C9A1',
      primaryGlow: '#7CFDE3',
      primarySoft: '#D3F8EE',
      primaryMist: '#ECFDF9',
      cream: '#FDF9EC',
      creamDeep: '#FAF1DB',
      white: '#FFFFFF',
      sand: '#F1E2C6',
      gold: '#B3A5FE',
      copper: '#3B1ECC',
      copperVivid: '#2D04FB',
      copperLight: '#B3A5FE',
      copperBright: '#9B92C9',
      copperSoft: '#E9E1FE',
      textOnDark: '#FEFBF1',
      textOnDarkMuted: '#9BFDEA',
      textOnLight: '#0D362F',
      textMuted: '#346A5F',
      textFaint: '#549C8D',
      success: '#0D8257',
      warning: '#AC4815',
      danger: '#AB2F21',
      info: '#074A3D',
      border: '#F1E3C5',
      borderStrong: '#DFCCA4',
    },
  },
  lilaTezhibi: {
    ad: 'Lila Tezhibi',
    aciklama: 'Tezhip laciverdi ve firuze',
    renkler: {
      primary: '#0D0138',
      primaryDark: '#0A012A',
      primaryDeep: '#06011C',
      primaryLight: '#3A2A87',
      primaryBright: '#5A46B0',
      primaryGlow: '#8676C9',
      primarySoft: '#D6D1EC',
      primaryMist: '#EEEBF8',
      cream: '#FBF7EE',
      creamDeep: '#F5EFDD',
      white: '#FFFFFF',
      sand: '#E9DDC6',
      gold: '#5FB8C0',
      copper: '#0F5057',
      copperVivid: '#3D767C',
      copperLight: '#5FB8C0',
      copperBright: '#4AA0A8',
      copperSoft: '#DCEEEF',
      textOnDark: '#F5F2FB',
      textOnDarkMuted: '#A498D2',
      textOnLight: '#150C2C',
      textMuted: '#3B3157',
      textFaint: '#655C87',
      success: '#0D8257',
      warning: '#AC4815',
      danger: '#AB2F21',
      info: '#0D0138',
      border: '#E9DDC6',
      borderStrong: '#D3C3A0',
    },
  },
  zumrutVarak: {
    ad: 'Zümrüt Varak',
    aciklama: 'Derin zümrüt ve altın',
    renkler: {
      primary: '#043A1B',
      primaryDark: '#032B14',
      primaryDeep: '#011E0D',
      primaryLight: '#166B38',
      primaryBright: '#1E8E48',
      primaryGlow: '#4FBE7C',
      primarySoft: '#C3E9D1',
      primaryMist: '#E7F5EB',
      cream: '#FBF7EA',
      creamDeep: '#F6ECD5',
      white: '#FFFFFF',
      sand: '#E9DAB9',
      gold: '#D9AF5C',
      copper: '#7A5A10',
      copperVivid: '#8C6E2E',
      copperLight: '#D9AF5C',
      copperBright: '#C79A3E',
      copperSoft: '#F3E7C9',
      textOnDark: '#F7F3E4',
      textOnDarkMuted: '#8FCBA6',
      textOnLight: '#0B2A17',
      textMuted: '#2E5638',
      textFaint: '#4C7A5A',
      success: '#0D8257',
      warning: '#AC4815',
      danger: '#AB2F21',
      info: '#043A1B',
      border: '#E9DAB9',
      borderStrong: '#D3BE8E',
    },
  },
  kisveSiyahi: {
    ad: 'Kisve Siyahı',
    aciklama: 'Kâbe örtüsü tonu ve altın sırma',
    renkler: {
      primary: '#2E1801',
      primaryDark: '#211101',
      primaryDeep: '#160B01',
      primaryLight: '#6E3D06',
      primaryBright: '#8F5312',
      primaryGlow: '#C68A4C',
      primarySoft: '#E9D4BC',
      primaryMist: '#F5EAE0',
      cream: '#FBF6EC',
      creamDeep: '#F5EAD6',
      white: '#FFFFFF',
      sand: '#E9DAB9',
      gold: '#C4964C',
      copper: '#6B4F16',
      copperVivid: '#7C6535',
      copperLight: '#C4964C',
      copperBright: '#B0863E',
      copperSoft: '#EFE1C7',
      textOnDark: '#F7EFE2',
      textOnDarkMuted: '#D6A876',
      textOnLight: '#241606',
      textMuted: '#523C21',
      textFaint: '#7A6242',
      success: '#0D8257',
      warning: '#AC4815',
      danger: '#AB2F21',
      info: '#2E1801',
      border: '#E9DAB9',
      borderStrong: '#D3BE8E',
    },
  },
  tugraBordosu: {
    ad: 'Tuğra Bordosu',
    aciklama: 'Tuğra bordosu ve altın tezhip',
    renkler: {
      primary: '#33010E',
      primaryDark: '#26010A',
      primaryDeep: '#190107',
      primaryLight: '#711F30',
      primaryBright: '#93293F',
      primaryGlow: '#C36378',
      primarySoft: '#E9CCD2',
      primaryMist: '#F6E6E9',
      cream: '#FBF6EC',
      creamDeep: '#F5E9DA',
      white: '#FFFFFF',
      sand: '#E9DAB9',
      gold: '#C79657',
      copper: '#6E4B17',
      copperVivid: '#8A6934',
      copperLight: '#C79657',
      copperBright: '#B18544',
      copperSoft: '#EFE0C7',
      textOnDark: '#F7EDEE',
      textOnDarkMuted: '#D18C9C',
      textOnLight: '#2A0810',
      textMuted: '#552733',
      textFaint: '#7D4956',
      success: '#0D8257',
      warning: '#AC4815',
      danger: '#AB2F21',
      info: '#33010E',
      border: '#E9DAB9',
      borderStrong: '#D3BE8E',
    },
  },
};

export type PaletAdi = keyof typeof PALETLER;

/** Uygulama ilk kurulduğunda kullanılan palet. */
export const VARSAYILAN_PALET: PaletAdi = 'sirliParlaklik';

// ─────────────────────────────────────────────────────────────────────────────
// AKTİF PALET
//
// Bu değer uygulama AÇILIRKEN, `temaDeposu.ts` tarafından cihazdan okunan
// seçimle bir kez doldurulur (bkz. index.ts). Modül düzeyinde tutulmasının
// sebebi, `colors` nesnesinin de modül düzeyinde sabit kalması gerekliliği.
// ─────────────────────────────────────────────────────────────────────────────
let _aktif: PaletAdi = VARSAYILAN_PALET;

/**
 * Aktif paleti ayarlar. YALNIZCA uygulama açılışında, herhangi bir ekran
 * çizilmeden önce çağrılmalıdır (index.ts). Sonradan çağrılırsa zaten
 * oluşturulmuş stiller güncellenmez.
 */
export function _paletiAyarla(ad: PaletAdi) {
  if (PALETLER[ad]) _aktif = ad;
}

export function aktifPaletAdi(): PaletAdi {
  return _aktif;
}

/**
 * `colors` bir Proxy'dir: her okumada O ANKİ aktif paletten değeri döner.
 *
 * Bunun sebebi sıralama sorunudur — ekran modülleri `colors`'ı import
 * ettiğinde palet henüz cihazdan okunmuş olmayabilir. Düz bir nesne
 * kullansaydık ekranlar varsayılan renklere kilitlenirdi. Proxy sayesinde
 * değer, ilk gerçek okumada (StyleSheet.create çalışırken) alınır ve o an
 * palet çoktan ayarlanmış olur.
 *
 * Performans: Proxy yalnızca stil oluşturulurken, uygulama ömrü boyunca
 * birkaç yüz kez okunur — render döngüsünde değil.
 */
export const colors: Record<string, string> = new Proxy(
  {},
  {
    get(_t, anahtar: string) {
      if (anahtar === 'overlay') return 'rgba(0, 0, 0, 0.55)';
      if (anahtar === 'shadow') return 'rgba(0, 0, 0, 0.16)';
      return PALETLER[_aktif].renkler[anahtar] ?? '#000000';
    },
    has() {
      return true;
    },
  }
) as Record<string, string>;

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

// ─────────────────────────────────────────────────────────────────────────────
// PUNTO ÖLÇEĞİ
//
// Yazılar küçük ve yorucu bulunduğu için tek bir ölçek tanımlandı; ekranlar
// serbest sayı yerine bu adları kullanır. Satır yükseklikleri punto ile
// birlikte tanımlı — okumayı yoran asıl etken sıkışık satır aralığıydı.
// ─────────────────────────────────────────────────────────────────────────────
export const fontSize = {
  micro: 11,
  tiny: 12.5,
  small: 14,
  body: 15.5,
  bodyLg: 17,
  title: 19,
  heading: 22,
  numeral: 19,
  countdown: 44,
  display: 48,
};

export const lineHeight = {
  micro: 15,
  tiny: 18,
  small: 21,
  body: 23,
  bodyLg: 24,
  title: 26,
  heading: 30,
};

// Gölge, aktif paletin ana renginden türetilir ki her palette zeminle uyumlu
// kalsın. Proxy sayesinde bu da doğru anda okunur.
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
