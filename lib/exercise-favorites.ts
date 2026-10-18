import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "fitpath.exercise-favorites.v1";

export function toggleFavoriteIds(ids: string[], exerciseId: string): string[] {
  return ids.includes(exerciseId) ? ids.filter((id) => id !== exerciseId) : [...ids, exerciseId];
}

export async function loadFavoriteExerciseIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteExerciseIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export { STORAGE_KEY as EXERCISE_FAVORITES_STORAGE_KEY };
