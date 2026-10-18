import { describe, expect, it } from "vitest";
import { audienceLabel, getCuratedAudience, matchesAudience } from "../lib/audience-curation";
import type { OnboardingPreferences } from "../lib/onboarding-storage";

const preferences = (sex?: OnboardingPreferences["sex"]): OnboardingPreferences => ({ completed: true, goals: [], sex });

describe("audience curation", () => {
  it("curates men’s content for male preference", () => {
    expect(getCuratedAudience(preferences("male"))).toBe("men");
    expect(matchesAudience(["abs", "men"], "men")).toBe(true);
    expect(matchesAudience(["abs", "women"], "men")).toBe(false);
  });

  it("curates women’s content for female preference", () => {
    expect(getCuratedAudience(preferences("female"))).toBe("women");
    expect(audienceLabel("women")).toContain("Women");
  });

  it("keeps unspecified preference inclusive", () => {
    expect(getCuratedAudience(preferences("prefer-not-to-say"))).toBe("all");
    expect(matchesAudience(["abs", "women"], "all")).toBe(true);
  });
});
