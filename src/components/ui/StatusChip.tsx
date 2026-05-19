import { View } from "react-native";

import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type ReceiptStatusVariant = "processing" | "review" | "ready" | "failed";

const chipClasses: Record<ReceiptStatusVariant, string> = {
  processing: "bg-status-processing-bg",
  review: "bg-status-review-bg",
  ready: "bg-status-ready-bg",
  failed: "bg-status-failed-bg",
};

const textClasses: Record<ReceiptStatusVariant, string> = {
  processing: "text-status-processing",
  review: "text-status-review",
  ready: "text-status-ready",
  failed: "text-status-failed",
};

export type StatusChipProps = {
  variant: ReceiptStatusVariant;
  label: string;
};

export function StatusChip({ variant, label }: StatusChipProps) {
  return (
    <View
      className={cn("h-6 justify-center rounded-full px-2", chipClasses[variant])}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text variant="caption" className={textClasses[variant]}>
        {label}
      </Text>
    </View>
  );
}
