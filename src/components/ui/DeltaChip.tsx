import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type DeltaChipTone = "up" | "down" | "neutral";

export type DeltaChipProps = {
  label: string;
  tone: DeltaChipTone;
  /** `hero` — white chip for gradient hero cards (Home month total). */
  variant?: "default" | "hero";
};

type IconName = ComponentProps<typeof Ionicons>["name"];

const defaultToneClasses: Record<DeltaChipTone, string> = {
  up: "bg-delta-up-bg",
  down: "bg-delta-down-bg",
  neutral: "bg-delta-neutral-bg",
};

const defaultTextClasses: Record<DeltaChipTone, string> = {
  up: "text-delta-up",
  down: "text-delta-down",
  neutral: "text-foreground-inverse/90",
};

const heroToneClasses: Record<DeltaChipTone, string> = {
  up: "border border-white/35 bg-white/22",
  down: "border border-white/35 bg-white/22",
  neutral: "border border-white/30 bg-white/18",
};

const heroIcons: Record<DeltaChipTone, IconName> = {
  up: "trending-up",
  down: "trending-down",
  neutral: "remove-outline",
};

export function DeltaChip({ label, tone, variant = "default" }: DeltaChipProps) {
  const isHero = variant === "hero";

  return (
    <View
      className={cn(
        "min-h-[32px] flex-row items-center gap-1.5 self-start rounded-full px-3 py-1.5",
        isHero ? heroToneClasses[tone] : defaultToneClasses[tone],
      )}
    >
      {isHero ? (
        <Ionicons name={heroIcons[tone]} size={14} color="#FFFFFF" accessibilityElementsHidden />
      ) : null}
      <Text
        variant="caption"
        className={cn(
          "font-sans-semibold",
          isHero ? "text-white" : defaultTextClasses[tone],
        )}
      >
        {label}
      </Text>
    </View>
  );
}
