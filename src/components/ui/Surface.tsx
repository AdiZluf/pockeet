import { View, type ViewProps } from "react-native";

import { surfaceElevation } from "@/theme/surfaces";
import { cn } from "@/utils/cn";

export type SurfaceVariant =
  | "default"
  | "elevated"
  | "inset"
  | "hero"
  | "panel"
  | "featured"
  | "dock";

export type SurfaceProps = ViewProps & {
  variant?: SurfaceVariant;
};

const variantClasses: Record<SurfaceVariant, string> = {
  default: "rounded-2xl bg-surface",
  elevated: "rounded-2xl bg-surface-elevated border border-border-subtle",
  inset: "rounded-2xl bg-surface-inset",
  hero: "rounded-2xl bg-surface-elevated border border-border-subtle overflow-hidden",
  panel: "rounded-2xl bg-surface-elevated border border-border-subtle overflow-hidden",
  featured: "rounded-2xl bg-surface-elevated border border-border-subtle overflow-hidden",
  dock: "rounded-2xl bg-surface-inset border border-border-subtle",
};

const elevationFor: Record<SurfaceVariant, keyof typeof surfaceElevation | null> = {
  default: "card",
  elevated: "raised",
  inset: null,
  hero: "raised",
  panel: "raised",
  featured: "raised",
  dock: "floating",
};

export function Surface({ variant = "default", className, style, children, ...props }: SurfaceProps) {
  const elevationKey = elevationFor[variant];
  const elevationStyle = elevationKey ? surfaceElevation[elevationKey] : undefined;

  return (
    <View className={cn(variantClasses[variant], className)} style={[elevationStyle, style]} {...props}>
      {variant === "elevated" || variant === "featured" || variant === "panel" ? (
        <View
          className="absolute inset-x-0 top-0 h-px bg-white/60"
          accessibilityElementsHidden
          pointerEvents="none"
        />
      ) : null}
      {children}
    </View>
  );
}
