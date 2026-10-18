import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { cloudinaryThumbnailUrl } from "@/components/cloudinary-video-player";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { loadOnboardingPreferences, type OnboardingPreferences } from "@/lib/onboarding-storage";
import { getCuratedAudience, type CuratedAudience } from "@/lib/audience-curation";
import { loadFavoriteExerciseIds, saveFavoriteExerciseIds, toggleFavoriteIds } from "@/lib/exercise-favorites";
import { bodyPartDefinitions, filterExercisesByBodyPart } from "@/lib/body-part-catalog";
import { menAbsExercises } from "@/shared/men-abs-content";
import { womenAbsExercises } from "@/shared/women-abs-content";
import { gymBackExercises } from "@/shared/gym-back-content";
import { bicepsExercises } from "@/shared/biceps-content";
import { tricepsExercises } from "@/shared/triceps-content";
import { chestExercises } from "@/shared/chest-content";
import { shouldersExercises } from "@/shared/shoulders-content";
import { legsExercises } from "@/shared/legs-content";
import { legDayProgram } from "@/shared/leg-day-program";
import { armsProgram, backProgram, chestProgram, generateArmsProgram, generateBackProgram, generateChestProgram } from "@/shared/upper-body-programs";
import type { ExerciseContent } from "@/shared/exercise-content";

const allExercises = [...menAbsExercises, ...womenAbsExercises, ...gymBackExercises, ...bicepsExercises, ...tricepsExercises, ...chestExercises, ...shouldersExercises, ...legsExercises];
const gymExercises = [...gymBackExercises, ...bicepsExercises, ...tricepsExercises, ...chestExercises, ...shouldersExercises, ...legsExercises];
const bodyParts = bodyPartDefinitions;
type WorkoutMode = "home" | "gym" | "cardio";
type AbsGroup = "full-abs" | "upper-abs" | "middle-abs" | "lower-abs" | "obliques";
type ChestGroup = "upper-chest" | "mid-chest" | "inner-chest" | "lower-chest";
type BackGroup = "lats" | "upper-back" | "mid-back" | "lower-back";
type ArmGroup = "biceps" | "triceps" | "brachialis" | "forearms";
type ShoulderGroup = "front-delts" | "side-delts" | "rear-delts" | "traps";
type LegGroup = "quadriceps" | "hamstrings" | "glutes" | "inner-thigh" | "calves";
type EquipmentFilter = "all" | "dumbbells" | "machines" | "bodyweight" | "barbell" | "cable";
const absGroups: { id: AbsGroup; label: string }[] = [
  { id: "full-abs", label: "Full abs" },
  { id: "upper-abs", label: "Upper abs" },
  { id: "middle-abs", label: "Middle abs" },
  { id: "lower-abs", label: "Lower abs" },
  { id: "obliques", label: "Obliques" },
];
const chestGroups: { id: ChestGroup; label: string }[] = [
  { id: "upper-chest", label: "Upper chest" },
  { id: "mid-chest", label: "Mid chest" },
  { id: "inner-chest", label: "Inner chest" },
  { id: "lower-chest", label: "Lower chest" },
];
const backGroups: { id: BackGroup; label: string }[] = [
  { id: "lats", label: "Lats" },
  { id: "upper-back", label: "Upper back" },
  { id: "mid-back", label: "Mid back" },
  { id: "lower-back", label: "Lower back" },
];
const armGroups: { id: ArmGroup; label: string }[] = [
  { id: "biceps", label: "Biceps" },
  { id: "triceps", label: "Triceps" },
  { id: "brachialis", label: "Brachialis" },
  { id: "forearms", label: "Forearms" },
];
const shoulderGroups: { id: ShoulderGroup; label: string }[] = [
  { id: "front-delts", label: "Front delts" },
  { id: "side-delts", label: "Side delts" },
  { id: "rear-delts", label: "Rear delts" },
  { id: "traps", label: "Traps" },
];
const legGroups: { id: LegGroup; label: string }[] = [
  { id: "quadriceps", label: "Quads" },
  { id: "hamstrings", label: "Hamstrings" },
  { id: "glutes", label: "Glutes" },
  { id: "inner-thigh", label: "Inner Thigh" },
  { id: "calves", label: "Calves" },
];
const equipmentFilters: { id: EquipmentFilter; label: string }[] = [
  { id: "all", label: "All equipment" },
  { id: "dumbbells", label: "Dumbbells" },
  { id: "machines", label: "Machines" },
  { id: "bodyweight", label: "Bodyweight" },
  { id: "barbell", label: "Barbell" },
  { id: "cable", label: "Cable" },
];

