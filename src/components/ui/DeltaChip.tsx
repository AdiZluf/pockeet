import { View } from "react-native";

import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type DeltaChipTone = "up" | "down" | "neutral";

export type DeltaChipProps = {
  label: string;
  tone: DeltaChipTone;
};

const toneClasses: Record<DeltaChipTone, string> = {
  up: "bg-delta-up-bg",
  down: "bg-delta-down-bg",
  neutral: "bg-delta-neutral-bg",
};

const textClasses: Record<DeltaChipTone, string> = {
  up: "text-delta-up",
  down: "text-delta-down",
  neutral: "text-foreground-inverse/90",
};

export function DeltaChip({ label, tone }: DeltaChipProps) {
  return (
    <View className={cn("self-start rounded-full px-3 py-1.5", toneClasses[tone])}>
      <Text variant="caption" className={cn("font-sans-semibold", textClasses[tone])}>
        {label}
      </Text>
    </View>
  );
}
