import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, CanvasBackground, Text } from "@/components/ui";
import type { OnboardingSlideKey } from "@/theme/gradients";

import { markOnboardingCompleted } from "../services/onboardingGate";
import { OnboardingSlide } from "./OnboardingSlide";

const SLIDE_KEYS: OnboardingSlideKey[] = ["scan", "organize", "clarity"];

type SlideItem = {
  key: OnboardingSlideKey;
  icon: "scan-outline" | "sparkles-outline" | "pie-chart-outline";
  title: string;
  body: string;
};

export function OnboardingView() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: pageWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<SlideItem>>(null);
  const [step, setStep] = useState(0);

  const slides = useMemo<SlideItem[]>(
    () =>
      SLIDE_KEYS.map((key) => ({
        key,
        icon:
          key === "scan"
            ? "scan-outline"
            : key === "organize"
              ? "sparkles-outline"
              : "pie-chart-outline",
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

  const scrollToStep = useCallback(
    (index: number, animated = true) => {
      const clamped = Math.max(0, Math.min(index, slides.length - 1));
      listRef.current?.scrollToOffset({
        offset: pageWidth * clamped,
        animated,
      });
      setStep(clamped);
    },
    [pageWidth, slides.length],
  );

  const handleNext = () => {
    if (isLast) {
      void goToLogin();
      return;
    }
    scrollToStep(step + 1);
  };

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
      if (index !== step && index >= 0 && index < slides.length) {
        setStep(index);
      }
    },
    [pageWidth, slides.length, step],
  );

  const renderSlide = useCallback(
    ({ item, index }: { item: SlideItem; index: number }) => (
      <View style={{ width: pageWidth }} className="flex-1">
        <OnboardingSlide
          stepKey={item.key}
          icon={item.icon}
          title={item.title}
          body={item.body}
          stepIndex={index + 1}
          totalSteps={slides.length}
        />
      </View>
    ),
    [pageWidth, slides.length],
  );

  return (
    <CanvasBackground accessibilityLabel={t("onboarding.screenLabel")}>
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

      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.key}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, index) => ({
          length: pageWidth,
          offset: pageWidth * index,
          index,
        })}
        style={{ flex: 1 }}
        accessibilityLabel={t("onboarding.swipeHint")}
      />

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
              className={
                index === step ? "h-2.5 w-8 rounded-full bg-accent" : "h-2 w-2 rounded-full bg-border"
              }
            />
          ))}
        </View>

        <Button
          label={isLast ? t("onboarding.getStarted") : t("onboarding.next")}
          onPress={handleNext}
        />
        <Text variant="caption" muted align="center">
          {t("onboarding.swipeHint")}
        </Text>
      </View>
    </CanvasBackground>
  );
}
