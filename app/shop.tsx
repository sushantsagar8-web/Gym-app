import { Pressable, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { loadOnboardingPreferences, type OnboardingPreferences } from "@/lib/onboarding-storage";
import { audienceLabel, getCuratedAudience, type CuratedAudience } from "@/lib/audience-curation";
import { shopPrograms, type ShopProgram } from "@/shared/shop-programs";

function ProgramCard({ program, colors }: { program: ShopProgram; colors: ReturnType<typeof useColors> }) {
  const isMuscleBuilding = program.kind === "muscle-building";
  return (
    <Pressable
      onPress={() => router.push(isMuscleBuilding ? { pathname: "/program", params: { program: "shop.muscle-building", split: "bro-split" } } : { pathname: "/program", params: { program: program.id } })}
      style={({ pressed }) => [{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 24, padding: 20, gap: 18 }, pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] }]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${program.title}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="rounded-full bg-primary-soft px-3 py-1.5">
          <Text className="text-xs font-semibold text-primary">
            {program.audience === "all" ? "Open to everyone" : `${program.audience === "men" ? "Men’s" : "Women’s"} curated plan`}
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
      <View className="gap-2">
        <Text className="text-xl font-semibold text-foreground">{program.title}</Text>
        <Text className="text-sm leading-5 text-muted">{program.subtitle}</Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-muted">{program.daysPerWeek} days/week · about {program.estimatedMinutes} min</Text>
        <Text className="text-sm font-semibold text-primary">View program</Text>
      </View>
    </Pressable>
  );
}

export default function ShopScreen() {
  const colors = useColors();
  const [audience, setAudience] = useState<CuratedAudience>("all");
  useEffect(() => { void loadOnboardingPreferences().then((preferences: OnboardingPreferences) => setAudience(getCuratedAudience(preferences))); }, []);
  const visiblePrograms = shopPrograms.filter((program) => audience === "all" || program.audience === "all" || program.audience === audience);

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="gap-7 pt-3">
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted">{audienceLabel(audience).toUpperCase()}</Text>
            <Text className="text-3xl font-semibold text-foreground">Find your program</Text>
            <Text className="text-base leading-6 text-muted">Choose the structure that matches your goal. Each card now opens its own routine instead of sharing the Leg Day fallback.</Text>
          </View>
          <View className="gap-4">
            {visiblePrograms.map((program) => <ProgramCard key={program.id} program={program} colors={colors} />)}
          </View>
          <View className="rounded-2xl bg-primary-soft p-5">
            <Text className="text-base font-semibold text-primary">Your free starting point</Text>
            <Text className="mt-2 text-sm leading-5 text-foreground">Try the free exercise library before choosing a full program.</Text>
            <Pressable onPress={() => router.push("/exercise")} style={({ pressed }) => [{ marginTop: 16, opacity: pressed ? 0.65 : 1 }]}>
              <Text className="text-sm font-semibold text-primary">Browse free exercises →</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
