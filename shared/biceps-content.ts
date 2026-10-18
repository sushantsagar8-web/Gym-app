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
  regressions: ["Reduce the load and range of motion.", "Use a lighter weight and slower tempo."],
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
  secondaryMuscles: ["forearms", "grip"],
  movementPattern: "elbow-flexion",
  difficulty: "intermediate",
  locations: ["gym"],
  equipment,
  media: [clip],
  prescription: { mode: "reps", defaultReps: 10, defaultSets: 3, defaultRestSeconds: 60, progression: { repsIncrease: 1, weightIncreaseKg: 1.25 } },
  safety: safety(cues, mistakes),
  tags: ["arms", "biceps", "gym", "men", "women", "media-batch-2026-08-biceps"],
  language: "en-IN",
  isFree: true,
  status: "review",
  createdAt,
  updatedAt: createdAt,
});

const curlCues = [
  "Brace the trunk and keep the shoulders relaxed.",
  "Curl through the elbows without swinging the torso.",
  "Lower the weight under control and keep a comfortable range of motion.",
];

export const bicepsExercises: ExerciseContent[] = [
  base("exercise.biceps-dumbbell-curl", "Dumbbell biceps curl", "A classic alternating or simultaneous dumbbell curl for focused biceps work.", ["biceps"], ["dumbbells"], media("media.biceps-dumbbell-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858567/bicep_curls.mp4", "Dumbbell biceps curl gym reference."), curlCues),
  base("exercise.biceps-dumbbell-preacher-curl", "Dumbbell preacher curl", "A preacher-supported curl that limits momentum and emphasizes controlled elbow flexion.", ["biceps"], ["dumbbell", "preacher bench"], media("media.biceps-dumbbell-preacher-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858568/dumbell_preacher.mp4", "Dumbbell preacher curl gym reference."), curlCues),
  base("exercise.biceps-seated-dumbbell-curl", "Seated dumbbell curl", "A seated dumbbell curl variation for stable upper-arm positioning.", ["biceps"], ["dumbbells", "bench"], media("media.biceps-seated-dumbbell-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858571/Bicep_dumbell_curls.mp4", "Seated dumbbell biceps curl gym reference."), curlCues),
  base("exercise.biceps-cable-hammer-curl", "Cable hammer curl", "A neutral-grip cable curl that trains the biceps and brachialis with steady tension.", ["biceps", "brachialis"], ["cable machine", "rope attachment"], media("media.biceps-cable-hammer-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858572/cable_hammer_curls.mp4", "Cable hammer curl gym reference."), curlCues),
  base("exercise.biceps-forearm-curl", "Forearm curl", "A controlled wrist-flexion exercise for forearm and grip development.", ["forearms"], ["barbell or dumbbells"], media("media.biceps-forearm-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858572/Forearm_curls.mp4", "Forearm curl gym reference."), ["Support the forearms on a stable surface.", "Move through the wrists without bouncing.", "Return slowly to the starting position."]),
  base("exercise.biceps-cable-curl", "Cable biceps curl", "A cable curl that maintains consistent resistance through the movement.", ["biceps"], ["cable machine", "straight bar attachment"], media("media.biceps-cable-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858572/Cable_bicep_curls.mp4", "Cable biceps curl gym reference."), curlCues),
  base("exercise.biceps-incline-dumbbell-curl", "Incline biceps curl", "An incline dumbbell curl with the upper arms positioned slightly behind the torso.", ["biceps"], ["dumbbells", "incline bench"], media("media.biceps-incline-dumbbell-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858575/inclined_bicep_curls.mp4", "Incline biceps curl gym reference."), curlCues),
  base("exercise.biceps-hammer-curl", "Hammer curl", "A neutral-grip dumbbell curl that trains the biceps, brachialis, and forearms.", ["biceps", "brachialis"], ["dumbbells"], media("media.biceps-hammer-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858575/hammer_curls.mp4", "Hammer curl gym reference."), curlCues),
  base("exercise.biceps-barbell-curl", "Barbell curl", "A foundational barbell curl for progressive biceps strength work.", ["biceps"], ["barbell", "weight plates"], media("media.biceps-barbell-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858575/Barbell_curls.mp4", "Barbell curl gym reference."), curlCues),
  base("exercise.biceps-reverse-grip-forearm-curl", "Reverse-grip forearm curl", "A pronated-grip curl variation emphasizing the forearms and brachioradialis.", ["forearms", "brachialis"], ["barbell or dumbbells"], media("media.biceps-reverse-grip-forearm-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858578/reverse_grip_forearm_curls.mp4", "Reverse-grip forearm curl gym reference."), curlCues),
  base("exercise.biceps-single-arm-preacher-curl", "Single-arm dumbbell preacher curl", "A unilateral preacher curl for focused biceps control and side-to-side balance.", ["biceps"], ["dumbbell", "preacher bench"], media("media.biceps-single-arm-preacher-curl", "https://res.cloudinary.com/qvzram56/video/upload/v1786858578/single_hand_dumble_preacher_curl.mp4", "Single-arm dumbbell preacher curl gym reference."), curlCues),
];

export const bicepsMediaBatch = {
  id: "media-batch-2026-08-biceps",
  audience: "all",
  category: "biceps",
  sourceFiles: bicepsExercises.length,
  rightsStatus: "pending-confirmation" as const,
  exercises: bicepsExercises,
};

export default bicepsExercises;

/* User-provided media should be reviewed for licensing and exercise-form safety before publication. */
const _keepTypeCheck: ExerciseContent[] = bicepsExercises;
void _keepTypeCheck;
