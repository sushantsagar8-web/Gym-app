import type { OnboardingPreferences } from "./onboarding-storage";

export type CuratedAudience = "men" | "women" | "all";

export function getCuratedAudience(preferences: OnboardingPreferences): CuratedAudience {
  if (preferences.curationAudience) return preferences.curationAudience;
  if (preferences.sex === "male") return "men";
  if (preferences.sex === "female") return "women";
  return "all";
}

export function audienceLabel(audience: CuratedAudience): string {
  if (audience === "men") return "Men’s programs";
  if (audience === "women") return "Women’s programs";
  return "Programs for everyone";
}

export function matchesAudience(tags: string[], audience: CuratedAudience): boolean {
  return audience === "all" || tags.includes(audience);
}
