import { sampleExerciseContent } from "./exercise-content";
import { menAbsExercises } from "./men-abs-content";
import { womenAbsExercises } from "./women-abs-content";
import { gymBackExercises } from "./gym-back-content";
import { bicepsExercises } from "./biceps-content";
import { tricepsExercises } from "./triceps-content";
import { chestExercises } from "./chest-content";
import { shouldersExercises } from "./shoulders-content";
import { legsExercises } from "./legs-content";
import { starterMeals, starterPrograms, type ContentBundle, type WorkoutSessionTemplate } from "./fitpath-models";

export const starterSessions: WorkoutSessionTemplate[] = [
  { id: "session-foundation-day-1", programId: "program.foundation-strength", title: "Full-body foundation", dayLabel: "Week 1 · Day 1", estimatedMinutes: 25, blocks: [{ id: "warmup-1", title: "warm-up", exerciseIds: [] }, { id: "main-1", title: "main-workout", exerciseIds: [sampleExerciseContent.id] }, { id: "cooldown-1", title: "cool-down", exerciseIds: [] }] },
  { id: "session-home-day-2", programId: "program.stronger-at-home", title: "Lower-body strength", dayLabel: "Week 1 · Day 2", estimatedMinutes: 30, blocks: [{ id: "warmup-2", title: "warm-up", exerciseIds: [] }, { id: "main-2", title: "main-workout", exerciseIds: [sampleExerciseContent.id] }, { id: "cooldown-2", title: "cool-down", exerciseIds: [] }] },
];

export const starterContentBundle: ContentBundle = { exercises: [sampleExerciseContent, ...menAbsExercises, ...womenAbsExercises, ...gymBackExercises, ...bicepsExercises, ...tricepsExercises, ...chestExercises, ...shouldersExercises, ...legsExercises], programs: starterPrograms, sessions: starterSessions, meals: starterMeals };

export const contentPublishingChecklist = ["Exercise record created", "Licensed media attached", "Rights metadata verified", "Form and safety review complete", "Program placement configured", "Published to app"] as const;
