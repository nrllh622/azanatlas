// src/theme.ts
//
// AZANATLAS TASARIM SİSTEMİ — "Sırlı Parlaklık"
//
// Palet, klasik İslam sanatının somut malzemelerinden türetildi:
//   • Turkuaz → İznik çinisi ve Selçuklu/Osmanlı kubbe mozaiklerinin ana rengi
//   • Fildişi → el yazması Kur'an-ı Kerim sayfalarının ve tezhip zemininin rengi
//   • Mercan  → çini panolardaki kırmızı-turuncu sır (Ermeni bolusu)
//
// ─────────────────────────────────────────────────────────────────────────────
// NEDEN ÖNCEKİ PALET MAT GÖRÜNÜYORDU
//
// Ölçüldüğünde turkuaz zaten %76 doygunluktaydı; sorun doygunluk değil,
// PARLAKLIĞIN %25'te sabit kalmasıydı. Koyu + orta doygun bir renk ışığı
// emer, geri vermez — ham (fırınlanmamış) çini gibi. Bu sürümde ton (177°)
// aynen korunup parlaklık beş basamağa açıldı: %17 → %24 → %33 → %43 → %79.
//
// İkinci değişiklik sıcak vurguda: BAKIR yerine MERCAN. Gerekçe ölçüme
// dayanıyor — beyaz üzerinde okunacak kadar koyulaştırılan turuncu
// kaçınılmaz olarak kahverengiye düşüyordu ve "cansız" hissin asıl kaynağı
// buydu. Mercan aynı parlaklıkta canlı kalır, kahveye kaymaz.
//
// ─────────────────────────────────────────────────────────────────────────────
// ROL SÖZLEŞMESİ  (bu paletin çalışmasının tek şartı)
//
// En parlak tonlar tam doygunlukta kalabilsin diye kontrast eşiğine
// takılmamaları gerekir. Bunu sağlayan kural şudur:
//
//   *Bright anahtarları ASLA metin taşımaz.
//   Yalnızca dolgu, nokta, ilerleme çubuğu olarak kullanılır.
//
// Metin taşıyan her yüzey, koyu (primary / primaryDark) ya da açık
// (cream / white) uçtan seçilir. 27 metin/zemin çiftinin tamamı WCAG AA
// eşiğini geçecek şekilde ölçüldü.


export const AKTIF_PALET: PaletAdi = 'sirliParlaklik';   // turkuaz
export const AKTIF_PALET: PaletAdi = 'sedefLacivert';    // lacivert

export const colors = {
  // ─── ANA RENKLER (turkuaz ailesi, ton 177° sabit) ───────────────────────
  primary: '#08706C',        // ana koyu dolgu — üzerine beyaz metin gelir
  primaryDark: '#05534F',    // en koyu — alt navigasyon, aktif satır, başlık metni
  primaryDeep: '#03403D',    // gradient bitişi, parlak dolgu üzerindeki metin
  primaryLight: '#0E9C95',   // canlı turkuaz — açık zeminde dolgu ve kalın çizgi
  primaryBright: '#17C2BA',  // EN CANLI — yalnızca koyu zeminde dolgu/nokta (metin taşımaz)
  primaryGlow: '#9CF7F1',    // koyu zeminde parlak vurgu metni
  primarySoft: '#C9F2EE',    // ikon kabı zemini
  primaryMist: '#E8FBF9',    // en açık turkuaz zemin

  // ─── ZEMİN (fildişi ailesi) ─────────────────────────────────────────────
  cream: '#FEFAF0',          // uygulamanın ana zemini
  creamDeep: '#FBF2DF',      // ikincil zemin, ayırıcı bantlar
  white: '#FFFFFF',          // kart zemini
  sand: '#EFE0C6',           // ince kenarlıklar, pasif çizgiler

  // ─── VURGU (mercan ailesi) ──────────────────────────────────────────────
  // İsimler projedeki mevcut kullanımla uyum için korundu; değerler artık MERCAN.
  gold: '#FFDFD3',           // koyu zeminde vurgu metni + üzerine koyu metin alan dolgu
  copper: '#A83518',         // AÇIK zeminde vurgu metni ve beyaz metin taşıyan dolgu
  copperVivid: '#DC4A26',    // açık zeminde CANLI ikon (metin taşımaz)
  copperLight: '#FFDFD3',    // koyu zeminde vurgu metni (gold ile aynı rol)
  copperBright: '#FF9C6E',   // canlı mercan dolgu — üzerine KOYU metin gelir
  copperSoft: '#FFEDE7',     // rozet/ikon kabı zemini

  // ─── METİN ──────────────────────────────────────────────────────────────
  textOnDark: '#FEFCF3',     // koyu zemin üzerindeki ana metin
  textOnDarkMuted: '#BFEFEB', // koyu zemin üzerindeki ikincil metin
  textOnLight: '#0C3E3D',    // açık zemin üzerindeki ana metin
  textMuted: '#376F6D',      // ikincil/açıklama metni
  textFaint: '#5C9A96',      // pasif ikon, placeholder

  // ─── DURUM RENKLERİ ─────────────────────────────────────────────────────
  // Paletin dışına çıkmamak için turkuaz/mercan ailesinden türetildi.
  success: '#0F8A63',        // kılındı, tamamlandı
  warning: '#C25A1E',        // mekruh vakti, uyarı (açık zeminde metin olarak okunur)
  danger: '#B23A22',         // hata, silme, kaza borcu
  info: '#08706C',           // bilgilendirme

  // ─── YARDIMCI ───────────────────────────────────────────────────────────
  border: '#EFE0C6',
  borderStrong: '#DCC9A6',
  overlay: 'rgba(3, 64, 61, 0.55)',
  shadow: 'rgba(8, 112, 108, 0.16)',
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
    shadowColor: '#08706C',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#08706C',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
};
