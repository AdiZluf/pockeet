import { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, StatusChip, Text } from "@/components/ui";
import { getReceiptWithImages } from "@/db/repositories/receiptRepository";

export default function ReceiptProcessingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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
        {thumbUri ? (
          <Image
            source={{ uri: thumbUri }}
            className="mb-6 h-40 w-32 rounded-md bg-surface-muted"
            resizeMode="cover"
            accessibilityLabel={t("processing.thumbnailLabel")}
          />
        ) : (
          <View className="mb-6 h-40 w-32 items-center justify-center rounded-md bg-surface-muted">
            <ActivityIndicator />
          </View>
        )}

        <StatusChip variant="processing" label={t("status.processing")} />
        <Text variant="titleMd" className="mt-4 text-center">
          {t("processing.title")}
        </Text>
        <Text variant="body" muted className="mt-2 text-center">
          {t("processing.bodyLocal")}
        </Text>
        <ActivityIndicator className="mt-6" accessibilityLabel={t("status.processing")} />
      </View>

      <Button label={t("processing.continueBackground")} variant="text" onPress={goHome} />
    </View>
  );
}
