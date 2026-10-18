import { describe, expect, it } from "vitest";
import { createTimerState, formatTimer, reduceTimer, type TimerExercise } from "../lib/workout-timer";

const exercises: TimerExercise[] = [
  { id: "a", name: "A", workSeconds: 10, restSeconds: 5, sets: 2 },
  { id: "b", name: "B", workSeconds: 8, restSeconds: 0, sets: 1 },
];

describe("workout timer state machine", () => {
  it("starts only after an explicit Start timer action", () => {
    let state = createTimerState(exercises, 0);
    expect(state.phase).toBe("ready");
    state = reduceTimer(state, { type: "tick", now: 10_000 }, exercises);
    expect(state.phase).toBe("ready");
    expect(state.remainingSeconds).toBe(10);
    state = reduceTimer(state, { type: "start", now: 10_000 }, exercises);
    expect(state.phase).toBe("work");
  });

  it("waits for explicit confirmation after work before starting rest", () => {
    let state = createTimerState(exercises, 0);
    state = reduceTimer(state, { type: "start", now: 0 }, exercises);
    state = reduceTimer(state, { type: "tick", now: 10_000 }, exercises);
    expect(state.phase).toBe("awaiting-confirmation");
    expect(state.confirmationKind).toBe("work");
    expect(state.remainingSeconds).toBe(0);
    state = reduceTimer(state, { type: "confirm", now: 10_000 }, exercises);
    expect(state.phase).toBe("rest");
    expect(state.remainingSeconds).toBe(5);
  });

  it("waits for explicit confirmation after rest before moving to the next set", () => {
    let state = createTimerState(exercises, 0);
    state = reduceTimer(state, { type: "start", now: 0 }, exercises);
    state = reduceTimer(state, { type: "complete-work", now: 10_000 }, exercises);
    state = reduceTimer(state, { type: "confirm", now: 10_000 }, exercises);
    state = reduceTimer(state, { type: "tick", now: 15_000 }, exercises);
    expect(state.phase).toBe("awaiting-confirmation");
    expect(state.confirmationKind).toBe("rest");
    state = reduceTimer(state, { type: "confirm", now: 15_000 }, exercises);
    expect(state.phase).toBe("ready");
    expect(state.setIndex).toBe(1);
    expect(state.remainingSeconds).toBe(10);
    state = reduceTimer(state, { type: "start", now: 15_000 }, exercises);
    expect(state.phase).toBe("work");
  });

  it("pauses and resumes without losing the remaining time", () => {
    let state = createTimerState(exercises, 0);
    state = reduceTimer(state, { type: "start", now: 0 }, exercises);
    state = reduceTimer(state, { type: "tick", now: 3_000 }, exercises);
    expect(state.remainingSeconds).toBe(7);
    state = reduceTimer(state, { type: "pause", now: 3_000 }, exercises);
    state = reduceTimer(state, { type: "resume", now: 20_000 }, exercises);
    state = reduceTimer(state, { type: "tick", now: 21_000 }, exercises);
    expect(state.remainingSeconds).toBe(6);
  });

  it("stops and resumes without advancing the countdown", () => {
    let state = createTimerState(exercises, 0);
    state = reduceTimer(state, { type: "start", now: 0 }, exercises);
    state = reduceTimer(state, { type: "tick", now: 3_000 }, exercises);
    state = reduceTimer(state, { type: "stop", now: 3_000 }, exercises);
    expect(state.phase).toBe("paused");
    expect(state.pausedFrom).toBe("work");
    state = reduceTimer(state, { type: "tick", now: 20_000 }, exercises);
    expect(state.remainingSeconds).toBe(7);
    state = reduceTimer(state, { type: "resume", now: 20_000 }, exercises);
    state = reduceTimer(state, { type: "tick", now: 21_000 }, exercises);
    expect(state.remainingSeconds).toBe(6);
  });

  it("supports skip and repeat without automatic restart", () => {
    let state = createTimerState(exercises, 0);
    state = reduceTimer(state, { type: "skip", now: 1_000 }, exercises);
    expect(state.phase).toBe("skipped");
    state = reduceTimer(state, { type: "repeat", now: 2_000 }, exercises);
    expect(state.phase).toBe("ready");
    expect(state.remainingSeconds).toBe(10);
    state = reduceTimer(state, { type: "tick", now: 20_000 }, exercises);
    expect(state.remainingSeconds).toBe(10);
    state = reduceTimer(state, { type: "start", now: 20_000 }, exercises);
    expect(state.phase).toBe("work");
  });

  it("applies custom work and break durations", () => {
    let state = createTimerState(exercises, 0);
    state = reduceTimer(state, { type: "start", now: 0 }, exercises);
    const configured = exercises.map((exercise) => ({ ...exercise, workSeconds: 15, restSeconds: 7 }));
    state = reduceTimer(state, { type: "configure", workSeconds: 15, restSeconds: 7, now: 0 }, exercises);
    expect(state.remainingSeconds).toBe(15);
    state = reduceTimer(state, { type: "tick", now: 15_000 }, configured);
    state = reduceTimer(state, { type: "confirm", now: 15_000 }, configured);
    expect(state.phase).toBe("rest");
    expect(state.remainingSeconds).toBe(7);
  });

  it("updates an active rest countdown when break settings change", () => {
    let state = createTimerState(exercises, 0);
    state = reduceTimer(state, { type: "start", now: 0 }, exercises);
    state = reduceTimer(state, { type: "complete-work", now: 10_000 }, exercises);
    state = reduceTimer(state, { type: "confirm", now: 10_000 }, exercises);
    expect(state.phase).toBe("rest");
    state = reduceTimer(state, { type: "configure", workSeconds: 15, restSeconds: 9, now: 10_000 }, exercises);
    expect(state.remainingSeconds).toBe(9);
  });

  it("formats timer values consistently", () => {
    expect(formatTimer(65)).toBe("01:05");
    expect(formatTimer(0)).toBe("00:00");
  });
});
