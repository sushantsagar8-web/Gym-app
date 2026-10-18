import { describe, expect, it } from "vitest";
import { generateArmsProgram, generateBackProgram, generateChestProgram } from "../shared/upper-body-programs";

describe("upper-body focus programs", () => {
  it("builds three Chest exercises for one focus and six for two focuses", () => {
    const one = generateChestProgram(["mid-chest"]);
    const two = generateChestProgram(["mid-chest", "inner-chest"]);
    expect(one.steps).toHaveLength(3);
    expect(two.steps).toHaveLength(6);
    expect(two.focuses).toEqual(["mid-chest", "inner-chest"]);
  });

  it("caps three or more Back focuses at six exercises", () => {
    const program = generateBackProgram(["lats", "upper-back", "mid-back", "lower-back"]);
    expect(program.steps).toHaveLength(6);
    expect(program.focuses).toHaveLength(4);
  });

  it("combines Arms focus areas without duplicating exercise IDs when alternatives exist", () => {
    const program = generateArmsProgram(["biceps", "triceps", "brachialis"]);
    const ids = program.steps.map((step) => step.exerciseId);
    expect(program.steps).toHaveLength(6);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
