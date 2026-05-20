import { ActivityIndicator, type PressableProps } from "react-native";

import { a11y, motion, useIconColors } from "@/theme";
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

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent shadow-card",
  secondary: "bg-surface-elevated border border-border-subtle",
  destructive: "bg-transparent",
  text: "bg-transparent",
};

const labelClasses: Record<ButtonVariant, string> = {
  primary: "text-foreground-inverse",
  secondary: "text-accent",
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

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading, ...accessibilityState }}
      disabled={isDisabled}
      scaleTo={isDisabled ? 1 : motion.scale.pressed}
      className={cn(
        "min-h-[52px] items-center justify-center rounded-xl px-5",
        variantClasses[variant],
        block && "w-full",
        isDisabled && "opacity-45",
        className,
      )}
      style={{ minHeight: a11y.primaryButtonHeight }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? iconColors.inverse : iconColors.accent}
        />
      ) : (
        <Text variant="label" className={labelClasses[variant]}>
          {label}
        </Text>
      )}
    </PressableScale>
  );
}
