import { Pressable, View, type PressableProps } from "react-native";

import { a11y } from "@/theme";
import { cn } from "@/utils/cn";

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
      {leading ? <View className="me-3">{leading}</View> : null}
      <View className="min-w-0 flex-1 gap-0.5">
        {title}
        {subtitle}
      </View>
      {trailing ? <View className="ms-3">{trailing}</View> : null}
    </>
  );

  const rowClass = cn(
    "flex-row items-center px-5",
    compact ? "min-h-[56px] py-3" : "min-h-[64px] py-3",
    className,
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        className={rowClass}
        style={{ minHeight: compact ? a11y.listRowCompactHeight : a11y.listRowHeight }}
        {...props}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      className={rowClass}
      style={{ minHeight: compact ? a11y.listRowCompactHeight : a11y.listRowHeight }}
    >
      {content}
    </View>
  );
}
