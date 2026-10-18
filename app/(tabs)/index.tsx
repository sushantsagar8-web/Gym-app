import { ScrollView, Text, View, Pressable, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import { starterPrograms } from "@/shared/fitpath-models";
import { loadOnboardingPreferences, type OnboardingPreferences } from "@/lib/onboarding-storage";
import { audienceLabel, getCuratedAudience, type CuratedAudience } from "@/lib/audience-curation";
import { audienceSchedules } from "@/shared/audience-schedules";

const focusAreas = [
  { label: "Weight loss", icon: "local.fire.department" as const, image: "weightLoss" as const },
  { label: "Build muscle", icon: "fitness.center" as const, image: "buildMuscle" as const },
  { label: "HIIT & cardio", icon: "directions.run", image: "hiitCardio" as const },
];

const weightLossAudienceImages = {
  women: "https://res.cloudinary.com/qvzram56/image/upload/v1786817570/pasted_file_jJCeUl_image.png",
  men: "https://res.cloudinary.com/qvzram56/image/upload/v1786817570/pasted_file_BNL4Mu_image.png",
} as const;

const buildMuscleImage = require("../../assets/images/build-muscle.webp");
const hiitCardioImage = require("../../assets/images/hiit-cardio.webp");
const menGoalImages = [
  require("../../assets/images/goals/men-transform-1.png"),
  require("../../assets/images/goals/men-transform-2.png"),
] as const;
const womenGoalImages = [require("../../assets/images/goals/women-transform.png")] as const;

const freeExercises = [
  { name: "Reverse crunch", detail: "Men’s abs · Reps", audience: "men" as const },
  { name: "Lower-ab leg raise", detail: "Women’s abs · Reps", audience: "women" as const },
  { name: "Forearm plank", detail: "Core · Time", audience: "all" as const },
];

function ActionCard({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: "shopping-bag" | "restaurant" | "show-chart" | "fitness.center";
  onPress: () => void;
}) {
  const colors = useColors();
  const { colorScheme } = useThemeContext();
  const cardIconColor = colorScheme === "dark" ? colors.primary : "#000000";
  const cardTextColor = colorScheme === "dark" ? colors.foreground : "#000000";
  const cardSurface = colorScheme === "dark" ? colors.surface : "#F5F5F5";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        {
          backgroundColor: cardSurface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 22,
          padding: 18,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        },
        pressed && { opacity: 0.78, transform: [{ scale: 0.985 }] },
      ]}
    >
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft">
        <IconSymbol name={icon} size={22} color={cardIconColor} />
      </View>
      <View className="flex-1 gap-1">
        <Text style={{ color: cardTextColor, fontSize: 16, fontWeight: "600" }}>{title}</Text>
        <Text className="text-sm leading-5 text-muted">{subtitle}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={cardIconColor} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const { colorScheme } = useThemeContext();
  const { width } = useWindowDimensions();
  const isCompactPhone = width < 360;
  const cardIconColor = colorScheme === "dark" ? colors.primary : "#FFFFFF";
  const focusIconColor = colorScheme === "dark" ? colors.primary : "#000000";
  const cardTextColor = colorScheme === "dark" ? colors.foreground : "#000000";
  const cardSurface = colorScheme === "dark" ? colors.surface : "#F5F5F5";
  const [audience, setAudience] = useState<CuratedAudience>("all");
  const [goalImageIndex, setGoalImageIndex] = useState(0);
  useEffect(() => { void loadOnboardingPreferences().then((preferences: OnboardingPreferences) => setAudience(getCuratedAudience(preferences))); }, []);
  const goalImages = audience === "women" ? womenGoalImages : menGoalImages;
  useEffect(() => {
    setGoalImageIndex(0);
    if (audience === "women") return;
    const interval = setInterval(() => setGoalImageIndex((current) => (current + 1) % menGoalImages.length), 5000);
    return () => clearInterval(interval);
  }, [audience]);
  const activeGoalImage = goalImages[goalImageIndex] ?? goalImages[0];
  const visibleExercises = freeExercises.filter((exercise) => audience === "all" || exercise.audience === "all" || exercise.audience === audience);
  const weeklySchedule = audience === "all" ? audienceSchedules.men : audienceSchedules[audience];

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="gap-7 pt-3">
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-sm font-medium text-muted">{audienceLabel(audience).toUpperCase()}</Text>
              <Text className="text-3xl font-semibold tracking-tight text-foreground">Your next step</Text>
            </View>
            <Pressable
              accessibilityLabel="Open profile"
              onPress={() => router.push("/profile")}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
                <Text className="text-base font-semibold text-background">FP</Text>
              </View>
            </Pressable>
          </View>

          <View style={{ minHeight: 430, position: "relative", overflow: "hidden", borderRadius: 28, padding: 24, gap: 16, backgroundColor: "#0A7EA4" }}>
            <Image
              source={activeGoalImage}
              accessibilityLabel={`${audience === "women" ? "Women" : "Men"} transformation background image`}
              contentFit="cover"
              transition={350}
              cachePolicy="disk"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
            <View className="flex-row items-center justify-between">
              <View className="rounded-full bg-white/15 px-3 py-1.5">
                <Text className="text-xs font-semibold tracking-wide text-white">COACH MODE</Text>
              </View>
              <IconSymbol name="arrow-upward" size={21} color="#D6E8DE" />
            </View>
            <View className="flex-1 justify-end gap-2">
              <View className="flex-row items-center gap-2">
                {goalImages.map((_, index) => (
                  <View key={`${audience}-goal-dot-${index}`} style={{ width: index === goalImageIndex ? 22 : 7, height: 7, borderRadius: 999, backgroundColor: index === goalImageIndex ? "#FFFFFF" : "rgba(255,255,255,0.55)" }} />
                ))}
              </View>
              <Text className="text-xs font-semibold tracking-wide text-white/80">{audience === "women" ? "WOMEN'S JOURNEY" : "MEN'S JOURNEY"}</Text>
            </View>
            <View style={{ gap: 8, padding: 14, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.26)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)" }}>
              <Text className="text-2xl font-semibold leading-8 text-white">Build your plan around the life you live.</Text>
              <Text className="text-sm leading-5 text-white/75">Choose a goal, find your program, and let each session guide the next.</Text>
            </View>
            <Pressable
              onPress={() => router.push("/onboarding")}
              accessibilityRole="button"
              style={({ pressed }) => [
                { backgroundColor: "#F7F6F2", borderRadius: 999, paddingVertical: 13, alignItems: "center" },
                pressed && { opacity: 0.82 },
              ]}
            >
              <Text className="text-sm font-semibold text-primary">Set up my goals</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            <View className="flex-row items-end justify-between">
              <View className="gap-1">
                <Text className="text-xl font-semibold text-foreground">Find your focus</Text>
                <Text className="text-sm text-muted">Start with what matters most today.</Text>
              </View>
              <Pressable onPress={() => router.push("/shop")} accessibilityRole="button">
                <Text className="text-sm font-semibold text-primary">See all</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: isCompactPhone ? "column" : "row", gap: 12 }}>
              {focusAreas.map((area) => (
                <Pressable
                  key={area.label}
                  onPress={() => router.push("/shop")}
                  style={({ pressed }) => [
                    { flex: isCompactPhone ? 0 : 1, borderRadius: 20, backgroundColor: cardSurface, borderColor: colors.border, borderWidth: 1, padding: 14, gap: 14 },
                    pressed && { opacity: 0.78 },
                  ]}
                >
                  <Image
                    source={area.image === "weightLoss" ? weightLossAudienceImages[audience === "women" ? "women" : "men"] : area.image === "buildMuscle" ? buildMuscleImage : hiitCardioImage}
                    accessibilityLabel={area.image === "weightLoss" ? `${audience === "women" ? "Female" : "Male"} weight loss illustration` : area.image === "buildMuscle" ? "Build muscle illustration" : "HIIT and cardio runner illustration"}
                    contentFit="contain"
                    transition={180}
                    cachePolicy="disk"
                    style={{ width: "100%", height: 112, borderRadius: 16, backgroundColor: colors.surface }}
                  />
                  <Text style={{ color: cardTextColor, fontSize: 14, fontWeight: "600", lineHeight: 20 }}>{area.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <View className="flex-row items-end justify-between gap-3"><View className="min-w-0 flex-1 gap-1"><Text className="text-xl font-semibold text-foreground">This week</Text><Text className="text-sm leading-5 text-muted">{audienceLabel(audience)} schedule, built around your selected audience.</Text></View><Text className="shrink-0 text-sm font-semibold text-primary">{weeklySchedule.sessions.length} sessions</Text></View>
            {weeklySchedule.sessions.map((session, index) => <Pressable key={session.id} onPress={() => router.push(`/workout?exerciseId=${session.blocks[0]?.exerciseIds[0] ?? ""}`)} style={({ pressed }) => [{ borderRadius: 22, backgroundColor: cardSurface, borderColor: colors.border, borderWidth: 1, padding: 18 }, pressed && { opacity: 0.78 }]}><View className="flex-row items-center justify-between"><View className="flex-1 gap-1"><Text className="text-xs font-medium text-muted">{session.dayLabel.toUpperCase()}</Text><Text style={{ color: cardTextColor, fontSize: 18, fontWeight: "600" }}>{session.title}</Text><Text className="text-sm text-muted">{session.estimatedMinutes} min · {audienceLabel(audience)}</Text></View><View className="h-11 w-11 items-center justify-center rounded-full bg-primary-soft"><Text className="text-sm font-bold text-primary">{index + 1}/{weeklySchedule.sessions.length}</Text></View></View></Pressable>)}
          </View>

          <View className="gap-3">
            <View className="gap-1">
              <Text className="text-xl font-semibold text-foreground">Your space to begin</Text>
              <Text className="text-sm leading-5 text-muted">Curated free exercises for your selected audience.</Text>
            </View>
            <View className="gap-3">
              {visibleExercises.map((exercise) => (
                <Pressable
                  key={exercise.name}
                  onPress={() => router.push("/exercise")}
                  style={({ pressed }) => [
                    { flexDirection: "row", alignItems: "center", gap: 14, borderBottomColor: colors.border, borderBottomWidth: 1, paddingVertical: 12 },
                    pressed && { opacity: 0.65 },
                  ]}
                >
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft">
                    <IconSymbol name="play.arrow" size={22} color={cardIconColor} />
                  </View>
                  <View className="flex-1 gap-1">
                    <Text style={{ color: cardTextColor, fontSize: 16, fontWeight: "600" }}>{exercise.name}</Text>
                    <Text className="text-sm text-muted">{exercise.detail}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={cardIconColor} />
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-xl font-semibold text-foreground">Keep your rhythm</Text>
            <ActionCard title="Browse exercises" subtitle="Filter abs references by muscle, audience, and equipment." icon="fitness.center" onPress={() => router.push("/library")} />
            <ActionCard title="Explore programs" subtitle="Goal-based plans for the journey ahead." icon="shopping-bag" onPress={() => router.push("/shop")} />
            <ActionCard title="Plan your meals" subtitle="Calories, macros, and flexible templates." icon="restaurant" onPress={() => router.push("/diet")} />
            <ActionCard title="See your progress" subtitle="Track consistency, strength, and endurance." icon="show-chart" onPress={() => router.push("/progress")} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
