import { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, StatusChip, Surface, Text } from "@/components/ui";
import { useIconColors } from "@/theme";
import { getReceiptWithImages } from "@/db/repositories/receiptRepository";

export default function ReceiptProcessingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const [thumbUri, setThumbUri] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const receipt = await getReceiptWithImages(id);
      setThumbUri(receipt?.images[0]?.localUri ?? null);
    })();
  }, [id]);

  const goHome = () => {
    router.replace("/(tabs)");
  };

  return (
    <View
      className="flex-1 bg-background px-5"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }}
      accessibilityLabel={t("processing.screenLabel")}
    >
      <View className="flex-1 items-center justify-center">
        <Surface variant="hero" className="w-full max-w-[320px] overflow-hidden">
          <View className="h-1 bg-accent" accessibilityElementsHidden />
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

            <StatusChip variant="processing" label={t("status.processing")} />
            <Text variant="titleLg" className="text-center">
              {t("processing.title")}
            </Text>
            <Text variant="body" muted className="text-center leading-6">
              {t("processing.bodyLocal")}
            </Text>
          </View>
        </Surface>
      </View>

      <View className="gap-3">
        <Button
          label={t("processing.reviewNow")}
          onPress={() => id && router.push({ pathname: "/receipt/[id]/review", params: { id, source: "scan" } })}
          disabled={!id}
        />
        <Button label={t("processing.continueBackground")} variant="text" onPress={goHome} />
      </View>
    </View>
  );
}
