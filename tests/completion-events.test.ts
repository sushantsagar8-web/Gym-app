import { describe, expect, it } from "vitest";
import { calculateWorkoutSummary, makeCompletionEvent } from "../lib/completion-events";

describe("completion events", () => {
  it("creates a stable exercise completion event", () => {
    const event = makeCompletionEvent({ sessionId: "s1", exerciseId: "e1", exerciseName: "Plank", setNumber: 1, durationSeconds: 30, completionType: "completed" }, 1700000000000);
    expect(event.id).toContain("completion-1700000000000-e1-1");
    expect(event.completedAt).toBe("2023-11-14T22:13:20.000Z");
  });
  it("calculates completed sets, exercises, elapsed time, and percentage", () => {
    const events = [
      makeCompletionEvent({ sessionId: "s1", exerciseId: "e1", exerciseName: "Plank", setNumber: 1, durationSeconds: 30, completionType: "completed" }, 1700000000000),
      makeCompletionEvent({ sessionId: "s1", exerciseId: "e1", exerciseName: "Plank", setNumber: 2, durationSeconds: 30, completionType: "completed" }, 1700000001000),
      makeCompletionEvent({ sessionId: "s1", exerciseId: "e2", exerciseName: "Crunch", setNumber: 1, durationSeconds: 20, completionType: "skipped" }, 1700000002000),
    ];
    const summary = calculateWorkoutSummary("s1", events, 2, 3, 1700000000000, 1700000065000);
    expect(summary.completedExercises).toBe(1);
    expect(summary.completedSets).toBe(2);
    expect(summary.elapsedSeconds).toBe(65);
    expect(summary.completionPercent).toBe(67);
  });
});
