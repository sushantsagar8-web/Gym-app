import type { ExerciseContent } from "./exercise-content";

export type ProgramGoal = "weight-loss" | "muscle-gain" | "cardio-endurance" | "hiit" | "general-fitness" | "strength" | "flexibility" | "maintenance";

export type Program = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  goals: ProgramGoal[];
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionMinutes: number;
  level: "beginner" | "intermediate" | "advanced";
  location: "home" | "gym" | "cardio";
  priceInr?: number;
  isFree: boolean;
  published: boolean;
  mediaReady: boolean;
  audience?: "men" | "women" | "all";
};

export type WorkoutBlock = { id: string; title: "warm-up" | "main-workout" | "cool-down"; exerciseIds: string[] };
export type WorkoutSessionTemplate = { id: string; programId?: string; title: string; dayLabel: string; blocks: WorkoutBlock[]; estimatedMinutes: number; audience?: "men" | "women" | "all" };
export type SetLog = { setNumber: number; reps?: number; weightKg?: number; durationSeconds?: number; perceivedEffort?: number; completed: boolean };
export type WorkoutSessionLog = { id: string; templateId: string; startedAt: string; completedAt?: string; exerciseSets: Record<string, SetLog[]>; notes?: string; completionPercent: number };
export type ProgressEntry = { id: string; date: string; weightKg?: number; strengthScore?: number; enduranceMinutes?: number; consistencyScore?: number; note?: string; audience?: "men" | "women" | "all" };

export type MealTemplate = { id: string; name: string; cuisine: string; preference: "vegetarian" | "non-vegetarian"; calories: number; proteinGrams: number; carbsGrams: number; fatGrams: number; allergens: string[]; ingredients: string[]; instructions: string[] };
export type CustomMealItem = { id: string; name: string; portionValue: number; portionUnit: "serving" | "grams"; calories: number; proteinGrams: number; carbsGrams: number; fatGrams: number; sourceFoodId?: string };
export type CustomMeal = { id: string; name: string; items: CustomMealItem[]; calories: number; proteinGrams: number; carbsGrams: number; fatGrams: number; createdAt: string; updatedAt: string };
export type CalorieLedgerEntry = { id: string; date: string; mealName: string; calories: number; proteinGrams?: number; carbsGrams?: number; fatGrams?: number; completed: boolean; portionValue?: number; portionUnit?: "serving" | "grams"; source?: "manual" | "estimate" | "template"; foodDescription?: string };
export type RestAlertMode = "sound" | "vibration" | "visual";
export type AppSettings = { language: "english" | "hindi"; soundEnabled: boolean; vibrationEnabled: boolean; restAlertMode: RestAlertMode; keepScreenAwake: boolean; musicBehavior: "keep-playing" | "pause-on-timer"; notificationsEnabled: boolean; workDurationSeconds: number; breakIntervalSeconds: number; darkModeEnabled: boolean };

export type ContentBundle = { exercises: ExerciseContent[]; programs: Program[]; sessions: WorkoutSessionTemplate[]; meals: MealTemplate[] };
export type AudienceSchedule = { audience: "men" | "women"; weekLabel: string; sessions: WorkoutSessionTemplate[] };
export type EngagementEvent = { id: string; type: "onboarding-started" | "onboarding-step-completed" | "onboarding-completed" | "onboarding-abandoned" | "curated-workout-impression" | "curated-workout-started" | "curated-exercise-completed" | "curated-exercise-skipped" | "curated-workout-finished"; audience: "men" | "women" | "all"; occurredAt: string; sessionId?: string; exerciseId?: string; step?: number; metadata?: Record<string, string | number | boolean> };

export const defaultAppSettings: AppSettings = { language: "english", soundEnabled: true, vibrationEnabled: true, restAlertMode: "sound", keepScreenAwake: true, musicBehavior: "keep-playing", notificationsEnabled: false, workDurationSeconds: 30, breakIntervalSeconds: 20, darkModeEnabled: false };

export function getNextProgression(current: { reps?: number; weightKg?: number; restSeconds?: number }, target: { reps?: number; weightKg?: number; restSeconds?: number }) {
  return {
    reps: current.reps !== undefined && target.reps !== undefined ? Math.min(target.reps, current.reps + 1) : current.reps,
    weightKg: current.weightKg !== undefined && target.weightKg !== undefined ? Math.min(target.weightKg, Number((current.weightKg + 1.25).toFixed(2))) : current.weightKg,
    restSeconds: current.restSeconds !== undefined && target.restSeconds !== undefined ? Math.max(target.restSeconds, current.restSeconds - 5) : current.restSeconds,
  };
}

export const starterPrograms: Program[] = [
  { id: "program.foundation-strength", slug: "foundation-strength", title: "Foundation strength", subtitle: "Build a consistent base", description: "A structured progression for strength and general fitness, ready for your licensed exercise references.", goals: ["strength", "general-fitness", "muscle-gain"], durationWeeks: 4, sessionsPerWeek: 3, sessionMinutes: 30, level: "beginner", location: "home", isFree: true, published: true, mediaReady: false },
  { id: "program.stronger-at-home", slug: "stronger-at-home", title: "Stronger at home", subtitle: "Minimal equipment, clear direction", description: "Short home sessions organized around repeatable movement patterns and progressive overload.", goals: ["muscle-gain", "strength"], durationWeeks: 6, sessionsPerWeek: 4, sessionMinutes: 35, level: "intermediate", location: "home", priceInr: 499, isFree: false, published: true, mediaReady: false },
];

export const starterMeals: MealTemplate[] = [
  { id: "meal-paneer-bowl", name: "Paneer power bowl", cuisine: "North Indian", preference: "vegetarian", calories: 520, proteinGrams: 28, carbsGrams: 54, fatGrams: 20, allergens: ["dairy"], ingredients: ["paneer", "rice", "vegetables"], instructions: ["Prepare the rice.", "Cook paneer with vegetables and spices.", "Serve together."] },
  { id: "meal-chicken-bowl", name: "Chicken grain bowl", cuisine: "Indian fusion", preference: "non-vegetarian", calories: 560, proteinGrams: 38, carbsGrams: 58, fatGrams: 18, allergens: [], ingredients: ["chicken", "millet", "vegetables"], instructions: ["Cook the grain.", "Grill the chicken thoroughly.", "Add vegetables and serve."] },
];
