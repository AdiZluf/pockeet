import type { ComponentProps } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { FadeInView, GradientIconWell, Text } from "@/components/ui";
import type { OnboardingSlideKey } from "@/theme/gradients";
import { onboardingSlideGradient } from "@/theme/gradients";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type OnboardingSlideProps = {
  icon: IconName;
  title: string;
  body: string;
  stepKey: OnboardingSlideKey;
};

export function OnboardingSlide({ icon, title, body, stepKey }: OnboardingSlideProps) {
  const colors = onboardingSlideGradient(stepKey);

  return (
    <FadeInView key={stepKey} className="flex-1">
      <LinearGradient
        colors={[...colors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <View
          className="flex-1 items-center justify-end px-6 pb-8"
          style={{ minHeight: "40%" }}
        >
          <GradientIconWell name={icon} size={96} iconSize={44} />
        </View>
        <View className="gap-3 px-6 pb-4">
          <Text variant="titleLg" align="center" className="text-foreground-onAccent">
            {title}
          </Text>
          <Text variant="bodyLg" align="center" className="text-foreground-onAccent/90 leading-6">
            {body}
          </Text>
        </View>
      </LinearGradient>
    </FadeInView>
  );
}
