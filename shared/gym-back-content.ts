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

const safety = (cues: string[], mistakes: string[] = []) => ({
  formCues: cues,
  commonMistakes: mistakes,
  contraindications: [
    "Stop if you feel sharp pain, dizziness, or unusual discomfort.",
    "Seek professional advice before exercising with an injury or medical limitation.",
  ],
  regressions: ["Reduce the load and range of motion.", "Use a slower tempo with fewer repetitions."],
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
  mistakes: string[] = [],
): ExerciseContent => ({
  id,
  slug: id.replace("exercise.", ""),
  name,
  shortDescription: description,
  instructions: cues,
  primaryMuscles: muscles,
  secondaryMuscles: ["core stabilizers", "grip"],
  movementPattern: "pull",
  difficulty: "intermediate",
  locations: ["gym"],
  equipment,
  media: [clip],
  prescription: { mode: "reps", defaultReps: 10, defaultSets: 3, defaultRestSeconds: 60, progression: { repsIncrease: 1, weightIncreaseKg: 2.5 } },
  safety: safety(cues, mistakes),
  tags: ["back", "gym", "men", "women", "media-batch-2026-08-back"],
  language: "en-IN",
  isFree: true,
  status: "review",
  createdAt,
  updatedAt: createdAt,
});

const cues = ["Brace the trunk and keep the spine neutral.", "Move the weight under control without swinging.", "Pull through the elbows and pause briefly at the contracted position."];

export const gymBackExercises: ExerciseContent[] = [
  base("exercise.gym-back-barbell-row-full", "Barbell row — full back", "A compound row targeting the full back with a controlled bar path.", ["back", "upper back"], ["barbell", "weight plates"], media("media.back-barbell-row-full", "https://res.cloudinary.com/qvzram56/video/upload/v1786849188/barbell_rows_-_full_back.mp4", "Barbell row full-back gym reference."), cues),
  base("exercise.gym-back-barbell-row-upper", "Barbell row — upper back", "A barbell row variation emphasizing the upper-back musculature.", ["upper back"], ["barbell", "weight plates"], media("media.back-barbell-row-upper", "https://res.cloudinary.com/qvzram56/video/upload/v1786849190/Barbell_rows_-_upper_back.mp4", "Barbell row upper-back gym reference."), cues),
  base("exercise.gym-back-cable-upper", "Cable row — upper back", "A cable-machine pull focused on upper-back control.", ["upper back"], ["cable machine"], media("media.back-cable-upper", "https://res.cloudinary.com/qvzram56/video/upload/v1786849197/cable_machine_-_upper_back.mp4", "Cable upper-back gym reference."), cues),
  base("exercise.gym-back-cable-mid", "Cable row — mid back", "A seated cable movement for the mid-back and scapular retraction.", ["back"], ["cable machine"], media("media.back-cable-mid", "https://res.cloudinary.com/qvzram56/video/upload/v1786849199/cable_machine-_mid_back.mp4", "Cable mid-back gym reference."), cues),
  base("exercise.gym-back-barbell-lower", "Barbell row — lower back focus", "A hinged barbell row variation with emphasis on posterior-chain bracing.", ["back"], ["barbell", "weight plates"], media("media.back-barbell-lower", "https://res.cloudinary.com/qvzram56/video/upload/v1786849201/Barbell_rows_-_lower.mp4", "Barbell lower-back gym reference."), cues),
  base("exercise.gym-back-cable-lower", "Cable pull — lower back", "A cable back exercise emphasizing controlled trunk and lat engagement.", ["back"], ["cable machine"], media("media.back-cable-lower", "https://res.cloudinary.com/qvzram56/video/upload/v1786849201/Cable_machine_-_lower_back.mp4", "Cable lower-back gym reference."), cues),
  base("exercise.gym-back-cable-upper-wide", "Cable row — wide upper back", "A wide-grip cable variation for upper-back width and control.", ["upper back"], ["cable machine"], media("media.back-cable-upper-wide", "https://res.cloudinary.com/qvzram56/video/upload/v1786849220/cable_machine_upper_back.mp4", "Wide cable upper-back gym reference."), cues),
  base("exercise.gym-back-lat-pulldown-upper", "Lat pulldown — upper back", "A vertical pull emphasizing the lats and upper-back position.", ["lats", "upper back"], ["lat pulldown machine"], media("media.back-lat-pulldown-upper", "https://res.cloudinary.com/qvzram56/video/upload/v1786849223/Lat_Pulldown_-_upper.mp4", "Upper lat pulldown gym reference."), cues),
  base("exercise.gym-back-lat-pulldown-lower", "Lat pulldown — lower emphasis", "A lat pulldown variation using a controlled full range.", ["lats"], ["lat pulldown machine"], media("media.back-lat-pulldown-lower", "https://res.cloudinary.com/qvzram56/video/upload/v1786849227/Lat_pulldown_lower.mp4", "Lower-emphasis lat pulldown gym reference."), cues),
  base("exercise.gym-back-smith-upper", "Smith machine row — upper back", "A guided-machine row for stable upper-back loading.", ["upper back"], ["Smith machine"], media("media.back-smith-upper", "https://res.cloudinary.com/qvzram56/video/upload/v1786849233/simth_machine_-_upper_back.mp4", "Smith-machine upper-back gym reference."), cues),
  base("exercise.gym-back-dumbbell-bench-upper", "Dumbbell bench row — upper back", "A bench-supported dumbbell row for upper-back control.", ["upper back"], ["dumbbells", "bench"], media("media.back-dumbbell-bench-upper", "https://res.cloudinary.com/qvzram56/video/upload/v1786849238/dumbell_bench_-_upper_back.mp4", "Dumbbell bench upper-back gym reference."), cues),
  base("exercise.gym-back-dumbbell-row", "Dumbbell back workout", "A single- or double-dumbbell row for balanced back development.", ["back"], ["dumbbells"], media("media.back-dumbbell-row", "https://res.cloudinary.com/qvzram56/video/upload/v1786849248/Dumbell_-_back_workout.mp4", "Dumbbell back workout gym reference."), cues),
  base("exercise.gym-back-smith-wide", "Smith machine row — wide back", "A wide-grip Smith-machine row for back width and upper-back tension.", ["upper back"], ["Smith machine"], media("media.back-smith-wide", "https://res.cloudinary.com/qvzram56/video/upload/v1786849250/smith_machine_-_back_wide.mp4", "Wide Smith-machine back gym reference."), cues),
  base("exercise.gym-back-smith-lower", "Smith machine row — lower back", "A Smith-machine row variation with a stable lower-back position.", ["back"], ["Smith machine"], media("media.back-smith-lower", "https://res.cloudinary.com/qvzram56/video/upload/v1786849248/Smith_machine_-_lowerback.mp4", "Smith-machine lower-back gym reference."), cues),
  base("exercise.gym-back-lat-underhand", "Underhand lat pulldown", "An underhand vertical pull emphasizing the lats and elbow drive.", ["lats"], ["lat pulldown machine"], media("media.back-lat-underhand", "https://res.cloudinary.com/qvzram56/video/upload/v1786849258/Lat_pulldown_-_undrehand.mp4", "Underhand lat pulldown gym reference."), cues),
  base("exercise.gym-back-t-bar-row", "T-bar row", "A supported or free-standing row for full-back strength and thickness.", ["back", "upper back"], ["T-bar row machine", "weight plates"], media("media.back-t-bar-row", "https://res.cloudinary.com/qvzram56/video/upload/v1786849266/T-bar_row.mp4", "T-bar row gym reference."), cues),
];

export const gymBackMediaBatch = {
  id: "media-batch-2026-08-gym-back",
  audience: "all",
  category: "back",
  sourceFiles: gymBackExercises.length,
  rightsStatus: "pending-confirmation" as const,
  exercises: gymBackExercises,
};

export default gymBackExercises;

/* User-provided media should be reviewed for licensing and exercise-form safety before publication. */
const _keepTypeCheck: ExerciseContent[] = gymBackExercises;
void _keepTypeCheck;
