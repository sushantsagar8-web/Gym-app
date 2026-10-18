import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { loadOnboardingPreferences } from "@/lib/onboarding-storage";
import { loadBroSplitSchedule, saveBroSplitSchedule } from "@/lib/bro-split-storage";
import { bicepsExercises } from "@/shared/biceps-content";
import { chestExercises } from "@/shared/chest-content";
import { gymBackExercises } from "@/shared/gym-back-content";
import { legsExercises } from "@/shared/legs-content";
import { menAbsExercises } from "@/shared/men-abs-content";
import { shouldersExercises } from "@/shared/shoulders-content";
import { tricepsExercises } from "@/shared/triceps-content";
import { womenAbsExercises } from "@/shared/women-abs-content";
import { audienceLabel, getCuratedAudience } from "@/lib/audience-curation";
import {
  BRO_SPLIT_GROUPS,
  BRO_SPLIT_WEEKDAYS,
  canCustomizeBroSplit,
  getBeginnerRecommendations,
  getDefaultExerciseConfig,
  getDefaultBroSplitSchedule,
  getExercisesForGroup,
  getBroSplitDayVolume,
  getScheduleDay,
  normalizeBroSplitSchedule,
  type BroSplitAudience,
  type BroSplitExperience,
  type BroSplitGroup,
  type BroSplitSchedule,
  type BroSplitWeekday,
} from "@/shared/bro-split";

const allExercises = [...chestExercises, ...tricepsExercises, ...gymBackExercises, ...bicepsExercises, ...shouldersExercises, ...legsExercises, ...menAbsExercises, ...womenAbsExercises];
const exerciseById = new Map(allExercises.map((exercise) => [exercise.id, exercise]));

function groupTitle(group: BroSplitGroup) {
  return BRO_SPLIT_GROUPS.find((item) => item.id === group)?.title ?? "Rest day";
}

