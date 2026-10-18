import { describe, expect, it } from "vitest";
import { summarizeEngagement } from "../lib/engagement-analytics";
import type { EngagementEvent } from "../shared/fitpath-models";

const event = (type: EngagementEvent["type"], audience: EngagementEvent["audience"]): EngagementEvent => ({
  id: `${type}-${audience}`,
  type,
  audience,
  occurredAt: "2026-08-14T00:00:00.000Z",
});

describe("engagement analytics", () => {
  it("summarizes onboarding and curated workout events for one audience", () => {
    const summary = summarizeEngagement([
      event("onboarding-started", "women"),
      event("onboarding-completed", "women"),
      event("curated-workout-started", "women"),
      event("curated-workout-finished", "women"),
      event("curated-exercise-completed", "women"),
      event("curated-exercise-skipped", "men"),
    ], "women");

    expect(summary.onboardingCompletionRate).toBe(100);
    expect(summary.workoutFinishRate).toBe(100);
    expect(summary.exerciseCompletions).toBe(1);
    expect(summary.exerciseSkips).toBe(0);
  });

  it("includes both curated audiences in the inclusive summary", () => {
    const summary = summarizeEngagement([
      event("onboarding-started", "men"),
      event("onboarding-started", "women"),
      event("curated-workout-started", "men"),
      event("curated-workout-started", "women"),
      event("curated-exercise-completed", "men"),
      event("curated-exercise-completed", "women"),
    ], "all");

    expect(summary.onboardingStarted).toBe(2);
    expect(summary.workoutStarted).toBe(2);
    expect(summary.exerciseCompletions).toBe(2);
  });
});
