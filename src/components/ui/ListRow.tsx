import { View, type PressableProps } from "react-native";

import { a11y } from "@/theme";
import { cn } from "@/utils/cn";

import { PressableScale } from "./PressableScale";

export type ListRowProps = PressableProps & {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  compact?: boolean;
  accessibilityLabel?: string;
};

export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  compact,
  onPress,
  className,
  accessibilityLabel,
  ...props
}: ListRowProps) {
  const content = (
    <>
      {leading ? <View className="me-3.5">{leading}</View> : null}
      <View className="min-w-0 flex-1 gap-0.5">
        {title}
        {subtitle}
      </View>
      {trailing ? <View className="ms-3 shrink-0">{trailing}</View> : null}
    </>
  );

  const rowClass = cn(
    "flex-row items-center px-4",
    compact ? "min-h-[56px] py-3" : "min-h-[68px] py-3.5",
    className,
  );

  if (onPress) {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        className={rowClass}
        style={{ minHeight: compact ? a11y.listRowCompactHeight : a11y.listRowHeight + 4 }}
        {...props}
      >
        {content}
      </PressableScale>
    );
  }

  return (
    <View
      className={rowClass}
      style={{ minHeight: compact ? a11y.listRowCompactHeight : a11y.listRowHeight + 4 }}
    >
      {content}
    </View>
  );
}
