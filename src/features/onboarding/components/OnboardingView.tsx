import { useMemo, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Text } from "@/components/ui";

import { markOnboardingCompleted } from "../services/onboardingGate";
import { OnboardingSlide } from "./OnboardingSlide";

const SLIDE_KEYS = ["scan", "organize", "clarity"] as const;

export function OnboardingView() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);

  const slides = useMemo(
    () =>
      SLIDE_KEYS.map((key) => ({
        key,
        icon:
          key === "scan"
            ? ("scan-outline" as const)
            : key === "organize"
              ? ("sparkles-outline" as const)
              : ("pie-chart-outline" as const),
        title: t(`onboarding.slides.${key}.title`),
        body: t(`onboarding.slides.${key}.body`),
      })),
    [t],
  );

  const isLast = step >= slides.length - 1;

  const goToLogin = async () => {
    await markOnboardingCompleted();
    router.replace("/(auth)/login");
  };

  const handleNext = () => {
    if (isLast) {
      void goToLogin();
      return;
    }
    setStep((s) => s + 1);
  };

  const current = slides[step];

  return (
    <View
      className="flex-1 bg-background"
      accessibilityLabel={t("onboarding.screenLabel")}
    >
      <View
        className="flex-row items-center justify-end px-5"
        style={{ paddingTop: insets.top + 8, minHeight: insets.top + 48 }}
      >
        {!isLast ? (
          <Button
            variant="text"
            label={t("onboarding.skip")}
            onPress={() => void goToLogin()}
            block={false}
            className="min-h-[44px] px-2"
          />
        ) : (
          <View className="h-11" />
        )}
      </View>

      <View className="min-h-0 flex-1">
        <OnboardingSlide
          stepKey={current.key}
          icon={current.icon}
          title={current.title}
          body={current.body}
        />
      </View>

      <View className="gap-6 px-5" style={{ paddingBottom: insets.bottom + 24 }}>
        <View
          className="flex-row items-center justify-center gap-2"
          accessibilityRole="tablist"
          accessibilityLabel={t("onboarding.progressA11y", {
            current: step + 1,
            total: slides.length,
          })}
        >
          {slides.map((slide, index) => (
            <View
              key={slide.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: index === step }}
              className={`h-2 rounded-full ${
                index === step ? "w-6 bg-accent" : "w-2 bg-border"
              }`}
            />
          ))}
        </View>

        <Button
          label={isLast ? t("onboarding.getStarted") : t("onboarding.next")}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
