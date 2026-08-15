// src/lib/kazaStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'azanatlas_kaza_status';

export type KazaStatus = 'prayed' | 'compensated';
export type KazaMap = Record<string, KazaStatus>; // key: "YYYY-MM-DD_vakitKey"

export function makeKey(date: Date, vakitKey: string): string {
  const d = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  return `${d}_${vakitKey}`;
}

export async function loadKazaMap(): Promise<KazaMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function setKazaStatus(key: string, status: KazaStatus): Promise<KazaMap> {
  const map = await loadKazaMap();
  map[key] = status;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  return map;
}
