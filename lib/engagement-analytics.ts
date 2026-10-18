import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AudienceSchedule, EngagementEvent } from "@/shared/fitpath-models";

const STORAGE_KEY = "fitpath.engagement.events.v1";

export async function loadEngagementEvents(): Promise<EngagementEvent[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as EngagementEvent[]; } catch { return []; }
}

export async function recordEngagementEvent(event: Omit<EngagementEvent, "id" | "occurredAt">): Promise<EngagementEvent> {
  const next: EngagementEvent = { ...event, id: `engagement-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, occurredAt: new Date().toISOString() };
  const events = [...(await loadEngagementEvents()), next];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  return next;
}

export function summarizeEngagement(events: EngagementEvent[], audience: EngagementEvent["audience"]) {
  const scoped = events.filter((event) => audience === "all" ? event.audience === "all" || event.audience === "men" || event.audience === "women" : event.audience === audience);
  const count = (type: EngagementEvent["type"]) => scoped.filter((event) => event.type === type).length;
  const onboardingStarted = count("onboarding-started");
  const onboardingCompleted = count("onboarding-completed");
  const workoutStarted = count("curated-workout-started");
  const workoutFinished = count("curated-workout-finished");
  return { onboardingStarted, onboardingCompleted, onboardingCompletionRate: onboardingStarted ? Math.round((onboardingCompleted / onboardingStarted) * 100) : 0, workoutStarted, workoutFinished, workoutFinishRate: workoutStarted ? Math.round((workoutFinished / workoutStarted) * 100) : 0, exerciseCompletions: count("curated-exercise-completed"), exerciseSkips: count("curated-exercise-skipped") };
}

export function makeAudienceSchedule(audience: "men" | "women", sessions: AudienceSchedule["sessions"]): AudienceSchedule {
  return { audience, weekLabel: "This week", sessions: sessions.filter((session) => !session.audience || session.audience === "all" || session.audience === audience) };
}
