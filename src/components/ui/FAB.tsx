import { Pressable, type PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { a11y } from "@/theme";
import { cn } from "@/utils/cn";

export type FABProps = PressableProps & {
  accessibilityLabel: string;
  visible?: boolean;
  tabBarOffset?: number;
};

export function FAB({
  accessibilityLabel,
  visible = true,
  tabBarOffset = 49,
  className,
  ...props
}: FABProps) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const bottom = insets.bottom + tabBarOffset + 16;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={cn(
        "absolute end-5 items-center justify-center rounded-full bg-accent shadow-fab",
        className,
      )}
      style={{
        bottom,
        width: a11y.fabSize,
        height: a11y.fabSize,
      }}
      {...props}
    >
      <Ionicons name="camera" size={26} color="#FFFCF9" />
    </Pressable>
  );
}
