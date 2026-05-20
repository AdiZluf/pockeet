import { ActivityIndicator, View, type PressableProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { a11y, brandGradients, motion, useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

export type ButtonVariant = "primary" | "secondary" | "destructive" | "text";

export type ButtonProps = PressableProps & {
  variant?: ButtonVariant;
  label: string;
  loading?: boolean;
  block?: boolean;
};

const variantClasses: Record<Exclude<ButtonVariant, "primary">, string> = {
  secondary: "bg-surface-elevated border border-border-subtle shadow-card",
  destructive: "bg-transparent",
  text: "bg-transparent",
};

const labelClasses: Record<ButtonVariant, string> = {
  primary: "text-foreground-onAccent",
  secondary: "text-foreground",
  destructive: "text-status-failed",
  text: "text-accent",
};

export function Button({
  variant = "primary",
  label,
  loading = false,
  disabled,
  block = true,
  className,
  accessibilityState,
  ...props
}: ButtonProps) {
  const iconColors = useIconColors();
  const isDisabled = disabled || loading;

  const inner = loading ? (
    <ActivityIndicator color={variant === "primary" ? iconColors.inverse : iconColors.accent} />
  ) : (
    <Text variant="label" align="center" className={labelClasses[variant]}>
      {label}
    </Text>
  );

  if (variant === "primary") {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading, ...accessibilityState }}
        disabled={isDisabled}
        scaleTo={isDisabled ? 1 : motion.scale.pressed}
        className={cn(block && "w-full", isDisabled && "opacity-45", className)}
        style={{ minHeight: a11y.primaryButtonHeight }}
        {...props}
      >
        <LinearGradient
          colors={[...brandGradients.button]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            minHeight: a11y.primaryButtonHeight,
            borderRadius: 16,
            paddingHorizontal: 20,
            alignItems: "center",
            justifyContent: "center",
            width: block ? "100%" : undefined,
          }}
        >
          {inner}
        </LinearGradient>
      </PressableScale>
    );
  }

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading, ...accessibilityState }}
      disabled={isDisabled}
      scaleTo={isDisabled ? 1 : motion.scale.pressed}
      className={cn(
        "min-h-[52px] items-center justify-center rounded-lg px-5",
        variantClasses[variant],
        block && "w-full",
        isDisabled && "opacity-45",
        className,
      )}
      style={{ minHeight: a11y.primaryButtonHeight }}
      {...props}
    >
      {inner}
    </PressableScale>
  );
}
