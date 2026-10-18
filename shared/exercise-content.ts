export type ExerciseMediaKind = "gif" | "video" | "image";
export type ExercisePrescriptionMode = "reps" | "duration";
export type ExerciseDifficulty = "beginner" | "intermediate" | "advanced";
export type ExerciseLocation = "home" | "gym" | "cardio";

export type ExerciseMediaAsset = {
  id: string;
  kind: ExerciseMediaKind;
  uri: string;
  thumbnailUri?: string;
  altText: string;
  durationSeconds?: number;
  mimeType?: string;
  licenseStatus: "pending" | "licensed" | "owned" | "public-domain";
  rightsHolder?: string;
  licenseReference?: string;
  attributionText?: string;
  expiresAt?: string;
};

export type ExercisePrescription = {
  mode: ExercisePrescriptionMode;
  defaultReps?: number;
  defaultDurationSeconds?: number;
  defaultSets: number;
  defaultRestSeconds: number;
  progression?: { repsIncrease?: number; weightIncreaseKg?: number; restDecreaseSeconds?: number };
};

export type ExerciseSafety = {
  formCues: string[];
  breathingCue?: string;
  commonMistakes: string[];
  contraindications: string[];
  regressions: string[];
  progressions: string[];
  professionalReviewStatus: "not-reviewed" | "reviewed";
  reviewedBy?: string;
  reviewedAt?: string;
};

export type ExerciseContent = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  instructions: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  movementPattern: string;
  difficulty: ExerciseDifficulty;
  locations: ExerciseLocation[];
  equipment: string[];
  media: ExerciseMediaAsset[];
  prescription: ExercisePrescription;
  safety: ExerciseSafety;
  tags: string[];
  language: "en-IN" | "hi-IN";
  isFree: boolean;
  status: "draft" | "review" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
};

export const sampleExerciseContent: ExerciseContent = {
  id: "exercise.bodyweight-squat",
  slug: "bodyweight-squat",
  name: "Bodyweight squat",
  shortDescription: "A foundational lower-body movement with a controlled tempo.",
  instructions: ["Stand with feet about hip-width apart.", "Lower with a steady, comfortable range of motion.", "Drive through the feet and return to standing."],
  primaryMuscles: ["quadriceps", "glutes"],
  secondaryMuscles: ["hamstrings", "core"],
  movementPattern: "squat",
  difficulty: "beginner",
  locations: ["home", "gym"],
  equipment: [],
  media: [],
  prescription: { mode: "reps", defaultReps: 10, defaultSets: 3, defaultRestSeconds: 45 },
  safety: { formCues: ["Keep the chest lifted.", "Move within a pain-free range."], commonMistakes: ["Rushing the descent."], contraindications: [], regressions: ["Sit-to-stand squat"], progressions: ["Tempo squat"], professionalReviewStatus: "not-reviewed" },
  tags: ["lower-body", "free-library"],
  language: "en-IN",
  isFree: true,
  status: "draft",
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};
