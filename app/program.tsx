import { Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { generateLegDayProgram, legDayProgram } from "@/shared/leg-day-program";
import { legsExercises } from "@/shared/legs-content";
import { chestExercises } from "@/shared/chest-content";
import { gymBackExercises } from "@/shared/gym-back-content";
import { bicepsExercises } from "@/shared/biceps-content";
import { tricepsExercises } from "@/shared/triceps-content";
import type { ExerciseContent } from "@/shared/exercise-content";
import { armsProgram, backProgram, chestProgram, generateArmsProgram, generateBackProgram, generateChestProgram } from "@/shared/upper-body-programs";
import { getShopProgram, getShopProgramExercises, muscleBuildingSplitOptions, type ShopProgram } from "@/shared/shop-programs";

type ProgramStep = { exerciseId: string; order: number; block: "warm-up" | "strength" | "accessory"; sets: number; reps: number; restSeconds: number };

type Colors = ReturnType<typeof useColors>;

function ShopProgramView({ program, colors }: { program: ShopProgram; colors: Colors }) {
  const programExercises = getShopProgramExercises(program);
  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
        <View className="gap-5 pt-3">
          <Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]} accessibilityRole="button" accessibilityLabel="Go back to Shop">
            <Text className="text-sm font-semibold text-primary">‹ Back to Shop</Text>
          </Pressable>
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-wide text-primary">Shop program</Text>
            <Text className="text-3xl font-semibold text-foreground">{program.title}</Text>
            <Text className="text-base leading-6 text-muted">{program.subtitle}</Text>
          </View>
          {program.kind === "muscle-building" && (
            <View className="gap-3 rounded-3xl border-2 border-primary bg-primary-soft p-4">
              <View className="gap-1"><Text className="text-base font-semibold text-primary">Choose your split</Text><Text className="text-sm leading-5 text-foreground">Both structures use the same progressive training principles, but organize your week differently.</Text></View>
              <View className="gap-2">
                {muscleBuildingSplitOptions.map((option) => {
                  const selected = option.id === program.split;
                  return <Pressable key={option.id} onPress={() => router.replace({ pathname: "/program", params: { program: "shop.muscle-building", split: option.id } })} style={({ pressed }) => [{ borderWidth: 1, borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : colors.surface, borderRadius: 16, padding: 13, opacity: pressed ? 0.75 : 1 }]} accessibilityRole="button" accessibilityState={{ selected }}><Text className={selected ? "font-semibold text-white" : "font-semibold text-foreground"}>{option.title}</Text><Text className={selected ? "mt-1 text-xs text-white" : "mt-1 text-xs text-muted"}>{option.subtitle}</Text></Pressable>;
                })}
              </View>
            </View>
          )}
          {program.id === "shop.muscle-building-bro-split" && <Pressable onPress={() => router.push("/bro-split")} style={({ pressed }) => [{ alignItems: "center", borderRadius: 999, backgroundColor: colors.primary, paddingVertical: 14, opacity: pressed ? 0.8 : 1 }]} accessibilityRole="button"><Text className="font-semibold text-white">Customize weekly Bro Split</Text></Pressable>}
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-surface p-4"><Text className="text-xs font-semibold text-muted">Days/week</Text><Text className="mt-1 text-xl font-bold text-foreground">{program.daysPerWeek}</Text></View>
            <View className="flex-1 rounded-2xl bg-surface p-4"><Text className="text-xs font-semibold text-muted">Session length</Text><Text className="mt-1 text-xl font-bold text-foreground">{program.estimatedMinutes} min</Text></View>
          </View>
          <View className="gap-3">
            {program.steps.map((step) => {
              const exercise = step.exerciseId ? programExercises.find((item) => item.id === step.exerciseId) : undefined;
              if (step.contentStatus === "awaiting-video-content") {
                return <View key={`${program.id}-${step.order}`} className="rounded-3xl border border-border bg-surface p-4"><View className="flex-row items-start gap-3"><View className="h-9 w-9 items-center justify-center rounded-full bg-primary"><Text className="font-bold text-white">{step.order}</Text></View><View className="flex-1 gap-1"><Text className="text-base font-semibold text-foreground">{step.title}</Text><Text className="text-sm text-muted">{step.dayLabel} · {Math.round((step.durationSeconds ?? 0) / 60)} min</Text></View></View><View className="mt-3 rounded-xl bg-primary-soft px-3 py-2"><Text className="text-xs font-semibold text-primary">Video content placeholder</Text><Text className="mt-1 text-xs leading-4 text-foreground">Add the licensed reference video to make this cardio session executable in the workout player.</Text></View></View>;
              }
              if (!exercise) return null;
              return <View key={step.exerciseId} className="rounded-3xl border border-border bg-surface p-4"><View className="flex-row items-start gap-3"><View className="h-9 w-9 items-center justify-center rounded-full bg-primary"><Text className="font-bold text-white">{step.order}</Text></View><View className="flex-1 gap-1"><Text className="text-base font-semibold text-foreground">{exercise.name}</Text><Text className="text-sm text-muted">{step.dayLabel} · {step.block === "warm-up" ? "Warm-up" : step.block === "strength" ? "Strength" : step.block === "conditioning" ? "Conditioning" : "Recovery"} · {step.sets} sets · {step.reps} reps · {step.restSeconds}s rest</Text></View></View><Pressable onPress={() => router.push({ pathname: "/exercise", params: { id: exercise.id } })} style={({ pressed }) => [{ marginTop: 14, alignItems: "center", borderRadius: 999, backgroundColor: colors.primary, paddingVertical: 11, opacity: pressed ? 0.75 : 1 }]} accessibilityRole="button" accessibilityLabel={`Open ${exercise.name}`}><Text className="font-semibold text-white">Open exercise</Text></Pressable></View>;
            })}
          </View>
          <View className="rounded-3xl border border-border bg-primary-soft p-4"><Text className="font-semibold text-primary">How to follow {program.title}</Text><Text className="mt-2 text-sm leading-6 text-foreground">Complete the exercises in order, use the prescribed rest, and start the timer only when you are ready. Increase difficulty gradually and stop if you feel sharp pain, dizziness, or unusual discomfort.</Text></View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

