import { describe, expect, it } from "vitest";
import { BREAK_MAX, BREAK_MIN, WORK_MAX, WORK_MIN, parseDuration } from "../lib/workout-settings";

describe("workout settings duration validation", () => {
  it("clamps work duration to supported bounds", () => {
    expect(parseDuration("2", 30, WORK_MIN, WORK_MAX)).toBe(WORK_MIN);
    expect(parseDuration("999", 30, WORK_MIN, WORK_MAX)).toBe(WORK_MAX);
  });

  it("allows a zero-second break and clamps long breaks", () => {
    expect(parseDuration("0", 20, BREAK_MIN, BREAK_MAX)).toBe(0);
    expect(parseDuration("240", 20, BREAK_MIN, BREAK_MAX)).toBe(BREAK_MAX);
  });

  it("falls back safely for empty or invalid input", () => {
    expect(parseDuration("", 30, WORK_MIN, WORK_MAX)).toBe(30);
    expect(parseDuration("abc", 20, BREAK_MIN, BREAK_MAX)).toBe(20);
    expect(parseDuration("45 sec", 20, BREAK_MIN, BREAK_MAX)).toBe(45);
  });
});
