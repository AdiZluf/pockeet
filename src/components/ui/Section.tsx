import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type SectionProps = ViewProps & {
  title?: string;
  first?: boolean;
};

export function Section({ title, first, className, children, ...props }: SectionProps) {
  return (
    <View className={cn(!first && "mt-6", "gap-3", className)} {...props}>
      {title ? <Text variant="titleMd">{title}</Text> : null}
      {children}
    </View>
  );
}
