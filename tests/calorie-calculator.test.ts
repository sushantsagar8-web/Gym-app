import { describe, expect, it } from "vitest";
import { calculateCalories } from "../shared/calorie-calculator";
import { estimateFoodMacros, estimateNaturalLanguageFoodLocally } from "../shared/food-macro-estimator";

describe("calorie calculator", () => {
  const base = { sex: "male" as const, age: 30, heightCm: 170, weightKg: 70, activity: "moderate" as const };

  it("calculates a maintenance target from BMR and activity", () => {
    const result = calculateCalories({ ...base, goal: "maintain" });
    expect(result.bmr).toBe(1618);
    expect(result.maintenanceCalories).toBe(2507);
    expect(result.targetCalories).toBe(2507);
    expect(result.adjustmentCalories).toBe(0);
    expect(result.macros.proteinGrams).toBe(157);
    expect(result.macros.carbsGrams).toBeGreaterThan(0);
    expect(result.macros.fatGrams).toBeGreaterThan(0);
  });

  it("applies a moderate deficit and modest surplus", () => {
    const loss = calculateCalories({ ...base, goal: "loss" });
    const gain = calculateCalories({ ...base, goal: "gain" });
    expect(loss.targetCalories).toBe(2107);
    expect(gain.targetCalories).toBe(2757);
    expect(loss.weeklyChangeKgEstimate).toBeLessThan(0);
    expect(gain.weeklyChangeKgEstimate).toBeGreaterThan(0);
    expect(loss.macros.proteinGrams).toBe(132);
    expect(gain.macros.proteinGrams).toBe(172);
    expect(loss.macros.proteinCalories + loss.macros.carbsCalories + loss.macros.fatCalories).toBeGreaterThan(2000);
  });

  it("honors customized percentages and an explicit protein target", () => {
    const result = calculateCalories({ ...base, goal: "maintain" }, { proteinPercent: 30, carbsPercent: 45, fatPercent: 25, proteinGrams: 140 });
    expect(result.macros.proteinGrams).toBe(140);
    expect(result.macros.carbsGrams).toBeGreaterThan(0);
    expect(result.macros.fatGrams).toBeGreaterThan(0);
  });

  it("estimates a supported food description by portion", () => {
    const estimate = estimateFoodMacros("chicken", 150);
    expect(estimate?.isApproximate).toBe(true);
    expect(estimate?.calories).toBe(248);
    expect(estimate?.proteinGrams).toBe(47);
  });

  it("uses a sourced reference record for a specific food description", () => {
    const estimate = estimateFoodMacros("chicken breast", 150);
    expect(estimate?.source).toBe("IFCT 2017");
    expect(estimate?.matchedFood).toContain("Chicken");
    expect(estimate?.proteinGrams).toBeGreaterThan(20);
    expect(estimate?.calories).toBeGreaterThan(100);
  });

  it("returns no estimate for an unsupported description", () => {
    expect(estimateFoodMacros("unknown food", 150)).toBeNull();
  });

  it("keeps carbohydrate values for mixed rice dishes such as chicken biryani", () => {
    const estimate = estimateFoodMacros("chicken biryani", 200);
    expect(estimate?.matchedCategory).toContain("biryani");
    expect(estimate?.carbsGrams).toBeGreaterThan(0);
    expect(estimate?.calories).toBeGreaterThan(0);
  });

  it("falls back to a mixed-meal estimate for paneer and rotis", () => {
    const result = estimateNaturalLanguageFoodLocally("paneer bowl and 2 rotis");
    expect(result?.items).toHaveLength(2);
    expect(result?.totals.calories).toBeGreaterThan(0);
    expect(result?.totals.proteinGrams).toBeGreaterThan(0);
    expect(result?.items.map((item) => item.name).join(" ")).toContain("paneer");
    expect(result?.items.map((item) => item.name).join(" ")).toContain("rotis");
    expect(result?.warnings[0]).toContain("AI was unavailable");
  });

  it("does not return a target below the practical lower bound", () => {
    const result = calculateCalories({ sex: "female", age: 75, heightCm: 145, weightKg: 35, activity: "sedentary", goal: "loss" });
    expect(result.targetCalories).toBe(1200);
  });
});
