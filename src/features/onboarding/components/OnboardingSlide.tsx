import type { ComponentProps } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FadeInView, Surface, Text } from "@/components/ui";
import { useIconColors } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type OnboardingSlideProps = {
  icon: IconName;
  title: string;
  body: string;
  stepKey: string;
};

export function OnboardingSlide({ icon, title, body, stepKey }: OnboardingSlideProps) {
  const iconColors = useIconColors();

  return (
    <FadeInView key={stepKey} className="flex-1 items-center justify-center px-6">
      <Surface variant="hero" className="w-full max-w-[340px]">
        <View className="h-1 bg-accent" accessibilityElementsHidden />
        <View className="items-center gap-6 bg-accent-soft px-6 py-10">
          <View className="h-20 w-20 items-center justify-center rounded-2xl bg-surface-elevated border border-border-subtle">
            <Ionicons name={icon} size={40} color={iconColors.accent} />
          </View>
          <View className="gap-3">
            <Text variant="titleLg" align="center">
              {title}
            </Text>
            <Text variant="body" muted align="center" className="leading-6">
              {body}
            </Text>
          </View>
        </View>
      </Surface>
    </FadeInView>
  );
}
