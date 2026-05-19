import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

export type LoadingSkeletonProps = ViewProps & {
  height?: number;
  width?: number | `${number}%`;
  rounded?: "sm" | "md" | "lg" | "full";
};

const roundedClass = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function LoadingSkeleton({
  height = 16,
  width = "100%",
  rounded = "md",
  className,
  ...props
}: LoadingSkeletonProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn("bg-surface-muted", roundedClass[rounded], className)}
      style={{ height, width }}
      {...props}
    />
  );
}

export type LoadingSkeletonGroupProps = ViewProps & {
  busy?: boolean;
  label?: string;
};

export function LoadingSkeletonGroup({
  busy,
  label = "Loading",
  children,
  className,
  ...props
}: LoadingSkeletonGroupProps) {
  return (
    <View
      accessibilityLabel={label}
      accessibilityState={{ busy }}
      className={cn("gap-3", className)}
      {...props}
    >
      {children}
    </View>
  );
}
