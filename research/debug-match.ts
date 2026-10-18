import { FOOD_REFERENCE } from "../shared/food-reference";
import { estimateFoodMacros, findFoodReference } from "../shared/food-macro-estimator";

const names = FOOD_REFERENCE.filter((food) => food.name.toLowerCase().includes("chicken")).slice(0, 20).map((food) => ({ name: food.name, aliases: food.aliases.slice(-2), source: food.source }));
console.log(names);
console.log(findFoodReference("chicken breast"));
console.log(estimateFoodMacros("chicken breast", 150));
