import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function RestScreen() {
  const colors = useColors();
  return <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}><View className="flex-1 items-center justify-center gap-6"><Text className="text-sm font-semibold tracking-wide text-primary">REST</Text><Text className="text-7xl font-semibold text-foreground">00:00</Text><Text className="text-center text-base leading-6 text-muted">Take the time you need. Your next movement is ready when you are.</Text><View className="w-full gap-3"><Pressable onPress={() => router.push("/workout")} style={{ backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 16, alignItems: "center" }}><Text className="text-base font-semibold text-white">Continue</Text></Pressable><Pressable style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 999, paddingVertical: 16, alignItems: "center" }}><Text className="text-base font-semibold text-foreground">Add 30 seconds</Text></Pressable></View></View></ScreenContainer>;
}
