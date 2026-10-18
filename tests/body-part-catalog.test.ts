import { describe, expect, it } from "vitest";

import { bodyPartDefinitions, filterExercisesByBodyPart } from "../lib/body-part-catalog";
import { menAbsExercises } from "../shared/men-abs-content";
import { womenAbsExercises } from "../shared/women-abs-content";
import { bicepsExercises } from "../shared/biceps-content";
import { tricepsExercises } from "../shared/triceps-content";
import { chestExercises } from "../shared/chest-content";
import { shouldersExercises } from "../shared/shoulders-content";
import { legsExercises } from "../shared/legs-content";
import { generateLegDayProgram, legDayProgram, legDayExercises } from "../shared/leg-day-program";

describe("body-part exercise catalog", () => {
  it("provides the expected body-part categories and icons", () => {
    expect(bodyPartDefinitions.map((part) => part.id)).toEqual(["abs", "chest", "shoulders", "back", "legs", "arms"]);
    expect(bodyPartDefinitions.every((part) => part.icon.startsWith("body."))).toBe(true);
  });

  it("filters abs exercises by the selected audience", () => {
    const abs = bodyPartDefinitions.find((part) => part.id === "abs");
    expect(abs).toBeDefined();
    const men = filterExercisesByBodyPart([...menAbsExercises, ...womenAbsExercises], abs!, "men");
    const women = filterExercisesByBodyPart([...menAbsExercises, ...womenAbsExercises], abs!, "women");
    expect(men.length).toBe(menAbsExercises.length);
    expect(women.length).toBe(womenAbsExercises.length);
    expect(men.every((exercise) => exercise.tags.includes("men"))).toBe(true);
    expect(women.every((exercise) => exercise.tags.includes("women"))).toBe(true);
  });

  it("filters all 11 Biceps exercises into Arms for both curated audiences", () => {
    const arms = bodyPartDefinitions.find((part) => part.id === "arms");
    expect(arms).toBeDefined();
    const men = filterExercisesByBodyPart(bicepsExercises, arms!, "men");
    const women = filterExercisesByBodyPart(bicepsExercises, arms!, "women");
    expect(men).toHaveLength(11);
    expect(women).toHaveLength(11);
    expect(men.every((exercise) => exercise.tags.includes("biceps"))).toBe(true);
    expect(women.every((exercise) => exercise.locations.includes("gym"))).toBe(true);
  });

  it("filters all 11 Triceps exercises into Arms and keeps Brachialis ready for future content", () => {
    const arms = bodyPartDefinitions.find((part) => part.id === "arms");
    expect(arms).toBeDefined();
    const triceps = filterExercisesByBodyPart(tricepsExercises, arms!, "all").filter((exercise) => exercise.tags.includes("triceps"));
    const brachialis = filterExercisesByBodyPart([...bicepsExercises, ...tricepsExercises], arms!, "all").filter((exercise) => exercise.tags.includes("brachialis"));
    expect(triceps).toHaveLength(11);
    expect(triceps.every((exercise) => exercise.media[0]?.uri.includes("cloudinary.com"))).toBe(true);
    expect(brachialis).toHaveLength(0);
  });

  it("exposes all 9 Chest exercises with playable media for both curated audiences", () => {
    const chest = bodyPartDefinitions.find((part) => part.id === "chest");
    expect(chest).toBeDefined();
    expect(chestExercises).toHaveLength(9);
    const men = filterExercisesByBodyPart(chestExercises, chest!, "men");
    const women = filterExercisesByBodyPart(chestExercises, chest!, "women");
    expect(men).toHaveLength(9);
    expect(women).toHaveLength(9);
    expect(chestExercises.every((exercise) => exercise.media[0]?.uri.includes("cloudinary.com"))).toBe(true);
    expect(chestExercises.every((exercise) => exercise.locations.includes("gym"))).toBe(true);
  });

  it("categorizes all seven shoulder exercises into the requested subgroups", () => {
    expect(shouldersExercises).toHaveLength(7);
    expect(shouldersExercises.filter((exercise) => exercise.tags.includes("front-delts"))).toHaveLength(3);
    expect(shouldersExercises.filter((exercise) => exercise.tags.includes("side-delts"))).toHaveLength(1);
    expect(shouldersExercises.filter((exercise) => exercise.tags.includes("rear-delts"))).toHaveLength(1);
    expect(shouldersExercises.filter((exercise) => exercise.tags.includes("traps"))).toHaveLength(2);
  });

  it("exposes all 23 Legs exercises with playable Cloudinary media", () => {
    const legs = bodyPartDefinitions.find((part) => part.id === "legs");
    expect(legs).toBeDefined();
    expect(legsExercises).toHaveLength(23);
    expect(filterExercisesByBodyPart(legsExercises, legs!, "men")).toHaveLength(23);
    expect(filterExercisesByBodyPart(legsExercises, legs!, "women")).toHaveLength(23);
    expect(legsExercises.every((exercise) => exercise.media[0]?.uri.includes("cloudinary.com"))).toBe(true);
    expect(legsExercises.every((exercise) => exercise.locations.includes("gym"))).toBe(true);
  });

  it("categorizes Legs exercises into all five requested subgroups", () => {
    expect(legsExercises.filter((exercise) => exercise.tags.includes("quadriceps"))).not.toHaveLength(0);
    expect(legsExercises.filter((exercise) => exercise.tags.includes("hamstrings"))).not.toHaveLength(0);
    expect(legsExercises.filter((exercise) => exercise.tags.includes("glutes"))).not.toHaveLength(0);
    expect(legsExercises.filter((exercise) => exercise.tags.includes("inner-thigh"))).not.toHaveLength(0);
    expect(legsExercises.filter((exercise) => exercise.tags.includes("calves"))).not.toHaveLength(0);
  });

  it("provides a playable six-exercise Leg Day routine in order", () => {
    expect(legDayProgram.id).toBe("program.leg-day");
    expect(legDayProgram.steps).toHaveLength(6);
    expect(legDayExercises).toHaveLength(6);
    expect(legDayProgram.steps.every((step) => step.sets > 0 && step.reps > 0 && step.restSeconds > 0)).toBe(true);
    expect(legDayExercises.every((exercise) => exercise.media[0]?.uri.includes("cloudinary.com"))).toBe(true);
  });

  it("generates Leg Day from the selected focus areas", () => {
    const oneFocus = generateLegDayProgram(["quadriceps"]);
    const twoFocuses = generateLegDayProgram(["quadriceps", "glutes"]);
    const manyFocuses = generateLegDayProgram(["quadriceps", "hamstrings", "glutes"]);
    const countForFocus = (steps: typeof oneFocus.steps, focus: string) =>
      steps.filter((step) => legsExercises.find((exercise) => exercise.id === step.exerciseId)?.tags.includes(focus)).length;

    expect(oneFocus.steps).toHaveLength(3);
    expect(countForFocus(oneFocus.steps, "quadriceps")).toBeGreaterThanOrEqual(3);
    expect(twoFocuses.steps).toHaveLength(6);
    expect(countForFocus(twoFocuses.steps, "quadriceps")).toBeGreaterThanOrEqual(3);
    expect(countForFocus(twoFocuses.steps, "glutes")).toBeGreaterThanOrEqual(3);
    expect(manyFocuses.steps).toHaveLength(6);
    expect(countForFocus(manyFocuses.steps, "quadriceps")).toBeGreaterThanOrEqual(2);
    expect(countForFocus(manyFocuses.steps, "hamstrings")).toBeGreaterThanOrEqual(2);
    expect(countForFocus(manyFocuses.steps, "glutes")).toBeGreaterThanOrEqual(2);
    expect(manyFocuses.steps.every((step) => step.exerciseId.startsWith("exercise.legs-"))).toBe(true);
  });

  it("returns an empty list for body parts without loaded content", () => {
    const chest = bodyPartDefinitions.find((part) => part.id === "chest");
    expect(filterExercisesByBodyPart([...menAbsExercises, ...womenAbsExercises], chest!, "all")).toEqual([]);
  });
});
