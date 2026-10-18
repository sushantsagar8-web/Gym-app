import type { ExerciseContent, ExerciseMediaAsset } from "./exercise-content";

const createdAt = "2026-08-16T00:00:00.000Z";

const media = (id: string, uri: string, altText: string): ExerciseMediaAsset => ({
  id,
  kind: "video",
  uri,
  mimeType: "video/mp4",
  altText,
  licenseStatus: "pending",
});

const base = (
  id: string,
  name: string,
  description: string,
  muscles: string[],
  equipment: string[],
  clip: ExerciseMediaAsset,
  instructions: string[],
): ExerciseContent => ({
  id,
  slug: id.replace("exercise.", ""),
  name,
  shortDescription: description,
  instructions,
  primaryMuscles: muscles,
  secondaryMuscles: ["shoulders", "forearms", "grip"],
  movementPattern: "elbow-extension",
  difficulty: "intermediate",
  locations: ["gym"],
  equipment,
  media: [clip],
  prescription: { mode: "reps", defaultReps: 10, defaultSets: 3, defaultRestSeconds: 60, progression: { repsIncrease: 1, weightIncreaseKg: 1.25 } },
  safety: {
    formCues: instructions,
    commonMistakes: ["Avoid forcing the elbows into a painful position.", "Do not use momentum to complete repetitions."],
    contraindications: ["Stop if you feel sharp pain, dizziness, or unusual discomfort.", "Seek professional advice before exercising with an injury or medical limitation."],
    regressions: ["Reduce the load and use a shorter comfortable range of motion."],
    progressions: ["Add a controlled repetition or small load increase when form remains consistent."],
    professionalReviewStatus: "not-reviewed",
  },
  tags: ["arms", "triceps", "gym", "men", "women", "media-batch-2026-08-triceps"],
  language: "en-IN",
  isFree: true,
  status: "review",
  createdAt,
  updatedAt: createdAt,
});

const extensionCues = [
  "Brace the trunk and keep the upper arms controlled.",
  "Extend through the elbows without swinging the shoulders.",
  "Return slowly to the starting position and keep a comfortable range of motion.",
];

export const tricepsExercises: ExerciseContent[] = [
  base("exercise.triceps-chair-dips", "Chair dips", "A supported bodyweight dip variation for triceps strength.", ["triceps"], ["chair or bench"], media("media.triceps-chair-dips", "https://res.cloudinary.com/qvzram56/video/upload/v1786866404/chair_dips.mp4", "Chair dips triceps exercise reference."), extensionCues),
  base("exercise.triceps-forearm-pushup", "Forearm push-up", "A bodyweight pressing variation that challenges the triceps and upper body.", ["triceps"], ["bodyweight"], media("media.triceps-forearm-pushup", "https://res.cloudinary.com/qvzram56/video/upload/v1786866404/forearm_pushup.mp4", "Forearm push-up triceps exercise reference."), extensionCues),
  base("exercise.triceps-dips", "Parallel-bar dips", "A dip movement that trains the triceps with controlled bodyweight resistance.", ["triceps"], ["dip bars"], media("media.triceps-dips", "https://res.cloudinary.com/qvzram56/video/upload/v1786866408/Dips.mp4", "Parallel-bar dips triceps exercise reference."), extensionCues),
  base("exercise.triceps-chair-dips-advanced", "Dips on a chair", "A chair-supported dip variation for accessible triceps work.", ["triceps"], ["chair or bench"], media("media.triceps-chair-dips-advanced", "https://res.cloudinary.com/qvzram56/video/upload/v1786866417/Dips_on_a_chair.mp4", "Chair dip triceps exercise reference."), extensionCues),
  base("exercise.triceps-overhead-dumbbell-extension", "Overhead dumbbell extension", "An overhead extension emphasizing the long head of the triceps.", ["triceps"], ["dumbbell"], media("media.triceps-overhead-dumbbell-extension", "https://res.cloudinary.com/qvzram56/video/upload/v1786866417/overhead_dumbell_extensions.mp4", "Overhead dumbbell triceps extension reference."), extensionCues),
  base("exercise.triceps-dumbbell-kickback", "Dumbbell kickback", "A hinge-supported extension that isolates the triceps near lockout.", ["triceps"], ["dumbbells"], media("media.triceps-dumbbell-kickback", "https://res.cloudinary.com/qvzram56/video/upload/v1786866417/Dumbell_kisckback.mp4", "Dumbbell triceps kickback reference."), extensionCues),
  base("exercise.triceps-skull-crusher", "Skull crusher", "A lying extension variation for controlled triceps loading.", ["triceps"], ["barbell or dumbbells", "bench"], media("media.triceps-skull-crusher", "https://res.cloudinary.com/qvzram56/video/upload/v1786866417/skull_crushers.mp4", "Skull crusher triceps exercise reference."), extensionCues),
  base("exercise.triceps-bench-supported-dips", "Bench-supported dips", "A bench-supported dip variation for focused triceps work.", ["triceps"], ["bench"], media("media.triceps-bench-supported-dips", "https://res.cloudinary.com/qvzram56/video/upload/v1786866421/Bench_supported_dips.mp4", "Bench-supported dips triceps exercise reference."), extensionCues),
  base("exercise.triceps-rope-pulldown", "Rope pushdown", "A cable pushdown using a rope attachment for controlled triceps extension.", ["triceps"], ["cable machine", "rope attachment"], media("media.triceps-rope-pulldown", "https://res.cloudinary.com/qvzram56/video/upload/v1786866431/Rope_pull_down.mp4", "Rope pushdown triceps exercise reference."), extensionCues),
  base("exercise.triceps-diamond-pushup", "Diamond push-up", "A close-hand push-up variation that increases triceps demand.", ["triceps"], ["bodyweight"], media("media.triceps-diamond-pushup", "https://res.cloudinary.com/qvzram56/video/upload/v1786866433/Diamond_Push_ups.mp4", "Diamond push-up triceps exercise reference."), extensionCues),
  base("exercise.triceps-cable-rope-pulldown", "Triceps rope pull-down", "A rope cable extension with steady resistance through the pushdown.", ["triceps"], ["cable machine", "rope attachment"], media("media.triceps-cable-rope-pulldown", "https://res.cloudinary.com/qvzram56/video/upload/v1786866437/Triceps_rope_pull_down.mp4", "Triceps rope pull-down exercise reference."), extensionCues),
];

export const tricepsMediaBatch = {
  id: "media-batch-2026-08-triceps",
  audience: "all",
  category: "triceps",
  sourceFiles: tricepsExercises.length,
  rightsStatus: "pending-confirmation" as const,
  exercises: tricepsExercises,
};

export default tricepsExercises;
