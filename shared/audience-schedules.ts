import type { AudienceSchedule, WorkoutSessionTemplate } from "./fitpath-models";

const menSessions: WorkoutSessionTemplate[] = [
  { id: "men-week-1-core", title: "Core foundation", dayLabel: "Monday", estimatedMinutes: 25, audience: "men", blocks: [{ id: "main", title: "main-workout", exerciseIds: ["men-full-abs", "men-upper-abs"] }] },
  { id: "men-week-2-strength", title: "Strength rhythm", dayLabel: "Wednesday", estimatedMinutes: 30, audience: "men", blocks: [{ id: "main", title: "main-workout", exerciseIds: ["men-obliques", "men-upper"] }] },
  { id: "men-week-3-conditioning", title: "Core conditioning", dayLabel: "Saturday", estimatedMinutes: 20, audience: "men", blocks: [{ id: "main", title: "main-workout", exerciseIds: ["men-obliques-2", "men-full-abs-2"] }] },
];

const womenSessions: WorkoutSessionTemplate[] = [
  { id: "women-week-1-core", title: "Core foundation", dayLabel: "Monday", estimatedMinutes: 25, audience: "women", blocks: [{ id: "main", title: "main-workout", exerciseIds: ["women-full-abs", "women-middle-abs"] }] },
  { id: "women-week-2-lower", title: "Lower-ab focus", dayLabel: "Wednesday", estimatedMinutes: 25, audience: "women", blocks: [{ id: "main", title: "main-workout", exerciseIds: ["women-lower-abs", "women-full-abs-2"] }] },
  { id: "women-week-3-obliques", title: "Oblique control", dayLabel: "Saturday", estimatedMinutes: 20, audience: "women", blocks: [{ id: "main", title: "main-workout", exerciseIds: ["women-obliques", "women-full-3"] }] },
];

export const audienceSchedules: Record<"men" | "women", AudienceSchedule> = {
  men: { audience: "men", weekLabel: "This week", sessions: menSessions },
  women: { audience: "women", weekLabel: "This week", sessions: womenSessions },
};
