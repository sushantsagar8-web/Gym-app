import { useEffect, useReducer, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View, Platform, useWindowDimensions } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Haptics from "expo-haptics";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { ScreenContainer } from "@/components/screen-container";
import { CloudinaryVideoPlayer } from "@/components/cloudinary-video-player";
import { useColors } from "@/hooks/use-colors";
import { appendCompletionEvents, makeCompletionEvent, type ExerciseCompletionEvent } from "@/lib/completion-events";
import { loadAppSettings, loadWorkoutLogs, saveWorkoutLogs } from "@/lib/local-data";
import { createTimerState, currentExercise, formatTimer, reduceTimer, type TimerExercise } from "@/lib/workout-timer";
import { menAbsExercises } from "@/shared/men-abs-content";
import { womenAbsExercises } from "@/shared/women-abs-content";
import { gymBackExercises } from "@/shared/gym-back-content";
import { bicepsExercises } from "@/shared/biceps-content";
import { tricepsExercises } from "@/shared/triceps-content";
import { chestExercises } from "@/shared/chest-content";
import { shouldersExercises } from "@/shared/shoulders-content";
import { legsExercises } from "@/shared/legs-content";
import { loadOnboardingPreferences } from "@/lib/onboarding-storage";
import { getCuratedAudience } from "@/lib/audience-curation";
import { recordEngagementEvent } from "@/lib/engagement-analytics";
import { defaultAppSettings, type RestAlertMode } from "@/shared/fitpath-models";
import { loadCustomWorkout, type CustomWorkout } from "@/lib/custom-workouts";
import type { BroSplitExerciseConfig } from "@/shared/bro-split";

const allExercises = [...menAbsExercises, ...womenAbsExercises, ...gymBackExercises, ...bicepsExercises, ...tricepsExercises, ...chestExercises, ...shouldersExercises, ...legsExercises];
const defaultTimerExercises: TimerExercise[] = [
  { id: "men-abs-reverse-crunch", name: "Reverse crunch", workSeconds: 30, restSeconds: 20, sets: 3, prescriptionLabel: "30 seconds · 3 sets", mediaUri: menAbsExercises[0].media[0]?.uri, mediaAltText: menAbsExercises[0].media[0]?.altText },
  { id: "men-abs-bicycle-crunch", name: "Bicycle crunch", workSeconds: 30, restSeconds: 20, sets: 2, prescriptionLabel: "30 seconds · 2 sets", mediaUri: menAbsExercises[3].media[0]?.uri, mediaAltText: menAbsExercises[3].media[0]?.altText },
];
const toTimerExercise = (item: (typeof allExercises)[number], override?: BroSplitExerciseConfig): TimerExercise => ({ id: item.id, name: item.name, workSeconds: override?.durationSeconds ?? (item.prescription.mode === "duration" ? item.prescription.defaultDurationSeconds ?? 30 : 30), restSeconds: override?.restSeconds ?? item.prescription.defaultRestSeconds, sets: override?.sets ?? item.prescription.defaultSets, prescriptionLabel: item.prescription.mode === "reps" ? `${override?.reps ?? item.prescription.defaultReps ?? 0} reps · ${override?.sets ?? item.prescription.defaultSets} sets` : `${override?.durationSeconds ?? item.prescription.defaultDurationSeconds ?? 30} seconds · ${override?.sets ?? item.prescription.defaultSets} sets`, mediaUri: item.media[0]?.uri, mediaAltText: item.media[0]?.altText });