export default function ProgramScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ program?: string; focuses?: string | string[]; split?: string | string[] }>();
  const programId = Array.isArray(params.program) ? params.program[0] : params.program;
  const splitParam = Array.isArray(params.split) ? params.split[0] : params.split;
  const shopProgram = getShopProgram(programId, splitParam);
  if (shopProgram) return <ShopProgramView program={shopProgram} colors={colors} />;

  const focusParam = Array.isArray(params.focuses) ? params.focuses[0] : params.focuses;
  const selectedFocuses = focusParam ? focusParam.split(",").filter(Boolean) : [];
  const resolvedProgramId = programId ?? legDayProgram.id;
  const isLegDay = resolvedProgramId === legDayProgram.id;

  let activeProgram: { title: string; subtitle: string; estimatedMinutes: number; steps: readonly ProgramStep[] };
  let programExercises: ExerciseContent[];
  if (resolvedProgramId === chestProgram.id) {
    activeProgram = generateChestProgram(selectedFocuses); programExercises = chestExercises;
  } else if (resolvedProgramId === backProgram.id) {
    activeProgram = generateBackProgram(selectedFocuses); programExercises = gymBackExercises;
  } else if (resolvedProgramId === armsProgram.id) {
    activeProgram = generateArmsProgram(selectedFocuses); programExercises = [...bicepsExercises, ...tricepsExercises];
  } else if (isLegDay) {
    activeProgram = generateLegDayProgram(selectedFocuses.length > 0 ? selectedFocuses : ["quadriceps"]); programExercises = legsExercises;
  } else {
    activeProgram = { title: "Program unavailable", subtitle: "This workout program could not be found.", estimatedMinutes: 0, steps: [] }; programExercises = [];
  }

  const isKnownProgram = isLegDay || resolvedProgramId === chestProgram.id || resolvedProgramId === backProgram.id || resolvedProgramId === armsProgram.id;
  if (!isKnownProgram) return <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}><View className="flex-1 items-center justify-center gap-4"><Text className="text-2xl font-semibold text-foreground">Program unavailable</Text><Pressable onPress={() => router.back()} style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12 }}><Text className="font-semibold text-white">Go back</Text></Pressable></View></ScreenContainer>;

  return <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}><ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}><View className="gap-5 pt-3"><Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}><Text className="text-sm font-semibold text-primary">‹ Back to Exercises</Text></Pressable><View className="gap-2"><Text className="text-xs font-bold uppercase tracking-wide text-primary">Structured workout</Text><Text className="text-3xl font-semibold text-foreground">{activeProgram.title}</Text><Text className="text-base leading-6 text-muted">{activeProgram.subtitle}</Text></View><View className="flex-row gap-3"><View className="flex-1 rounded-2xl bg-surface p-4"><Text className="text-xs font-semibold text-muted">Exercises</Text><Text className="mt-1 text-xl font-bold text-foreground">{activeProgram.steps.length}</Text></View><View className="flex-1 rounded-2xl bg-surface p-4"><Text className="text-xs font-semibold text-muted">Duration</Text><Text className="mt-1 text-xl font-bold text-foreground">{activeProgram.estimatedMinutes} min</Text></View></View><View className="gap-3">{activeProgram.steps.map((step) => { const exercise = programExercises.find((item) => item.id === step.exerciseId); if (!exercise) return null; return <View key={step.exerciseId} className="rounded-3xl border border-border bg-surface p-4"><View className="flex-row items-start gap-3"><View className="h-9 w-9 items-center justify-center rounded-full bg-primary"><Text className="font-bold text-white">{step.order}</Text></View><View className="flex-1 gap-1"><Text className="text-base font-semibold text-foreground">{exercise.name}</Text><Text className="text-sm text-muted">{step.block === "warm-up" ? "Warm-up" : step.block === "strength" ? "Strength" : "Accessory"} · {step.sets} sets · {step.reps} reps · {step.restSeconds}s rest</Text></View></View><Pressable onPress={() => router.push({ pathname: "/exercise", params: { id: exercise.id } })} style={({ pressed }) => [{ marginTop: 14, alignItems: "center", borderRadius: 999, backgroundColor: colors.primary, paddingVertical: 11, opacity: pressed ? 0.75 : 1 }]}><Text className="font-semibold text-white">Open exercise</Text></Pressable></View>; })}</View><View className="rounded-3xl border border-border bg-primary-soft p-4"><Text className="font-semibold text-primary">How to follow {activeProgram.title}</Text><Text className="mt-2 text-sm leading-6 text-foreground">Complete the exercises in order. Press Start timer only when you are ready, then use the automatic rest period before moving to the next set. Stop if you feel sharp pain or unusual discomfort.</Text></View></View></ScrollView></ScreenContainer>;
}
