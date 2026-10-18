import type { ExerciseContent } from "./exercise-content";
import { bicepsExercises } from "./biceps-content";
import { tricepsExercises } from "./triceps-content";
import { chestExercises } from "./chest-content";
import { gymBackExercises } from "./gym-back-content";

export type UpperBodyProgramStep = {
  exerciseId: string;
  order: number;
  block: "warm-up" | "strength" | "accessory";
  sets: number;
  reps: number;
  restSeconds: number;
};

type ProgramDefinition = {
  id: string;
  title: string;
  subtitle: string;
  exercises: ExerciseContent[];
  focusOptions: readonly string[];
  labels: Record<string, string>;
};

export const chestProgram = {
  id: "program.chest-focus",
  title: "Chest Focus",
  subtitle: "A flexible chest session built around the regions you want to emphasize.",
  focusOptions: ["upper-chest", "mid-chest", "inner-chest", "lower-chest"] as const,
  labels: { "upper-chest": "Upper chest", "mid-chest": "Mid chest", "inner-chest": "Inner chest", "lower-chest": "Lower chest" },
};

export const backProgram = {
  id: "program.back-focus",
  title: "Back Focus",
  subtitle: "A targeted back session combining your selected pulling areas.",
  focusOptions: ["lats", "upper-back", "mid-back", "lower-back"] as const,
  labels: { lats: "Lats", "upper-back": "Upper back", "mid-back": "Mid back", "lower-back": "Lower back" },
};

export const armsProgram = {
  id: "program.arms-focus",
  title: "Arms Focus",
  subtitle: "A focused arm session built around the muscles you want to train today.",
  focusOptions: ["biceps", "triceps", "brachialis", "forearms"] as const,
  labels: { biceps: "Biceps", triceps: "Triceps", brachialis: "Brachialis", forearms: "Forearms" },
};

function focusText(exercise: ExerciseContent) {
  return [exercise.name, exercise.shortDescription, ...exercise.primaryMuscles, ...exercise.secondaryMuscles, ...exercise.tags].join(" ").toLowerCase();
}

export function exerciseMatchesFocus(exercise: ExerciseContent, focus: string) {
  const text = focusText(exercise);
  const aliases: Record<string, string[]> = {
    "upper-chest": ["upper chest", "upper_chest", "incline"],
    "mid-chest": ["mid chest", "middle chest", "bench press", "chest press", "dumbbell press"],
    "inner-chest": ["inner chest", "inner_chest"],
    "lower-chest": ["lower chest", "decline"],
    lats: ["lat", "lats", "pulldown"],
    "upper-back": ["upper back", "upper_back", "rear delt", "t-bar row"],
    "mid-back": ["mid back", "middle back", "barbell row", "cable row", "dumbbell row"],
    "lower-back": ["lower back", "lower_back"],
    biceps: ["biceps", "bicep"],
    triceps: ["triceps", "tricep"],
    brachialis: ["brachialis", "hammer curl", "reverse grip"],
    forearms: ["forearm", "forearms", "wrist"],
  };
  return (aliases[focus] ?? [focus]).some((alias) => text.includes(alias));
}

function generateProgram(definition: ProgramDefinition, selectedFocuses: readonly string[] = [definition.focusOptions[0]]) {
  const valid = Array.from(new Set(selectedFocuses.filter((focus) => definition.focusOptions.includes(focus))));
  const focuses = valid.length > 0 ? valid : [definition.focusOptions[0]];
  const exercisesPerFocus = focuses.length <= 2 ? 3 : 2;
  const selectedExercises: ExerciseContent[] = [];

  focuses.forEach((focus) => {
    const matches = definition.exercises.filter((exercise) => exerciseMatchesFocus(exercise, focus));
    const unusedMatches = matches.filter((exercise) => !selectedExercises.some((selected) => selected.id === exercise.id));
    const chosen = unusedMatches.slice(0, exercisesPerFocus);
    if (chosen.length < exercisesPerFocus) {
      const unusedCatalog = definition.exercises.filter((exercise) => !selectedExercises.some((selected) => selected.id === exercise.id) && !chosen.some((selected) => selected.id === exercise.id));
      chosen.push(...unusedCatalog.slice(0, exercisesPerFocus - chosen.length));
    }
    if (chosen.length < exercisesPerFocus) chosen.push(...matches.slice(0, exercisesPerFocus - chosen.length));
    selectedExercises.push(...chosen);
  });

  const maxSteps = focuses.length > 2 ? 6 : focuses.length * exercisesPerFocus;
  const steps: UpperBodyProgramStep[] = selectedExercises.slice(0, maxSteps).map((exercise, index) => ({
    exerciseId: exercise.id,
    order: index + 1,
    block: index < 2 ? "strength" : "accessory",
    sets: index < 2 ? 3 : 2,
    reps: index < 2 ? 8 : 10,
    restSeconds: index < 2 ? 75 : 60,
  }));

  return {
    id: definition.id,
    title: definition.title,
    subtitle: `${focuses.map((focus) => definition.labels[focus]).join(" + ")} focus · ${steps.length} exercises selected for today.`,
    estimatedMinutes: steps.length <= 3 ? 18 : 34,
    steps,
    focuses,
  } as const;
}

export function generateChestProgram(selectedFocuses: readonly string[] = [chestProgram.focusOptions[0]]) {
  return generateProgram({ ...chestProgram, exercises: chestExercises }, selectedFocuses);
}

export function generateBackProgram(selectedFocuses: readonly string[] = [backProgram.focusOptions[0]]) {
  return generateProgram({ ...backProgram, exercises: gymBackExercises }, selectedFocuses);
}

export function generateArmsProgram(selectedFocuses: readonly string[] = [armsProgram.focusOptions[0]]) {
  return generateProgram({ ...armsProgram, exercises: [...bicepsExercises, ...tricepsExercises] }, selectedFocuses);
}

export function getUpperBodyProgram(programId: string) {
  if (programId === chestProgram.id) return chestProgram;
  if (programId === backProgram.id) return backProgram;
  if (programId === armsProgram.id) return armsProgram;
  return undefined;
}
