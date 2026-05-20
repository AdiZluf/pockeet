import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, StatusChip, Surface, Text } from "@/components/ui";
import { getReceiptWithImages } from "@/db/repositories/receiptRepository";
import {
  FAKE_PARSE_DELAY_MS,
  runFakeParse,
} from "@/features/parse/services/fakeParseReceipt";
import { useIconColors } from "@/theme";

const POLL_MS = 400;
const SUCCESS_NAV_DELAY_MS = 300;

type ParsePhase = "analyzing" | "complete";

export default function ReceiptProcessingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const [thumbUri, setThumbUri] = useState<string | null>(null);
  const [phase, setPhase] = useState<ParsePhase>("analyzing");
  const [canReview, setCanReview] = useState(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (!id) return;

    void runFakeParse(id);

    const poll = setInterval(() => {
      void (async () => {
        const receipt = await getReceiptWithImages(id);
        setThumbUri(receipt?.images[0]?.localUri ?? null);

        if (receipt?.status === "needs_review") {
          setPhase("complete");
          setCanReview(true);
          if (!navigatedRef.current) {
            navigatedRef.current = true;
            setTimeout(() => {
              router.replace({
                pathname: "/receipt/[id]/review",
                params: { id, source: "scan" },
              });
            }, SUCCESS_NAV_DELAY_MS);
          }
        }
      })();
    }, POLL_MS);

    const fallback = setTimeout(() => {
      void (async () => {
        const receipt = await getReceiptWithImages(id);
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
  }, [id, router]);

  const goHome = () => {
    router.replace("/(tabs)");
  };

  const openReview = () => {
    if (!id) return;
    router.push({ pathname: "/receipt/[id]/review", params: { id, source: "scan" } });
  };

  const statusLabel =
    phase === "complete" ? t("status.needs_review") : t("status.processing");
  const statusVariant = phase === "complete" ? "review" : "processing";

  return (
    <View
      className="flex-1 bg-background px-5"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }}
      accessibilityLabel={t("processing.screenLabel")}
    >
      <View
        className="flex-1 items-center justify-center"
        accessibilityLiveRegion="polite"
        accessibilityLabel={phase === "complete" ? t("processing.completeA11y") : t("processing.analyzingA11y")}
      >
        <Surface variant="hero" className="w-full max-w-[320px] overflow-hidden">
          <View
            className={`h-1 ${phase === "complete" ? "bg-status-ready" : "bg-accent"}`}
            accessibilityElementsHidden
          />
          <View className="items-center gap-4 px-6 py-8">
            {thumbUri ? (
              <Image
                source={{ uri: thumbUri }}
                className="h-44 w-36 rounded-xl bg-surface-muted"
                resizeMode="cover"
                accessibilityLabel={t("processing.thumbnailLabel")}
              />
            ) : (
              <View className="h-44 w-36 items-center justify-center rounded-xl bg-accent-soft">
                <ActivityIndicator color={iconColors.accent} />
              </View>
            )}

            <StatusChip variant={statusVariant} label={statusLabel} />
            <Text variant="titleLg" className="text-center">
              {phase === "complete" ? t("processing.completeTitle") : t("processing.title")}
            </Text>
            <Text variant="body" muted className="text-center leading-6">
              {phase === "complete" ? t("processing.completeBody") : t("processing.analyzingBody")}
            </Text>
            {phase === "analyzing" ? (
              <ActivityIndicator color={iconColors.accent} accessibilityLabel={t("processing.analyzingA11y")} />
            ) : null}
          </View>
        </Surface>
      </View>

      <View className="gap-3">
        <Button
          label={t("processing.reviewNow")}
          onPress={openReview}
          disabled={!id || !canReview}
        />
        <Button label={t("processing.continueBackground")} variant="text" onPress={goHome} />
      </View>
    </View>
  );
}
