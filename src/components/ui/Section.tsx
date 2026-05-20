import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type SectionProps = ViewProps & {
  title?: string;
  subtitle?: string;
  first?: boolean;
};

export function Section({ title, subtitle, first, className, children, ...props }: SectionProps) {
  return (
    <View className={cn(!first && "mt-2", "gap-3", className)} {...props}>
      {title ? (
        <View className="gap-0.5">
          <Text variant="micro" muted className="uppercase tracking-wide">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" muted>
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}