function focusText(item: ExerciseContent) {
  return [item.name, item.shortDescription, ...item.primaryMuscles, ...item.secondaryMuscles, ...item.tags].join(" ").toLowerCase();
}

function matchesFocus(item: ExerciseContent, part: string, focus: string) {
  const text = focusText(item);
  const aliases: Record<string, string[]> = {
    "full-abs": ["full abs", "full_abs", "full-abs"],
    "upper-abs": ["upper abs", "upper_abs", "upper-abs"],
    "middle-abs": ["middle abs", "middle_abs", "middle-abs"],
    "lower-abs": ["lower abs", "lower_abs", "lower-abs"],
    obliques: ["oblique"],
    "upper-chest": ["upper chest", "upper_chest", "incline"],
    "mid-chest": ["mid chest", "middle chest", "bench press", "chest press", "dumbbell press"],
    "inner-chest": ["inner chest", "inner_chest"],
    "lower-chest": ["lower chest", "decline"],
    lats: ["lat", "lats", "pulldown"],
    "upper-back": ["upper back", "upper_back", "rear delt", "t-bar row"],
    "mid-back": ["mid back", "middle back", "barbell row", "cable row", "dumbbell row"],
    "lower-back": ["lower back", "lower_back"],
    biceps: ["biceps", "bicep"],
    triceps: ["triceps", "tricep"],
    brachialis: ["brachialis", "hammer curl", "reverse grip"],
    forearms: ["forearm", "forearms", "wrist"],
    "front-delts": ["front-delts", "front delts", "anterior deltoid"],
    "side-delts": ["side-delts", "side delts", "lateral raise", "middle deltoid"],
    "rear-delts": ["rear-delts", "rear delts", "posterior shoulder", "rear delt"],
    traps: ["traps", "trapezius"],
  };
  if (part === "legs") return item.tags.includes(focus);
  return (aliases[focus] ?? [focus]).some((alias) => text.includes(alias));
}

function activeFocusLabel(part: string, abs: AbsGroup, chest: ChestGroup[], back: BackGroup[], arms: ArmGroup[], shoulders: ShoulderGroup, legs: LegGroup[]) {
  if (part === "abs") return absGroups.find((group) => group.id === abs)?.label ?? "Abs";
  if (part === "chest") return chest.map((groupId) => chestGroups.find((group) => group.id === groupId)?.label).filter(Boolean).join(" + ");
  if (part === "back") return back.map((groupId) => backGroups.find((group) => group.id === groupId)?.label).filter(Boolean).join(" + ");
  if (part === "arms") return arms.map((groupId) => armGroups.find((group) => group.id === groupId)?.label).filter(Boolean).join(" + ");
  if (part === "shoulders") return shoulderGroups.find((group) => group.id === shoulders)?.label ?? "Shoulders";
  if (part === "legs") return legs.map((groupId) => legGroups.find((group) => group.id === groupId)?.label).filter(Boolean).join(" + ");
  return "All areas";
}

function MultiFocusPanel<T extends string>({ title, helper, groups, selected, onToggle, colors }: { title: string; helper: string; groups: { id: T; label: string }[]; selected: T[]; onToggle: (value: T) => void; colors: ReturnType<typeof useColors> }) {
  return (
    <View className="rounded-3xl border-2 border-primary bg-primary-soft p-3">
      <Text className="text-sm font-bold uppercase tracking-wide text-foreground">{title}</Text>
      <Text className="mt-1 text-xs text-muted">{helper}</Text>
      <View className="mt-3 flex-row flex-wrap justify-between gap-y-2">
        {groups.map((group) => {
          const active = selected.includes(group.id);
          return <Pressable key={group.id} onPress={() => onToggle(group.id)} accessibilityRole="checkbox" accessibilityState={{ checked: active }} style={({ pressed }) => [{ width: groups.length > 4 ? "31.5%" : "48%", minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.background, opacity: pressed ? 0.72 : 1, paddingHorizontal: 8 }]}><Text className="text-center text-xs font-bold" style={{ color: active ? "#FFFFFF" : colors.foreground }}>{active ? "✓ " : ""}{group.label}</Text></Pressable>;
        })}
      </View>
    </View>
  );
}

