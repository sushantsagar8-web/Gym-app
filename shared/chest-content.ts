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

const safety = (cues: string[]) => ({
  formCues: cues,
  commonMistakes: ["Avoid bouncing the load or locking out aggressively.", "Do not let the shoulders roll forward under fatigue."],
  contraindications: ["Stop if you feel sharp pain, dizziness, or unusual discomfort.", "Seek professional advice before exercising with an injury or medical limitation."],
  regressions: ["Reduce the load and use a shorter comfortable range of motion."],
  progressions: ["Add a controlled repetition or small load increase when form remains consistent."],
  professionalReviewStatus: "not-reviewed" as const,
});

const base = (
  id: string,
  name: string,
  description: string,
  muscles: string[],
  equipment: string[],
  clip: ExerciseMediaAsset,
  cues: string[],
): ExerciseContent => ({
  id,
  slug: id.replace("exercise.", ""),
  name,
  shortDescription: description,
  instructions: cues,
  primaryMuscles: muscles,
  secondaryMuscles: ["shoulders", "triceps"],
  movementPattern: "horizontal-push",
  difficulty: "intermediate",
  locations: ["gym", "home"],
  equipment,
  media: [clip],
  prescription: { mode: "reps", defaultReps: 10, defaultSets: 3, defaultRestSeconds: 60, progression: { repsIncrease: 1, weightIncreaseKg: 1.25 } },
  safety: safety(cues),
  tags: ["chest", "pectorals", "gym", "home", "men", "women", "media-batch-2026-08-chest"],
  language: "en-IN",
  isFree: true,
  status: "review",
  createdAt,
  updatedAt: createdAt,
});

const pressCues = [
  "Set the shoulders down and back before pressing.",
  "Press smoothly through the palms while keeping the wrists stacked.",
  "Lower under control and use a comfortable range of motion.",
];

const flyCues = [
  "Keep a soft bend in the elbows and brace the trunk.",
  "Bring the hands together without forcing the shoulder joint.",
  "Return slowly while maintaining control of the load.",
];

export const chestExercises: ExerciseContent[] = [
  base("exercise.chest-press-home", "Home chest press", "A home-friendly pressing movement for building chest strength.", ["chest", "pectorals"], ["home press setup"], media("media.chest-press-home", "https://res.cloudinary.com/qvzram56/video/upload/v1786876618/chest_press_home.mp4", "Home chest press exercise reference."), pressCues),
  base("exercise.chest-inner-chest", "Inner chest press", "A pressing variation emphasizing controlled pectoral contraction.", ["chest", "pectorals"], ["dumbbells or machine"], media("media.chest-inner-chest", "https://res.cloudinary.com/qvzram56/video/upload/v1786876617/inner_chest.mp4", "Inner chest exercise reference."), pressCues),
  base("exercise.chest-dumbbell-press", "Dumbbell press", "A dumbbell press for balanced chest strength and stability.", ["chest", "pectorals"], ["dumbbells", "bench"], media("media.chest-dumbbell-press", "https://res.cloudinary.com/qvzram56/video/upload/v1786876624/DUmbell_press_-_form.mp4", "Dumbbell chest press exercise reference."), pressCues),
  base("exercise.chest-upper-dumbbell-press", "Upper-chest dumbbell press", "An angled dumbbell press for upper-pectoral emphasis.", ["chest", "pectorals"], ["dumbbells", "incline bench"], media("media.chest-upper-dumbbell-press", "https://res.cloudinary.com/qvzram56/video/upload/v1786876629/upper_chest_dumblles_-_home.mp4", "Upper-chest dumbbell press exercise reference."), pressCues),
  base("exercise.chest-machine-fly-two", "Machine fly", "A supported fly movement for controlled chest isolation.", ["chest", "pectorals"], ["chest fly machine"], media("media.chest-machine-fly-two", "https://res.cloudinary.com/qvzram56/video/upload/v1786876629/machine_fly_2.mp4", "Machine fly chest exercise reference."), flyCues),
  base("exercise.chest-dumbbell-fly", "Dumbbell fly", "A controlled dumbbell fly for chest adduction and stretch tolerance.", ["chest", "pectorals"], ["dumbbells", "bench"], media("media.chest-dumbbell-fly", "https://res.cloudinary.com/qvzram56/video/upload/v1786876629/dumbell_fly.mp4", "Dumbbell fly chest exercise reference."), flyCues),
  base("exercise.chest-machine-fly", "Machine fly variation", "A machine fly variation with stable resistance through the chest movement.", ["chest", "pectorals"], ["chest fly machine"], media("media.chest-machine-fly", "https://res.cloudinary.com/qvzram56/video/upload/v1786876633/Machine_fly.mp4", "Machine fly variation chest exercise reference."), flyCues),
  base("exercise.chest-cable-fly", "Cable fly", "A cable fly that maintains tension through the chest contraction.", ["chest", "pectorals"], ["cable machine"], media("media.chest-cable-fly", "https://res.cloudinary.com/qvzram56/video/upload/v1786876638/Cable_fly.mp4", "Cable fly chest exercise reference."), flyCues),
  base("exercise.chest-bench-press", "Bench press", "A foundational barbell or machine press for chest strength.", ["chest", "pectorals"], ["barbell or machine", "bench"], media("media.chest-bench-press", "https://res.cloudinary.com/qvzram56/video/upload/v1786876639/Bench_press.mp4", "Bench press chest exercise reference."), pressCues),
];

export const chestMediaBatch = {
  id: "media-batch-2026-08-chest",
  audience: "all",
  category: "chest",
  sourceFiles: chestExercises.length,
  rightsStatus: "pending-confirmation" as const,
  exercises: chestExercises,
};

export default chestExercises;

/* User-provided media should be reviewed for licensing and exercise-form safety before publication. */
const _keepTypeCheck: ExerciseContent[] = chestExercises;
void _keepTypeCheck;
