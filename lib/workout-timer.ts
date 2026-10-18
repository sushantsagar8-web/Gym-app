export type TimerPhase = "ready" | "work" | "rest" | "paused" | "awaiting-confirmation" | "completed" | "skipped";

export type ConfirmationKind = "work" | "rest";

export type TimerExercise = {
  id: string;
  name: string;
  workSeconds: number;
  restSeconds: number;
  sets: number;
  mediaUri?: string;
  mediaAltText?: string;
  prescriptionLabel?: string;
};

export type TimerState = {
  phase: TimerPhase;
  exerciseIndex: number;
  setIndex: number;
  remainingSeconds: number;
  pausedFrom: "work" | "rest" | null;
  confirmationKind: ConfirmationKind | null;
  lastUpdatedAt: number;
};

export type TimerAction =
  | { type: "start"; now: number }
  | { type: "tick"; now: number }
  | { type: "pause"; now: number }
  | { type: "stop"; now: number }
  | { type: "resume"; now: number }
  | { type: "complete-work"; now: number }
  | { type: "confirm"; now: number }
  | { type: "skip"; now: number }
  | { type: "repeat"; now: number }
  | { type: "next"; now: number }
  | { type: "configure"; workSeconds: number; restSeconds: number; now: number };

const clampSeconds = (value: number) => Math.max(0, Math.ceil(value));

export function createTimerState(exercises: TimerExercise[], now = Date.now()): TimerState {
  const first = exercises[0];
  return { phase: first ? "ready" : "completed", exerciseIndex: 0, setIndex: 0, remainingSeconds: first?.workSeconds ?? 0, pausedFrom: null, confirmationKind: null, lastUpdatedAt: now };
}

export function currentExercise(state: TimerState, exercises: TimerExercise[]) {
  return exercises[state.exerciseIndex];
}

function advanceAfterRest(state: TimerState, exercises: TimerExercise[], now: number): TimerState {
  const exercise = currentExercise(state, exercises);
  if (!exercise) return { ...state, phase: "completed", remainingSeconds: 0, confirmationKind: null, lastUpdatedAt: now };
  if (state.setIndex + 1 < exercise.sets) return { ...state, phase: "ready", setIndex: state.setIndex + 1, remainingSeconds: exercise.workSeconds, pausedFrom: null, confirmationKind: null, lastUpdatedAt: now };
  const nextExercise = exercises[state.exerciseIndex + 1];
  if (!nextExercise) return { ...state, phase: "completed", remainingSeconds: 0, pausedFrom: null, confirmationKind: null, lastUpdatedAt: now };
  return { ...state, phase: "ready", exerciseIndex: state.exerciseIndex + 1, setIndex: 0, remainingSeconds: nextExercise.workSeconds, pausedFrom: null, confirmationKind: null, lastUpdatedAt: now };
}

function awaitConfirmation(state: TimerState, kind: ConfirmationKind, now: number): TimerState {
  return { ...state, phase: "awaiting-confirmation", remainingSeconds: 0, pausedFrom: null, confirmationKind: kind, lastUpdatedAt: now };
}

export function reduceTimer(state: TimerState, action: TimerAction, exercises: TimerExercise[]): TimerState {
  const exercise = currentExercise(state, exercises);
  if (action.type === "configure" && exercise) {
    const nextExercises = exercises.map((item) => ({ ...item, workSeconds: action.workSeconds, restSeconds: action.restSeconds }));
    const nextExercise = nextExercises[state.exerciseIndex];
    const configuredRemaining = state.phase === "work"
      ? nextExercise.workSeconds
      : state.phase === "rest"
        ? nextExercise.restSeconds
        : state.phase === "paused" && state.pausedFrom === "work"
          ? nextExercise.workSeconds
          : state.phase === "paused" && state.pausedFrom === "rest"
            ? nextExercise.restSeconds
            : state.remainingSeconds;
    return {
      ...state,
      remainingSeconds: configuredRemaining,
      lastUpdatedAt: action.now,
    };
  }
  if (state.phase === "completed" && action.type !== "repeat") return state;
  if (action.type === "start") return { ...state, phase: state.phase === "paused" ? state.pausedFrom ?? "work" : state.phase === "ready" ? "work" : state.phase, pausedFrom: null, lastUpdatedAt: action.now };
  if ((action.type === "pause" || action.type === "stop") && (state.phase === "work" || state.phase === "rest")) return { ...state, phase: "paused", pausedFrom: state.phase, lastUpdatedAt: action.now };
  if (action.type === "resume" && state.phase === "paused") return { ...state, phase: state.pausedFrom ?? "work", pausedFrom: null, lastUpdatedAt: action.now };
  if (action.type === "skip") return { ...state, phase: "skipped", remainingSeconds: 0, confirmationKind: null, lastUpdatedAt: action.now };
  if (action.type === "repeat" && exercise) return { ...state, phase: "ready", remainingSeconds: exercise.workSeconds, pausedFrom: null, confirmationKind: null, lastUpdatedAt: action.now };
  if (action.type === "next") return advanceAfterRest({ ...state, phase: "rest", remainingSeconds: 0, confirmationKind: null }, exercises, action.now);
  if (action.type === "confirm" && state.phase === "awaiting-confirmation") {
    if (state.confirmationKind === "work" && exercise?.restSeconds > 0) return { ...state, phase: "rest", remainingSeconds: exercise.restSeconds, confirmationKind: null, lastUpdatedAt: action.now };
    return advanceAfterRest(state, exercises, action.now);
  }
  if (action.type === "complete-work" && exercise) return awaitConfirmation(state, "work", action.now);
  if (action.type === "tick" && (state.phase === "work" || state.phase === "rest")) {
    const elapsed = Math.max(0, (action.now - state.lastUpdatedAt) / 1000);
    const remaining = clampSeconds(state.remainingSeconds - elapsed);
    if (remaining > 0) return { ...state, remainingSeconds: remaining, lastUpdatedAt: action.now };
    return state.phase === "work" ? reduceTimer({ ...state, remainingSeconds: 0, lastUpdatedAt: action.now }, { type: "complete-work", now: action.now }, exercises) : awaitConfirmation(state, "rest", action.now);
  }
  return state;
}

export function formatTimer(seconds: number) {
  const total = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
