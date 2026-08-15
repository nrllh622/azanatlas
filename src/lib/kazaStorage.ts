// src/lib/kazaStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'azanatlas_kaza_counts_v2';

export type KazaCategory = 'sabah' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi' | 'vitr' | 'oruc';

export type KazaCounts = Record<KazaCategory, number>;

const DEFAULT_COUNTS: KazaCounts = {
  sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitr: 0, oruc: 0,
};

export async function loadKazaCounts(): Promise<KazaCounts> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_COUNTS, ...JSON.parse(raw) } : { ...DEFAULT_COUNTS };
  } catch {
    return { ...DEFAULT_COUNTS };
  }
}

export async function saveKazaCounts(counts: KazaCounts): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}
