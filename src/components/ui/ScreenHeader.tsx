import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type ScreenHeaderProps = ViewProps & {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  large?: boolean;
};

export function ScreenHeader({
  title,
  subtitle,
  trailing,
  large = true,
  className,
  ...props
}: ScreenHeaderProps) {
  return (
    <View className={cn("flex-row items-start justify-between gap-4 px-5 pb-1 pt-2", className)} {...props}>
      <View className="min-w-0 flex-1 gap-1">
        <Text variant={large ? "displayLg" : "titleLg"} align="start" className="tracking-tight">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body" muted align="start">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ? <View className="pt-1">{trailing}</View> : null}
    </View>
  );
}
