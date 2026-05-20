import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

import { Text } from "./Text";

export type SectionEyebrowProps = ViewProps & {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
};

/** Section title with accent dot — sentence case, not uppercase micro. */
export function SectionEyebrow({
  title,
  subtitle,
  trailing,
  className,
  ...props
}: SectionEyebrowProps) {
  return (
    <View className={cn("flex-row items-end justify-between gap-3 px-5", className)} {...props}>
      <View className="min-w-0 flex-1 flex-row items-start gap-2.5">
        <View className="mt-2 h-2 w-2 rounded-full bg-accent" accessibilityElementsHidden />
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
      </View>
      {trailing}
    </View>
  );
}
