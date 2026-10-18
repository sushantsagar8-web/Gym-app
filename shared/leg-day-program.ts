import type { ExerciseContent } from "./exercise-content";
import { legsExercises } from "./legs-content";

export type LegDayStep = {
  exerciseId: string;
  order: number;
  block: "warm-up" | "strength" | "accessory";
  sets: number;
  reps: number;
  restSeconds: number;
};

export const legDayProgram = {
  id: "program.leg-day",
  title: "Leg Day",
  subtitle: "A balanced lower-body session for quads, glutes, hamstrings, inner thighs, and calves.",
  estimatedMinutes: 34,
  steps: [
    { exerciseId: "exercise.legs-close-foot-squat", order: 1, block: "warm-up", sets: 3, reps: 10, restSeconds: 60 },
    { exerciseId: "exercise.legs-smith-squat", order: 2, block: "strength", sets: 3, reps: 8, restSeconds: 75 },
    { exerciseId: "exercise.legs-glutes-hamstrings", order: 3, block: "strength", sets: 3, reps: 10, restSeconds: 75 },
    { exerciseId: "exercise.legs-single-leg-hamstring", order: 4, block: "accessory", sets: 2, reps: 10, restSeconds: 60 },
    { exerciseId: "exercise.legs-inner-thigh-dumbbell-squat", order: 5, block: "accessory", sets: 2, reps: 12, restSeconds: 60 },
    { exerciseId: "exercise.legs-calves", order: 6, block: "accessory", sets: 3, reps: 15, restSeconds: 45 },
  ] satisfies LegDayStep[],
} as const;

export const legDayExercises: ExerciseContent[] = legDayProgram.steps
  .map((step) => legsExercises.find((exercise) => exercise.id === step.exerciseId))
  .filter((exercise): exercise is ExerciseContent => Boolean(exercise));

export const legFocusOptions = ["quadriceps", "hamstrings", "glutes", "inner-thigh", "calves"] as const;
export type LegFocus = (typeof legFocusOptions)[number];

const legFocusLabels: Record<LegFocus, string> = {
  quadriceps: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  "inner-thigh": "Inner Thigh",
  calves: "Calves",
};

export function generateLegDayProgram(selectedFocuses: readonly string[] = ["quadriceps"]) {
  const focuses = Array.from(new Set(selectedFocuses.filter((focus): focus is LegFocus => legFocusOptions.includes(focus as LegFocus))));
  const normalizedFocuses: LegFocus[] = focuses.length > 0 ? focuses : ["quadriceps"];
  const exercisesPerFocus = normalizedFocuses.length <= 2 ? 3 : 2;
  const selectedExercises: ExerciseContent[] = [];

  normalizedFocuses.forEach((focus) => {
    const matches = legsExercises.filter((exercise) => exercise.tags.includes(focus));
    const unusedMatches = matches.filter((exercise) => !selectedExercises.some((selected) => selected.id === exercise.id));
    const chosen = unusedMatches.slice(0, exercisesPerFocus);

    // Prefer unique exercises across focus areas, but preserve the requested quota
    // when a focus overlaps heavily with an earlier selection.
    if (chosen.length < exercisesPerFocus) {
      chosen.push(...matches.slice(0, exercisesPerFocus - chosen.length));
    }
    selectedExercises.push(...chosen);
  });

  const steps: LegDayStep[] = selectedExercises.slice(0, normalizedFocuses.length > 2 ? 6 : normalizedFocuses.length * exercisesPerFocus).map((exercise, index) => ({
    exerciseId: exercise.id,
    order: index + 1,
    block: index < 2 ? "strength" : "accessory",
    sets: index < 2 ? 3 : 2,
    reps: index < 2 ? 8 : 10,
    restSeconds: index < 2 ? 75 : 60,
  }));

  const focusLabel = normalizedFocuses.map((focus) => legFocusLabels[focus]).join(" + ");
  return {
    id: legDayProgram.id,
    title: "Leg Day",
    subtitle: `${focusLabel} focus · ${steps.length} exercises selected for today.`,
    estimatedMinutes: steps.length <= 3 ? 18 : 34,
    steps,
    focuses: normalizedFocuses,
  } as const;
}

export default legDayProgram;
