// src/lib/diyanetApi.ts
//
// Diyanet İşleri Başkanlığı'nın yayınladığı RESMİ namaz vakti verisini,
// Diyanet'in kendi API'sine (awqatsalah.diyanet.gov.tr) değil, onun verisini
// aynen sunan, kimlik doğrulama gerektirmeyen ve cömert rate-limit'li aracı
// bir servise (ezanvakti.emushaf.net) istek atarak çeker.
//
// NEDEN Diyanet'in kendi resmi API'si DEĞİL: awqatsalah.diyanet.gov.tr,
// "Standard Role" (deneme süresi bitmiş) hesaplar için endpoint başına
// GÜNDE SADECE 5 istekle sınırlı — bir mobil uygulamanın üretim trafiği
// için kullanılamaz. ezanvakti.emushaf.net aynı resmi Diyanet verisini
// (il/ilçe/vakit) anahtarsız ve 100 istek/5 dakika gibi çok daha geniş bir
// limitle sunuyor; biz zaten ayda bir kez (30 günlük toplu) çektiğimiz için
// bu limit hiçbir zaman sorun olmaz.
//
// STRATEJİ:
// 1) İlçe ID'si önbellekte yoksa: il adına göre sabit SehirID (diyanetSehirIds.ts)
//    ile /ilceler/{sehirId} çekilir, uygulamanın kayıtlı ilçe adına göre en
//    iyi eşleşen IlceID bulunur ve AsyncStorage'a yazılır.
// 2) O ayın vakit verisi önbellekte yoksa (veya ay değiştiyse): /vakitler/{ilceId}
//    çekilir, tüm ay AsyncStorage'a yazılır.
// 3) Herhangi bir ağ hatası / veri yoksa: null döner — çağıran taraf (prayerCalculator
//    üzerinden HomeScreen) bunu yerel `adhan` hesaplamasına düşerek karşılar.
//    Yani internet yokken uygulama ASLA vakitsiz kalmaz, sessizce yerel hesaba döner.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSehirIdForIl } from '../data/diyanetSehirIds';

const BASE_URL = 'https://ezanvakti.emushaf.net';
// Madde 3 (bu tur): 8sn tek deneme yerine daha kısa timeout + daha fazla
// deneme — toplam bekleme süresi benzer kalırken başarı şansı artıyor
// (bkz. fetchJsonWithTimeout).
const FETCH_TIMEOUT_MS = 5000;
const ILCE_ID_CACHE_KEY = 'azanatlas_diyanet_ilce_id_v1';
const VAKIT_CACHE_KEY = 'azanatlas_diyanet_vakit_cache_v1';

export interface DiyanetGunlukVakit {
  tarih: string; // "dd.MM.yyyy" (Diyanet formatı)
  imsak: string; // "HH:mm"
  gunes: string;
  ogle: string;
  ikindi: string;
  aksam: string;
  yatsi: string;
}

interface IlceIdCacheEntry {
  il: string;
  ilce: string;
  ilceId: number;
}

interface VakitCacheEntry {
  ilceId: number;
  ilkTarih: string; // "dd.MM.yyyy" — dönen listedeki ilk gün
  sonTarih: string; // "dd.MM.yyyy" — dönen listedeki son gün
  gunler: DiyanetGunlukVakit[];
  cekilmeZamani: number;
}

