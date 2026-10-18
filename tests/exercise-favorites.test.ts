import { describe, expect, it } from "vitest";

import { toggleFavoriteIds } from "../lib/exercise-favorites";

describe("exercise favorites", () => {
  it("adds an exercise to favorites and removes it on the next toggle", () => {
    const added = toggleFavoriteIds([], "exercise.chest-press");
    expect(added).toEqual(["exercise.chest-press"]);
    expect(toggleFavoriteIds(added, "exercise.chest-press")).toEqual([]);
  });

  it("preserves unrelated favorites when toggling one exercise", () => {
    expect(toggleFavoriteIds(["exercise.chest-press", "exercise.shoulder-press"], "exercise.chest-press")).toEqual(["exercise.shoulder-press"]);
  });
});
