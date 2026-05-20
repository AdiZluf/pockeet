import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { PressableScale, Sheet, Text } from "@/components/ui";
import { useIconColors } from "@/theme";

type AddReceiptOption = {
  id: "camera" | "gallery" | "pdf";
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: string;
  bodyKey: string;
  onPress: () => void;
  loading?: boolean;
};

type AddReceiptSheetProps = {
  visible: boolean;
  onClose: () => void;
  onDismissed?: () => void;
  onTakePhoto: () => void;
  onChooseGallery: () => void;
  onUploadPdf: () => void;
  pdfLoading?: boolean;
};

export function AddReceiptSheet({
  visible,
  onClose,
  onDismissed,
  onTakePhoto,
  onChooseGallery,
  onUploadPdf,
  pdfLoading = false,
}: AddReceiptSheetProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  const options: AddReceiptOption[] = [
    {
      id: "camera",
      icon: "camera-outline",
      titleKey: "addReceipt.takePhoto",
      bodyKey: "addReceipt.takePhotoBody",
      onPress: () => void onTakePhoto(),
    },
    {
      id: "gallery",
      icon: "images-outline",
      titleKey: "addReceipt.chooseGallery",
      bodyKey: "addReceipt.chooseGalleryBody",
      onPress: () => void onChooseGallery(),
    },
    {
      id: "pdf",
      icon: "document-text-outline",
      titleKey: "addReceipt.uploadPdf",
      bodyKey: "addReceipt.uploadPdfBody",
      onPress: () => void onUploadPdf(),
      loading: pdfLoading,
    },
  ];

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      onDismissed={onDismissed}
      scrimAccessibilityLabel={t("common.closeSheet")}
      title={t("addReceipt.title")}
    >
      <View className="gap-2 pb-2">
        <Text variant="body" muted align="start" className="pb-2 leading-6">
          {t("addReceipt.subtitle")}
        </Text>
        {options.map((option) => (
          <PressableScale
            key={option.id}
            accessibilityRole="button"
            accessibilityLabel={t("addReceipt.optionA11y", {
              title: t(option.titleKey),
              body: t(option.bodyKey),
            })}
            onPress={option.onPress}
            disabled={option.loading}
            className="min-h-[72px] flex-row items-center gap-4 rounded-lg bg-surface-muted px-4 py-3.5"
          >
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-accent-soft">
              {option.loading ? (
                <ActivityIndicator size="small" color={iconColors.accent} />
              ) : (
                <Ionicons name={option.icon} size={24} color={iconColors.accent} />
              )}
            </View>
            <View className="min-w-0 flex-1 gap-0.5">
              <Text variant="bodyLg" align="start">
                {t(option.titleKey)}
              </Text>
              <Text variant="caption" muted align="start" className="leading-5">
                {t(option.bodyKey)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={iconColors.secondary} />
          </PressableScale>
        ))}
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("common.cancel")}
          onPress={onClose}
          className="mt-2 min-h-[48px] items-center justify-center rounded-lg"
        >
          <Text variant="label" muted>
            {t("common.cancel")}
          </Text>
        </PressableScale>
      </View>
    </Sheet>
  );
}