export default function WorkoutScreen() {
  useEffect(() => {
    if (Platform.OS === "web") return;
    void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => undefined);
    return () => {
      void ScreenOrientation.unlockAsync().catch(() => undefined);
    };
  }, []);

  useEffect(() => { if (Platform.OS !== "web") { void activateKeepAwakeAsync("fitpath-workout"); return () => { void deactivateKeepAwake("fitpath-workout"); }; } }, []);
  const colors = useColors();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { id, customId, exerciseIds: exerciseIdsParam, exerciseConfigs: exerciseConfigsParam, templateId: templateIdParam } = useLocalSearchParams<{ id?: string; customId?: string; exerciseIds?: string | string[]; exerciseConfigs?: string | string[]; templateId?: string | string[] }>();
  const orderedExerciseIds = (Array.isArray(exerciseIdsParam) ? exerciseIdsParam[0] : exerciseIdsParam)?.split(",").filter(Boolean) ?? [];
  const rawExerciseConfigs = Array.isArray(exerciseConfigsParam) ? exerciseConfigsParam[0] : exerciseConfigsParam;
  const exerciseConfigs: Record<string, BroSplitExerciseConfig> = (() => { if (!rawExerciseConfigs) return {}; try { const parsed = JSON.parse(rawExerciseConfigs) as Record<string, BroSplitExerciseConfig>; return parsed && typeof parsed === "object" ? parsed : {}; } catch { return {}; } })();
  const hasPerExerciseConfigs = orderedExerciseIds.length > 0 && Object.keys(exerciseConfigs).length > 0;
  const selectedExercise = allExercises.find((item) => item.id === id);
  const selectedDayExercises = orderedExerciseIds.map((exerciseId) => allExercises.find((item) => item.id === exerciseId)).filter((item): item is (typeof allExercises)[number] => Boolean(item));
  const [customWorkout, setCustomWorkout] = useState<CustomWorkout | null>(null);
  const [timingSettings, setTimingSettings] = useState({ workDurationSeconds: defaultAppSettings.workDurationSeconds, breakIntervalSeconds: defaultAppSettings.breakIntervalSeconds });
  const [restAlertMode, setRestAlertMode] = useState<RestAlertMode>(defaultAppSettings.restAlertMode);
  const [restCompleteFlash, setRestCompleteFlash] = useState(false);
  const restCuePlayer = useAudioPlayer(require("../assets/audio/fitpath-timer-cue.wav"));
  const baseExercises: TimerExercise[] = customWorkout
    ? customWorkout.steps.map((step) => {
        const item = allExercises.find((exercise) => exercise.id === step.exerciseId);
        if (!item) return null;
        const isDuration = item.prescription.mode === "duration";
        const timerExercise: TimerExercise = { id: item.id, name: item.name, workSeconds: step.durationSeconds ?? item.prescription.defaultDurationSeconds ?? 30, restSeconds: step.restSeconds, sets: step.sets, prescriptionLabel: isDuration ? `${step.durationSeconds ?? 30} seconds · ${step.sets} sets` : `${step.reps ?? item.prescription.defaultReps ?? 10} reps · ${step.sets} sets`, mediaUri: item.media[0]?.uri, mediaAltText: item.media[0]?.altText };
        return timerExercise;
      }).filter((item): item is TimerExercise => Boolean(item))
    : selectedDayExercises.length > 0 ? selectedDayExercises.map((item) => toTimerExercise(item, exerciseConfigs[item.id])) : selectedExercise ? [toTimerExercise(selectedExercise)] : defaultTimerExercises;
  const exercises: TimerExercise[] = hasPerExerciseConfigs ? baseExercises : baseExercises.map((item) => ({ ...item, workSeconds: timingSettings.workDurationSeconds, restSeconds: timingSettings.breakIntervalSeconds, prescriptionLabel: item.prescriptionLabel?.includes("reps") ? item.prescriptionLabel : `${timingSettings.workDurationSeconds} seconds · ${item.sets} sets` }));
  const sessionId = useRef(`session-${Date.now()}`).current;
  const startedAt = useRef(Date.now()).current;
  const events = useRef<ExerciseCompletionEvent[]>([]);
  const audienceRef = useRef<"men" | "women" | "all">("all");
  const previousState = useRef(createTimerState(exercises));

  useEffect(() => {
    if (!customId) return;
    void loadCustomWorkout(customId).then((workout) => setCustomWorkout(workout ?? null));
  }, [customId]);

  useEffect(() => {
    void loadAppSettings().then((settings) => {
      setTimingSettings({ workDurationSeconds: settings.workDurationSeconds, breakIntervalSeconds: settings.breakIntervalSeconds });
      setRestAlertMode(settings.restAlertMode ?? (settings.soundEnabled ? "sound" : settings.vibrationEnabled ? "vibration" : "visual"));
    });
  }, []);

  useEffect(() => {
    void loadOnboardingPreferences().then((preferences) => {
      audienceRef.current = getCuratedAudience(preferences);
      void recordEngagementEvent({ type: "curated-workout-started", audience: audienceRef.current, sessionId });
    });
  }, [sessionId]);
  const [state, dispatch] = useReducer((current: ReturnType<typeof createTimerState>, action: Parameters<typeof reduceTimer>[1]) => reduceTimer(current, action, exercises), createTimerState(exercises));
  const exercise = currentExercise(state, exercises);

  useEffect(() => {
    if (hasPerExerciseConfigs) return;
    dispatch({ type: "configure", workSeconds: timingSettings.workDurationSeconds, restSeconds: timingSettings.breakIntervalSeconds, now: Date.now() });
  }, [timingSettings.workDurationSeconds, timingSettings.breakIntervalSeconds, hasPerExerciseConfigs]);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  useEffect(() => {
    const previous = previousState.current;
    const confirmedWork = previous.phase === "awaiting-confirmation" && previous.confirmationKind === "work" && state.phase !== "awaiting-confirmation";
    const skippedWork = previous.phase === "work" && state.phase === "skipped";
    if (confirmedWork || skippedWork) {
      const completedExercise = exercises[previous.exerciseIndex];
      if (completedExercise) {
        const completionType = skippedWork ? "skipped" : "completed";
        events.current.push(makeCompletionEvent({ sessionId, exerciseId: completedExercise.id, exerciseName: completedExercise.name, setNumber: previous.setIndex + 1, durationSeconds: completedExercise.workSeconds, completionType }));
        void recordEngagementEvent({ type: completionType === "skipped" ? "curated-exercise-skipped" : "curated-exercise-completed", audience: audienceRef.current, sessionId, exerciseId: completedExercise.id, metadata: { setNumber: previous.setIndex + 1, durationSeconds: completedExercise.workSeconds } });
      }
    }
    if (previous.phase === "rest" && state.phase !== "rest") {
      setRestCompleteFlash(true);
      const timer = setTimeout(() => setRestCompleteFlash(false), 1800);
      if (restAlertMode === "sound") { restCuePlayer.seekTo(0); restCuePlayer.play(); }
      if (restAlertMode === "vibration" && Platform.OS !== "web") { void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }
      return () => clearTimeout(timer);
    }
    previousState.current = state;
    if (state.phase === "completed" && previous.phase !== "completed") {
      const endedAt = Date.now();
      void appendCompletionEvents(events.current);
      void recordEngagementEvent({ type: "curated-workout-finished", audience: audienceRef.current, sessionId, metadata: { completedExercises: events.current.filter((event) => event.completionType === "completed").length, totalExercises: exercises.length } });
      void loadWorkoutLogs().then((logs) => saveWorkoutLogs([...logs, { id: sessionId, templateId: customWorkout ? customWorkout.id : (Array.isArray(templateIdParam) ? templateIdParam[0] : templateIdParam) ?? "session-foundation-day-1", startedAt: new Date(startedAt).toISOString(), completedAt: new Date(endedAt).toISOString(), exerciseSets: Object.fromEntries(exercises.map((item) => [item.id, events.current.filter((event) => event.exerciseId === item.id).map((event) => ({ setNumber: event.setNumber, completed: event.completionType === "completed", durationSeconds: event.durationSeconds }))])), completionPercent: Math.round((events.current.filter((event) => event.completionType === "completed").length / exercises.reduce((total, item) => total + item.sets, 0)) * 100) }]));
    }
  }, [state, sessionId, startedAt, restAlertMode, restCuePlayer]);

  useEffect(() => {
    if (state.phase !== "work" && state.phase !== "rest") return;
    const tick = () => dispatch({ type: "tick", now: Date.now() });
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [state.phase]);
  const isPaused = state.phase === "paused";
  const isComplete = state.phase === "completed";
  const isRest = state.phase === "rest";
  const isAwaiting = state.phase === "awaiting-confirmation";
  const label = isComplete ? "Workout complete" : isRest ? "Rest" : isAwaiting ? "Ready to continue" : isPaused ? "Paused" : "Work interval";
  const videoShouldPlay = !isComplete;
  const openSummary = () => router.replace({ pathname: "/workout-summary", params: { sessionId, startedAt: String(startedAt), endedAt: String(Date.now()), totalExercises: String(exercises.length), totalSets: String(exercises.reduce((total, item) => total + item.sets, 0)) } });

  if (isLandscape) {
    return (
      <ScreenContainer className="px-4" edges={["top", "left", "right", "bottom"]}>
        <View style={{ flex: 1, flexDirection: "row", gap: 16, paddingVertical: 12 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View className="mb-3 flex-row items-center justify-between">
              <Pressable onPress={() => router.back()}><Text className="text-sm font-semibold text-primary">‹ Exit</Text></Pressable>
              <Text className="text-sm font-medium text-muted">{exercise ? `SET ${state.setIndex + 1} OF ${exercise.sets}` : "DONE"}</Text>
              <Pressable onPress={() => dispatch({ type: isPaused ? "resume" : "pause", now: Date.now() })} disabled={isComplete}><Text className="text-sm font-semibold text-primary">{isPaused ? "Resume" : "Pause"}</Text></Pressable>
            </View>
            {exercise?.mediaUri && !isComplete ? <CloudinaryVideoPlayer uri={exercise.mediaUri} altText={exercise.mediaAltText ?? `${exercise.name} reference`} immersive autoPlay loop shouldPlay={videoShouldPlay} /> : <View className="flex-1 items-center justify-center rounded-[28px] bg-primary-soft"><Text className="text-sm font-semibold text-primary">Workout complete</Text></View>}
          </View>
          <ScrollView style={{ width: Math.min(320, Math.max(250, width * 0.34)) }} contentContainerStyle={{ gap: 14, paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
            <View className="items-center rounded-3xl bg-white px-4 py-4">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted">Sets</Text>
              <Text className="mt-1 text-2xl font-bold text-slate-900">{exercise?.sets ?? "—"}</Text>
              <Text className="mt-2 text-sm font-semibold text-slate-700">Current set {exercise ? state.setIndex + 1 : "—"} of {exercise?.sets ?? "—"}</Text>
              <Text className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted">Time</Text>
              <Text className="mt-1 text-base font-semibold text-slate-900">{exercise ? `${isRest ? exercise.restSeconds : exercise.workSeconds} seconds` : "—"}</Text>
            </View>
            <View className="items-center gap-2">{restCompleteFlash && <View className="rounded-full bg-primary-soft px-4 py-2"><Text className="text-sm font-semibold text-primary">Rest complete · next set ready</Text></View>}<Text className="text-sm font-medium text-muted">{label.toUpperCase()}</Text><Text className="text-5xl font-semibold text-foreground">{formatTimer(state.remainingSeconds)}</Text></View>
            {isComplete ? <Pressable onPress={openSummary} style={{ backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 16, alignItems: "center" }}><Text className="text-base font-semibold text-white">View progress summary</Text></Pressable> : <><Pressable onPress={() => dispatch({ type: isAwaiting ? "confirm" : isPaused ? "resume" : "start", now: Date.now() })} disabled={isRest} style={{ backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 14, alignItems: "center", opacity: isRest ? 0.5 : 1 }}><Text className="text-base font-semibold text-white">{isAwaiting ? state.confirmationKind === "work" ? "Done · Start rest" : "Next set / exercise" : isPaused ? "Resume timer" : isRest ? "Rest timer running" : "Start timer"}</Text></Pressable>{!isAwaiting && <Pressable onPress={() => dispatch({ type: "stop", now: Date.now() })} style={{ borderColor: colors.error, borderWidth: 1, borderRadius: 999, paddingVertical: 12, alignItems: "center" }}><Text className="text-sm font-semibold" style={{ color: colors.error }}>Stop timer</Text></Pressable>}<View className="flex-row gap-3"><Pressable onPress={() => dispatch({ type: "skip", now: Date.now() })} style={{ flex: 1, borderColor: colors.border, borderWidth: 1, borderRadius: 999, paddingVertical: 12, alignItems: "center" }}><Text className="text-sm font-semibold text-foreground">Skip</Text></Pressable><Pressable onPress={() => dispatch({ type: "repeat", now: Date.now() })} style={{ flex: 1, borderColor: colors.border, borderWidth: 1, borderRadius: 999, paddingVertical: 12, alignItems: "center" }}><Text className="text-sm font-semibold text-foreground">Repeat</Text></Pressable></View></>}
          </ScrollView>
        </View>
      </ScreenContainer>
    );
  }

  return <ScreenContainer className="px-4" edges={["top", "left", "right", "bottom"]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}><View className="gap-5 pt-2"><View className="flex-row items-center justify-between"><Pressable onPress={() => router.back()}><Text className="text-sm font-semibold text-primary">‹ Exit</Text></Pressable><Text className="text-sm font-medium text-muted">{exercise ? `SET ${state.setIndex + 1} OF ${exercise.sets}` : "DONE"}</Text><Pressable onPress={() => dispatch({ type: isPaused ? "resume" : "pause", now: Date.now() })} disabled={isComplete}><Text className="text-sm font-semibold text-primary">{isPaused ? "Resume" : "Pause"}</Text></Pressable></View>{exercise?.mediaUri && !isComplete ? <CloudinaryVideoPlayer uri={exercise.mediaUri} altText={exercise.mediaAltText ?? `${exercise.name} reference`} immersive autoPlay loop shouldPlay={videoShouldPlay} /> : <View className="h-56 items-center justify-center rounded-[28px] bg-primary-soft"><Text className="text-sm font-semibold text-primary">Workout complete</Text><Text className="mt-2 text-sm text-muted">Your exercise events are ready to review.</Text></View>}<View className="items-center rounded-3xl bg-white px-4 py-4"><Text className="text-xs font-semibold uppercase tracking-widest text-muted">Sets</Text><Text className="mt-1 text-2xl font-bold text-slate-900">{exercise?.sets ?? "—"}</Text><Text className="mt-2 text-sm font-semibold text-slate-700">Current set {exercise ? state.setIndex + 1 : "—"} of {exercise?.sets ?? "—"}</Text><Text className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted">Time</Text><Text className="mt-1 text-base font-semibold text-slate-900">{exercise ? `${isRest ? exercise.restSeconds : exercise.workSeconds} seconds` : "—"}</Text></View><View className="items-center gap-2">{restCompleteFlash && <View className="rounded-full bg-primary-soft px-4 py-2"><Text className="text-sm font-semibold text-primary">Rest complete · next set ready</Text></View>}<Text className="text-sm font-medium text-muted">{label.toUpperCase()}</Text><Text className="text-6xl font-semibold text-foreground">{formatTimer(state.remainingSeconds)}</Text></View><View className="gap-3">{isComplete ? <Pressable onPress={openSummary} style={{ backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 16, alignItems: "center" }}><Text className="text-base font-semibold text-white">View progress summary</Text></Pressable> : <><Pressable onPress={() => dispatch({ type: isAwaiting ? "confirm" : isPaused ? "resume" : "start", now: Date.now() })} disabled={isRest} style={{ backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 16, alignItems: "center", opacity: isRest ? 0.5 : 1 }}><Text className="text-base font-semibold text-white">{isAwaiting ? state.confirmationKind === "work" ? "Done · Start rest" : "Next set / exercise" : isPaused ? "Resume timer" : isRest ? "Rest timer running" : "Start timer"}</Text></Pressable>{!isAwaiting && <Pressable onPress={() => dispatch({ type: "stop", now: Date.now() })} disabled={isComplete} style={{ borderColor: colors.error, borderWidth: 1, borderRadius: 999, paddingVertical: 14, alignItems: "center", opacity: isComplete ? 0.45 : 1 }}><Text className="text-sm font-semibold" style={{ color: colors.error }}>Stop timer</Text></Pressable>}<View className="flex-row gap-3"><Pressable onPress={() => dispatch({ type: "skip", now: Date.now() })} style={{ flex: 1, borderColor: colors.border, borderWidth: 1, borderRadius: 999, paddingVertical: 14, alignItems: "center" }}><Text className="text-sm font-semibold text-foreground">Skip</Text></Pressable><Pressable onPress={() => dispatch({ type: "repeat", now: Date.now() })} style={{ flex: 1, borderColor: colors.border, borderWidth: 1, borderRadius: 999, paddingVertical: 14, alignItems: "center" }}><Text className="text-sm font-semibold text-foreground">Repeat</Text></Pressable></View></>}</View></View></ScrollView></ScreenContainer>;
}
