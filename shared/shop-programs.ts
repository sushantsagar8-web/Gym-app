import type { ExerciseContent } from "./exercise-content";
import { menAbsExercises } from "./men-abs-content";
import { womenAbsExercises } from "./women-abs-content";
import { chestExercises } from "./chest-content";
import { gymBackExercises } from "./gym-back-content";
import { bicepsExercises } from "./biceps-content";
import { tricepsExercises } from "./triceps-content";
import { shouldersExercises } from "./shoulders-content";
import { legsExercises } from "./legs-content";

export type ShopAudience = "men" | "women" | "all";
export type ShopProgramKind = "abs" | "muscle-building" | "general-fitness" | "cardio";
export type MuscleSplit = "bro-split" | "push-pull-days";

export type ShopStep = {
  exerciseId?: string;
  title?: string;
  order: number;
  dayLabel: string;
  block: "warm-up" | "strength" | "conditioning" | "recovery";
  sets?: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds?: number;
  contentStatus: "ready" | "awaiting-video-content";
};

export type ShopProgram = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  audience: ShopAudience;
  kind: ShopProgramKind;
  split?: MuscleSplit;
  estimatedMinutes: number;
  daysPerWeek: number;
  steps: readonly ShopStep[];
};

const ready = (exerciseId: string, order: number, dayLabel: string, block: ShopStep["block"], sets: number, reps: number, restSeconds: number): ShopStep => ({ exerciseId, order, dayLabel, block, sets, reps, restSeconds, contentStatus: "ready" });
const placeholder = (title: string, order: number, dayLabel: string, durationSeconds: number, block: ShopStep["block"] = "conditioning"): ShopStep => ({ title, order, dayLabel, block, durationSeconds, contentStatus: "awaiting-video-content" });

