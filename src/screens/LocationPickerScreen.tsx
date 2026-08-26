// src/screens/LocationPickerScreen.tsx
//
// Madde 4 (devir dosyası — bu tur): bu ekran hâlâ kendi özel başlığını
// çiziyordu (backArrow/header metinleri), ScreenHeader/IslamicPattern
// kullanmıyordu — anasayfa dışındaki ekranlar arasında görsel tutarsızlık
// yaratıyordu. Şimdi Ayarlar/Tesbih/Kıble gibi ekranlarla aynı ortak
// başlık bileşenine ve token ölçeğine geçirildi.

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { colors, spacing, radius, typography, fontSize, lineHeight, elevation } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Icon from '../components/Icon';
import { TURKEY_PROVINCES, Province } from '../data/turkeyLocations';
import { DISTRICT_COORDS } from '../data/districtCoords';
import { GLOBAL_COUNTRIES, GlobalCountry } from '../data/globalLocations';
import { useLocationContext } from '../context/LocationContext';
import { useCalculationSettings } from '../context/CalculationSettingsContext';
import { useCeviri } from '../i18n/DilContext';

interface Props {
  onDone: () => void;
}

// Gerçek ilçe koordinatı yoksa (henüz DISTRICT_COORDS'a eklenmemiş il), ilin
// yaklaşık merkezine düşer — bu 10 ilin il-geneli ortalama noktaları
const PROVINCE_FALLBACK: Record<string, { lat: number; lng: number }> = {
  'İstanbul': { lat: 41.0082, lng: 28.9784 },
  'Ankara': { lat: 39.9334, lng: 32.8597 },
  'İzmir': { lat: 38.4237, lng: 27.1428 },
  'Bursa': { lat: 40.1826, lng: 29.0669 },
  'Antalya': { lat: 36.8841, lng: 30.7056 },
  'Adana': { lat: 37.0, lng: 35.3213 },
  'Konya': { lat: 37.8667, lng: 32.4833 },
  'Gaziantep': { lat: 37.0662, lng: 37.3833 },
  'Kayseri': { lat: 38.7333, lng: 35.4833 },
  'Mersin': { lat: 36.8, lng: 34.6333 },
};
const DEFAULT_FALLBACK = { lat: 39.9208, lng: 32.8541 };

function getCoordsFor(il: string, ilce: string) {
  const exact = DISTRICT_COORDS[`${il}|${ilce}`];
  if (exact) return exact;
  return PROVINCE_FALLBACK[il] || DEFAULT_FALLBACK;
}

