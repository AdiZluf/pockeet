import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { a11y, surfaceElevation, useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

import { PressableScale } from "./PressableScale";

export type FABIcon = "camera" | "add";

export type FABProps = {
  accessibilityLabel: string;
  icon?: FABIcon;
  visible?: boolean;
  tabBarOffset?: number;
  onPress?: () => void;
  className?: string;
};

const FAB_ICONS: Record<FABIcon, keyof typeof Ionicons.glyphMap> = {
  camera: "camera",
  add: "add",
};

export function FAB({
  accessibilityLabel,
  icon = "add",
  visible = true,
  tabBarOffset = 49,
  onPress,
  className,
}: FABProps) {
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();

  if (!visible) return null;

  const bottom = insets.bottom + tabBarOffset + 20;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className={cn(
        "absolute end-5 items-center justify-center rounded-full bg-accent",
        className,
      )}
      style={{
        bottom,
        width: a11y.fabSize,
        height: a11y.fabSize,
        ...surfaceElevation.fab,
      }}
    >
      <Ionicons name={FAB_ICONS[icon]} size={icon === "add" ? 28 : 26} color={iconColors.inverse} />
    </PressableScale>
  );
}
