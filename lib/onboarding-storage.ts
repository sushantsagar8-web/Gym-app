import AsyncStorage from "@react-native-async-storage/async-storage";

export type FitnessGoal = "weight-loss" | "muscle-gain" | "cardio-endurance" | "hiit" | "general-fitness" | "strength" | "flexibility" | "maintenance";
export type TrainingContext = "home" | "gym" | "cardio";
export type DietPreference = "vegetarian" | "non-vegetarian";

export type OnboardingPreferences = {
  completed: boolean;
  goals: FitnessGoal[];
  age?: number;
  sex?: "female" | "male" | "prefer-not-to-say";
  curationAudience?: "men" | "women";
  heightCm?: number;
  weightKg?: number;
  activityLevel?: "sedentary" | "light" | "moderate" | "high";
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  sleepHours?: number;
  stressLevel?: "low" | "moderate" | "high";
  medicalLimitations?: string;
  trainingContext?: TrainingContext[];
  equipment?: string[];
  workoutDays?: number;
  sessionMinutes?: number;
  language?: "english" | "hindi";
  dietPreference?: DietPreference;
  cuisine?: string;
  allergies?: string;
  intolerances?: string;
  dislikedFoods?: string;
};

export const defaultPreferences: OnboardingPreferences = { completed: false, goals: [], trainingContext: [], equipment: [], curationAudience: undefined };
const STORAGE_KEY = "fitpath.onboarding.preferences.v1";

export async function loadOnboardingPreferences(): Promise<OnboardingPreferences> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultPreferences;
  try { return { ...defaultPreferences, ...JSON.parse(raw) } as OnboardingPreferences; } catch { return defaultPreferences; }
}

export async function saveOnboardingPreferences(preferences: OnboardingPreferences) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export async function clearOnboardingPreferences() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
