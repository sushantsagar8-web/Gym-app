import type { ExerciseContent, ExerciseMediaAsset } from "./exercise-content";

const createdAt = "2026-08-16T00:00:00.000Z";

const media = (id: string, uri: string, altText: string): ExerciseMediaAsset => ({ id, kind: "video", uri, mimeType: "video/mp4", altText, licenseStatus: "pending" });

const cues = [
  "Brace the trunk and keep the ribs controlled.",
  "Move through the shoulders without swinging or forcing the range.",
  "Lower the load slowly and stop if you feel sharp pain or unusual discomfort.",
];

const safety = {
  formCues: cues,
  commonMistakes: ["Avoid momentum and shrugging through every repetition.", "Do not force overhead range if shoulder mobility is limited."],
  contraindications: ["Stop if you feel sharp pain, dizziness, or unusual discomfort.", "Seek professional advice before exercising with an injury or medical limitation."],
  regressions: ["Use a lighter load, supported position, or shorter comfortable range of motion."],
  progressions: ["Add a controlled repetition or small load increase when form remains consistent."],
  professionalReviewStatus: "not-reviewed" as const,
};

const base = (id: string, name: string, description: string, muscles: string[], equipment: string[], clip: ExerciseMediaAsset, subgroup: "front-delts" | "side-delts" | "rear-delts" | "traps"): ExerciseContent => ({
  id,
  slug: id.replace("exercise.", ""),
  name,
  shortDescription: description,
  instructions: cues,
  primaryMuscles: muscles,
  secondaryMuscles: ["traps", "triceps"],
  movementPattern: "shoulder-press-or-raise",
  difficulty: "intermediate",
  locations: ["gym", "home"],
  equipment,
  media: [clip],
  prescription: { mode: "reps", defaultReps: 10, defaultSets: 3, defaultRestSeconds: 60, progression: { repsIncrease: 1, weightIncreaseKg: 1.25 } },
  safety,
  tags: ["shoulders", "deltoids", "gym", "home", "men", "women", "media-batch-2026-08-shoulders", subgroup],
  language: "en-IN",
  isFree: true,
  status: "review",
  createdAt,
  updatedAt: createdAt,
});

export const shouldersExercises: ExerciseContent[] = [
  base("exercise.shoulders-seated-front-raise", "Seated front raise", "A controlled front raise for the anterior deltoids.", ["shoulders", "front deltoids"], ["dumbbells", "bench"], media("media.shoulders-seated-front-raise", "https://res.cloudinary.com/qvzram56/video/upload/v1786878507/Seated_front_raises.mp4", "Seated front raise shoulder exercise reference."), "front-delts"),
  base("exercise.shoulders-press", "Shoulder press", "A foundational overhead press for shoulder strength.", ["shoulders", "deltoids"], ["dumbbells or machine"], media("media.shoulders-press", "https://res.cloudinary.com/qvzram56/video/upload/v1786878507/sholder_press.mp4", "Shoulder press exercise reference."), "front-delts"),
  base("exercise.shoulders-rear-delt-raise", "Rear-delt raise", "A rear-delt raise for posterior shoulder development.", ["shoulders", "rear deltoids"], ["dumbbells"], media("media.shoulders-rear-delt-raise", "https://res.cloudinary.com/qvzram56/video/upload/v1786878507/rear_dealt_raises.mp4", "Rear-delt raise shoulder exercise reference."), "rear-delts"),
  base("exercise.shoulders-hammer-press", "Shoulder hammer press", "A neutral-grip press variation for controlled shoulder pressing.", ["shoulders", "deltoids"], ["dumbbells or machine"], media("media.shoulders-hammer-press", "https://res.cloudinary.com/qvzram56/video/upload/v1786878507/Shoulder_hammer_press.mp4", "Shoulder hammer press exercise reference."), "front-delts"),
  base("exercise.shoulders-traps-two", "Traps raise variation", "A controlled movement for the upper trapezius and shoulder girdle.", ["traps", "shoulders"], ["dumbbells"], media("media.shoulders-traps-two", "https://res.cloudinary.com/qvzram56/video/upload/v1786878507/traps_2.mp4", "Traps exercise reference."), "traps"),
  base("exercise.shoulders-seated-lateral-raise", "Seated lateral raise", "A seated lateral raise for the middle deltoids.", ["shoulders", "side deltoids"], ["dumbbells", "bench"], media("media.shoulders-seated-lateral-raise", "https://res.cloudinary.com/qvzram56/video/upload/v1786878507/seated_lateral_raises.mp4", "Seated lateral raise shoulder exercise reference."), "side-delts"),
  base("exercise.shoulders-traps", "Traps movement", "A shoulder-girdle movement targeting the upper traps.", ["traps", "shoulders"], ["dumbbells or barbell"], media("media.shoulders-traps", "https://res.cloudinary.com/qvzram56/video/upload/v1786878507/traps.mp4", "Traps shoulder exercise reference."), "traps"),
];

export const shouldersMediaBatch = { id: "media-batch-2026-08-shoulders", audience: "all", category: "shoulders", sourceFiles: shouldersExercises.length, rightsStatus: "pending-confirmation" as const, exercises: shouldersExercises };

export default shouldersExercises;

/* User-provided media should be reviewed for licensing and exercise-form safety before publication. */
const _keepTypeCheck: ExerciseContent[] = shouldersExercises;
void _keepTypeCheck;
