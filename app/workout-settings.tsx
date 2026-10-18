import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { loadAppSettings, saveAppSettings } from "@/lib/local-data";
import { defaultAppSettings, type AppSettings } from "@/shared/fitpath-models";
import { BREAK_MAX, BREAK_MIN, WORK_MAX, WORK_MIN, parseDuration } from "@/lib/workout-settings";

export default function WorkoutSettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [workText, setWorkText] = useState(String(defaultAppSettings.workDurationSeconds));
  const [breakText, setBreakText] = useState(String(defaultAppSettings.breakIntervalSeconds));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void loadAppSettings().then((next) => {
      setSettings(next);
      setWorkText(String(next.workDurationSeconds));
      setBreakText(String(next.breakIntervalSeconds));
    });
  }, []);

  const save = async () => {
    const next = {
      ...settings,
      workDurationSeconds: parseDuration(workText, defaultAppSettings.workDurationSeconds, WORK_MIN, WORK_MAX),
      breakIntervalSeconds: parseDuration(breakText, defaultAppSettings.breakIntervalSeconds, BREAK_MIN, BREAK_MAX),
    };
    setSettings(next);
    setWorkText(String(next.workDurationSeconds));
    setBreakText(String(next.breakIntervalSeconds));
    await saveAppSettings(next);
    setSaved(true);
  };

  const reset = async () => {
    setSettings(defaultAppSettings);
    setWorkText(String(defaultAppSettings.workDurationSeconds));
    setBreakText(String(defaultAppSettings.breakIntervalSeconds));
    await saveAppSettings(defaultAppSettings);
    setSaved(true);
  };

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="gap-6 pt-3">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} style={{ paddingVertical: 8 }}>
              <Text className="text-sm font-semibold text-primary">‹ Back</Text>
            </Pressable>
            <Text className="text-sm font-medium text-muted">WORKOUT</Text>
            <View style={{ width: 48 }} />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-muted">PERSONALIZE YOUR PACE</Text>
            <Text className="text-3xl font-semibold text-foreground">Workout settings</Text>
            <Text className="text-base leading-6 text-muted">Choose how long each work set runs and how much recovery time you get between sets.</Text>
          </View>

          <DurationField
            label="Work-set duration"
            description={`Active exercise time · ${WORK_MIN}–${WORK_MAX} seconds`}
            value={workText}
            onChangeText={setWorkText}
            suffix="sec"
          />
          <DurationField
            label="Break interval"
            description={`Recovery time between sets · ${BREAK_MIN}–${BREAK_MAX} seconds`}
            value={breakText}
            onChangeText={setBreakText}
            suffix="sec"
          />

          <View className="rounded-2xl border border-border bg-surface p-4">
            <Text className="text-sm font-semibold text-foreground">Applied to new workouts</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">These settings override the default duration and rest values when you start a new timed workout. Exercise repetitions and set counts remain unchanged.</Text>
          </View>

          <View className="gap-3">
            <Pressable onPress={save} style={{ backgroundColor: "#174A3B", borderRadius: 999, paddingVertical: 16, alignItems: "center" }}>
              <Text className="text-base font-semibold text-white">Save workout settings</Text>
            </Pressable>
            <Pressable onPress={reset} style={{ borderColor: "#E6E7E2", borderWidth: 1, borderRadius: 999, paddingVertical: 14, alignItems: "center" }}>
              <Text className="text-sm font-semibold text-foreground">Reset defaults</Text>
            </Pressable>
            {saved ? <Text className="text-center text-sm font-medium text-primary">Saved on this device</Text> : null}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function DurationField({ label, description, value, onChangeText, suffix }: { label: string; description: string; value: string; onChangeText: (value: string) => void; suffix: string }) {
  return (
    <View className="gap-3 rounded-3xl border border-border bg-white p-4">
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{label}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted">{description}</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={3}
          accessibilityLabel={label}
          style={{ flex: 1, borderColor: "#E6E7E2", borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, fontSize: 22, fontWeight: "700", color: "#10231C", backgroundColor: "#FAFAF8" }}
        />
        <Text className="text-base font-semibold text-muted">{suffix}</Text>
      </View>
    </View>
  );
}

