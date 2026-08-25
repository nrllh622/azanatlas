// src/data/globalLocations.ts
//
// FAZ-1 HEDEF ÜLKELER — TÜRKİYE DIŞI ŞEHİR LİSTESİ (madde 9 — bu tur)
//
// Türkiye zaten `turkeyLocations.ts` (81 il + ilçeler) ve `districtCoords.ts`
// ile ayrıntılı şekilde kapsanıyor — bu dosya ONLARIN YERİNE GEÇMİYOR, yalnızca
// Türkiye DIŞINDAKİ Faz-1 hedef ülkeleri (İngilizce konuşulan ülkeler,
// Endonezya, Fransa) için MANUEL şehir seçimi ekliyor.
//
// KAPSAM VE GRANÜLERLİK: Türkiye'deki gibi il/ilçe (81 il × binlerce ilçe)
// düzeyinde bir ayrıntı yerine, her ülke için ülkenin en büyük/en yaygın
// şehirlerinden oluşan DÜZ (tek seviyeli) bir liste sunuluyor — çoğu namaz
// vakti uygulamasının (Muslim Pro dahil) izlediği pratik yaklaşım budur.
// Kullanıcı listede kendi şehrini bulamazsa "GPS ile Ekle" seçeneği ZATEN
// ÜLKE SINIRLAMASI OLMADAN çalışıyor (bkz. LocationPickerScreen.tsx'teki
// `useGps` — `expo-location` ile herhangi bir ülkede konum + ülke kodu
// otomatik belirleniyor) — yani GPS her zaman tam isabetli sonuç verir, bu
// liste yalnızca GPS izni vermeyen/vermek istemeyen kullanıcılar için manuel
// bir kısayoldur.
//
// NAMAZ VAKTİ API/HESAPLAMA UYUMLULUĞU (madde 9'daki asıl soru):
// `lib/prayerCalculator.ts`'teki `calculateVakitler()` hiçbir zaman dış bir
// API'ye bağımlı DEĞİL — `adhan` kütüphanesiyle YEREL/OFFLINE astronomik
// hesaplama yapıyor ve Dünya'nın HERHANGİ BİR enlem/boylamı için çalışır.
// Yalnızca Türkiye+Diyanet metodu seçiliyken `getVakitlerWithDiyanetFallback()`
// EK OLARAK Diyanet'in resmi takvim API'sini dener (bkz. o dosyadaki
// açıklama) — bulamazsa YİNE sessizce yerel hesaba düşer. Yani buraya
// eklenen hiçbir ülke/şehir için "API veri sağlamıyor" riski YOK: hepsi
// `getMethodForCountry()` (US/CA → NorthAmerica, aksi halde
// MuslimWorldLeague — ID/FR/GB/AU dahil) ile anında, internetsiz hesaplanır.
//
// Şehir adları TÜRKİYE'DEKİ il/ilçe adları gibi YER ADI VERİSİDİR — diğer
// uygulamalardaki gibi dile göre çevrilmez, ülke adları da aynı ilkeyle
// (ör. "France" her dilde "France") sabit tutulur.
// ─────────────────────────────────────────────────────────────────────────────

export interface GlobalCity {
  name: string;
  lat: number;
  lng: number;
}

export interface GlobalCountry {
  /** ISO 3166-1 alpha-2 — `getMethodForCountry()`/GPS `isoCountryCode` ile uyumlu */
  code: string;
  /** Ülke adı — DATA, çevrilmez (bkz. dosya başı açıklama) */
  name: string;
  cities: GlobalCity[];
}