// Madde 4 (bu tur): GPS ile konum alındığında Android'in native reverse-geocode
// sonucu (`place.region`/`place.subregion`) uygulamanın kendi 81 il / ilçe
// listesindeki (turkeyLocations.ts) YAZIM ile birebir aynı gelmeyebiliyor —
// örn. "İstanbul İli", baştaki/sondaki boşluklar, ya da nadiren ilçe hiç
// dönmeyebiliyor. Bu, GPS'ten dönen il adının diyanetSehirIds.ts'teki tam
// eşleşme aramasında bulunamayıp "Diyanet verisine ulaşılamadı" uyarısına yol
// açan asıl nedendi (diyanetSehirIds.ts'e ayrıca normalize edilmiş arama
// eklendi — bkz. o dosya). Burada ayrıca GPS sonucunu, uygulamanın kendi
// bilinen il/ilçe listesindeki EN YAKIN karşılığa "onarmak" için normalize
// edilmiş bir eşleştirme yapılıyor; böylece hem Diyanet sorgusu hem de
// uygulama içi il/ilçe gösterimi tutarlı ve güvenilir hale geliyor.
function normalizeTrForMatch(s: string): string {
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

// GPS'ten dönen ham il adını, uygulamanın bilinen 81 il listesindeki tam
// karşılığına çözer. Bulamazsa ham adı olduğu gibi geri döner (en azından
// bir isim gösterilsin diye) — yalnızca Diyanet sorgusu tarafı zaten kendi
// normalize aramasına sahip olduğu için bu durumda da sessizce yerele düşer.
function resolveKnownIl(rawIl: string): string {
  const norm = normalizeTrForMatch(rawIl);
  const found = TURKEY_PROVINCES.find((p) => normalizeTrForMatch(p.name) === norm);
  if (found) return found.name;
  const partial = TURKEY_PROVINCES.find(
    (p) => norm.includes(normalizeTrForMatch(p.name)) && p.name.length >= 3
  );
  return partial ? partial.name : rawIl;
}

// GPS'ten dönen ham ilçe adını, çözülen ilin bilinen ilçe listesindeki tam
// karşılığına çözer (varsa). Bulamazsa (ör. ilçe listesi henüz "Merkez" ile
// temsil edilen 71 il için) ham adı olduğu gibi geri döner.
function resolveKnownIlce(resolvedIl: string, rawIlce: string): string {
  const province = TURKEY_PROVINCES.find((p) => p.name === resolvedIl);
  if (!province || !rawIlce) return rawIlce;
  const norm = normalizeTrForMatch(rawIlce);
  const found = province.districts.find((d) => normalizeTrForMatch(d.name) === norm);
  return found ? found.name : rawIlce;
}

// Madde 9 (bu tur): Türkiye dışındaki Faz-1 ülkeleri için manuel ülke→şehir
// akışı eklendi. 'country' → 'city' yeni akış (globalLocations.ts); Türkiye
// seçilirse mevcut 'province' → 'district' akışına (il/ilçe düzeyi) yönlenir
// — o veri seti (TURKEY_PROVINCES/DISTRICT_COORDS) korunuyor, DEĞİŞMEDİ.
type Mode = 'list' | 'country' | 'province' | 'district' | 'city';

export default function LocationPickerScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const { locations, activeId, setActiveId, addLocation, removeLocation } = useLocationContext();
  const { setAutoMethod } = useCalculationSettings();
  const { t } = useCeviri();
  const [mode, setMode] = useState<Mode>('list');
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<GlobalCountry | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const useGps = async () => {
    setGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsLoading(false);
        return;
      }

      // Madde 1 (bu tur): "İzin verildi" (`status === 'granted'`) yalnızca
      // UYGULAMANIN konumu kullanma İZNİNİ gösterir — telefonun konum
      // SERVİSİNİN (GPS'in) fiilen AÇIK olduğunu göstermez. Konum servisi
      // kapalıyken önceki kod doğrudan `getCurrentPositionAsync`'e geçiyordu;
      // bu ya reddediliyor ya da Android'in kendi "Konumu Etkinleştir"
      // sistem diyaloğunu tetikliyordu — ama kod bu diyaloğun SONUCUNU hiç
      // beklemiyordu, `catch` bloğu hatayı sessizce yutup `gpsLoading`'i
      // kapatıyordu. Kullanıcı diyalogtan konumu açtığında uygulama bunu
      // öğrenmiyordu; ikinci "GPS/Konum ile Ekle" basışında konum artık açık
      // olduğu için akış baştan başlayıp çalışıyordu.
      //
      // Çözüm: Android'de önce `hasServicesEnabledAsync()` ile servisin açık
      // olup olmadığı doğrudan sorgulanıyor. Kapalıysa,
      // `enableNetworkProviderAsync()` çağrılıyor — bu, `expo-location`'ın
      // Android'e özgü fonksiyonu; sistemin "Konumu Etkinleştir" diyaloğunu
      // AÇAR ve kullanıcı "Evet" dediğinde promise'i RESOLVE ederek koda
      // aynı çağrı içinde devam etme imkânı verir (kullanıcı reddederse
      // reject eder, `catch` bloğuna düşer). Böylece kullanıcı diyalogda
      // konumu etkinleştirdiği AN, ikinci bir buton basışına gerek kalmadan
      // konum alınıp ekleniyor. iOS'ta bu API yoktur (iOS'ta konum servisi
      // sistem ayarlarından kapatılır, uygulama içinden açtırılamaz) — bu
      // yüzden yalnızca Android'de çalıştırılıyor.
      if (Platform.OS === 'android') {
        const hizmetAcik = await Location.hasServicesEnabledAsync();
        if (!hizmetAcik) {
          await Location.enableNetworkProviderAsync();
        }
      }

      const position = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      const countryCode = place?.isoCountryCode || 'TR';
      const rawIl = place?.region || place?.city || t('gpsKonumu');
      const rawIlce = place?.subregion || place?.district || place?.city || '';
      // Madde 4 (bu tur): sadece Türkiye'deyken bilinen il/ilçe listesine göre
      // "onarım" yapılır — bu normalize eşleştirme yalnızca TURKEY_PROVINCES
      // için anlamlı (diğer ülkelerde ham ad zaten yeterli).
      const il = countryCode === 'TR' ? resolveKnownIl(rawIl) : rawIl;
      const ilce = countryCode === 'TR' ? resolveKnownIlce(il, rawIlce) : rawIlce;
      addLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        il,
        ilce,
        countryCode,
        isGps: true,
      });
      // Madde 5 (bu tur): konum GPS ile değiştirildiğinde Ayarlar'daki
      // "Otomatik" hesaplama yöntemi de otomatik açılır — uygulama yeni
      // konumun ülkesine göre doğru yöntemi (ör. Türkiye→Diyanet) kendiliğinden
      // seçip tüm vakitleri buna göre yeniden hesaplar (bkz. prayerCalculator.ts
      // içindeki getMethodForCountry — autoMethod açıkken zaten ülkeye göre
      // otomatik yöntem seçiyor, ekstra bir "yeniden hesapla" çağrısına gerek
      // yok çünkü HomeScreen zaten location/autoMethod değiştiğinde useEffect
      // ile yeniden hesaplıyor).
      setAutoMethod(true);
      onDone();
    } catch (e) {
      // sessizce yut
    } finally {
      setGpsLoading(false);
    }
  };

  if (mode === 'list') {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title={t('sehriDegistir')} icon="konum" onClose={onDone} />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listIcerik}
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, item.id === activeId && styles.rowActive]}
              onPress={() => {
                setActiveId(item.id);
                onDone();
              }}
              activeOpacity={0.75}
            >
              <View style={styles.rowTextWrap}>
                {item.isGps && <Icon name="konum" size={15} color={colors.copper} />}
                <Text style={styles.rowText}>
                  {item.il} · {item.ilce}
                </Text>
              </View>
              {locations.length > 1 && (
                <TouchableOpacity onPress={() => removeLocation(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.deleteText}>{t('sil')}</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={useGps} disabled={gpsLoading} activeOpacity={0.85}>
            <View style={styles.actionBtnInner}>
              <Icon name="konum" size={16} color={colors.textOnDark} />
              <Text style={styles.actionBtnText}>{gpsLoading ? t('konumAliniyor') : t('gpsIleEkle')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnIkincil} onPress={() => setMode('country')} activeOpacity={0.75}>
            <Text style={styles.actionBtnIkincilText}>{t('konumEkle')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Madde 9 (bu tur): ülke seçimi — en üstte Türkiye (kendi il/ilçe akışına
  // yönlenir), altında Faz-1'in diğer hedef ülkeleri (globalLocations.ts).
  if (mode === 'country') {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title={t('ulkeSec')} icon="konum" onClose={() => setMode('list')} />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listIcerik}
          data={GLOBAL_COUNTRIES}
          keyExtractor={(item) => item.code}
          ListHeaderComponent={
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.75}
              onPress={() => setMode('province')}
            >
              <Text style={styles.rowText}>{t('turkiyeIlIlceSecerek')}</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.75}
              onPress={() => {
                setSelectedCountry(item);
                setMode('city');
              }}
            >
              <Text style={styles.rowText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Madde 9 (bu tur): Türkiye dışı ülkeler için düz şehir listesi — il/ilçe
  // hiyerarşisi yerine (bkz. globalLocations.ts'teki kapsam açıklaması).
  if (mode === 'city') {
    return (
      <View style={styles.wrap}>
        <ScreenHeader
          title={t('sehirSec')}
          subtitle={selectedCountry?.name}
          icon="konum"
          onClose={() => setMode('country')}
        />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listIcerik}
          data={selectedCountry?.cities ?? []}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.75}
              onPress={() => {
                addLocation({
                  latitude: item.lat,
                  longitude: item.lng,
                  il: selectedCountry!.name,
                  ilce: item.name,
                  countryCode: selectedCountry!.code,
                });
                // Madde 5 (bu tur): bkz. useGps içindeki aynı satırın yorumu.
                setAutoMethod(true);
                onDone();
              }}
            >
              <Text style={styles.rowText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  if (mode === 'province') {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title={t('ilSec')} icon="konum" onClose={() => setMode('country')} />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listIcerik}
          data={TURKEY_PROVINCES}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.75}
              onPress={() => {
                setSelectedProvince(item);
                setMode('district');
              }}
            >
              <Text style={styles.rowText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title={t('ilceSec')}
        subtitle={selectedProvince?.name}
        icon="konum"
        onClose={() => setMode('province')}
      />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listIcerik}
        data={selectedProvince?.districts ?? []}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.75}
            onPress={() => {
              const coords = getCoordsFor(selectedProvince!.name, item.name);
              addLocation({
                latitude: coords.lat,
                longitude: coords.lng,
                il: selectedProvince!.name,
                ilce: item.name,
                countryCode: 'TR',
              });
              // Madde 5 (bu tur): bkz. useGps içindeki aynı satırın yorumu.
              setAutoMethod(true);
              onDone();
            }}
          >
            <Text style={styles.rowText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream },
  list: { flex: 1 },
  listIcerik: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowActive: { borderColor: colors.primaryBright, borderWidth: 2 },
  rowTextWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  rowText: {
    fontFamily: typography.bodyBold,
    color: colors.textOnLight,
    fontSize: fontSize.bodyLg,
    lineHeight: lineHeight.bodyLg,
    flexShrink: 1,
  },
  deleteText: { fontFamily: typography.bodyBold, color: colors.danger, fontSize: fontSize.small },
  actionBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    ...elevation.card,
  },
  actionBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  actionBtnText: { fontFamily: typography.bodyBold, color: colors.textOnDark, fontSize: fontSize.body },
  actionBtnIkincil: {
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  actionBtnIkincilText: { fontFamily: typography.bodyBold, color: colors.primaryDark, fontSize: fontSize.body },
});
