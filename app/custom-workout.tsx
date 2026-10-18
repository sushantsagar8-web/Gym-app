import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { menAbsExercises } from "@/shared/men-abs-content";
import { womenAbsExercises } from "@/shared/women-abs-content";
import { gymBackExercises } from "@/shared/gym-back-content";
import { bicepsExercises } from "@/shared/biceps-content";
import { tricepsExercises } from "@/shared/triceps-content";
import { chestExercises } from "@/shared/chest-content";
import { shouldersExercises } from "@/shared/shoulders-content";
import { legsExercises } from "@/shared/legs-content";
import { deleteCustomWorkout, loadCustomWorkouts, makeCustomWorkoutStep, saveCustomWorkout, type CustomWorkout, type CustomWorkoutStep } from "@/lib/custom-workouts";
import type { ExerciseContent } from "@/shared/exercise-content";

const exercises = [...menAbsExercises, ...womenAbsExercises, ...gymBackExercises, ...bicepsExercises, ...tricepsExercises, ...chestExercises, ...shouldersExercises, ...legsExercises];

export default function CustomWorkoutScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ edit?: string }>();
  const [saved, setSaved] = useState<CustomWorkout[]>([]);
  const [name, setName] = useState("My custom workout");
  const [steps, setSteps] = useState<CustomWorkoutStep[]>([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | undefined>(params.edit);
  const [notice, setNotice] = useState("");
  const byId = useMemo(() => new Map(exercises.map((exercise) => [exercise.id, exercise])), []);
  const available = exercises.filter((exercise) => !steps.some((step) => step.exerciseId === exercise.id) && `${exercise.name} ${exercise.primaryMuscles.join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  const refresh = () => { void loadCustomWorkouts().then(setSaved); };
  useEffect(() => {
    void loadCustomWorkouts().then((items) => {
      setSaved(items);
      const existing = params.edit ? items.find((item) => item.id === params.edit) : undefined;
      if (existing) { setEditingId(existing.id); setName(existing.name); setSteps(existing.steps); }
    });
  }, [params.edit]);

  const addExercise = (exercise: ExerciseContent) => setSteps((current) => [...current, makeCustomWorkoutStep(exercise)]);
  const removeExercise = (id: string) => setSteps((current) => current.filter((step) => step.exerciseId !== id));
  const moveStep = (index: number, direction: -1 | 1) => setSteps((current) => { const next = [...current]; const target = index + direction; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const updateStep = (index: number, patch: Partial<CustomWorkoutStep>) => setSteps((current) => current.map((step, stepIndex) => stepIndex === index ? { ...step, ...patch } : step));
  const save = async () => {
    if (!name.trim() || steps.length === 0) { setNotice("Add a name and at least one Exercise Library exercise."); return; }
    const workout = await saveCustomWorkout({ id: editingId ?? `custom-${Date.now()}`, name: name.trim(), createdAt: saved.find((item) => item.id === editingId)?.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString(), steps });
    setEditingId(workout.id); setNotice("Custom workout saved."); refresh();
  };

  return <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}><ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}><View className="gap-5 pt-3">
    <View className="flex-row items-start justify-between"><View className="flex-1 gap-1"><Text className="text-3xl font-semibold text-foreground">Custom workout</Text><Text className="text-sm leading-5 text-muted">Build a session using only exercises already available in the Exercise Library.</Text></View><Pressable onPress={() => router.back()}><Text className="text-sm font-semibold text-primary">Close</Text></Pressable></View>
    {saved.length > 0 && <View className="gap-2"><Text className="text-xs font-bold uppercase tracking-wide text-muted">Saved workouts</Text>{saved.map((workout) => <View key={workout.id} className="flex-row items-center gap-2 rounded-2xl border border-border bg-surface p-3"><View className="flex-1"><Text className="font-semibold text-foreground">{workout.name}</Text><Text className="text-xs text-muted">{workout.steps.length} exercises</Text></View><Pressable onPress={() => { setEditingId(workout.id); setName(workout.name); setSteps(workout.steps); }}><Text className="text-xs font-semibold text-primary">Edit</Text></Pressable><Pressable onPress={() => { void deleteCustomWorkout(workout.id).then(refresh); }}><Text className="text-xs font-semibold" style={{ color: colors.error }}>Delete</Text></Pressable></View>)}</View>}
    <View className="gap-3 rounded-3xl border-2 border-primary bg-primary-soft p-4"><Text className="text-sm font-bold uppercase tracking-wide text-foreground">Workout details</Text><TextInput value={name} onChangeText={setName} placeholder="Workout name" placeholderTextColor={colors.muted} className="rounded-2xl border border-border bg-background px-4 py-3 text-foreground"/><Text className="text-xs text-muted">Select exercises below, then arrange their order and prescriptions.</Text></View>
    <View className="gap-3"><Text className="text-lg font-semibold text-foreground">Selected exercises ({steps.length})</Text>{steps.length === 0 && <Text className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted">No exercises selected yet.</Text>}{steps.map((step, index) => { const exercise = byId.get(step.exerciseId); if (!exercise) return null; return <View key={step.exerciseId} className="gap-3 rounded-3xl border border-border bg-surface p-4"><View className="flex-row items-start gap-3"><View className="h-8 w-8 items-center justify-center rounded-full bg-primary"><Text className="font-bold text-white">{index + 1}</Text></View><View className="flex-1"><Text className="font-semibold text-foreground">{exercise.name}</Text><Text className="text-xs text-muted">{exercise.primaryMuscles.join(" · ")}</Text></View><Pressable onPress={() => removeExercise(step.exerciseId)}><Text className="text-xs font-semibold" style={{ color: colors.error }}>Remove</Text></Pressable></View><View className="flex-row gap-2"><NumberInput label="Sets" value={step.sets} onChange={(value) => updateStep(index, { sets: value })} colors={colors}/>{exercise.prescription.mode === "reps" ? <NumberInput label="Reps" value={step.reps ?? 10} onChange={(value) => updateStep(index, { reps: value })} colors={colors}/> : <NumberInput label="Seconds" value={step.durationSeconds ?? 30} onChange={(value) => updateStep(index, { durationSeconds: value })} colors={colors}/>}<NumberInput label="Rest" value={step.restSeconds} onChange={(value) => updateStep(index, { restSeconds: value })} colors={colors}/></View><View className="flex-row gap-2"><SmallButton label="↑ Move up" disabled={index === 0} onPress={() => moveStep(index, -1)} colors={colors}/><SmallButton label="↓ Move down" disabled={index === steps.length - 1} onPress={() => moveStep(index, 1)} colors={colors}/></View></View>; })}</View>
    <View className="gap-3"><Text className="text-lg font-semibold text-foreground">Add from Exercise Library</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search exercises" placeholderTextColor={colors.muted} className="rounded-2xl border border-border bg-surface px-4 py-3 text-foreground"/>{available.slice(0, 20).map((exercise) => <Pressable key={exercise.id} onPress={() => addExercise(exercise)} style={({ pressed }) => [{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, opacity: pressed ? 0.72 : 1 }]}><View className="flex-1"><Text className="font-semibold text-foreground">{exercise.name}</Text><Text className="text-xs text-muted">{exercise.primaryMuscles.join(" · ")} · {exercise.prescription.defaultSets} sets</Text></View><Text className="font-bold text-primary">Add</Text></Pressable>)}</View>
    {notice ? <Text className="rounded-2xl bg-primary-soft p-3 text-sm font-semibold text-primary">{notice}</Text> : null}<Pressable onPress={() => void save()} style={{ backgroundColor: colors.primary, borderRadius: 999, alignItems: "center", paddingVertical: 15 }}><Text className="font-semibold text-white">Save custom workout</Text></Pressable>{editingId && <Pressable onPress={() => router.push({ pathname: "/workout", params: { customId: editingId } })} style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 999, alignItems: "center", paddingVertical: 13 }}><Text className="font-semibold text-primary">Start this workout</Text></Pressable>}
  </View></ScrollView></ScreenContainer>;
}

function NumberInput({ label, value, onChange, colors }: { label: string; value: number; onChange: (value: number) => void; colors: ReturnType<typeof useColors> }) { return <View className="flex-1 gap-1"><Text className="text-xs font-semibold text-muted">{label}</Text><TextInput value={String(value)} onChangeText={(text) => onChange(Math.max(1, Number.parseInt(text.replace(/[^0-9]/g, ""), 10) || 1))} keyboardType="number-pad" className="rounded-xl border border-border bg-background px-3 py-2 text-center text-foreground"/></View>; }
function SmallButton({ label, disabled, onPress, colors }: { label: string; disabled: boolean; onPress: () => void; colors: ReturnType<typeof useColors> }) { return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [{ flex: 1, alignItems: "center", borderRadius: 999, borderWidth: 1, borderColor: colors.border, paddingVertical: 9, opacity: disabled ? 0.35 : pressed ? 0.7 : 1 }]}><Text className="text-xs font-semibold text-foreground">{label}</Text></Pressable>; }
