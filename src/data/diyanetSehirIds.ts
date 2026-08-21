// src/data/diyanetSehirIds.ts
// Diyanet'in resmi verisini ücretsiz/anahtarsız olarak sunan aracı servis
// (ezanvakti.emushaf.net) üzerindeki şehir (il) ID'leri. Kaynak: o servisin
// /sehirler/2 (2 = Türkiye ülke ID'si) uç noktasından alınan tam liste.
//
// Bu ID'ler Diyanet'in kendi il ID'leriyle birebir aynıdır (aracı servis
// veriyi olduğu gibi yayınlar). İlçe ID'leri burada YOK — onlar çalışma
// zamanında `/ilceler/{sehirId}` çağrısıyla çekilip cihazda önbelleklenir
// (bkz. diyanetApi.ts), çünkü Diyanet'in ilçe ayrımı bu uygulamanın kendi
// 39/25/30 ilçelik coğrafi listesinden daha kaba (birçok ilçe aynı "vakit
// istasyonu"nu paylaşır) ve elle eşleştirmek hataya açıktır.

export const DIYANET_SEHIR_IDS: Record<string, number> = {
  'Adana': 500, 'Adıyaman': 501, 'Afyonkarahisar': 502, 'Ağrı': 503, 'Aksaray': 504,
  'Amasya': 505, 'Ankara': 506, 'Antalya': 507, 'Ardahan': 508, 'Artvin': 509,
  'Aydın': 510, 'Balıkesir': 511, 'Bartın': 512, 'Batman': 513, 'Bayburt': 514,
  'Bilecik': 515, 'Bingöl': 516, 'Bitlis': 517, 'Bolu': 518, 'Burdur': 519,
  'Bursa': 520, 'Çanakkale': 521, 'Çankırı': 522, 'Çorum': 523, 'Denizli': 524,
  'Diyarbakır': 525, 'Düzce': 526, 'Edirne': 527, 'Elazığ': 528, 'Erzincan': 529,
  'Erzurum': 530, 'Eskişehir': 531, 'Gaziantep': 532, 'Giresun': 533, 'Gümüşhane': 534,
  'Hakkari': 535, 'Hatay': 536, 'Iğdır': 537, 'Isparta': 538, 'İstanbul': 539,
  'İzmir': 540, 'Kahramanmaraş': 541, 'Karabük': 542, 'Karaman': 543, 'Kars': 544,
  'Kastamonu': 545, 'Kayseri': 546, 'Kilis': 547, 'Kırıkkale': 548, 'Kırklareli': 549,
  'Kırşehir': 550, 'Kocaeli': 551, 'Konya': 552, 'Kütahya': 553, 'Malatya': 554,
  'Manisa': 555, 'Mardin': 556, 'Mersin': 557, 'Muğla': 558, 'Muş': 559,
  'Nevşehir': 560, 'Niğde': 561, 'Ordu': 562, 'Osmaniye': 563, 'Rize': 564,
  'Sakarya': 565, 'Samsun': 566, 'Şanlıurfa': 567, 'Siirt': 568, 'Sinop': 569,
  'Şırnak': 570, 'Sivas': 571, 'Tekirdağ': 572, 'Tokat': 573, 'Trabzon': 574,
  'Tunceli': 575, 'Uşak': 576, 'Van': 577, 'Yalova': 578, 'Yozgat': 579,
  'Zonguldak': 580,
};

export function getSehirIdForIl(il: string): number | null {
  return DIYANET_SEHIR_IDS[il] ?? null;
}
