import { findFoodReference as findCombinedFoodReference, getFoodClarification, type SearchableFoodReference } from "./food-reference-search";

export type FoodMacroEstimate = {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  matchedCategory: string;
  matchedFood?: string;
  source?: string;
  reference?: SearchableFoodReference;
  clarification?: { needsClarification: boolean; questions: string[] };
  isApproximate: true;
};

type FoodProfile = { keywords: string[]; label: string; caloriesPer100g: number; proteinPer100g: number; carbsPer100g: number; fatPer100g: number };

const FOOD_PROFILES: FoodProfile[] = [
  // Mixed rice dishes must be checked before ingredient profiles. Otherwise
  // “chicken biryani” can incorrectly match chicken and return 0 g carbs.
  { keywords: ["chicken biryani", "mutton biryani", "vegetable biryani", "biryani", "biriyani"], label: "biryani or mixed rice dish", caloriesPer100g: 210, proteinPer100g: 8, carbsPer100g: 28, fatPer100g: 7 },
  { keywords: ["chicken", "fish", "salmon", "tuna"], label: "lean protein", caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 4 },
  { keywords: ["paneer", "tofu"], label: "paneer or tofu", caloriesPer100g: 180, proteinPer100g: 18, carbsPer100g: 6, fatPer100g: 10 },
  { keywords: ["egg", "eggs"], label: "eggs", caloriesPer100g: 143, proteinPer100g: 13, carbsPer100g: 1, fatPer100g: 10 },
  { keywords: ["rice", "roti", "bread", "oats", "pasta", "quinoa"], label: "grain or starch", caloriesPer100g: 180, proteinPer100g: 5, carbsPer100g: 35, fatPer100g: 2 },
  { keywords: ["dal", "lentil", "beans", "chickpea", "chana"], label: "legumes", caloriesPer100g: 125, proteinPer100g: 8, carbsPer100g: 20, fatPer100g: 2 },
  { keywords: ["milk", "yogurt", "curd", "dahi"], label: "dairy", caloriesPer100g: 65, proteinPer100g: 4, carbsPer100g: 5, fatPer100g: 3 },
  { keywords: ["banana", "apple", "fruit"], label: "fruit", caloriesPer100g: 70, proteinPer100g: 1, carbsPer100g: 18, fatPer100g: 0 },
  { keywords: ["salad", "vegetable", "sabzi", "broccoli", "spinach"], label: "vegetables", caloriesPer100g: 45, proteinPer100g: 2, carbsPer100g: 8, fatPer100g: 1 },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function findFoodReference(description: string) {
  return findCombinedFoodReference(description);
}

export function estimateFoodMacros(description: string, grams: number): FoodMacroEstimate | null {
  const normalized = normalize(description);
  if (!normalized || !Number.isFinite(grams) || grams <= 0) return null;
  const multiplier = grams / 100;
  const reference = findCombinedFoodReference(normalized);
  if (reference) {
    const isPrepared = reference.state === "prepared" && "servingUnit" in reference;
    const servingGrams = isPrepared ? (reference as { servingGrams?: number | null }).servingGrams : null;
    const servingMultiplier = isPrepared ? (servingGrams ? grams / servingGrams : 1) : multiplier;
    return {
      calories: Math.round((isPrepared ? reference.calories * servingMultiplier : reference.calories * multiplier)),
      proteinGrams: Math.round((isPrepared ? reference.protein * servingMultiplier : reference.protein * multiplier)),
      carbsGrams: Math.round((isPrepared ? reference.carbs * servingMultiplier : reference.carbs * multiplier)),
      fatGrams: Math.round((isPrepared ? reference.fat * servingMultiplier : reference.fat * multiplier)),
      matchedCategory: reference.category,
      matchedFood: reference.name,
      source: reference.source,
      reference,
      clarification: getFoodClarification(reference, description),
      isApproximate: true,
    };
  }
  const profile = FOOD_PROFILES.find((candidate) => candidate.keywords.some((keyword) => normalized.includes(keyword)));
  if (!profile) return null;
  return {
    calories: Math.round(profile.caloriesPer100g * multiplier),
    proteinGrams: Math.round(profile.proteinPer100g * multiplier),
    carbsGrams: Math.round(profile.carbsPer100g * multiplier),
    fatGrams: Math.round(profile.fatPer100g * multiplier),
    matchedCategory: profile.label,
    clarification: getFoodClarification(null, description),
    isApproximate: true,
  };
}

export type NaturalLanguageEstimateItem = {
  name: string;
  portionText: string;
  grams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  confidence: number;
  notes: string;
  clarificationQuestions?: string[];
};

const LOCAL_PORTION_HINTS: Array<{ pattern: RegExp; grams: number; unit: string }> = [
  { pattern: /\b(roti|chapati|paratha)\b/i, grams: 40, unit: "piece" },
  { pattern: /\b(bowl|katori)\b/i, grams: 150, unit: "bowl" },
  { pattern: /\b(cup)\b/i, grams: 150, unit: "cup" },
  { pattern: /\b(egg|eggs)\b/i, grams: 50, unit: "piece" },
  { pattern: /\b(piece|pieces|slice|slices)\b/i, grams: 80, unit: "piece" },
];

function localSentenceParts(sentence: string) {
  return sentence
    .replace(/\s+(?:and|with|plus)\s+/gi, ",")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function localPortion(part: string) {
  const numeric = part.match(/\b(\d+(?:\.\d+)?)\s*(g|grams?|ml|cups?|bowls?|katoris?|pieces?|slices?|eggs?|rotis?|chapatis?)\b/i);
  if (numeric) {
    const amount = Number(numeric[1]);
    const unit = numeric[2].toLowerCase();
    const grams = /g|gram/.test(unit) ? amount : /egg/.test(unit) ? amount * 50 : /roti|chapati/.test(unit) ? amount * 40 : /piece|slice/.test(unit) ? amount * 80 : amount * 150;
    return { grams: Math.max(1, Math.round(grams)), portionText: `${numeric[1]} ${numeric[2]}` };
  }
  const words = part.match(/\b(one|a|an|two|three|four|five|six)\b/i);
  const countWords: Record<string, number> = { one: 1, a: 1, an: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  const count = words ? countWords[words[1].toLowerCase()] ?? 1 : 1;
  const hint = LOCAL_PORTION_HINTS.find((item) => item.pattern.test(part));
  if (hint) return { grams: Math.max(1, Math.round(count * hint.grams)), portionText: `${count} ${hint.unit}${count === 1 ? "" : "s"}` };
  return { grams: 150, portionText: "1 approximate serving" };
}

export function estimateNaturalLanguageFoodLocally(sentence: string) {
  const items: NaturalLanguageEstimateItem[] = localSentenceParts(sentence).flatMap((part) => {
    const portion = localPortion(part);
    const estimate = estimateFoodMacros(part, portion.grams);
    if (!estimate) return [];
    const needsClarification = estimate.clarification?.needsClarification ?? true;
    return [{
      name: part.replace(/^\s*(\d+(?:\.\d+)?|one|a|an|two|three|four|five|six)\s+/i, "").trim() || part,
      portionText: portion.portionText,
      grams: portion.grams,
      calories: estimate.calories,
      proteinGrams: estimate.proteinGrams,
      carbsGrams: estimate.carbsGrams,
      fatGrams: estimate.fatGrams,
      confidence: estimate.matchedFood ? 0.72 : 0.48,
      notes: estimate.matchedFood ? `Matched ${estimate.matchedFood} from ${estimate.source ?? "local nutrition reference"}.` : "Approximate local estimate; review the portion before saving.",
      clarificationQuestions: needsClarification ? estimate.clarification?.questions : undefined,
    }];
  });
  if (!items.length) return null;
  return {
    items,
    totals: items.reduce((totals, item) => ({
      calories: totals.calories + item.calories,
      proteinGrams: totals.proteinGrams + item.proteinGrams,
      carbsGrams: totals.carbsGrams + item.carbsGrams,
      fatGrams: totals.fatGrams + item.fatGrams,
    }), { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 }),
    warnings: ["AI was unavailable, so this is a local approximate estimate. Review portions and values before saving."],
  };
}
