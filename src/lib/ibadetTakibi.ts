// src/lib/ibadetTakibi.ts
//
// GÜNLÜK İBADET TAKİBİ
//
// Kullanıcının hangi gün hangi farz namazı kıldığını cihazda saklar ve
// buradan "seri" (streak) hesaplar. Hiçbir veri sunucuya gönderilmez,
// hesap/giriş gerektirmez — tamamı AsyncStorage'da, kullanıcının cihazında.
//
// Sadece BEŞ FARZ namaz takip edilir. İmsak ve Güneş birer namaz vakti
// değil (imsak orucun başlangıcı, güneş sabah namazının çıkış vakti),
// bu yüzden takip dışında bırakılmıştır.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'azanatlas_ibadet_takibi_v1';

/** Takip edilen farz namazlar — sırası ekranda gösterim sırasıdır. */
export const TAKIP_VAKITLERI = ['sabah', 'ogle', 'ikindi', 'aksam', 'yatsi'] as const;
export type TakipVakti = (typeof TAKIP_VAKITLERI)[number];

export const TAKIP_ETIKETLERI: Record<TakipVakti, string> = {
  sabah: 'Sabah',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam',
  yatsi: 'Yatsı',
};

/** Gün anahtarı → o gün kılınan vakitler. Örn: { '2026-08-21': ['sabah','ogle'] } */
export type TakipKayitlari = Record<string, TakipVakti[]>;

/** Depolamayı sınırlamak için tutulacak en fazla gün sayısı (yaklaşık 14 ay). */
const MAX_GUN = 420;

/**
 * Tarihi YEREL takvim gününe göre 'YYYY-MM-DD' anahtarına çevirir.
 * toISOString() KULLANILMAZ — o UTC'ye çevirdiği için, saat dilimi farkıyla
 * gece yarısına yakın saatlerde kayıt yanlış güne düşerdi.
 */
export function gunAnahtari(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function kayitlariYukle(): Promise<TakipKayitlari> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function kayitlariKaydet(kayitlar: TakipKayitlari): Promise<void> {
  try {
    // Eski günleri buda — depolamanın sınırsız büyümesini engeller.
    const anahtarlar = Object.keys(kayitlar).sort();
    let budanmis = kayitlar;
    if (anahtarlar.length > MAX_GUN) {
      budanmis = {};
      for (const k of anahtarlar.slice(anahtarlar.length - MAX_GUN)) {
        budanmis[k] = kayitlar[k];
      }
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(budanmis));
  } catch {
    // Depolama hatası takibi bozmamalı — sessizce geç.
  }
}

/**
 * Bir vaktin işaretini değiştirir (kılındıysa kaldırır, kılınmadıysa ekler)
 * ve GÜNCEL kayıtları döndürür. Arka plan görevinden de çağrılabilsin diye
 * React'tan bağımsız, doğrudan depolama üzerinde çalışır.
 */
export async function vaktiIsaretleDegistir(date: Date, vakit: TakipVakti): Promise<TakipKayitlari> {
  const kayitlar = await kayitlariYukle();
  const anahtar = gunAnahtari(date);
  const mevcut = kayitlar[anahtar] ?? [];
  const yeni = mevcut.includes(vakit)
    ? mevcut.filter((v) => v !== vakit)
    : [...mevcut, vakit];

  const guncel: TakipKayitlari = { ...kayitlar };
  if (yeni.length === 0) delete guncel[anahtar];
  else guncel[anahtar] = yeni;

  await kayitlariKaydet(guncel);
  return guncel;
}

/**
 * Bir vakti KILINDI olarak işaretler (zaten işaretliyse dokunmaz).
 * Bildirimdeki "Kıldım" butonu bunu kullanır — orada "geri alma" davranışı
 * istenmez; kullanıcı butona ikinci kez bassa bile vakit kılınmış kalmalıdır.
 */
export async function vaktiKilindiIsaretle(date: Date, vakit: TakipVakti): Promise<TakipKayitlari> {
  const kayitlar = await kayitlariYukle();
  const anahtar = gunAnahtari(date);
  const mevcut = kayitlar[anahtar] ?? [];
  if (mevcut.includes(vakit)) return kayitlar;

  const guncel: TakipKayitlari = { ...kayitlar, [anahtar]: [...mevcut, vakit] };
  await kayitlariKaydet(guncel);
  return guncel;
}

/** Verilen günde kılınan vakitler. */
export function gununVakitleri(kayitlar: TakipKayitlari, date: Date): TakipVakti[] {
  return kayitlar[gunAnahtari(date)] ?? [];
}

/** Verilen gün beş vakit de kılınmış mı? */
export function gunTamam(kayitlar: TakipKayitlari, date: Date): boolean {
  const kilinan = gununVakitleri(kayitlar, date);
  return TAKIP_VAKITLERI.every((v) => kilinan.includes(v));
}

/**
 * Kesintisiz "tam gün" serisi.
 *
 * Bugün henüz tamamlanmamış olabilir (ör. saat 10:00, daha ikindi girmedi) —
 * bu yüzden bugün eksikse seri BOZULMUŞ sayılmaz; sayım düne kaydırılır.
 * Böylece kullanıcı günün ortasında serisini sıfırlanmış görmez.
 */
export function seriHesapla(kayitlar: TakipKayitlari, bugun: Date): number {
  const gun = new Date(bugun);
  gun.setHours(12, 0, 0, 0); // yaz saati geçişlerinde gün kaymasını önlemek için öğle saati

  let seri = 0;
  if (!gunTamam(kayitlar, gun)) {
    // Bugün eksik → seriyi dünden itibaren say.
    gun.setDate(gun.getDate() - 1);
  }

  // Geriye doğru, tam olmayan ilk güne kadar say. MAX_GUN bir güvenlik sınırı.
  for (let i = 0; i < MAX_GUN; i++) {
    if (!gunTamam(kayitlar, gun)) break;
    seri++;
    gun.setDate(gun.getDate() - 1);
  }
  return seri;
}

/** Son N gün içinde kılınan toplam vakit sayısı — Takip ekranındaki özet için. */
export function sonGunlerdeKilinan(kayitlar: TakipKayitlari, bugun: Date, gunSayisi: number): number {
  const gun = new Date(bugun);
  gun.setHours(12, 0, 0, 0);
  let toplam = 0;
  for (let i = 0; i < gunSayisi; i++) {
    toplam += gununVakitleri(kayitlar, gun).length;
    gun.setDate(gun.getDate() - 1);
  }
  return toplam;
}

/** Bir vakit anahtarının takip edilen farz namazlardan olup olmadığı. */
export function takipEdilebilir(key: string): key is TakipVakti {
  return (TAKIP_VAKITLERI as readonly string[]).includes(key);
}
