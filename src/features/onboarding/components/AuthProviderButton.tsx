import type { ComponentProps } from "react";
import { View, type PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PressableScale, Text } from "@/components/ui";
import { a11y, motion, useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type AuthProviderButtonProps = PressableProps & {
  icon: IconName;
  label: string;
};

export function AuthProviderButton({ icon, label, onPress, className, ...props }: AuthProviderButtonProps) {
  const iconColors = useIconColors();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      scaleTo={motion.scale.pressed}
      className={cn(
        "min-h-[52px] w-full flex-row items-center justify-center gap-3 rounded-xl border border-border bg-surface-elevated px-5",
        className,
      )}
      style={{ minHeight: a11y.primaryButtonHeight }}
      {...props}
    >
      <Ionicons name={icon} size={22} color={iconColors.primary} />
      <Text variant="label" align="center" className="text-foreground">
        {label}
      </Text>
      <View className="w-[22px]" accessibilityElementsHidden />
    </PressableScale>
  );
}