export const shopPrograms: readonly ShopProgram[] = [
  {
    id: "shop.men-abs-foundation",
    title: "Men’s Abs Foundation",
    subtitle: "A focused core progression using the men’s reference library.",
    description: "Three repeatable core sessions that rotate full-abs, lower-abs, and oblique work without routing into the leg program.",
    audience: "men",
    kind: "abs",
    estimatedMinutes: 18,
    daysPerWeek: 3,
    steps: [
      ready("exercise.men-abs-reverse-crunch", 1, "Core A", "warm-up", 3, 12, 45),
      ready("exercise.men-abs-crunch", 2, "Core A", "strength", 3, 15, 45),
      ready("exercise.men-abs-side-plank-hip-lift-right", 3, "Core A", "conditioning", 2, 12, 45),
      ready("exercise.men-abs-leg-lift", 4, "Core B", "strength", 3, 10, 45),
      ready("exercise.men-abs-bicycle-crunch", 5, "Core B", "conditioning", 3, 16, 45),
      ready("exercise.men-abs-toe-touch", 6, "Core B", "conditioning", 2, 12, 45),
    ],
  },
  {
    id: "shop.women-abs-foundation",
    title: "Women’s Abs Foundation",
    subtitle: "A focused core progression using the women’s reference library.",
    description: "A three-day core rotation built from the women’s licensed reference videos, with clear progression and manageable rest periods.",
    audience: "women",
    kind: "abs",
    estimatedMinutes: 18,
    daysPerWeek: 3,
    steps: [
      ready("exercise.women-abs-full-3", 1, "Core A", "warm-up", 3, 15, 45),
      ready("exercise.women-abs-lower-abs", 2, "Core A", "strength", 3, 12, 45),
      ready("exercise.women-abs-obliques", 3, "Core A", "conditioning", 2, 12, 45),
      ready("exercise.women-abs-full-4", 4, "Core B", "strength", 3, 15, 45),
      ready("exercise.women-abs-middle", 5, "Core B", "conditioning", 3, 12, 45),
      ready("exercise.women-abs-full", 6, "Core B", "conditioning", 2, 30, 45),
    ],
  },
  {
    id: "shop.muscle-building-bro-split",
    title: "Muscle Building · Bro Split",
    subtitle: "Chest & Triceps · Back & Biceps · Shoulders, Traps & Abs · Legs & Abs.",
    description: "A four-day bro split that pairs complementary muscle groups and trains the core on shoulder and leg days. Use progressive overload and scale volume to experience.",
    audience: "all",
    kind: "muscle-building",
    split: "bro-split",
    estimatedMinutes: 44,
    daysPerWeek: 4,
    steps: [
      ready("exercise.chest-bench-press", 1, "Day 1 · Chest & Triceps", "strength", 3, 8, 90),
      ready("exercise.chest-upper-dumbbell-press", 2, "Day 1 · Chest & Triceps", "strength", 3, 10, 75),
      ready("exercise.chest-cable-fly", 3, "Day 1 · Chest & Triceps", "conditioning", 2, 12, 60),
      ready("exercise.triceps-rope-pulldown", 4, "Day 1 · Chest & Triceps", "strength", 3, 10, 60),
      ready("exercise.triceps-overhead-dumbbell-extension", 5, "Day 1 · Chest & Triceps", "conditioning", 2, 12, 45),
      ready("exercise.gym-back-barbell-row-full", 6, "Day 2 · Back & Biceps", "strength", 3, 8, 90),
      ready("exercise.gym-back-lat-pulldown-upper", 7, "Day 2 · Back & Biceps", "strength", 3, 10, 75),
      ready("exercise.gym-back-cable-mid", 8, "Day 2 · Back & Biceps", "conditioning", 2, 12, 60),
      ready("exercise.biceps-dumbbell-curl", 9, "Day 2 · Back & Biceps", "strength", 3, 10, 60),
      ready("exercise.biceps-hammer-curl", 10, "Day 2 · Back & Biceps", "conditioning", 2, 12, 45),
      ready("exercise.shoulders-press", 11, "Day 3 · Shoulders, Traps & Abs", "strength", 3, 8, 75),
      ready("exercise.shoulders-seated-lateral-raise", 12, "Day 3 · Shoulders, Traps & Abs", "conditioning", 3, 12, 60),
      ready("exercise.shoulders-rear-delt-raise", 13, "Day 3 · Shoulders, Traps & Abs", "conditioning", 2, 12, 60),
      ready("exercise.shoulders-traps", 14, "Day 3 · Shoulders, Traps & Abs", "conditioning", 3, 12, 60),
      ready("exercise.men-abs-crunch", 15, "Day 3 · Shoulders, Traps & Abs", "conditioning", 2, 15, 45),
      ready("exercise.men-abs-bicycle-crunch", 16, "Day 3 · Shoulders, Traps & Abs", "conditioning", 2, 16, 45),
      ready("exercise.legs-smith-squat", 17, "Day 4 · Legs & Abs", "strength", 3, 8, 90),
      ready("exercise.legs-glutes-hamstrings", 18, "Day 4 · Legs & Abs", "strength", 3, 10, 75),
      ready("exercise.legs-calves", 19, "Day 4 · Legs & Abs", "conditioning", 3, 15, 45),
      ready("exercise.men-abs-reverse-crunch", 20, "Day 4 · Legs & Abs", "conditioning", 2, 12, 45),
    ],
  },
  {
    id: "shop.muscle-building-push-pull-days",
    title: "Muscle Building · Push & Pull Days",
    subtitle: "Push-only · Pull-only · Legs rotation.",
    description: "Push contains only pressing and triceps movements; Pull contains only back and biceps movements; Legs is a dedicated lower-body day. Repeat the three-day rotation across three to six weekly sessions.",
    audience: "all",
    kind: "muscle-building",
    split: "push-pull-days",
    estimatedMinutes: 40,
    daysPerWeek: 3,
    steps: [
      ready("exercise.chest-bench-press", 1, "Day 1 · Push", "strength", 3, 8, 90),
      ready("exercise.chest-upper-dumbbell-press", 2, "Day 1 · Push", "strength", 3, 10, 75),
      ready("exercise.chest-cable-fly", 3, "Day 1 · Push", "conditioning", 2, 12, 60),
      ready("exercise.shoulders-press", 4, "Day 1 · Push", "strength", 3, 8, 75),
      ready("exercise.triceps-rope-pulldown", 5, "Day 1 · Push", "conditioning", 3, 12, 60),
      ready("exercise.triceps-diamond-pushup", 6, "Day 1 · Push", "conditioning", 2, 12, 45),
      ready("exercise.gym-back-barbell-row-upper", 7, "Day 2 · Pull", "strength", 3, 8, 90),
      ready("exercise.gym-back-lat-pulldown-upper", 8, "Day 2 · Pull", "strength", 3, 10, 75),
      ready("exercise.gym-back-cable-mid", 9, "Day 2 · Pull", "conditioning", 2, 12, 60),
      ready("exercise.biceps-dumbbell-curl", 10, "Day 2 · Pull", "strength", 3, 10, 60),
      ready("exercise.biceps-hammer-curl", 11, "Day 2 · Pull", "conditioning", 2, 12, 45),
      ready("exercise.legs-smith-squat", 12, "Day 3 · Legs", "strength", 3, 8, 90),
      ready("exercise.legs-single-leg-hamstring", 13, "Day 3 · Legs", "strength", 3, 10, 75),
      ready("exercise.legs-glutes-hamstrings", 14, "Day 3 · Legs", "strength", 3, 10, 75),
      ready("exercise.legs-calves", 15, "Day 3 · Legs", "conditioning", 3, 15, 45),
    ],
  },
  {
    id: "shop.general-fitness-foundation",
    title: "General Fitness Foundation",
    subtitle: "Balanced full-body sessions for a broad starting point.",
    description: "A balanced routine combining a push, pull, lower-body, and core movement so the general-fitness card opens a true full-body plan.",
    audience: "all",
    kind: "general-fitness",
    estimatedMinutes: 30,
    daysPerWeek: 3,
    steps: [
      ready("exercise.chest-press-home", 1, "Full Body A", "strength", 3, 10, 60),
      ready("exercise.gym-back-cable-mid", 2, "Full Body A", "strength", 3, 10, 60),
      ready("exercise.legs-close-foot-squat", 3, "Full Body A", "strength", 3, 10, 60),
      ready("exercise.men-abs-crunch", 4, "Full Body A", "conditioning", 2, 15, 45),
      ready("exercise.chest-dumbbell-press", 5, "Full Body B", "strength", 3, 10, 60),
      ready("exercise.gym-back-cable-upper", 6, "Full Body B", "strength", 3, 10, 60),
      ready("exercise.legs-glutes-hamstrings", 7, "Full Body B", "strength", 3, 10, 60),
      ready("exercise.women-abs-middle", 8, "Full Body B", "conditioning", 2, 12, 45),
    ],
  },
  {
    id: "shop.cardio-foundation",
    title: "Cardio Foundation",
    subtitle: "Walking, cycling, rowing, and low-impact intervals prepared for video content.",
    description: "A progressive cardio menu built around moderate aerobic work, low-impact options, and cautious interval progression. Exercise videos will be added when you provide them.",
    audience: "all",
    kind: "cardio",
    estimatedMinutes: 28,
    daysPerWeek: 4,
    steps: [
      placeholder("Brisk walk or treadmill walk", 1, "Day 1 · Steady cardio", 1200, "conditioning"),
      placeholder("Cycling", 2, "Day 2 · Low-impact cardio", 1500, "conditioning"),
      placeholder("Rowing machine", 3, "Day 3 · Intervals", 1200, "conditioning"),
      placeholder("Low-impact bodyweight cardio", 4, "Day 4 · Cardio circuit", 900, "conditioning"),
    ],
  },
];

export function getShopProgram(programId: string | undefined, split?: string): ShopProgram | undefined {
  if (programId === "shop.muscle-building") {
    return shopPrograms.find((program) => program.split === (split === "bro-split" ? "bro-split" : "push-pull-days"));
  }
  return shopPrograms.find((program) => program.id === programId);
}

export function getShopProgramExercises(program: ShopProgram): ExerciseContent[] {
  const catalogs = [menAbsExercises, womenAbsExercises, chestExercises, gymBackExercises, bicepsExercises, tricepsExercises, shouldersExercises, legsExercises];
  const exercises = catalogs.flat();
  return program.steps.flatMap((step) => (step.exerciseId ? exercises.filter((exercise) => exercise.id === step.exerciseId) : []));
}

export const muscleBuildingSplitOptions = [
  { id: "bro-split" as const, title: "Bro Split", subtitle: "Chest & Triceps · Back & Biceps · Shoulders, Traps & Abs · Legs & Abs" },
  { id: "push-pull-days" as const, title: "Push & Pull Days", subtitle: "Push · Pull · Legs rotation" },
];

export default shopPrograms;
