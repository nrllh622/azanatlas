// src/theme.ts
//
// AZANATLAS TASARIM SİSTEMİ — "Turkuaz + Fildişi + Bakır"
//
// Palet, klasik İslam sanatının somut malzemelerinden türetildi:
//   • Turkuaz  → İznik çinisi ve Selçuklu/Osmanlı kubbe mozaiklerinin ana rengi
//   • Fildişi  → el yazması Kur'an-ı Kerim sayfalarının ve tezhip zemininin rengi
//   • Bakır    → şamdan, ibrik, kandil gibi cami eşyalarındaki dövme bakır/pirinç
//
// Uygulamadaki HER ŞEY (zeminler, kartlar, butonlar, ikonlar, yazılar, desenler)
// bu üç renkten ve onların tonlarından türetilir; palet dışında serbest renk
// kullanılmaz. Böylece uygulama baştan sona tek bir İslami görsel dile sahip olur.

export const colors = {
  // --- ANA RENKLER (turkuaz ailesi) ---
  primary: '#0F6F6A',        // İznik turkuazı — ana marka rengi, header/hero zemini
  primaryDark: '#0C4A46',    // koyu turkuaz — alt navigasyon, koyu kartlar, başlık metni
  primaryDeep: '#083532',    // en koyu turkuaz — gradient bitişi, gölge tonları
  primaryLight: '#12817B',   // açık turkuaz — gradient başlangıcı, aktif durum
  primarySoft: '#EAF4F2',    // çok açık turkuaz — ikon kabı, seçili satır zemini

  // --- ZEMİN (fildişi ailesi) ---
  cream: '#FAF4E6',          // fildişi — uygulamanın ana zemini
  creamDeep: '#F3EAD6',      // koyu fildişi — ikincil zemin, ayırıcı bantlar
  white: '#FFFFFF',          // kart zemini
  sand: '#E6DCC6',           // kum — ince kenarlıklar, pasif çizgiler

  // --- VURGU (bakır ailesi) ---
  // `gold` ismi projedeki mevcut ekranlarla uyum için korundu; değeri artık BAKIR.
  gold: '#C87941',           // orta bakır — hem açık hem koyu zeminde okunur (ortak vurgu)
  copper: '#B5652F',         // dövme bakır — açık zemin üzerinde vurgu, ikon, buton
  copperLight: '#E08A3E',    // parlak bakır — koyu zemin üzerinde vurgu, aktif ikon
  copperSoft: '#F7E9DA',     // çok açık bakır — bakır ikonların kabı, rozet zemini

  // --- METİN ---
  textOnDark: '#FDFAF1',     // koyu turkuaz zemin üzerindeki ana metin
  textOnDarkMuted: '#B9D3D0', // koyu zemin üzerindeki ikincil metin
  textOnLight: '#123A37',    // fildişi/beyaz zemin üzerindeki ana metin
  textMuted: '#7A8C89',      // ikincil/açıklama metni
  textFaint: '#A9B9B6',      // pasif metin, placeholder

  // --- DURUM RENKLERİ ---
  // Paletin dışına çıkmamak için turkuaz/bakır ailesinden türetildi.
  success: '#2E8B6F',        // yeşilimsi turkuaz — kılındı, tamamlandı
  warning: '#C87941',        // bakır — mekruh vakti, uyarı
  danger: '#B04A3A',         // kiremit — hata, silme, kaza borcu
  info: '#0F6F6A',           // turkuaz — bilgilendirme

  // --- YARDIMCI ---
  border: '#E6DCC6',
  borderStrong: '#D3C7AC',
  overlay: 'rgba(8, 53, 50, 0.55)',
  shadow: 'rgba(15, 111, 106, 0.14)',
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

// Tekrar eden kart/gölge tanımları — her ekranda elle yazmak yerine buradan.
export const elevation = {
  card: {
    shadowColor: '#0F6F6A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#0F6F6A',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
};
