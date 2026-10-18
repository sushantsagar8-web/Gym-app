import { describe, expect, it } from "vitest";

import { getShopProgram, getShopProgramExercises, shopPrograms } from "../shared/shop-programs";

describe("Shop program catalog", () => {
  it("resolves men’s, women’s, and general fitness cards to different routines", () => {
    const men = getShopProgram("shop.men-abs-foundation");
    const women = getShopProgram("shop.women-abs-foundation");
    const general = getShopProgram("shop.general-fitness-foundation");

    expect(men?.id).toBe("shop.men-abs-foundation");
    expect(women?.id).toBe("shop.women-abs-foundation");
    expect(general?.id).toBe("shop.general-fitness-foundation");
    expect(men?.steps.map((step) => step.exerciseId)).not.toEqual(general?.steps.map((step) => step.exerciseId));
    expect(men?.steps.every((step) => step.exerciseId?.startsWith("exercise.men-abs-"))).toBe(true);
    expect(women?.steps.every((step) => step.exerciseId?.startsWith("exercise.women-abs-"))).toBe(true);
  });

  it("supports both muscle-building split choices", () => {
    const bro = getShopProgram("shop.muscle-building", "bro-split");
    const pushPull = getShopProgram("shop.muscle-building", "push-pull-days");
    const defaultSplit = getShopProgram("shop.muscle-building");

    expect(bro?.split).toBe("bro-split");
    expect(pushPull?.split).toBe("push-pull-days");
    expect(defaultSplit?.split).toBe("push-pull-days");
  });

  it("organizes Bro Split into the requested paired muscle days", () => {
    const bro = getShopProgram("shop.muscle-building", "bro-split");
    const labels = [...new Set(bro?.steps.map((step) => step.dayLabel))];
    expect(labels).toEqual([
      "Day 1 · Chest & Triceps",
      "Day 2 · Back & Biceps",
      "Day 3 · Shoulders, Traps & Abs",
      "Day 4 · Legs & Abs",
    ]);
    expect(bro?.steps.filter((step) => step.dayLabel.includes("Chest & Triceps")).every((step) => step.exerciseId?.includes("chest-") || step.exerciseId?.includes("triceps-"))).toBe(true);
    expect(bro?.steps.filter((step) => step.dayLabel.includes("Back & Biceps")).every((step) => step.exerciseId?.includes("gym-back-") || step.exerciseId?.includes("biceps-"))).toBe(true);
    expect(bro?.steps.filter((step) => step.dayLabel.includes("Shoulders, Traps & Abs")).every((step) => step.exerciseId?.includes("shoulders-") || step.exerciseId?.includes("men-abs-"))).toBe(true);
    expect(bro?.steps.filter((step) => step.dayLabel.includes("Legs & Abs")).every((step) => step.exerciseId?.includes("legs-") || step.exerciseId?.includes("men-abs-"))).toBe(true);
  });

  it("keeps Push, Pull, and Legs days movement-appropriate", () => {
    const program = getShopProgram("shop.muscle-building", "push-pull-days");
    const push = program?.steps.filter((step) => step.dayLabel.endsWith("Push")) ?? [];
    const pull = program?.steps.filter((step) => step.dayLabel.endsWith("Pull")) ?? [];
    const legs = program?.steps.filter((step) => step.dayLabel.endsWith("Legs")) ?? [];

    expect(push).toHaveLength(6);
    expect(push.every((step) => step.exerciseId?.includes("chest-") || step.exerciseId?.includes("shoulders-") || step.exerciseId?.includes("triceps-"))).toBe(true);
    expect(pull).toHaveLength(5);
    expect(pull.every((step) => step.exerciseId?.includes("gym-back-") || step.exerciseId?.includes("biceps-"))).toBe(true);
    expect(legs).toHaveLength(4);
    expect(legs.every((step) => step.exerciseId?.includes("legs-"))).toBe(true);
  });

  it("contains valid catalog exercises for every ready Shop step", () => {
    for (const program of shopPrograms.filter((item) => item.kind !== "cardio")) {
      const readySteps = program.steps.filter((step) => step.contentStatus === "ready");
      expect(getShopProgramExercises(program)).toHaveLength(readySteps.length);
    }
  });

  it("keeps cardio sessions visible as explicit content placeholders until videos are supplied", () => {
    const cardio = getShopProgram("shop.cardio-foundation");
    expect(cardio?.steps).toHaveLength(4);
    expect(cardio?.steps.every((step) => step.contentStatus === "awaiting-video-content")).toBe(true);
    expect(cardio?.steps.map((step) => step.title)).toEqual(["Brisk walk or treadmill walk", "Cycling", "Rowing machine", "Low-impact bodyweight cardio"]);
  });
});
