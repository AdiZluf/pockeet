import { useState } from "react";
import { Alert, Image, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Text } from "@/components/ui";
import { useIconColors } from "@/theme";

import { MAX_RECEIPT_PAGES } from "../constants";
import { useDefaultCurrency } from "../hooks/useDefaultCurrency";
import { saveReceiptLocally } from "../services/saveReceiptLocally";
import { useCaptureSessionStore } from "../stores/captureSessionStore";
import { CaptureActionButton, CaptureActionsPanel } from "./CaptureActionButton";
import { ThumbnailStrip } from "./ThumbnailStrip";

export function CapturePreviewView() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const currencyCode = useDefaultCurrency();
  const [isSaving, setIsSaving] = useState(false);

  const images = useCaptureSessionStore((s) => s.images);
  const selectedIndex = useCaptureSessionStore((s) => s.selectedIndex);
  const selectImage = useCaptureSessionStore((s) => s.selectImage);
  const removeImage = useCaptureSessionStore((s) => s.removeImage);
  const reset = useCaptureSessionStore((s) => s.reset);

  const selected = images[selectedIndex];
  const canAddPage = images.length < MAX_RECEIPT_PAGES;

  const handleBack = () => {
    router.back();
  };

  const openCrop = (index = selectedIndex) => {
    const target = images[index];
    if (!target) return;
    router.push({ pathname: "/capture/crop", params: { imageId: target.id } });
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
          className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated border border-border"
        >
          <Ionicons name="chevron-back" size={24} color={iconColors.primary} />
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
        onEdit={openCrop}
        label={t("capture.filmstripLabel")}
      />

      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel={t("capture.previewImage", { page: selectedIndex + 1 })}
        accessibilityHint={t("capture.editPageHint")}
        onPress={() => openCrop()}
        className="mx-5 mt-3 min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-surface-muted"
      >
        {selected ? (
          <>
            <Image
              source={{ uri: selected.uri }}
              className="h-full w-full"
              resizeMode="contain"
            />
            <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-center gap-2 bg-overlay px-4 py-3">
              <Ionicons name="crop-outline" size={18} color={iconColors.inverse} />
              <Text variant="label" className="text-foreground-inverse">
                {t("capture.editImage")}
              </Text>
            </View>
          </>
        ) : null}
      </Pressable>

      <View className="shrink-0 gap-4 px-5 pt-4">
        <CaptureActionsPanel title={t("capture.pageActionsTitle")}>
          <View className="flex-row gap-3">
            <CaptureActionButton
              variant="default"
              icon="crop-outline"
              label={t("capture.editImage")}
              onPress={() => openCrop()}
              block={false}
              className="flex-1"
            />
            <CaptureActionButton
              variant="destructive"
              icon="trash-outline"
              label={t("capture.removePage")}
              onPress={handleDeletePage}
              block={false}
              className="flex-1"
            />
          </View>
          <CaptureActionButton
            variant="emphasis"
            icon="add-circle-outline"
            label={t("capture.addPage")}
            onPress={handleBack}
            disabled={!canAddPage}
            accessibilityLabel={
              canAddPage
                ? t("capture.addPage")
                : t("capture.addPageDisabledA11y", { max: MAX_RECEIPT_PAGES })
            }
          />
        </CaptureActionsPanel>

        <View
          className="gap-2 border-t border-border-subtle pt-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Button
            label={isSaving ? t("capture.saving") : t("capture.saveAndAnalyze")}
            onPress={() => void handleSave()}
            loading={isSaving}
            disabled={isSaving}
          />
          <Text variant="caption" muted align="center">
            {t("capture.savedLocallyHint")}
          </Text>
        </View>
      </View>
    </View>
  );
}
