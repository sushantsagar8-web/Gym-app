import { Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { CloudinaryVideoPlayer } from "@/components/cloudinary-video-player";
import { useColors } from "@/hooks/use-colors";
import { menAbsExercises } from "@/shared/men-abs-content";
import { womenAbsExercises } from "@/shared/women-abs-content";
import { gymBackExercises } from "@/shared/gym-back-content";
import { bicepsExercises } from "@/shared/biceps-content";
import { tricepsExercises } from "@/shared/triceps-content";
import { chestExercises } from "@/shared/chest-content";
import { shouldersExercises } from "@/shared/shoulders-content";
import { legsExercises } from "@/shared/legs-content";

export default function ExerciseScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const allExercises = [...menAbsExercises, ...womenAbsExercises, ...gymBackExercises, ...bicepsExercises, ...tricepsExercises, ...chestExercises, ...shouldersExercises, ...legsExercises];
  const exercise = allExercises.find((item) => item.id === id) ?? allExercises[0];
  const media = exercise.media.find((asset) => asset.kind === "video" || asset.kind === "gif");
  return <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}><ScrollView contentContainerStyle={{ paddingBottom: 32 }}><View className="gap-6 pt-3"><Pressable onPress={() => router.back()}><Text className="text-sm font-semibold text-primary">‹ Back</Text></Pressable>{media ? <CloudinaryVideoPlayer uri={media.uri} altText={media.altText} autoPlay loop shouldPlay /> : <View className="h-64 items-center justify-center rounded-[28px] bg-primary-soft"><Text className="text-sm font-semibold text-primary">Reference coming soon</Text><Text className="mt-2 px-8 text-center text-sm text-muted">Add a licensed video to this exercise record.</Text></View>}<View className="gap-2"><Text className="text-sm font-medium text-muted">{exercise.primaryMuscles.join(" & ").toUpperCase()} · {exercise.difficulty.toUpperCase()}</Text><Text className="text-3xl font-semibold text-foreground">{exercise.name}</Text><Text className="text-base leading-6 text-muted">{exercise.shortDescription}</Text></View><View className="flex-row gap-3"><View className="flex-1 rounded-2xl border border-border bg-surface p-4"><Text className="text-xs font-medium text-muted">PRESCRIPTION</Text><Text className="mt-2 text-xl font-semibold text-foreground">{exercise.prescription.defaultSets} sets · {exercise.prescription.defaultReps ?? `${exercise.prescription.defaultDurationSeconds}s`}</Text></View><View className="flex-1 rounded-2xl border border-border bg-surface p-4"><Text className="text-xs font-medium text-muted">REST</Text><Text className="mt-2 text-xl font-semibold text-foreground">{exercise.prescription.defaultRestSeconds}s</Text></View></View><View className="gap-2"><Text className="text-lg font-semibold text-foreground">Form cues</Text>{exercise.safety.formCues.map((cue) => <Text key={cue} className="text-sm leading-5 text-muted">• {cue}</Text>)}</View><Pressable onPress={() => router.push({ pathname: "/workout", params: { id: exercise.id } })} style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 15, alignItems: "center" }, pressed && { opacity: 0.8 }]}><Text className="text-base font-semibold text-white">Add to workout</Text></Pressable></View></ScrollView></ScreenContainer>;
}
