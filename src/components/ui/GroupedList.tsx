import React from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

import { Surface } from "./Surface";

export type GroupedListProps = ViewProps & {
  /** Accent leading stripe (e.g. needs-review queue) */
  highlight?: boolean;
  children: React.ReactNode;
};

/**
 * iOS Settings–style grouped list: inset well, hairline separators between rows.
 * Prefer over elevated Surface + manual dividers in features.
 */
export function GroupedList({
  highlight,
  className,
  children,
  ...props
}: GroupedListProps) {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <Surface
      variant="inset"
      className={cn(
        "overflow-hidden",
        highlight && "border-s-[3px] border-s-accent",
        className,
      )}
      {...props}
    >
      {items.map((child, index) => (
        <View key={index}>
          {index > 0 ? (
            <View
              className="ms-[4.5rem] me-4 h-px bg-border-subtle"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
          ) : null}
          {child}
        </View>
      ))}
    </Surface>
  );
}
