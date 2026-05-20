import { View, type ViewProps } from "react-native";

import { surfaceElevation } from "@/theme/surfaces";
import { cn } from "@/utils/cn";

export type SurfaceVariant = "default" | "elevated" | "inset" | "hero" | "panel";

export type SurfaceProps = ViewProps & {
  variant?: SurfaceVariant;
};

const variantClasses: Record<SurfaceVariant, string> = {
  default: "rounded-xl bg-surface",
  elevated: "rounded-xl bg-surface-elevated border border-border-subtle",
  inset: "rounded-xl bg-surface-muted",
  hero: "rounded-2xl bg-surface-elevated border border-border-subtle overflow-hidden",
  panel: "rounded-2xl bg-surface-elevated border border-border-subtle overflow-hidden",
};

export function Surface({ variant = "default", className, style, children, ...props }: SurfaceProps) {
  const elevated = variant === "elevated" || variant === "hero" || variant === "panel";

  return (
    <View
      className={cn(variantClasses[variant], className)}
      style={[elevated ? surfaceElevation.card : undefined, style]}
      {...props}
    >
      {children}
    </View>
  );
}
