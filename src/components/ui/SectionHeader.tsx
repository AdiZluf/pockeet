import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type SectionHeaderProps = ViewProps & {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
};

/** Editorial section title — sentence case, RTL-safe alignment. */
export function SectionHeader({
  title,
  subtitle,
  trailing,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <View
      className={cn("flex-row items-end justify-between gap-3 px-5", className)}
      {...props}
    >
      <View className="min-w-0 flex-1 gap-0.5">
        <Text variant="titleMd" align="start">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" muted align="start">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}
