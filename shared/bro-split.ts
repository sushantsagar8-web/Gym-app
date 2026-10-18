import type { ExerciseContent } from "./exercise-content";

export type BroSplitAudience = "men" | "women";
export type BroSplitExperience = "beginner" | "intermediate" | "advanced";
export type BroSplitGroup = "chest-triceps" | "back-biceps" | "shoulders-abs" | "legs-abs" | "rest";
export type BroSplitWeekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export const BRO_SPLIT_WEEKDAYS: readonly BroSplitWeekday[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const BRO_SPLIT_GROUPS: readonly { id: BroSplitGroup; title: string; subtitle: string }[] = [
  { id: "chest-triceps", title: "Chest & Triceps", subtitle: "Pressing and triceps extension" },
  { id: "back-biceps", title: "Back & Biceps", subtitle: "Rows, pulldowns, and curls" },
  { id: "shoulders-abs", title: "Shoulders & Abs", subtitle: "Deltoids, traps, and core" },
  { id: "legs-abs", title: "Legs & Abs", subtitle: "Lower body and core" },
  { id: "rest", title: "Rest day", subtitle: "Recovery, mobility, or an easy walk" },
];

export type BroSplitExerciseConfig = {
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
};

export type BroSplitDay = {
  weekday: BroSplitWeekday;
  group: BroSplitGroup;
  exerciseIds: string[];
  exerciseConfigs?: Record<string, BroSplitExerciseConfig>;
};

export type BroSplitSchedule = {
  id: "bro-split-week";
  audience: BroSplitAudience;
  experience: BroSplitExperience;
  updatedAt: string;
  days: BroSplitDay[];
};

export type BroSplitDayVolume = {
  totalSets: number;
  estimatedDurationSeconds: number;
};

const defaultGroupByDay: Record<BroSplitWeekday, BroSplitGroup> = {
  Monday: "chest-triceps",
  Tuesday: "back-biceps",
  Wednesday: "shoulders-abs",
  Thursday: "legs-abs",
  Friday: "rest",
  Saturday: "rest",
  Sunday: "rest",
};

const beginnerRecommendations: Record<Exclude<BroSplitGroup, "rest">, string[]> = {
  "chest-triceps": [
    "exercise.chest-bench-press",
    "exercise.chest-upper-dumbbell-press",
    "exercise.chest-cable-fly",
    "exercise.triceps-rope-pulldown",
    "exercise.triceps-overhead-dumbbell-extension",
  ],
  "back-biceps": [
    "exercise.gym-back-barbell-row-full",
    "exercise.gym-back-lat-pulldown-upper",
    "exercise.gym-back-cable-mid",
    "exercise.biceps-dumbbell-curl",
    "exercise.biceps-hammer-curl",
  ],
  "shoulders-abs": [
    "exercise.shoulders-press",
    "exercise.shoulders-seated-lateral-raise",
    "exercise.shoulders-rear-delt-raise",
    "exercise.men-abs-crunch",
    "exercise.men-abs-bicycle-crunch",
  ],
  "legs-abs": [
    "exercise.legs-smith-squat",
    "exercise.legs-glutes-hamstrings",
    "exercise.legs-calves",
    "exercise.men-abs-reverse-crunch",
  ],
};

export function canCustomizeBroSplit(experience: BroSplitExperience, customizeMode: boolean): boolean {
  return experience !== "beginner" || customizeMode;
}

export function getBeginnerRecommendations(group: BroSplitGroup, audience: BroSplitAudience): string[] {
  if (group === "rest") return [];
  return beginnerRecommendations[group].map((id) => id.replace("exercise.men-abs-", `exercise.${audience}-abs-`));
}

export function groupMatchesExercise(group: BroSplitGroup, exerciseId: string): boolean {
  if (group === "rest") return false;
  if (group === "chest-triceps") return exerciseId.includes("chest-") || exerciseId.includes("triceps-");
  if (group === "back-biceps") return exerciseId.includes("gym-back-") || exerciseId.includes("biceps-");
  if (group === "shoulders-abs") return exerciseId.includes("shoulders-") || exerciseId.includes("men-abs-") || exerciseId.includes("women-abs-");
  return exerciseId.includes("legs-") || exerciseId.includes("men-abs-") || exerciseId.includes("women-abs-");
}

export function getDefaultExerciseConfig(exercise: ExerciseContent): BroSplitExerciseConfig {
  return exercise.prescription.mode === "duration"
    ? { sets: exercise.prescription.defaultSets, durationSeconds: exercise.prescription.defaultDurationSeconds ?? 30, restSeconds: exercise.prescription.defaultRestSeconds }
    : { sets: exercise.prescription.defaultSets, reps: exercise.prescription.defaultReps ?? 10, restSeconds: exercise.prescription.defaultRestSeconds };
}

/** Estimates work plus between-set rest using the current prescriptions. */
export function getBroSplitDayVolume(day: BroSplitDay, exercisesById: ReadonlyMap<string, ExerciseContent>): BroSplitDayVolume {
  return day.exerciseIds.reduce<BroSplitDayVolume>((summary, exerciseId) => {
    const exercise = exercisesById.get(exerciseId);
    if (!exercise) return summary;
    const config = day.exerciseConfigs?.[exerciseId] ?? getDefaultExerciseConfig(exercise);
    const workSeconds = exercise.prescription.mode === "duration"
      ? config.durationSeconds ?? 0
      : (config.reps ?? 0) * 3;
    return {
      totalSets: summary.totalSets + config.sets,
      estimatedDurationSeconds: summary.estimatedDurationSeconds + (workSeconds * config.sets) + (config.restSeconds * Math.max(0, config.sets - 1)),
    };
  }, { totalSets: 0, estimatedDurationSeconds: 0 });
}

export function getDefaultBroSplitSchedule(audience: BroSplitAudience, experience: BroSplitExperience = "beginner"): BroSplitSchedule {
  return {
    id: "bro-split-week",
    audience,
    experience,
    updatedAt: new Date(0).toISOString(),
    days: BRO_SPLIT_WEEKDAYS.map((weekday) => {
      const group = defaultGroupByDay[weekday];
      const exerciseIds = getBeginnerRecommendations(group, audience);
      return { weekday, group, exerciseIds, exerciseConfigs: {} };
    }),
  };
}

export function normalizeBroSplitSchedule(value: Partial<BroSplitSchedule> | null | undefined, audience: BroSplitAudience, experience: BroSplitExperience): BroSplitSchedule {
  const fallback = getDefaultBroSplitSchedule(audience, experience);
  if (!value?.days?.length) return fallback;
  const byWeekday = new Map(value.days.map((day) => [day.weekday, day]));
  return {
    id: "bro-split-week",
    audience,
    experience,
    updatedAt: value.updatedAt ?? fallback.updatedAt,
    days: BRO_SPLIT_WEEKDAYS.map((weekday) => {
      const existing = byWeekday.get(weekday);
      const group = existing?.group ?? fallback.days.find((day) => day.weekday === weekday)?.group ?? "rest";
      const exerciseIds = existing?.exerciseIds ?? getBeginnerRecommendations(group, audience);
      return { weekday, group, exerciseIds, exerciseConfigs: existing?.exerciseConfigs ?? {} };
    }),
  };
}

export function getExercisesForGroup(exercises: ExerciseContent[], group: BroSplitGroup): ExerciseContent[] {
  return exercises.filter((exercise) => groupMatchesExercise(group, exercise.id));
}

export function getScheduleDay(schedule: BroSplitSchedule, weekday: BroSplitWeekday): BroSplitDay {
  return schedule.days.find((day) => day.weekday === weekday) ?? { weekday, group: "rest", exerciseIds: [], exerciseConfigs: {} };
}
