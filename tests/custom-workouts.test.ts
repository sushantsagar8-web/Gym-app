import { describe, expect, it } from "vitest";
import { makeCustomWorkoutStep, type CustomWorkout } from "../lib/custom-workouts";
import { chestExercises } from "../shared/chest-content";
import { legsExercises } from "../shared/legs-content";

describe("custom workouts", () => {
  it("creates a duration prescription from a library exercise", () => {
    const exercise = legsExercises.find((item) => item.prescription.mode === "duration") ?? legsExercises[0];
    const step = makeCustomWorkoutStep(exercise);
    expect(step.exerciseId).toBe(exercise.id);
    expect(step.sets).toBeGreaterThan(0);
    expect(step.restSeconds).toBeGreaterThanOrEqual(0);
  });

  it("keeps selected steps constrained to known library exercise IDs", () => {
    const libraryIds = new Set([...chestExercises, ...legsExercises].map((exercise) => exercise.id));
    const workout: CustomWorkout = { id: "custom-test", name: "Test", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), steps: [makeCustomWorkoutStep(chestExercises[0]), makeCustomWorkoutStep(legsExercises[0])] };
    expect(workout.steps.every((step) => libraryIds.has(step.exerciseId))).toBe(true);
  });
});