function FocusPanel<T extends string>({ title, helper, groups, selected, onSelect, colors }: { title: string; helper: string; groups: { id: T; label: string }[]; selected: T; onSelect: (value: T) => void; colors: ReturnType<typeof useColors> }) {
  return (
    <View className="rounded-3xl border-2 border-primary bg-primary-soft p-3">
      <Text className="text-sm font-bold uppercase tracking-wide text-foreground">{title}</Text>
      <Text className="mt-1 text-xs text-muted">{helper}</Text>
      <View className="mt-3 flex-row flex-wrap justify-between gap-y-2">
        {groups.map((group) => {
          const active = group.id === selected;
          return (
            <Pressable key={group.id} onPress={() => onSelect(group.id)} accessibilityRole="button" accessibilityLabel={`Show ${group.label} exercises`} style={({ pressed }) => [{ width: groups.length > 4 ? "31.5%" : "48%", minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.background, opacity: pressed ? 0.72 : 1, paddingHorizontal: 8 }]}>
              <Text className="text-center text-xs font-bold" style={{ color: active ? "#FFFFFF" : colors.foreground }}>{group.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function LibraryScreen() {
  const colors = useColors();
  const [activeMode, setActiveMode] = useState<WorkoutMode>("home");
  const [activePart, setActivePart] = useState("abs");
  const [activeAbsGroup, setActiveAbsGroup] = useState<AbsGroup>("full-abs");
  const [activeChestGroups, setActiveChestGroups] = useState<ChestGroup[]>(["mid-chest"]);
  const [activeBackGroups, setActiveBackGroups] = useState<BackGroup[]>(["upper-back"]);
  const [activeArmGroups, setActiveArmGroups] = useState<ArmGroup[]>(["biceps"]);
  const [activeShoulderGroup, setActiveShoulderGroup] = useState<ShoulderGroup>("front-delts");
  const [activeLegGroups, setActiveLegGroups] = useState<LegGroup[]>(["quadriceps"]);

  const toggleLegGroup = (group: LegGroup) => {
    setActiveLegGroups((current) => current.includes(group) ? (current.length === 1 ? current : current.filter((item) => item !== group)) : [...current, group]);
  };
  const toggleFocusGroup = <T extends string>(group: T, setGroups: (updater: (current: T[]) => T[]) => void) => {
    setGroups((current) => current.includes(group) ? (current.length === 1 ? current : current.filter((item) => item !== group)) : [...current, group]);
  };
  const [activeEquipment, setActiveEquipment] = useState<EquipmentFilter>("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<OnboardingPreferences | null>(null);

  useEffect(() => {
    let mounted = true;
    loadOnboardingPreferences().then((value) => {
      if (mounted) setPreferences(value);
    });
    loadFavoriteExerciseIds().then((value) => {
      if (mounted) setFavoriteIds(value);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleFavorite = (exerciseId: string) => {
    setFavoriteIds((current) => {
      const next = toggleFavoriteIds(current, exerciseId);
      void saveFavoriteExerciseIds(next);
      return next;
    });
  };

  const audience: CuratedAudience = getCuratedAudience(preferences ?? { completed: false, goals: [] });
  const selectedPart = bodyParts.find((part) => part.id === activePart) ?? bodyParts[0];
  const filtered = useMemo(() => {
    const source = activeMode === "gym" ? gymExercises : allExercises;
    const bodyPartExercises = filterExercisesByBodyPart(source, selectedPart, audience);
    if (selectedPart.id === "abs") return bodyPartExercises.filter((item) => matchesFocus(item, selectedPart.id, activeAbsGroup));
    if (selectedPart.id === "chest") return bodyPartExercises.filter((item) => activeChestGroups.some((focus) => matchesFocus(item, selectedPart.id, focus)));
    if (selectedPart.id === "back") return bodyPartExercises.filter((item) => activeBackGroups.some((focus) => matchesFocus(item, selectedPart.id, focus)));
    if (selectedPart.id === "arms") return bodyPartExercises.filter((item) => activeArmGroups.some((focus) => matchesFocus(item, selectedPart.id, focus)));
    if (selectedPart.id === "shoulders") return bodyPartExercises.filter((item) => matchesFocus(item, selectedPart.id, activeShoulderGroup));
    if (selectedPart.id === "legs") {
      const grouped = bodyPartExercises.filter((item) => activeLegGroups.some((group) => item.tags.includes(group)));
      if (activeEquipment === "all") return grouped;
      return grouped.filter((item) => item.equipment.some((equipment) => {
        const normalized = equipment.toLowerCase();
        if (activeEquipment === "machines") return normalized.includes("machine");
        if (activeEquipment === "bodyweight") return normalized.includes("bodyweight");
        return normalized.includes(activeEquipment.slice(0, -1)) || normalized.includes(activeEquipment);
      }));
    }
    return bodyPartExercises;
  }, [activeAbsGroup, activeArmGroups, activeBackGroups, activeChestGroups, activeEquipment, activeLegGroups, activeMode, activeShoulderGroup, audience, selectedPart]);
  const audienceLabel = audience === "men" ? "Men" : audience === "women" ? "Women" : "Everyone";
  const selectedFocusLabel = activeFocusLabel(selectedPart.id, activeAbsGroup, activeChestGroups, activeBackGroups, activeArmGroups, activeShoulderGroup, activeLegGroups);

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1 gap-5 pt-3">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1 gap-1">
            <Text className="text-3xl font-semibold text-foreground">Exercises</Text>
            <Text className="text-sm leading-5 text-muted">Choose a {activeMode === "cardio" ? "cardio" : activeMode === "gym" ? "gym exercise or body part" : "body part"} to see {audienceLabel.toLowerCase()} references.</Text>
          </View>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [pressed && { opacity: 0.65 }]}>
            <Text className="text-sm font-semibold text-primary">Close</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-2">
          <Pressable onPress={() => router.push("/custom-workout")} style={({ pressed }) => [{ flex: 1, minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primary, opacity: pressed ? 0.72 : 1, paddingHorizontal: 6 }]} accessibilityRole="button" accessibilityLabel="Create custom workout"><Text className="text-center text-xs font-semibold text-white">Custom workout</Text></Pressable>
          {(["home", "gym", "cardio"] as WorkoutMode[]).map((mode) => {
            const selected = mode === activeMode;
            const label = mode === "home" ? "Home workouts" : mode === "gym" ? "Gym workouts" : "Cardio";
            return (
              <Pressable
                key={mode}
                onPress={() => setActiveMode(mode)}
                style={({ pressed }) => [
                  { flex: 1, minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : colors.surface, opacity: pressed ? 0.72 : 1, paddingHorizontal: 6 },
                ]}
              >
                <Text className="text-center text-xs font-semibold" style={{ color: selected ? "#FFFFFF" : colors.foreground }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {activeMode === "cardio" ? (
          <View className="items-center rounded-3xl border border-dashed border-border bg-surface px-6 py-12">
            <Text className="text-lg font-semibold text-foreground">Cardio library coming next</Text>
            <Text className="mt-2 text-center text-sm leading-5 text-muted">Cardio exercises and reference videos will be added here.</Text>
          </View>
        ) : (
          <>
            <View className="rounded-3xl border border-border bg-surface p-4">
              <Text className="text-xs font-semibold uppercase tracking-wide text-muted">Train by body part</Text>
              <View className="mt-3 flex-row flex-wrap justify-between gap-y-3">
                {bodyParts.map((part) => {
                  const selected = part.id === activePart;
                  return (
                    <Pressable
                      key={part.id}
                      onPress={() => setActivePart(part.id)}
                      style={({ pressed }) => [
                        { width: "31%", minHeight: 132, alignItems: "center", justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : colors.background, opacity: pressed ? 0.72 : 1, overflow: "hidden", paddingHorizontal: 4, paddingVertical: 8 },
                      ]}
                    >
                      <Image source={{ uri: part.image }} resizeMode="contain" style={{ width: "100%", height: 88 }} accessibilityLabel={`${part.label} anatomy`} />
                      <Text className="mt-1 text-center text-xs font-semibold" style={{ color: selected ? "#FFFFFF" : colors.foreground }}>{part.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            {selectedPart.id === "abs" && <FocusPanel title="Abs: choose a focus" helper="Filter the core exercises by the area you want to train." groups={absGroups} selected={activeAbsGroup} onSelect={setActiveAbsGroup} colors={colors} />}
            {selectedPart.id === "chest" && <MultiFocusPanel title="Chest: choose focuses" helper="Select one or more chest regions to combine in your library and program." groups={chestGroups} selected={activeChestGroups} onToggle={(group) => toggleFocusGroup(group, setActiveChestGroups)} colors={colors} />}
            {selectedPart.id === "back" && <MultiFocusPanel title="Back: choose focuses" helper="Select one or more back regions to combine in your library and program." groups={backGroups} selected={activeBackGroups} onToggle={(group) => toggleFocusGroup(group, setActiveBackGroups)} colors={colors} />}
            {selectedPart.id === "arms" && <MultiFocusPanel title="Arms: choose focuses" helper="Select one or more arm muscles to combine in your library and program." groups={armGroups} selected={activeArmGroups} onToggle={(group) => toggleFocusGroup(group, setActiveArmGroups)} colors={colors} />}
            {selectedPart.id === "legs" && (
              <View className="gap-3 rounded-3xl border-2 border-primary bg-primary-soft p-3">
                <View>
                  <Text className="text-sm font-bold uppercase tracking-wide text-foreground">Legs: choose a focus</Text>
                  <Text className="mt-1 text-xs text-muted">Select one or more lower-body areas to combine focus filters.</Text>
                </View>
                <View className="flex-row flex-wrap justify-between gap-y-2">
                  {legGroups.map((group) => {
                    const selected = activeLegGroups.includes(group.id);
                    return (
                      <Pressable key={group.id} onPress={() => toggleLegGroup(group.id)} accessibilityRole="button" accessibilityLabel={`Show ${group.label} leg exercises`} style={({ pressed }) => [{ width: "31.5%", minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : colors.background, opacity: pressed ? 0.72 : 1, paddingHorizontal: 6 }]}>
                        <Text className="text-center text-xs font-bold" style={{ color: selected ? "#FFFFFF" : colors.foreground }}>{group.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View>
                  <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Equipment</Text>
                  <ScrollFilterRow options={equipmentFilters} selected={activeEquipment} onSelect={setActiveEquipment} colors={colors} />
                </View>
              </View>
            )}
            {selectedPart.id === "shoulders" && <FocusPanel title="Shoulders: choose a focus" helper="Filter shoulder exercises by the area you want to train." groups={shoulderGroups} selected={activeShoulderGroup} onSelect={setActiveShoulderGroup} colors={colors} />}
            {selectedPart.id === "legs" && (
              <Pressable onPress={() => router.push({ pathname: "/program", params: { program: legDayProgram.id, focuses: activeLegGroups.join(",") } })} style={({ pressed }) => [{ borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, opacity: pressed ? 0.75 : 1 }]}>
                <Text className="text-xs font-bold uppercase tracking-wide text-primary">Structured program</Text>
                <Text className="mt-1 text-lg font-semibold text-foreground">{legDayProgram.title}</Text>
                <Text className="mt-1 text-sm leading-5 text-muted">{legDayProgram.steps.length} exercises · about {legDayProgram.estimatedMinutes} minutes</Text>
                <Text className="mt-3 text-sm font-semibold text-primary">View Leg Day →</Text>
              </Pressable>
            )}
            {selectedPart.id === "chest" && <ProgramCard title={chestProgram.title} subtitle={generateChestProgram(activeChestGroups).subtitle} steps={generateChestProgram(activeChestGroups).steps.length} programId={chestProgram.id} focuses={activeChestGroups} colors={colors} />}
            {selectedPart.id === "back" && <ProgramCard title={backProgram.title} subtitle={generateBackProgram(activeBackGroups).subtitle} steps={generateBackProgram(activeBackGroups).steps.length} programId={backProgram.id} focuses={activeBackGroups} colors={colors} />}
            {selectedPart.id === "arms" && <ProgramCard title={armsProgram.title} subtitle={generateArmsProgram(activeArmGroups).subtitle} steps={generateArmsProgram(activeArmGroups).steps.length} programId={armsProgram.id} focuses={activeArmGroups} colors={colors} />}
            <View className="flex-row items-end justify-between gap-3">
              <View className="flex-1 gap-1">
                <Text className="text-2xl font-semibold text-foreground">{activeMode === "gym" ? "Gym · " : ""}{selectedPart.label} · {selectedFocusLabel}</Text>
                <Text className="text-sm leading-5 text-muted">{selectedFocusLabel} references curated for {audienceLabel.toLowerCase()} workouts.</Text>
              </View>
              <Text className="pb-1 text-sm font-semibold text-primary">{filtered.length} {filtered.length === 1 ? "exercise" : "exercises"}</Text>
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 12, paddingBottom: 30 }}
              ListEmptyComponent={<EmptyState part={selectedPart.label} />}
              renderItem={({ item }) => <ExerciseCard item={item} colors={colors} isFavorite={favoriteIds.includes(item.id)} onToggleFavorite={toggleFavorite} />}
            />
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

function ExerciseCard({ item, colors, isFavorite, onToggleFavorite }: { item: ExerciseContent; colors: ReturnType<typeof useColors>; isFavorite: boolean; onToggleFavorite: (exerciseId: string) => void }) {
  const media = item.media[0];
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/exercise", params: { id: item.id } })}
      style={({ pressed }) => [
        { padding: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
        pressed && { opacity: 0.75 },
      ]}
    >
      <View className="flex-row items-center gap-3">
        {media?.uri ? (
          <Image
            source={{ uri: cloudinaryThumbnailUrl(media.uri, 160) }}
            accessibilityLabel={`${item.name} middle-frame thumbnail`}
            resizeMode="cover"
            style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: colors.surface }}
          />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">
            <IconSymbol name="play.arrow" size={20} color={colors.primary} />
          </View>
        )}
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-foreground">{item.name}</Text>
          <Text className="text-sm text-muted">{item.primaryMuscles.join(" · ")} · {item.equipment.join(", ") || "No equipment"}</Text>
          <Text className="text-xs font-medium text-primary">{media ? "Video reference ready" : "Reference coming soon"}</Text>
        </View>
        <View className="items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? `Remove ${item.name} from favorites` : `Save ${item.name} to favorites`}
            onPress={(event) => {
              event.stopPropagation();
              onToggleFavorite(item.id);
            }}
            style={({ pressed }) => [{ minWidth: 44, minHeight: 36, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: isFavorite ? colors.surface : colors.background, opacity: pressed ? 0.65 : 1 }]}
          >
            <Text style={{ color: isFavorite ? colors.primary : colors.muted, fontSize: 22 }}>{isFavorite ? "★" : "☆"}</Text>
          </Pressable>
          <Text className="text-xl text-muted">›</Text>
        </View>
      </View>
    </Pressable>
  );
}

function ProgramCard({ title, subtitle, steps, programId, focuses, colors }: { title: string; subtitle: string; steps: number; programId: string; focuses: readonly string[]; colors: ReturnType<typeof useColors> }) {
  return <Pressable onPress={() => router.push({ pathname: "/program", params: { program: programId, focuses: focuses.join(",") } })} style={({ pressed }) => [{ borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, opacity: pressed ? 0.75 : 1 }]}><Text className="text-xs font-bold uppercase tracking-wide text-primary">Structured program</Text><Text className="mt-1 text-lg font-semibold text-foreground">{title}</Text><Text className="mt-1 text-sm leading-5 text-muted">{subtitle}</Text><Text className="mt-3 text-sm font-semibold text-primary">View workout · {steps} exercises →</Text></Pressable>;
}

function ScrollFilterRow<T extends string>({ options, selected, onSelect, colors }: { options: { id: T; label: string }[]; selected: T; onSelect: (value: T) => void; colors: ReturnType<typeof useColors> }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {options.map((option) => {
        const active = option.id === selected;
        return <Pressable key={option.id} onPress={() => onSelect(option.id)} style={({ pressed }) => [{ minHeight: 38, justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.background, paddingHorizontal: 12, opacity: pressed ? 0.72 : 1 }]}><Text className="text-xs font-semibold" style={{ color: active ? "#FFFFFF" : colors.foreground }}>{option.label}</Text></Pressable>;
      })}
    </ScrollView>
  );
}

function EmptyState({ part }: { part: string }) {
  return (
    <View className="items-center rounded-3xl border border-dashed border-border bg-surface px-6 py-10">
      <Text className="text-base font-semibold text-foreground">{part} library coming next</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-muted">More licensed {part.toLowerCase()} references will appear here as they are added for this audience.</Text>
    </View>
  );
}
