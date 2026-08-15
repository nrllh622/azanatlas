// src/lib/qibla.ts
// @ts-ignore
const SunCalc = require('suncalc');

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export function calculateQiblaBearing(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const λ1 = toRad(lng);
  const φ2 = toRad(KAABA_LAT);
  const λ2 = toRad(KAABA_LNG);
  const Δλ = λ2 - λ1;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

export function calculateDistanceKm(lat: number, lng: number): number {
  const R = 6371;
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δφ = toRad(KAABA_LAT - lat);
  const Δλ = toRad(KAABA_LNG - lng);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Güneşin gökyüzündeki azimutunun kıble açısına en yakın olduğu anı bulur
// (o an, dikey bir cismin gölgesi kıble yönünün tam tersini gösterir)
export function calculateQiblaTime(lat: number, lng: number, date: Date): Date {
  const qibla = calculateQiblaBearing(lat, lng);
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  let bestDiff = 361;
  let bestTime = dayStart;

  for (let minutes = 0; minutes < 24 * 60; minutes += 2) {
    const t = new Date(dayStart.getTime() + minutes * 60 * 1000);
    const pos = SunCalc.getPosition(t, lat, lng);
    // suncalc azimutu güneyden batıya doğru ölçer; kuzeyden saat yönüne çeviriyoruz
    const azimuthFromNorth = (toDeg(pos.azimuth) + 180 + 360) % 360;
    const diff = Math.abs(((azimuthFromNorth - qibla + 540) % 360) - 180);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestTime = t;
    }
  }
  return bestTime;
}
