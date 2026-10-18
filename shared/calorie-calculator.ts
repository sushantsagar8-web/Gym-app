export type CalorieSex = "male" | "female";
export type CalorieGoal = "loss" | "maintain" | "gain";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very-active";

export type CalorieProfile = {
  sex: CalorieSex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
  goal: CalorieGoal;
};

export type MacroPreferences = {
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
  proteinGrams: number | null;
};

export type MacroTargets = {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
};

export type CalorieResult = {
  bmr: number;
  maintenanceCalories: number;
  targetCalories: number;
  adjustmentCalories: number;
  weeklyChangeKgEstimate: number;
  macros: MacroTargets;
};

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  "very-active": 1.725,
};

export const GOAL_ADJUSTMENTS: Record<CalorieGoal, number> = { loss: -400, maintain: 0, gain: 250 };

export const DEFAULT_MACRO_PREFERENCES: MacroPreferences = { proteinPercent: 25, carbsPercent: 50, fatPercent: 25, proteinGrams: null };

export function calculateMacros(profile: CalorieProfile, targetCalories: number, preferences: MacroPreferences = DEFAULT_MACRO_PREFERENCES): MacroTargets {
  const proteinGrams = preferences.proteinGrams ?? Math.round((targetCalories * preferences.proteinPercent / 100) / 4);
  const proteinCalories = proteinGrams * 4;
  const remainingCalories = Math.max(0, targetCalories - proteinCalories);
  const nonProteinPercent = Math.max(1, preferences.carbsPercent + preferences.fatPercent);
  const carbsCalories = Math.round(remainingCalories * preferences.carbsPercent / nonProteinPercent);
  const fatCalories = Math.max(0, remainingCalories - carbsCalories);
  const fatGrams = Math.round(fatCalories / 9);
  const carbsGrams = Math.round(carbsCalories / 4);
  return { proteinGrams, carbsGrams, fatGrams, proteinCalories, carbsCalories: carbsGrams * 4, fatCalories: fatGrams * 9 };
}

export function calculateCalories(profile: CalorieProfile, preferences: MacroPreferences = DEFAULT_MACRO_PREFERENCES): CalorieResult {
  const bmr = profile.sex === "male"
    ? 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5
    : 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age - 161;
  const maintenanceCalories = Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activity]);
  const adjustmentCalories = GOAL_ADJUSTMENTS[profile.goal];
  const targetCalories = Math.max(1200, maintenanceCalories + adjustmentCalories);
  return { bmr: Math.round(bmr), maintenanceCalories, targetCalories, adjustmentCalories, weeklyChangeKgEstimate: Number(((adjustmentCalories * 7) / 7700).toFixed(2)), macros: calculateMacros(profile, targetCalories, preferences) };
}

export const DEFAULT_CALORIE_PROFILE: CalorieProfile = { sex: "male", age: 30, heightCm: 170, weightKg: 70, activity: "moderate", goal: "maintain" };
