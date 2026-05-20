import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { brandGradients } from "@/theme/gradients";
import { cn } from "@/utils/cn";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type GradientIconWellProps = {
  name: IconName;
  size?: number;
  iconSize?: number;
  color?: string;
  className?: string;
};

export function GradientIconWell({
  name,
  size = 48,
  iconSize = 24,
  color = "#FFFFFF",
  className,
}: GradientIconWellProps) {
  const radius = size * 0.28;

  return (
    <LinearGradient
      colors={[...brandGradients.iconWell]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        alignItems: "center",
        justifyContent: "center",
      }}
      className={className}
    >
      <Ionicons name={name} size={iconSize} color={color} />
    </LinearGradient>
  );
}
