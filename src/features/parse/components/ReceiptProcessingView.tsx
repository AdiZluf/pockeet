import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import {
  Button,
  CanvasBackground,
  FadeInView,
  HeroSurface,
  ReceiptAttachmentPreview,
  StatusChip,
  Text,
} from "@/components/ui";
import { isPdfUri } from "@/utils/receiptMedia";
import { getReceiptWithImages } from "@/db/repositories/receiptRepository";
import {
  FAKE_PARSE_DELAY_MS,
  runFakeParse,
} from "@/features/parse/services/fakeParseReceipt";
import { motion, useIconColors, useReducedMotion } from "@/theme";

const POLL_MS = 400;
const SUCCESS_NAV_DELAY_MS = 800;
const STAGE_STEP_MS = Math.floor(FAKE_PARSE_DELAY_MS / 3);

const STAGE_KEYS = ["stepReading", "stepExtracting", "stepOrganizing"] as const;

type ParsePhase = "analyzing" | "complete";

type ReceiptProcessingViewProps = {
  receiptId: string;
};

export function ReceiptProcessingView({ receiptId }: ReceiptProcessingViewProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const reduceMotion = useReducedMotion();
  const [thumbUri, setThumbUri] = useState<string | null>(null);
  const [phase, setPhase] = useState<ParsePhase>("analyzing");
  const [stageIndex, setStageIndex] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const navigatedRef = useRef(false);

  const progress = useSharedValue(0);
  const thumbScale = useSharedValue(reduceMotion ? 1 : 0.94);
  const successScale = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }
    progress.value = withTiming(1, {
      duration: FAKE_PARSE_DELAY_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, reduceMotion]);

  useEffect(() => {
    if (phase !== "analyzing") return;
    const timer = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGE_KEYS.length - 1));
    }, STAGE_STEP_MS);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (!thumbUri || reduceMotion) return;
    thumbScale.value = withTiming(1, { duration: motion.duration.slow });
  }, [reduceMotion, thumbScale, thumbUri]);

  useEffect(() => {
    void runFakeParse(receiptId);

    const poll = setInterval(() => {
      void (async () => {
        const receipt = await getReceiptWithImages(receiptId);
        setThumbUri(receipt?.images[0]?.localUri ?? null);

        if (receipt?.status === "needs_review") {
          setPhase("complete");
          setCanReview(true);
          progress.value = withTiming(1, { duration: motion.duration.fast });

          if (!reduceMotion) {
            successScale.value = withSequence(
              withTiming(1.12, { duration: motion.duration.fast }),
              withTiming(1, { duration: motion.duration.normal }),
            );
          } else {
            successScale.value = 1;
          }

          if (!reduceMotion) {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }

          if (!navigatedRef.current) {
            navigatedRef.current = true;
            setTimeout(() => {
              router.replace({
                pathname: "/receipt/[id]/review",
                params: { id: receiptId, source: "scan" },
              });
            }, SUCCESS_NAV_DELAY_MS);
          }
        }
      })();
    }, POLL_MS);

    const fallback = setTimeout(() => {
      void (async () => {
        const receipt = await getReceiptWithImages(receiptId);
        if (receipt?.status === "needs_review") {
          setPhase("complete");
          setCanReview(true);
        }
      })();
    }, FAKE_PARSE_DELAY_MS + POLL_MS);

    return () => {
      clearInterval(poll);
      clearTimeout(fallback);
    };
  }, [progress, receiptId, reduceMotion, router, successScale]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progress.value, 1) * 100}%`,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: thumbScale.value }],
  }));

  const successIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }));

  const goHome = () => {
    router.replace("/(tabs)");
  };

  const openReview = () => {
    router.replace({
      pathname: "/receipt/[id]/review",
      params: { id: receiptId, source: "scan" },
    });
  };

  const statusLabel =
    phase === "complete" ? t("status.needs_review") : t("status.processing");
  const statusVariant = phase === "complete" ? "review" : "processing";
  const stageKey = phase === "complete" ? "stepReady" : STAGE_KEYS[stageIndex];

  return (
    <CanvasBackground
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }}
      accessibilityLabel={t("processing.screenLabel")}
    >
      <FadeInView className="flex-1 items-center justify-center px-5 pb-6" delay={0}>
        <View
          className="w-full max-w-[340px] items-center"
          accessibilityLiveRegion="polite"
          accessibilityLabel={
            phase === "complete" ? t("processing.completeA11y") : t("processing.analyzingA11y")
          }
        >
          <HeroSurface className="w-full overflow-hidden">
            <View className="h-1.5 overflow-hidden bg-white/20" accessibilityElementsHidden>
              <Animated.View
                className={`h-full ${phase === "complete" ? "bg-status-ready" : "bg-white"}`}
                style={[progressStyle, phase !== "complete" && { shadowOpacity: 0.4 }]}
              />
            </View>

            <View className="items-center gap-5 px-6 py-9">
              <Animated.View style={thumbStyle} className="relative">
                {thumbUri && isPdfUri(thumbUri) ? (
                  <View className="w-[148px] overflow-hidden rounded-2xl border-2 border-white/30">
                    <ReceiptAttachmentPreview
                      uri={thumbUri}
                      variant="processing"
                      accessibilityLabel={t("processing.pdfThumbnailLabel")}
                    />
                  </View>
                ) : thumbUri ? (
                  <View className="overflow-hidden rounded-2xl border-2 border-white/30">
                    <Image
                      source={{ uri: thumbUri }}
                      style={{ width: 148, height: 196 }}
                      contentFit="cover"
                      transition={200}
                      accessibilityLabel={t("processing.thumbnailLabel")}
                    />
                  </View>
                ) : (
                  <View className="h-[196px] w-[148px] items-center justify-center rounded-2xl bg-white/15">
                    <Ionicons name="document-text-outline" size={40} color={iconColors.inverse} />
                  </View>
                )}
                {phase === "complete" ? (
                  <Animated.View
                    style={successIconStyle}
                    className="absolute -bottom-2 -end-2 rounded-full bg-surface p-1 shadow-card"
                    accessibilityElementsHidden
                  >
                    <Ionicons name="checkmark-circle" size={32} color={iconColors.accent} />
                  </Animated.View>
                ) : null}
              </Animated.View>

              <View className="items-center gap-2">
                <StatusChip variant={statusVariant} label={statusLabel} />
                <Text variant="titleLg" align="center" className="text-foreground-onAccent">
                  {phase === "complete" ? t("processing.completeTitle") : t("processing.title")}
                </Text>
                <Text variant="body" align="center" className="text-foreground-onAccent/85 leading-6">
                  {phase === "complete"
                    ? t("processing.completeBody")
                    : t(`processing.${stageKey}`)}
                </Text>
                {phase === "complete" && canReview ? (
                  <Text variant="caption" align="center" className="text-foreground-onAccent/70">
                    {t("processing.openingReview")}
                  </Text>
                ) : null}
              </View>
            </View>
          </HeroSurface>
        </View>
      </FadeInView>

      <FadeInView className="gap-3 px-5" delay={motion.duration.normal}>
        <Button
          label={t("processing.reviewNow")}
          onPress={openReview}
          disabled={!canReview}
        />
        <Button
          label={t("processing.continueBackground")}
          variant="text"
          onPress={goHome}
        />
      </FadeInView>
    </CanvasBackground>
  );
}
