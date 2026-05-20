import { type PressableProps, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

import { PressableScale } from "./PressableScale";
import { Surface, type SurfaceVariant } from "./Surface";

export type CardProps = ViewProps & {
  interactive?: boolean;
  variant?: SurfaceVariant;
  onPress?: PressableProps["onPress"];
};

export function Card({
  interactive,
  onPress,
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  const elevated = variant === "elevated" || variant === "hero";

  if (interactive && onPress) {
    return (
      <PressableScale accessibilityRole="button" onPress={onPress}>
        <Surface variant={elevated ? "elevated" : variant} className={cn("p-4", className)}>
          {children}
        </Surface>
      </PressableScale>
    );
  }

  return (
    <Surface variant={elevated ? "elevated" : variant} className={cn("p-4", className)} {...props}>
      {children}
    </Surface>
  );
}