export const GLOBAL_COUNTRIES: GlobalCountry[] = [
  {
    code: 'US',
    name: 'United States',
    cities: [
      { name: 'New York', lat: 40.7128, lng: -74.0060 },
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
      { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
      { name: 'Houston', lat: 29.7604, lng: -95.3698 },
      { name: 'Dearborn', lat: 42.3223, lng: -83.1763 },
      { name: 'Washington, D.C.', lat: 38.9072, lng: -77.0369 },
      { name: 'Boston', lat: 42.3601, lng: -71.0589 },
      { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
      { name: 'Atlanta', lat: 33.7490, lng: -84.3880 },
      { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
      { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
      { name: 'Minneapolis', lat: 44.9778, lng: -93.2650 },
      { name: 'Seattle', lat: 47.6062, lng: -122.3321 },
      { name: 'Miami', lat: 25.7617, lng: -80.1918 },
      { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    cities: [
      { name: 'London', lat: 51.5074, lng: -0.1278 },
      { name: 'Birmingham', lat: 52.4862, lng: -1.8904 },
      { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
      { name: 'Leeds', lat: 53.8008, lng: -1.5491 },
      { name: 'Bradford', lat: 53.7960, lng: -1.7594 },
      { name: 'Glasgow', lat: 55.8642, lng: -4.2518 },
      { name: 'Leicester', lat: 52.6369, lng: -1.1398 },
      { name: 'Sheffield', lat: 53.3811, lng: -1.4701 },
      { name: 'Liverpool', lat: 53.4084, lng: -2.9916 },
      { name: 'Cardiff', lat: 51.4816, lng: -3.1791 },
      { name: 'Edinburgh', lat: 55.9533, lng: -3.1883 },
      { name: 'Bristol', lat: 51.4545, lng: -2.5879 },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    cities: [
      { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
      { name: 'Montreal', lat: 45.5019, lng: -73.5674 },
      { name: 'Vancouver', lat: 49.2827, lng: -123.1207 },
      { name: 'Ottawa', lat: 45.4215, lng: -75.6972 },
      { name: 'Calgary', lat: 51.0447, lng: -114.0719 },
      { name: 'Edmonton', lat: 53.5461, lng: -113.4938 },
      { name: 'Mississauga', lat: 43.5890, lng: -79.6441 },
      { name: 'Winnipeg', lat: 49.8951, lng: -97.1384 },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    cities: [
      { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
      { name: 'Melbourne', lat: -37.8136, lng: 144.9631 },
      { name: 'Brisbane', lat: -27.4698, lng: 153.0251 },
      { name: 'Perth', lat: -31.9505, lng: 115.8605 },
      { name: 'Adelaide', lat: -34.9285, lng: 138.6007 },
      { name: 'Canberra', lat: -35.2809, lng: 149.1300 },
    ],
  },
  {
    code: 'ID',
    name: 'Indonesia',
    cities: [
      { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
      { name: 'Surabaya', lat: -7.2575, lng: 112.7521 },
      { name: 'Bandung', lat: -6.9175, lng: 107.6191 },
      { name: 'Medan', lat: 3.5952, lng: 98.6722 },
      { name: 'Semarang', lat: -6.9932, lng: 110.4203 },
      { name: 'Makassar', lat: -5.1477, lng: 119.4327 },
      { name: 'Palembang', lat: -2.9761, lng: 104.7754 },
      { name: 'Yogyakarta', lat: -7.7956, lng: 110.3695 },
      { name: 'Denpasar', lat: -8.6705, lng: 115.2126 },
      { name: 'Malang', lat: -7.9666, lng: 112.6326 },
    ],
  },
  {
    code: 'FR',
    name: 'France',
    cities: [
      { name: 'Paris', lat: 48.8566, lng: 2.3522 },
      { name: 'Marseille', lat: 43.2965, lng: 5.3698 },
      { name: 'Lyon', lat: 45.7640, lng: 4.8357 },
      { name: 'Toulouse', lat: 43.6047, lng: 1.4442 },
      { name: 'Nice', lat: 43.7102, lng: 7.2620 },
      { name: 'Nantes', lat: 47.2184, lng: -1.5536 },
      { name: 'Strasbourg', lat: 48.5734, lng: 7.7521 },
      { name: 'Montpellier', lat: 43.6108, lng: 3.8767 },
      { name: 'Bordeaux', lat: 44.8378, lng: -0.5792 },
      { name: 'Lille', lat: 50.6292, lng: 3.0573 },
    ],
  },
];
