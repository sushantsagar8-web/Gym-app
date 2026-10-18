import { FOOD_REFERENCE, type FoodReference } from "./food-reference";
import { PREPARED_FOOD_REFERENCE, type PreparedFoodReference } from "./prepared-food-reference";

export type SearchableFoodReference = FoodReference | PreparedFoodReference;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function score(reference: SearchableFoodReference, query: string) {
  const normalizedQuery = normalize(query);
  const queryWords = normalizedQuery.split(" ").filter((word) => word.length >= 3);
  const canonical = normalize(reference.name);
  if (!normalizedQuery) return 0;
  if (normalizedQuery === canonical) return 1000;
  for (const alias of reference.aliases.map(normalize).filter(Boolean)) {
    if (normalizedQuery === alias) return 850;
  }
  if (queryWords.length < 2) return 0;
  const canonicalWords = canonical.split(" ");
  const aliasWords = reference.aliases.flatMap((alias) => normalize(alias).split(" "));
  if (queryWords.every((word) => canonicalWords.includes(word))) return 500 - canonicalWords.length;
  if (queryWords.every((word) => canonicalWords.includes(word) || aliasWords.includes(word))) return 300 - canonicalWords.length;
  return 0;
}

export function isPreparedFoodReference(reference: SearchableFoodReference): reference is PreparedFoodReference {
  return reference.state === "prepared" && "servingUnit" in reference;
}

export function searchFoodReferences(query: string, limit = 20) {
  return [...FOOD_REFERENCE, ...PREPARED_FOOD_REFERENCE]
    .map((food) => ({ food, score: score(food, query) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name))
    .slice(0, limit)
    .map(({ food }) => food);
}

export function findFoodReference(query: string) {
  return searchFoodReferences(query, 1)[0] ?? null;
}

export function getFoodClarification(reference: SearchableFoodReference | null, description: string, portionText?: string) {
  if (!reference) {
    return {
      needsClarification: true,
      questions: ["Which food or dish is this, and what portion did you eat?"],
    };
  }
  const questions: string[] = [];
  const text = normalize(`${description} ${portionText ?? ""}`);
  if (isPreparedFoodReference(reference)) {
    if (!/\b(\d+(\.\d+)?|one|two|half|quarter|cup|bowl|plate|piece|serving|spoon|roti|chapati)\b/.test(text)) {
      questions.push(`How much did you eat? The reference uses ${reference.servingCount} ${reference.servingUnit} per serving.`);
    }
    questions.push(`This is a prepared-dish estimate based on ${reference.basis}; recipe, oil, and cooking method can change the result.`);
  } else if (!/\b\d+(\s?g|\s?gram|\s?grams|\s?ml|\s?cup|\s?bowl|\s?plate|\s?piece|\s?serving|\s?tbsp|\s?tsp)\b/i.test(text)) {
    questions.push("What portion did you eat? Add grams, cups, bowls, pieces, or servings for a better estimate.");
  }
  return { needsClarification: questions.length > 0, questions };
}
