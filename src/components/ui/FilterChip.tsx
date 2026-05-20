import { Ionicons } from "@expo/vector-icons";
import type { PressableProps } from "react-native";

import { useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

export type FilterChipVariant = "select" | "removable";

export type FilterChipProps = PressableProps & {
  label: string;
  variant?: FilterChipVariant;
  selected?: boolean;
  onPress: () => void;
};

export function FilterChip({
  label,
  variant = "select",
  selected = false,
  onPress,
  accessibilityLabel,
  className,
  ...props
}: FilterChipProps) {
  const iconColors = useIconColors();

  if (variant === "removable") {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        onPress={onPress}
        className={cn(
          "min-h-[44px] flex-row items-center gap-1.5 rounded-full border border-border-subtle bg-accent-soft px-3",
          className,
        )}
        {...props}
      >
        <Text variant="caption" className="font-medium text-accent">
          {label}
        </Text>
        <Ionicons name="close-circle" size={18} color={iconColors.accent} accessibilityElementsHidden />
      </PressableScale>
    );
  }

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        "min-h-[44px] items-center justify-center rounded-full px-4",
        selected ? "bg-accent" : "bg-surface-muted",
        className,
      )}
      {...props}
    >
      <Text
        variant="caption"
        className={selected ? "font-medium text-foreground-inverse" : undefined}
      >
        {label}
      </Text>
    </PressableScale>
  );
}
