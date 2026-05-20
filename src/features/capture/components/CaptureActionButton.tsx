import type { ComponentProps, ReactNode } from "react";
import { View, type PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PressableScale, Text } from "@/components/ui";
import { a11y, motion, useIconColors, useTheme } from "@/theme";
import { cn } from "@/utils/cn";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type CaptureActionVariant = "default" | "emphasis" | "destructive";

export type CaptureActionButtonProps = PressableProps & {
  label: string;
  onPress: () => void;
  variant?: CaptureActionVariant;
  icon?: IconName;
  block?: boolean;
};

const containerClasses: Record<CaptureActionVariant, string> = {
  default: "bg-surface-elevated border border-border",
  emphasis: "bg-accent-soft border border-accent/30",
  destructive: "bg-status-failed-bg border border-status-failed/25",
};

const labelClasses: Record<CaptureActionVariant, string> = {
  default: "text-foreground",
  emphasis: "text-accent",
  destructive: "text-status-failed",
};

export function CaptureActionButton({
  label,
  onPress,
  variant = "default",
  icon,
  disabled,
  block = true,
  className,
  accessibilityLabel,
  ...props
}: CaptureActionButtonProps) {
  const iconColors = useIconColors();
  const { colors } = useTheme();
  const iconColor =
    variant === "destructive"
      ? colors.status.failed.fg
      : variant === "emphasis"
        ? iconColors.accent
        : iconColors.primary;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      scaleTo={disabled ? 1 : motion.scale.pressed}
      className={cn(
        "min-h-[52px] flex-row items-center justify-center gap-2 rounded-xl px-4",
        containerClasses[variant],
        block && "w-full",
        disabled && "opacity-45",
        className,
      )}
      style={{ minHeight: a11y.primaryButtonHeight }}
      {...props}
    >
      {icon ? <Ionicons name={icon} size={20} color={iconColor} /> : null}
      <Text variant="label" align="center" className={labelClasses[variant]}>
        {label}
      </Text>
    </PressableScale>
  );
}

export type CaptureActionsPanelProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function CaptureActionsPanel({ title, children, className }: CaptureActionsPanelProps) {
  return (
    <View
      className={cn(
        "gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-4",
        className,
      )}
    >
      {title ? (
        <Text variant="caption" muted align="start">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
