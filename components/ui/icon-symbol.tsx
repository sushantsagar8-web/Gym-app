import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { OpaqueColorValue, Platform, Text, type StyleProp, type TextStyle } from "react-native";

const MAPPING: Record<string, ComponentProps<typeof MaterialIcons>["name"]> = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "play.arrow": "play-arrow",
  "local.fire.department": "local-fire-department",
  "fitness.center": "fitness-center",
  "directions.run": "directions-run",
  restaurant: "restaurant",
  "show.chart": "show-chart",
  "moon.fill": "dark-mode",
  "sun.max.fill": "light-mode",
  "shopping.bag": "shopping-bag",
  "arrow.upward": "arrow-upward",
  "body.abs": "accessibility",
  "body.chest": "fitness-center",
  "body.shoulders": "self-improvement",
  "body.back": "airline-seat-flat",
  "body.legs": "directions-run",
  "body.arms": "sports-handball",
};

const WEB_FALLBACK_GLYPHS: Record<string, string> = {
  "house.fill": "⌂",
  "paperplane.fill": "➤",
  "chevron.left.forwardslash.chevron.right": "‹›",
  "chevron.right": "›",
  "play.arrow": "▶",
  "local.fire.department": "♨",
  "fitness.center": "✦",
  "directions.run": "↗",
  restaurant: "◉",
  "show.chart": "↗",
  "moon.fill": "◐",
  "sun.max.fill": "☼",
  "shopping.bag": "□",
  "arrow.upward": "↑",
  "body.abs": "◇",
  "body.chest": "✦",
  "body.shoulders": "◇",
  "body.back": "▱",
  "body.legs": "↗",
  "body.arms": "◇",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: string;
}) {
  if (Platform.OS === "web") {
    return (
      <Text
        accessibilityLabel={name}
        style={[
          {
            color: color as string,
            fontSize: size,
            lineHeight: size,
            fontWeight: weight === "regular" ? "400" : "600",
            textAlign: "center",
          },
          style,
        ]}
      >
        {WEB_FALLBACK_GLYPHS[name] ?? "•"}
      </Text>
    );
  }

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name] ?? "help-outline"}
      style={[{ color: color as string }, style]}
    />
  );
}
