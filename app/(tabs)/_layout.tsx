import { BottomTabBar, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { loadAppSettings, saveAppSettings } from "@/lib/local-data";
import { useThemeContext } from "@/lib/theme-provider";

function QuickThemeTabBar(props: BottomTabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";

  const toggleTheme = async () => {
    const settings = await loadAppSettings();
    const darkModeEnabled = !isDark;
    await saveAppSettings({ ...settings, darkModeEnabled });
    setColorScheme(darkModeEnabled ? "dark" : "light");
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "stretch", backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        <BottomTabBar {...props} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onPress={toggleTheme}
        style={({ pressed }) => ({
          width: 58,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: Platform.OS === "web" ? 8 : Math.max(insets.bottom, 8),
          paddingTop: 8,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          opacity: pressed ? 0.65 : 1,
        })}
      >
        <IconSymbol size={22} name={isDark ? "sun.max.fill" : "moon.fill"} color={colors.primary} />
        <Text style={{ marginTop: 2, fontSize: 10, fontWeight: "600", color: colors.muted }}>{isDark ? "Light" : "Dark"}</Text>
      </Pressable>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const { colorScheme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      tabBar={(props) => <QuickThemeTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? colors.primary : "#000000",
        tabBarInactiveTintColor: colorScheme === "dark" ? colors.muted : "#000000",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 1,
        },
        tabBarItemStyle: {
          minWidth: 0,
          paddingHorizontal: 0,
        },
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} /> }} />
      <Tabs.Screen name="exercises" options={{ title: "Exercises", tabBarIcon: ({ color }) => <IconSymbol size={24} name="fitness.center" color={color} /> }} />
      <Tabs.Screen name="shop" options={{ title: "Shop", tabBarIcon: ({ color }) => <IconSymbol size={24} name="shopping.bag" color={color} /> }} />
      <Tabs.Screen name="diet" options={{ title: "Diet", tabBarIcon: ({ color }) => <IconSymbol size={24} name="restaurant" color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: "Progress", tabBarIcon: ({ color }) => <IconSymbol size={24} name="show.chart" color={color} /> }} />
    </Tabs>
  );
}
