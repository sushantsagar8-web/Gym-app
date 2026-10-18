import type { ExerciseContent } from "../shared/exercise-content";
import { matchesAudience, type CuratedAudience } from "./audience-curation";

export type BodyPartId = "abs" | "chest" | "shoulders" | "back" | "legs" | "arms";

export type BodyPartDefinition = {
  id: BodyPartId;
  label: string;
  icon: string;
  image: string;
  muscles: string[];
};

export const bodyPartDefinitions: BodyPartDefinition[] = [
  { id: "abs", label: "Abs", icon: "body.abs", image: "https://res.cloudinary.com/qvzram56/image/upload/v1786776000/Abs.png", muscles: ["full abs", "lower abs", "upper abs", "obliques", "abs"] },
  { id: "chest", label: "Chest", icon: "body.chest", image: "https://res.cloudinary.com/qvzram56/image/upload/v1786775993/chest.png", muscles: ["chest", "pectorals"] },
  { id: "shoulders", label: "Shoulders", icon: "body.shoulders", image: "https://res.cloudinary.com/qvzram56/image/upload/v1786775997/shoulder.png", muscles: ["shoulders", "deltoids"] },
  { id: "back", label: "Back", icon: "body.back", image: "https://res.cloudinary.com/qvzram56/image/upload/v1786775996/Back.png", muscles: ["back", "lats", "upper back"] },
  { id: "legs", label: "Legs", icon: "body.legs", image: "https://res.cloudinary.com/qvzram56/image/upload/v1786776001/legs.png", muscles: ["quadriceps", "hamstrings", "glutes", "calves", "legs"] },
  { id: "arms", label: "Arms", icon: "body.arms", image: "https://res.cloudinary.com/qvzram56/image/upload/v1786775996/Arms.png", muscles: ["biceps", "triceps", "forearms", "arms"] },
];

export function filterExercisesByBodyPart(exercises: ExerciseContent[], part: BodyPartDefinition, audience: CuratedAudience) {
  return exercises.filter((item) => {
    const belongsToPart = part.muscles.some((muscle) => item.primaryMuscles.includes(muscle) || item.tags.includes(muscle));
    return belongsToPart && matchesAudience(item.tags, audience);
  });
}
