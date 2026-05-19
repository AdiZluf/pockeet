import { useState } from "react";
import { Alert, I18nManager, Image, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Button, Text } from "@/components/ui";

import { MAX_RECEIPT_PAGES } from "../constants";
import { useDefaultCurrency } from "../hooks/useDefaultCurrency";
import { saveReceiptLocally } from "../services/saveReceiptLocally";
import { useCaptureSessionStore } from "../stores/captureSessionStore";
import { ThumbnailStrip } from "./ThumbnailStrip";

export function CapturePreviewView() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const currencyCode = useDefaultCurrency();
  const [isSaving, setIsSaving] = useState(false);

  const images = useCaptureSessionStore((s) => s.images);
  const selectedIndex = useCaptureSessionStore((s) => s.selectedIndex);
  const selectImage = useCaptureSessionStore((s) => s.selectImage);
  const removeImage = useCaptureSessionStore((s) => s.removeImage);
  const reset = useCaptureSessionStore((s) => s.reset);

  const selected = images[selectedIndex];

  const handleBack = () => {
    router.back();
  };

  const handleDeletePage = () => {
    if (!selected) return;
    if (images.length === 1) {
      Alert.alert(t("capture.lastPageTitle"), t("capture.lastPageBody"));
      return;
    }
    removeImage(selected.id);
  };

  const handleSave = async () => {
    if (images.length === 0 || isSaving) return;
    try {
      setIsSaving(true);
      const receiptId = await saveReceiptLocally(images, currencyCode);
      reset();
      router.replace(`/receipt/${receiptId}/processing`);
    } catch {
      Alert.alert(t("capture.saveFailedTitle"), t("capture.saveFailedBody"));
    } finally {
      setIsSaving(false);
    }
  };

  if (images.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-5">
        <Text variant="body" muted>
          {t("capture.noPages")}
        </Text>
        <Button className="mt-4" label={t("capture.backToCamera")} onPress={handleBack} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("capture.back")}
          onPress={handleBack}
          hitSlop={12}
          className="h-11 w-11 items-center justify-center"
        >
          <Ionicons
            name={I18nManager.isRTL ? "chevron-forward" : "chevron-back"}
            size={28}
            color="#1C1917"
          />
        </Pressable>
        <Text variant="label">
          {t("capture.pageCount", { count: images.length, max: MAX_RECEIPT_PAGES })}
        </Text>
        <View className="w-11" />
      </View>

      <ThumbnailStrip
        images={images}
        selectedIndex={selectedIndex}
        onSelect={selectImage}
        label={t("capture.filmstripLabel")}
      />

      <View className="mx-5 mt-4 flex-1 overflow-hidden rounded-lg bg-surface-muted">
        {selected ? (
          <Image
            source={{ uri: selected.uri }}
            className="h-full w-full"
            resizeMode="contain"
            accessibilityLabel={t("capture.previewImage", {
              page: selectedIndex + 1,
            })}
          />
        ) : null}
      </View>

      <View className="flex-row gap-3 px-5 py-4">
        <Button
          variant="secondary"
          label={t("capture.addPage")}
          onPress={handleBack}
          block={false}
          className="flex-1"
        />
        <Button
          variant="secondary"
          label={t("capture.removePage")}
          onPress={handleDeletePage}
          block={false}
          className="flex-1"
        />
      </View>

      <View className="px-5" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          label={isSaving ? t("capture.saving") : t("capture.saveAndAnalyze")}
          onPress={() => void handleSave()}
          loading={isSaving}
          disabled={isSaving}
        />
        <Text variant="caption" muted className="mt-2 text-center">
          {t("capture.savedLocallyHint")}
        </Text>
      </View>
    </View>
  );
}
