import { describe, expect, it } from "vitest";
import { canCustomizeBroSplit, getBeginnerRecommendations, getDefaultBroSplitSchedule, getScheduleDay, groupMatchesExercise, normalizeBroSplitSchedule } from "../shared/bro-split";

describe("Bro Split weekly schedule", () => {
  it("creates the requested Monday to Thursday default sessions and rest days through Sunday", () => {
    const schedule = getDefaultBroSplitSchedule("men", "beginner");
    expect(schedule.days.map((day) => [day.weekday, day.group])).toEqual([
      ["Monday", "chest-triceps"],
      ["Tuesday", "back-biceps"],
      ["Wednesday", "shoulders-abs"],
      ["Thursday", "legs-abs"],
      ["Friday", "rest"],
      ["Saturday", "rest"],
      ["Sunday", "rest"],
    ]);
  });

  it("allows explicit customization for beginners and keeps advanced users editable", () => {
    expect(canCustomizeBroSplit("beginner", false)).toBe(false);
    expect(canCustomizeBroSplit("beginner", true)).toBe(true);
    expect(canCustomizeBroSplit("advanced", false)).toBe(true);
  });

  it("uses audience-specific abs recommendations for women", () => {
    const ids = getBeginnerRecommendations("shoulders-abs", "women");
    expect(ids.some((id) => id.startsWith("exercise.women-abs-"))).toBe(true);
    expect(ids.some((id) => id.startsWith("exercise.men-abs-"))).toBe(false);
  });

  it("keeps beginner recommendations non-empty and grouped by movement target", () => {
    expect(getBeginnerRecommendations("chest-triceps", "men").length).toBeGreaterThan(0);
    expect(getBeginnerRecommendations("back-biceps", "men").every((id) => groupMatchesExercise("back-biceps", id))).toBe(true);
    expect(getBeginnerRecommendations("legs-abs", "men").every((id) => groupMatchesExercise("legs-abs", id))).toBe(true);
  });

  it("preserves user-edited day assignments while filling missing days safely", () => {
    const normalized = normalizeBroSplitSchedule({ days: [{ weekday: "Friday", group: "chest-triceps", exerciseIds: ["exercise.chest-bench-press"] }] }, "men", "advanced");
    expect(getScheduleDay(normalized, "Friday").group).toBe("chest-triceps");
    expect(getScheduleDay(normalized, "Friday").exerciseIds).toEqual(["exercise.chest-bench-press"]);
    expect(getScheduleDay(normalized, "Monday").group).toBe("chest-triceps");
  });
});


  it("preserves exercise order and per-exercise prescription overrides", () => {
    const normalized = normalizeBroSplitSchedule({ days: [{ weekday: "Monday", group: "chest-triceps", exerciseIds: ["exercise.triceps-rope-pulldown", "exercise.chest-bench-press"], exerciseConfigs: { "exercise.chest-bench-press": { sets: 4, reps: 8, restSeconds: 90 } } }] }, "men", "advanced");
    const monday = getScheduleDay(normalized, "Monday");
    expect(monday.exerciseIds).toEqual(["exercise.triceps-rope-pulldown", "exercise.chest-bench-press"]);
    expect(monday.exerciseConfigs?.["exercise.chest-bench-press"]).toEqual({ sets: 4, reps: 8, restSeconds: 90 });
  });

  it("provides prescription defaults for duration and repetition exercises", async () => {
    const { getDefaultExerciseConfig } = await import("../shared/bro-split");
    const exercise = (await import("../shared/chest-content")).chestExercises[0];
    const config = getDefaultExerciseConfig(exercise);
    expect(config.sets).toBeGreaterThan(0);
    expect(config.restSeconds).toBeGreaterThan(0);
    expect(config.reps ?? config.durationSeconds).toBeGreaterThan(0);
  });