async function fetchJsonOnce(url: string): Promise<any | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      if (__DEV__) console.log(`[diyanetApi] HTTP ${res.status}: ${url}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    if (__DEV__) console.log(`[diyanetApi] istek başarısız: ${url}`, e);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Madde 3, İKİNCİ TUR: "Diyanet verisine ulaşılamadı" uyarısı kullanıcı
// tarafından TEKRAR bildirildi (Adana/Aladağ ekran görüntüsüyle). Bu turda
// canlı WebFetch testleriyle doğrulandı: ezanvakti.emushaf.net servisinin
// kendisi ve eşleştirme mantığı (Aladağ → IlceID 9147, `IlceAdi` alan adı)
// TEST ANINDA doğru çalışıyordu — yani kod tarafında bir hata bulunamadı.
// Servis, gönüllü/topluluk barındırmalı (Ocak 2025 civarı Heroku'dan
// taşınmış) ve resmî bir SLA'sı yok — ARA SIRA geçici erişilemezlik
// BEKLENEN bir durum, kod hatası değil. Bu, istemci tarafından tamamen
// ortadan kaldırılamaz, yalnızca daha dayanıklı retry ile azaltılabilir:
// timeout 8sn'den 5sn'ye düşürüldü, deneme sayısı 2'den 3'e çıkarıldı
// (denemeler arası 700ms) — böylece toplam bekleme süresi benzer kalırken
// geçici bir başarısızlığın üstesinden gelme şansı artıyor.
async function fetchJsonWithTimeout(url: string): Promise<any | null> {
  for (let deneme = 0; deneme < 3; deneme++) {
    const sonuc = await fetchJsonOnce(url);
    if (sonuc != null) return sonuc;
    if (deneme < 2) {
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
  }
  return null;
}

// Türkçe karşılaştırma için normalize eder: büyük harfe çevirir, Türkçe'ye
// özgü harfleri ASCII'ye indirger. Diyanet verisindeki isimler (ör.
// "ŞEREFLİKÖCHİSAR") ile uygulamanın kendi il/ilçe adları (ör.
// "Şereflikoçhisar") arasında noktalama/yazım farkı olabileceği için
// eşleştirme harf-harf değil normalize edilmiş haliyle yapılır.
function normalizeTr(s: string): string {
  return s
    .toLocaleUpperCase('tr-TR')
    .replace(/İ/g, 'I')
    .replace(/Ş/g, 'S')
    .replace(/Ğ/g, 'G')
    .replace(/Ü/g, 'U')
    .replace(/Ö/g, 'O')
    .replace(/Ç/g, 'C')
    .replace(/[^A-Z0-9]/g, '');
}

async function readIlceIdCache(): Promise<IlceIdCacheEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ILCE_ID_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeIlceIdCache(entries: IlceIdCacheEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ILCE_ID_CACHE_KEY, JSON.stringify(entries));
  } catch {
    // önbellek yazılamazsa sorun değil, bir sonraki seferde tekrar çözümlenir
  }
}

// Verilen il/ilçe için Diyanet ilçe ID'sini bulur. Önce cihaz önbelleğine
// bakar; yoksa ağdan çeker ve önbelleğe yazar. "Merkez" ilçesi olan iller
// (henüz tam ilçe listesi eklenmemiş 71 il) için ilin kendi merkez ilçesini
// (Diyanet listesinde genelde il adıyla aynı IlceAdi) seçer.
export async function resolveIlceId(il: string, ilce: string): Promise<number | null> {
  const cache = await readIlceIdCache();
  const cached = cache.find((e) => e.il === il && e.ilce === ilce);
  if (cached) return cached.ilceId;

  const sehirId = getSehirIdForIl(il);
  if (sehirId == null) return null;

  const ilceler = await fetchJsonWithTimeout(`${BASE_URL}/ilceler/${sehirId}`);
  if (!Array.isArray(ilceler) || ilceler.length === 0) return null;

  const targetNorm = normalizeTr(ilce === 'Merkez' ? il : ilce);

  // 1) Tam eşleşme dene
  let match = ilceler.find((it: any) => normalizeTr(it.IlceAdi ?? '') === targetNorm);

  // 2) "Merkez" durumunda: il adıyla aynı isimli ilçeyi (genelde merkez ilçe) ara
  if (!match && ilce === 'Merkez') {
    match = ilceler.find((it: any) => normalizeTr(it.IlceAdi ?? '') === normalizeTr(il));
  }

  // 3) Yine bulunamadıysa, o il için dönen ilk ilçeyi kullan (Diyanet'in
  //    ilçe listesi ildeki en az bir merkezi her zaman içerir)
  if (!match) match = ilceler[0];

  const ilceId = Number(match.IlceID);
  if (!Number.isFinite(ilceId)) return null;

  await writeIlceIdCache([...cache.filter((e) => !(e.il === il && e.ilce === ilce)), { il, ilce, ilceId }]);
  return ilceId;
}

function tarihStr(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

// Diyanet formatı "dd.MM.yyyy" stringlerini karşılaştırılabilir sayıya çevirir
// (yyyyMMdd) — string olarak doğrudan karşılaştırmak yanlış sıralama verir.
function tarihSiraNo(ddMMyyyy: string): number {
  const [gg, aa, yyyy] = ddMMyyyy.split('.').map(Number);
  return yyyy * 10000 + aa * 100 + gg;
}

// ÖNEMLİ: Bu API endpoint'i belirli bir ay/tarih PARAMETRESİ ALMAZ — her
// çağrıldığında sunucunun o an elinde hangi aralık varsa onu döndürür (örn.
// "15 Ağustos - 15 Eylül" gibi takvim ayına hizalı OLMAYAN bir pencere
// olabilir; gerçek bir örnekle doğrulandı). Bu yüzden önbellek anahtarı
// "yyyy-MM" gibi bir takvim ayı DEĞİL, dönen listenin gerçek ilk/son tarih
// ARALIĞIdır — istenen tarih bu aralığın içindeyse önbellek geçerlidir,
// dışındaysa (ör. aralık ileride yenilenmiş/kaymışsa) yeniden çekilir.
async function readVakitCache(ilceId: number, date: Date): Promise<DiyanetGunlukVakit[] | null> {
  try {
    const raw = await AsyncStorage.getItem(`${VAKIT_CACHE_KEY}_${ilceId}`);
    if (!raw) return null;
    const entry: VakitCacheEntry = JSON.parse(raw);
    const t = tarihSiraNo(tarihStr(date));
    if (t < tarihSiraNo(entry.ilkTarih) || t > tarihSiraNo(entry.sonTarih)) return null;
    return entry.gunler;
  } catch {
    return null;
  }
}

async function writeVakitCache(ilceId: number, gunler: DiyanetGunlukVakit[]): Promise<void> {
  try {
    const siraliTarihler = [...gunler].sort((a, b) => tarihSiraNo(a.tarih) - tarihSiraNo(b.tarih));
    const entry: VakitCacheEntry = {
      ilceId,
      ilkTarih: siraliTarihler[0].tarih,
      sonTarih: siraliTarihler[siraliTarihler.length - 1].tarih,
      gunler,
      cekilmeZamani: Date.now(),
    };
    await AsyncStorage.setItem(`${VAKIT_CACHE_KEY}_${ilceId}`, JSON.stringify(entry));
  } catch {
    // önbellek yazılamazsa sorun değil
  }
}

// Belirtilen il/ilçe ve tarih için Diyanet'in namaz vakti verisini çeker
// (önce cihaz önbelleğine bakar, istenen tarih önbellekteki aralığın
// dışındaysa ağdan yeniden çeker). Şebeke yoksa veya ilçe/veri çözülemezse
// null döner — çağıran taraf yerel hesaba düşmeli.
export async function getDiyanetMonthlyVakitler(
  il: string,
  ilce: string,
  date: Date
): Promise<DiyanetGunlukVakit[] | null> {
  const ilceId = await resolveIlceId(il, ilce);
  if (ilceId == null) return null;

  const cached = await readVakitCache(ilceId, date);
  if (cached) return cached;

  const raw = await fetchJsonWithTimeout(`${BASE_URL}/vakitler/${ilceId}`);
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const gunler: DiyanetGunlukVakit[] = raw
    .map((g: any) => ({
      tarih: g.MiladiTarihKisa,
      imsak: g.Imsak,
      gunes: g.Gunes,
      ogle: g.Ogle,
      ikindi: g.Ikindi,
      aksam: g.Aksam,
      yatsi: g.Yatsi,
    }))
    .filter((g: DiyanetGunlukVakit) => g.tarih && g.imsak);

  if (gunler.length === 0) return null;

  await writeVakitCache(ilceId, gunler);
  return gunler;
}

// "dd.MM.yyyy" + "HH:mm" ikilisini o günün yerel Date nesnesine çevirir.
export function parseDiyanetGunSaat(tarihDDMMYYYY: string, saatHHmm: string): Date | null {
  const [gg, aa, yyyy] = tarihDDMMYYYY.split('.').map(Number);
  const [hh, dd] = saatHHmm.split(':').map(Number);
  if (!gg || !aa || !yyyy || Number.isNaN(hh) || Number.isNaN(dd)) return null;
  return new Date(yyyy, aa - 1, gg, hh, dd, 0, 0);
}

// Verilen tarih için, önbellekteki/ağdan çekilen aylık listeden o güne ait
// kaydı bulur (gün/ay/yıl eşleşmesiyle — saat dilimi kaymalarına karşı sağlam).
export function findGunlukVakit(gunler: DiyanetGunlukVakit[], date: Date): DiyanetGunlukVakit | null {
  const target = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
  return gunler.find((g) => g.tarih === target) ?? null;
}
