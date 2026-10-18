import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ExerciseContent } from "@/shared/exercise-content";

export type CustomWorkoutStep = {
  exerciseId: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
};

export type CustomWorkout = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  steps: CustomWorkoutStep[];
};

const KEY = "fitpath.custom-workouts.v1";

async function readAll(): Promise<CustomWorkout[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as CustomWorkout[]; } catch { return []; }
}

export async function loadCustomWorkouts() { return readAll(); }
export async function loadCustomWorkout(id: string) { return (await readAll()).find((workout) => workout.id === id); }
export async function saveCustomWorkout(workout: CustomWorkout) {
  const all = await readAll();
  const next = [...all.filter((item) => item.id !== workout.id), workout];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return workout;
}
export async function deleteCustomWorkout(id: string) {
  await AsyncStorage.setItem(KEY, JSON.stringify((await readAll()).filter((workout) => workout.id !== id)));
}

export function makeCustomWorkoutStep(exercise: ExerciseContent): CustomWorkoutStep {
  return exercise.prescription.mode === "duration"
    ? { exerciseId: exercise.id, sets: exercise.prescription.defaultSets, durationSeconds: exercise.prescription.defaultDurationSeconds ?? 30, restSeconds: exercise.prescription.defaultRestSeconds }
    : { exerciseId: exercise.id, sets: exercise.prescription.defaultSets, reps: exercise.prescription.defaultReps ?? 10, restSeconds: exercise.prescription.defaultRestSeconds };
}
