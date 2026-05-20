import React from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

export type DividerListProps = ViewProps & {
  children: React.ReactNode;
  /** Inset divider from start to align past leading thumbnail (logical). */
  insetStart?: boolean;
};

/**
 * Rows inside an ElevatedGroup with hairline separators.
 * Uses logical start/end margins for RTL-safe divider inset.
 */
export function DividerList({ insetStart = true, className, children, ...props }: DividerListProps) {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <View className={className} {...props}>
      {items.map((child, index) => (
        <View key={index}>
          {index > 0 ? (
            <View
              className={cn(
                "h-px bg-border-subtle",
                insetStart ? "ms-[4.5rem] me-4" : "mx-4",
              )}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
          ) : null}
          {child}
        </View>
      ))}
    </View>
  );
}
