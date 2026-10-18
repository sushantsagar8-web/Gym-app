import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultAppSettings, type AppSettings, type CalorieLedgerEntry, type ProgressEntry, type WorkoutSessionLog, type CustomMeal } from "@/shared/fitpath-models";
import { DEFAULT_CALORIE_PROFILE, DEFAULT_MACRO_PREFERENCES, type CalorieProfile, type MacroPreferences } from "@/shared/calorie-calculator";

const KEYS = { settings: "fitpath.settings.v1", workoutLogs: "fitpath.workout-logs.v1", calorieLedger: "fitpath.calorie-ledger.v1", progress: "fitpath.progress.v1", calorieProfile: "fitpath.calorie-profile.v1", macroPreferences: "fitpath.macro-preferences.v1", customMeals: "fitpath.custom-meals.v1", recentFoods: "fitpath.recent-foods.v1", favoriteFoods: "fitpath.favorite-foods.v1" } as const;

async function readJson<T>(key: string, fallback: T): Promise<T> { const raw = await AsyncStorage.getItem(key); if (!raw) return fallback; try { return JSON.parse(raw) as T; } catch { return fallback; } }
async function writeJson<T>(key: string, value: T) { await AsyncStorage.setItem(key, JSON.stringify(value)); }

export const loadAppSettings = async (): Promise<AppSettings> => ({ ...defaultAppSettings, ...(await readJson<Partial<AppSettings>>(KEYS.settings, {})) });
export const saveAppSettings = (value: AppSettings) => writeJson(KEYS.settings, value);
export const loadWorkoutLogs = () => readJson<WorkoutSessionLog[]>(KEYS.workoutLogs, []);
export const saveWorkoutLogs = (value: WorkoutSessionLog[]) => writeJson(KEYS.workoutLogs, value);
export const loadCalorieLedger = () => readJson<CalorieLedgerEntry[]>(KEYS.calorieLedger, []);
export const saveCalorieLedger = (value: CalorieLedgerEntry[]) => writeJson(KEYS.calorieLedger, value);
export const loadProgressEntries = () => readJson<ProgressEntry[]>(KEYS.progress, []);
export const saveProgressEntries = (value: ProgressEntry[]) => writeJson(KEYS.progress, value);
export const loadCalorieProfile = () => readJson<CalorieProfile>(KEYS.calorieProfile, DEFAULT_CALORIE_PROFILE);
export const saveCalorieProfile = (value: CalorieProfile) => writeJson(KEYS.calorieProfile, value);
export const loadMacroPreferences = () => readJson<MacroPreferences>(KEYS.macroPreferences, DEFAULT_MACRO_PREFERENCES);
export const saveMacroPreferences = (value: MacroPreferences) => writeJson(KEYS.macroPreferences, value);
export const loadCustomMeals = () => readJson<CustomMeal[]>(KEYS.customMeals, []);
export const saveCustomMeals = (value: CustomMeal[]) => writeJson(KEYS.customMeals, value);
export const loadRecentFoodIds = () => readJson<string[]>(KEYS.recentFoods, []);
export const saveRecentFoodIds = (value: string[]) => writeJson(KEYS.recentFoods, value);
export const loadFavoriteFoodIds = () => readJson<string[]>(KEYS.favoriteFoods, []);
export const saveFavoriteFoodIds = (value: string[]) => writeJson(KEYS.favoriteFoods, value);