export default function BroSplitScreen() {
  const colors = useColors();
  const [audience, setAudience] = useState<BroSplitAudience>("men");
  const [experience, setExperience] = useState<BroSplitExperience>("beginner");
  const [schedule, setSchedule] = useState<BroSplitSchedule>(() => getDefaultBroSplitSchedule("men", "beginner"));
  const [selectedDay, setSelectedDay] = useState<BroSplitWeekday>("Monday");
  const [loaded, setLoaded] = useState(false);
  const [customizeMode, setCustomizeMode] = useState(false);

  useEffect(() => {
    void loadOnboardingPreferences().then(async (preferences) => {
      const nextAudience = getCuratedAudience(preferences) === "women" ? "women" : "men";
      const nextExperience = preferences.fitnessLevel ?? "beginner";
      const saved = await loadBroSplitSchedule(nextAudience, nextExperience);
      setAudience(nextAudience);
      setExperience(nextExperience);
      setCustomizeMode(nextExperience !== "beginner");
      setSchedule(normalizeBroSplitSchedule(saved, nextAudience, nextExperience));
      setLoaded(true);
    });
  }, []);

  const day = getScheduleDay(schedule, selectedDay);
  const groupExercises = useMemo(() => getExercisesForGroup(allExercises, day.group), [day.group]);
  const dayVolume = useMemo(() => getBroSplitDayVolume(day, exerciseById), [day]);
  const isEditable = canCustomizeBroSplit(experience, customizeMode);

  const persist = (next: BroSplitSchedule) => {
    const updated = { ...next, updatedAt: new Date().toISOString() };
    setSchedule(updated);
    void saveBroSplitSchedule(updated);
  };

  const updateDay = (patch: Partial<typeof day>) => {
    persist({ ...schedule, days: schedule.days.map((item) => item.weekday === selectedDay ? { ...item, ...patch } : item) });
  };

  const selectGroup = (group: BroSplitGroup) => {
    if (!isEditable) return;
    updateDay({ group, exerciseIds: group === "rest" ? [] : getBeginnerRecommendations(group, audience), exerciseConfigs: {} });
  };

  const toggleExercise = (exerciseId: string) => {
    if (!isEditable || day.group === "rest") return;
    const nextIds = day.exerciseIds.includes(exerciseId) ? day.exerciseIds.filter((id) => id !== exerciseId) : [...day.exerciseIds, exerciseId];
    updateDay({ exerciseIds: nextIds });
  };

  const moveExercise = (index: number, direction: -1 | 1) => {
    if (!isEditable) return;
    const target = index + direction;
    if (target < 0 || target >= day.exerciseIds.length) return;
    const nextIds = [...day.exerciseIds];
    [nextIds[index], nextIds[target]] = [nextIds[target], nextIds[index]];
    updateDay({ exerciseIds: nextIds });
  };

  const updateExerciseConfig = (exerciseId: string, patch: Partial<NonNullable<typeof day.exerciseConfigs>[string]>) => {
    if (!isEditable) return;
    const exercise = exerciseById.get(exerciseId);
    if (!exercise) return;
    const current = day.exerciseConfigs?.[exerciseId] ?? getDefaultExerciseConfig(exercise);
    updateDay({ exerciseConfigs: { ...(day.exerciseConfigs ?? {}), [exerciseId]: { ...current, ...patch } } });
  };

  const resetSelectedDay = () => {
    if (!isEditable || day.group === "rest") return;
    Alert.alert(
      "Reset this day?",
      `This will remove your customized exercises and prescriptions for ${selectedDay}.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset to Default", style: "destructive", onPress: () => updateDay({ exerciseIds: getBeginnerRecommendations(day.group, audience), exerciseConfigs: {} }) },
      ],
    );
  };

  const startDay = () => {
    if (!day.exerciseIds.length || day.group === "rest") return;
    const exerciseConfigs = Object.fromEntries(day.exerciseIds.map((exerciseId) => { const exercise = exerciseById.get(exerciseId); return exercise ? [exerciseId, day.exerciseConfigs?.[exerciseId] ?? getDefaultExerciseConfig(exercise)] : null; }).filter((entry): entry is [string, NonNullable<typeof day.exerciseConfigs>[string]] => Boolean(entry)));
    router.push({ pathname: "/workout", params: { exerciseIds: day.exerciseIds.join(","), exerciseConfigs: JSON.stringify(exerciseConfigs), templateId: `bro-split-${selectedDay.toLowerCase()}`, title: `${selectedDay} · ${groupTitle(day.group)}` } });
  };

  if (!loaded) {
    return <ScreenContainer className="items-center justify-center px-5" edges={["top", "left", "right", "bottom"]}><Text className="text-base text-muted">Loading your Bro Split…</Text></ScreenContainer>;
  }

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="gap-5 pt-3">
          <Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}><Text className="text-sm font-semibold text-primary">‹ Back to program</Text></Pressable>
          <View className="gap-2"><Text className="text-xs font-bold uppercase tracking-wide text-primary">{audienceLabel(audience)} · Muscle building</Text><Text className="text-3xl font-semibold text-foreground">Your Bro Split week</Text><Text className="text-base leading-6 text-muted">Choose a day to see its body-part focus and launch the complete session without returning to the exercise list.</Text></View>
          <View className="rounded-3xl border border-border bg-primary-soft p-4"><Text className="font-semibold text-primary">{experience === "beginner" && !customizeMode ? "Beginner recommendations" : `${experience[0].toUpperCase()}${experience.slice(1)} customization`}</Text><Text className="mt-1 text-sm leading-5 text-foreground">{experience === "beginner" && !customizeMode ? "FitPath preselects common foundational movements. You can use these recommendations or customize every day yourself." : "Choose a day, assign its body-part group, then select or remove the exercises you want in the workout."}</Text>{experience === "beginner" && !customizeMode && <Pressable onPress={() => setCustomizeMode(true)} style={({ pressed }) => [{ alignItems: "center", borderRadius: 999, backgroundColor: colors.primary, marginTop: 12, paddingVertical: 11, opacity: pressed ? 0.8 : 1 }]}><Text className="font-semibold text-white">Customize exercises</Text></Pressable>}</View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {BRO_SPLIT_WEEKDAYS.map((weekday) => { const item = getScheduleDay(schedule, weekday); const selected = weekday === selectedDay; return <Pressable key={weekday} onPress={() => setSelectedDay(weekday)} style={({ pressed }) => [{ minWidth: 76, borderRadius: 16, paddingVertical: 11, paddingHorizontal: 10, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : colors.surface, opacity: pressed ? 0.75 : 1 }]}><Text className={selected ? "text-center text-xs font-bold text-white" : "text-center text-xs font-bold text-foreground"}>{weekday.slice(0, 3)}</Text><Text className={selected ? "mt-1 text-center text-[10px] text-white" : "mt-1 text-center text-[10px] text-muted"}>{item.group === "rest" ? "Rest" : groupTitle(item.group).split(" & ")[0]}</Text></Pressable>; })}
          </ScrollView>
          <View className="gap-3 rounded-3xl border-2 border-primary bg-surface p-4"><View className="gap-1"><Text className="text-xs font-bold uppercase tracking-wide text-primary">{selectedDay}</Text><Text className="text-2xl font-semibold text-foreground">{groupTitle(day.group)}</Text><Text className="text-sm text-muted">{day.group === "rest" ? "Recover today or take an easy walk." : `${day.exerciseIds.length} exercises selected`}</Text></View>
            {day.group !== "rest" && <View className="flex-row gap-2"><View className="flex-1 rounded-2xl border border-border bg-background p-3"><Text className="text-xs font-semibold uppercase tracking-wide text-muted">Volume</Text><Text className="mt-1 text-xl font-semibold text-foreground">{dayVolume.totalSets} sets</Text><Text className="mt-1 text-xs text-muted">Across selected exercises</Text></View><View className="flex-1 rounded-2xl border border-border bg-background p-3"><Text className="text-xs font-semibold uppercase tracking-wide text-muted">Estimated time</Text><Text className="mt-1 text-xl font-semibold text-foreground">{formatEstimatedDuration(dayVolume.estimatedDurationSeconds)}</Text><Text className="mt-1 text-xs text-muted">Work plus between-set rest</Text></View></View>}
            <View className="gap-2">{BRO_SPLIT_GROUPS.map((group) => <Pressable key={group.id} onPress={() => selectGroup(group.id)} disabled={!isEditable} style={({ pressed }) => [{ borderWidth: 1, borderColor: day.group === group.id ? colors.primary : colors.border, backgroundColor: day.group === group.id ? colors.primary : colors.surface, borderRadius: 14, padding: 12, opacity: !isEditable ? 0.65 : pressed ? 0.75 : 1 }]}><Text className={day.group === group.id ? "font-semibold text-white" : "font-semibold text-foreground"}>{group.title}</Text><Text className={day.group === group.id ? "mt-1 text-xs text-white" : "mt-1 text-xs text-muted"}>{group.subtitle}</Text></Pressable>)}</View>
          </View>
          {day.group !== "rest" && <View className="gap-4 rounded-3xl border border-border bg-surface p-4"><View><View className="flex-row items-center justify-between gap-3"><Text className="flex-1 text-lg font-semibold text-foreground">Exercises for {selectedDay}</Text>{isEditable && <Pressable onPress={resetSelectedDay}><Text className="text-xs font-semibold text-primary">Reset to Default</Text></Pressable>}</View><Text className="mt-1 text-sm leading-5 text-muted">{isEditable ? "Use the move controls to reorder, edit each prescription, or tap an exercise below to add or remove it." : "These foundational exercises are recommended for beginners."}</Text></View><View className="gap-3">{day.exerciseIds.map((exerciseId, index) => { const exercise = exerciseById.get(exerciseId); if (!exercise) return null; const config = day.exerciseConfigs?.[exercise.id] ?? getDefaultExerciseConfig(exercise); return <View key={exercise.id} className="gap-3 rounded-2xl border border-primary bg-background p-3"><View className="flex-row items-start gap-3"><View className="h-8 w-8 items-center justify-center rounded-full bg-primary"><Text className="font-bold text-white">{index + 1}</Text></View><View className="flex-1"><Text className="font-semibold text-foreground">{exercise.name}</Text><Text className="mt-1 text-xs text-muted">Selected for this day</Text></View>{isEditable && <Pressable onPress={() => toggleExercise(exercise.id)}><Text className="text-xs font-semibold" style={{ color: colors.error }}>Remove</Text></Pressable>}</View><View className="flex-row gap-2"><NumberInput label="Sets" value={config.sets} disabled={!isEditable} onChange={(value) => updateExerciseConfig(exercise.id, { sets: value })} colors={colors}/>{exercise.prescription.mode === "reps" ? <NumberInput label="Reps" value={config.reps ?? 10} disabled={!isEditable} onChange={(value) => updateExerciseConfig(exercise.id, { reps: value })} colors={colors}/> : <NumberInput label="Seconds" value={config.durationSeconds ?? 30} disabled={!isEditable} onChange={(value) => updateExerciseConfig(exercise.id, { durationSeconds: value })} colors={colors}/>}<NumberInput label="Rest" value={config.restSeconds} disabled={!isEditable} onChange={(value) => updateExerciseConfig(exercise.id, { restSeconds: value })} colors={colors}/></View><View className="flex-row gap-2"><SmallButton label="↑ Move up" disabled={!isEditable || index === 0} onPress={() => moveExercise(index, -1)} colors={colors}/><SmallButton label="↓ Move down" disabled={!isEditable || index === day.exerciseIds.length - 1} onPress={() => moveExercise(index, 1)} colors={colors}/></View></View>; })}</View><View className="gap-2"><Text className="text-sm font-semibold text-foreground">Add or remove exercises</Text>{groupExercises.map((exercise) => { const selected = day.exerciseIds.includes(exercise.id); return <Pressable key={exercise.id} onPress={() => toggleExercise(exercise.id)} disabled={!isEditable} style={({ pressed }) => [{ flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, borderRadius: 14, padding: 12, backgroundColor: selected ? colors.surface : colors.background, opacity: !isEditable ? 0.75 : pressed ? 0.75 : 1 }]}><View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : "transparent", alignItems: "center", justifyContent: "center" }}>{selected && <Text className="text-xs font-bold text-white">✓</Text>}</View><View className="flex-1"><Text className="font-semibold text-foreground">{exercise.name}</Text><Text className="mt-1 text-xs text-muted">{selected ? "Selected" : "Tap to add"}</Text></View></Pressable>; })}</View></View>}
          <Pressable onPress={startDay} disabled={!day.exerciseIds.length || day.group === "rest"} style={({ pressed }) => [{ alignItems: "center", borderRadius: 999, backgroundColor: colors.primary, paddingVertical: 16, opacity: !day.exerciseIds.length || day.group === "rest" ? 0.45 : pressed ? 0.8 : 1 }]}><Text className="text-base font-semibold text-white">{day.group === "rest" ? "Rest day" : `Start ${selectedDay} workout`}</Text></Pressable>
          <View className="rounded-3xl border border-border bg-primary-soft p-4"><Text className="font-semibold text-primary">How the day workout works</Text><Text className="mt-1 text-sm leading-6 text-foreground">Start once and complete every set. When you finish an exercise, choose the next exercise button in the existing timer interface; the next selected exercise opens automatically with its video, timer, rest, and completion tracking.</Text></View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}


function NumberInput({ label, value, disabled, onChange }: { label: string; value: number; disabled: boolean; onChange: (value: number) => void; colors: ReturnType<typeof useColors> }) {
  return <View className="flex-1 gap-1"><Text className="text-xs font-semibold text-muted">{label}</Text><TextInput editable={!disabled} value={String(value)} onChangeText={(text) => onChange(Math.max(1, Number.parseInt(text.replace(/[^0-9]/g, ""), 10) || 1))} keyboardType="number-pad" className="rounded-xl border border-border bg-background px-2 py-2 text-center text-foreground" /></View>;
}

function SmallButton({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void; colors: ReturnType<typeof useColors> }) {
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [{ flex: 1, alignItems: "center", borderRadius: 999, borderWidth: 1, borderColor: "#CBD5E1", paddingVertical: 9, opacity: disabled ? 0.35 : pressed ? 0.7 : 1 }]}><Text className="text-xs font-semibold text-foreground">{label}</Text></Pressable>;
}

function formatEstimatedDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (!minutes) return `${remainingSeconds}s`;
  return remainingSeconds ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}
