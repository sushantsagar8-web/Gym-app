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

const cues = [
  "Brace the trunk and keep the knees tracking in line with the toes.",
  "Use a controlled range of motion and avoid bouncing at the bottom.",
  "Lower the load slowly and stop if you feel sharp pain or unusual discomfort.",
];

const safety = {
  formCues: cues,
  commonMistakes: [
    "Avoid collapsing the knees inward or shifting weight unevenly.",
    "Do not use momentum to complete a repetition.",
  ],
  contraindications: [
    "Stop if you feel sharp pain, dizziness, or unusual discomfort.",
    "Seek professional advice before exercising with an injury or medical limitation.",
  ],
  regressions: ["Use a lighter load, supported position, or shorter comfortable range of motion."],
  progressions: ["Add a controlled repetition or small load increase when form remains consistent."],
  professionalReviewStatus: "not-reviewed" as const,
};

const base = (
  id: string,
  name: string,
  description: string,
  muscles: string[],
  equipment: string[],
  clip: ExerciseMediaAsset,
  tags: string[],
): ExerciseContent => ({
  id,
  slug: id.replace("exercise.", ""),
  name,
  shortDescription: description,
  instructions: cues,
  primaryMuscles: muscles,
  secondaryMuscles: ["glutes", "core"],
  movementPattern: "squat-hinge-lunge-or-calf-raise",
  difficulty: "intermediate",
  locations: ["gym", "home"],
  equipment,
  media: [clip],
  prescription: {
    mode: "reps",
    defaultReps: 10,
    defaultSets: 3,
    defaultRestSeconds: 60,
    progression: { repsIncrease: 1, weightIncreaseKg: 1.25 },
  },
  safety,
  tags: ["legs", "gym", "home", "men", "women", "media-batch-2026-08-legs", ...tags],
  language: "en-IN",
  isFree: true,
  status: "review",
  createdAt,
  updatedAt: createdAt,
});

