import { ActivityIndicator, Pressable, type PressableProps } from "react-native";

import { a11y } from "@/theme";
import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type ButtonVariant = "primary" | "secondary" | "destructive" | "text";

export type ButtonProps = PressableProps & {
  variant?: ButtonVariant;
  label: string;
  loading?: boolean;
  block?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent",
  secondary: "bg-surface-muted border border-border",
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
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading, ...accessibilityState }}
      disabled={isDisabled}
      className={cn(
        "min-h-[52px] items-center justify-center rounded-lg px-4",
        variantClasses[variant],
        block && "w-full",
        isDisabled && "opacity-45",
        className,
      )}
      style={{ minHeight: a11y.primaryButtonHeight }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFCF9" : "#1F6F78"} />
      ) : (
        <Text variant="label" className={labelClasses[variant]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
