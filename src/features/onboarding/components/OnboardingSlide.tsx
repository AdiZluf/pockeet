import type { ComponentProps } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Surface, Text } from "@/components/ui";
import type { OnboardingSlideKey } from "@/theme/gradients";
import { onboardingSlideGradient } from "@/theme/gradients";

import { OnboardingSlideArt } from "./OnboardingSlideArt";

type IconName = ComponentProps<typeof Ionicons>["name"];

const SLIDE_BADGE: Record<OnboardingSlideKey, { icon: IconName; labelKey?: string }> = {
  scan: { icon: "camera-outline" },
  organize: { icon: "sparkles-outline" },
  clarity: { icon: "analytics-outline" },
};

export type OnboardingSlideProps = {
  icon: IconName;
  title: string;
  body: string;
  stepKey: OnboardingSlideKey;
  /** 1-based step index for visual badge */
  stepIndex: number;
  totalSteps: number;
};

export function OnboardingSlide({
  title,
  body,
  stepKey,
  stepIndex,
  totalSteps,
}: OnboardingSlideProps) {
  const gradient = onboardingSlideGradient(stepKey);
  const badge = SLIDE_BADGE[stepKey];

  return (
    <View className="flex-1 justify-center px-5">
      <Surface variant="elevated" className="overflow-hidden border-0 p-0 shadow-raised">
        <LinearGradient
          colors={[...gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.85 }}
          className="w-full"
        >
          <View className="flex-row items-center justify-between px-5 pb-1 pt-5">
            <View className="flex-row items-center gap-2 rounded-full bg-white/20 px-3 py-1.5">
              <Ionicons name={badge.icon} size={16} color="#FFFFFF" />
              <Text variant="caption" className="font-sans-semibold text-white">
                {stepIndex} / {totalSteps}
              </Text>
            </View>
            <View
              className="h-2 w-2 rounded-full bg-white/60"
              accessibilityElementsHidden
            />
          </View>

          <OnboardingSlideArt stepKey={stepKey} />
        </LinearGradient>

        <View className="gap-3 bg-surface-elevated px-6 pb-8 pt-6">
          <Text variant="titleLg" align="start">
            {title}
          </Text>
          <Text variant="bodyLg" muted align="start" className="leading-6">
            {body}
          </Text>
        </View>
      </Surface>
    </View>
  );
}