export const legsExercises: ExerciseContent[] = [
  base("exercise.legs-calves", "Calf raise", "A focused calf raise for lower-leg strength.", ["calves"], ["bodyweight or machine"], media("media.legs-calves", "https://res.cloudinary.com/qvzram56/video/upload/v1786899447/Calves.mp4", "Calf raise leg exercise reference."), ["calves"]),
  base("exercise.legs-close-foot-squat", "Close-foot squat", "A close-stance squat emphasizing the quadriceps.", ["quadriceps", "glutes"], ["bodyweight or dumbbells"], media("media.legs-close-foot-squat", "https://res.cloudinary.com/qvzram56/video/upload/v1786899450/Close_Foot_squat.mp4", "Close-foot squat leg exercise reference."), ["quadriceps"]),
  base("exercise.legs-glutes-quads", "Glutes and quads movement", "A lower-body movement targeting the glutes and quadriceps.", ["glutes", "quadriceps"], ["bodyweight or dumbbells"], media("media.legs-glutes-quads", "https://res.cloudinary.com/qvzram56/video/upload/v1786899450/Glutes_Quads.mp4", "Glutes and quadriceps exercise reference."), ["glutes", "quadriceps"]),
  base("exercise.legs-glutes-three", "Glutes exercise variation", "A glute-focused lower-body exercise variation.", ["glutes"], ["bodyweight or dumbbells"], media("media.legs-glutes-three", "https://res.cloudinary.com/qvzram56/video/upload/v1786899452/Glutes_3.mp4", "Glutes exercise variation reference."), ["glutes"]),
  base("exercise.legs-glutes-two", "Glutes exercise variation 2", "A second glute-focused lower-body exercise variation.", ["glutes"], ["bodyweight or dumbbells"], media("media.legs-glutes-two", "https://res.cloudinary.com/qvzram56/video/upload/v1786899454/Glutes_2.mp4", "Glutes exercise variation 2 reference."), ["glutes"]),
  base("exercise.legs-glutes", "Glutes exercise", "A glute-focused lower-body exercise.", ["glutes"], ["bodyweight or dumbbells"], media("media.legs-glutes", "https://res.cloudinary.com/qvzram56/video/upload/v1786899456/Glutes.mp4", "Glutes exercise reference."), ["glutes"]),
  base("exercise.legs-glutes-hamstrings", "Glutes and hamstrings movement", "A posterior-chain movement for the glutes and hamstrings.", ["glutes", "hamstrings"], ["bodyweight or dumbbells"], media("media.legs-glutes-hamstrings", "https://res.cloudinary.com/qvzram56/video/upload/v1786899456/Glutes_and_Hamstrings.mp4", "Glutes and hamstrings exercise reference."), ["glutes", "hamstrings"]),
  base("exercise.legs-lower-body-variation", "Lower-body exercise", "A lower-body movement for balanced leg training.", ["quadriceps", "glutes"], ["bodyweight or dumbbells"], media("media.legs-lower-body-variation", "https://res.cloudinary.com/qvzram56/video/upload/v1786899456/cjys6h_1.mp4", "Lower-body exercise reference."), ["quadriceps", "glutes"]),
  base("exercise.legs-front-quads", "Front quadriceps exercise", "A quadriceps-focused movement for the front of the thighs.", ["quadriceps"], ["bodyweight or machine"], media("media.legs-front-quads", "https://res.cloudinary.com/qvzram56/video/upload/v1786899457/front_quads.mp4", "Front quadriceps exercise reference."), ["quadriceps"]),
  base("exercise.legs-assisted-single-leg-lunge", "Bench-assisted single-leg lunge", "A supported unilateral leg exercise for balance and control.", ["quadriceps", "glutes"], ["bench"], media("media.legs-assisted-single-leg-lunge", "https://res.cloudinary.com/qvzram56/video/upload/v1786899458/Bench_assisted_single_leg_lunges.mp4", "Bench-assisted single-leg lunge reference."), ["quadriceps", "glutes", "unilateral"]),
  base("exercise.legs-single-leg-hamstring", "Single-leg hamstring exercise", "A unilateral hamstring movement with controlled loading.", ["hamstrings"], ["bodyweight or dumbbells"], media("media.legs-single-leg-hamstring", "https://res.cloudinary.com/qvzram56/video/upload/v1786899459/Hamstring_-_single_legs.mp4", "Single-leg hamstring exercise reference."), ["hamstrings", "unilateral"]),
  base("exercise.legs-hamstrings-one", "Hamstring exercise", "A hamstring-focused posterior-chain exercise.", ["hamstrings"], ["machine or dumbbells"], media("media.legs-hamstrings-one", "https://res.cloudinary.com/qvzram56/video/upload/v1786899478/hamstrings_1.mp4", "Hamstring exercise reference."), ["hamstrings"]),
  base("exercise.legs-quadriceps", "Quadriceps exercise", "A direct quadriceps movement for front-thigh strength.", ["quadriceps"], ["machine or dumbbells"], media("media.legs-quadriceps", "https://res.cloudinary.com/qvzram56/video/upload/v1786899485/quadriceps.mp4", "Quadriceps exercise reference."), ["quadriceps"]),
  base("exercise.legs-inner-thigh-dumbbell-squat", "Inner-thigh dumbbell squat", "A squat variation emphasizing the inner thighs and legs.", ["adductors", "quadriceps", "glutes"], ["dumbbells"], media("media.legs-inner-thigh-dumbbell-squat", "https://res.cloudinary.com/qvzram56/video/upload/v1786899486/Inner_Thigh_dumbell_squats.mp4", "Inner-thigh dumbbell squat reference."), ["inner-thigh", "adductors"]),
  base("exercise.legs-quad-machine", "Quad machine exercise", "A machine-based quadriceps movement.", ["quadriceps"], ["quad machine"], media("media.legs-quad-machine", "https://res.cloudinary.com/qvzram56/video/upload/v1786899487/Quad_machine.mp4", "Quad machine exercise reference."), ["quadriceps", "machine"]),
  base("exercise.legs-quads-two", "Quadriceps exercise variation", "A second quadriceps-focused gym movement.", ["quadriceps"], ["machine or dumbbells"], media("media.legs-quads-two", "https://res.cloudinary.com/qvzram56/video/upload/v1786899489/Quads_2.mp4", "Quadriceps exercise variation reference."), ["quadriceps"]),
  base("exercise.legs-hamstrings-three", "Hamstrings exercise variation", "A hamstring-focused gym movement.", ["hamstrings"], ["machine or dumbbells"], media("media.legs-hamstrings-three", "https://res.cloudinary.com/qvzram56/video/upload/v1786899492/Hamstrings_3.mp4", "Hamstrings exercise variation reference."), ["hamstrings"]),
  base("exercise.legs-machine", "Leg machine exercise", "A machine-based movement for controlled leg training.", ["quadriceps", "hamstrings"], ["leg machine"], media("media.legs-machine", "https://res.cloudinary.com/qvzram56/video/upload/v1786899492/Leg_machine.mp4", "Leg machine exercise reference."), ["quadriceps", "hamstrings", "machine"]),
  base("exercise.legs-smith-squat", "Smith machine squat", "A guided squat variation for the quadriceps and glutes.", ["quadriceps", "glutes"], ["Smith machine"], media("media.legs-smith-squat", "https://res.cloudinary.com/qvzram56/video/upload/v1786899493/smith_machine_squats.mp4", "Smith machine squat reference."), ["quadriceps", "glutes", "machine"]),
  base("exercise.legs-outer-quads", "Outer quadriceps exercise", "A quadriceps movement emphasizing the outer thigh line.", ["quadriceps"], ["machine or dumbbells"], media("media.legs-outer-quads", "https://res.cloudinary.com/qvzram56/video/upload/v1786899494/outer_quads.mp4", "Outer quadriceps exercise reference."), ["quadriceps"]),
  base("exercise.legs-smith-stiff-legs", "Smith machine stiff-leg movement", "A guided hip-hinge movement for hamstrings and glutes.", ["hamstrings", "glutes"], ["Smith machine"], media("media.legs-smith-stiff-legs", "https://res.cloudinary.com/qvzram56/video/upload/v1786899494/Smith_machine_stiff_legs.mp4", "Smith machine stiff-leg exercise reference."), ["hamstrings", "glutes", "machine"]),
  base("exercise.legs-toes-out-inner-thigh", "Toes-out inner-thigh movement", "A toes-out lower-body movement for the inner thighs.", ["adductors", "quadriceps", "glutes"], ["bodyweight or dumbbells"], media("media.legs-toes-out-inner-thigh", "https://res.cloudinary.com/qvzram56/video/upload/v1786899494/Toes_out_-_inner_thigh.mp4", "Toes-out inner-thigh exercise reference."), ["inner-thigh", "adductors"]),
  base("exercise.legs-toes-out-squat", "Toes-out squat", "A wide toes-out squat variation for the lower body.", ["quadriceps", "glutes", "adductors"], ["bodyweight or dumbbells"], media("media.legs-toes-out-squat", "https://res.cloudinary.com/qvzram56/video/upload/v1786899503/Toes_out_squat.mp4", "Toes-out squat exercise reference."), ["inner-thigh", "quadriceps", "glutes"]),
];

export const legsMediaBatch = {
  id: "media-batch-2026-08-legs",
  audience: "all",
  category: "legs",
  sourceFiles: legsExercises.length,
  rightsStatus: "pending-confirmation" as const,
  exercises: legsExercises,
};

export default legsExercises;

/* User-provided media should be reviewed for licensing and exercise-form safety before publication. */
const _keepTypeCheck: ExerciseContent[] = legsExercises;
void _keepTypeCheck;

