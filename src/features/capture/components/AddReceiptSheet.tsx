import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { GradientIconWell, PressableScale, Sheet, Surface, Text } from "@/components/ui";
import { useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

type AddReceiptOption = {
  id: "camera" | "gallery" | "pdf";
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: string;
  bodyKey: string;
  onPress: () => void;
  loading?: boolean;
  recommended?: boolean;
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
      recommended: true,
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
      <View className="gap-3 pb-4">
        <Text variant="body" muted align="start" className="leading-6">
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
          >
            <Surface
              variant="elevated"
              className={cn(
                "min-h-[80px] flex-row items-center gap-4 p-4",
                option.recommended && "border-2 border-accent",
              )}
            >
              {option.loading ? (
                <View className="h-14 w-14 items-center justify-center">
                  <ActivityIndicator size="small" color={iconColors.accent} />
                </View>
              ) : (
                <GradientIconWell name={option.icon} size={56} iconSize={26} />
              )}
              <View className="min-w-0 flex-1 gap-0.5">
                <Text variant="titleMd" align="start">
                  {t(option.titleKey)}
                </Text>
                <Text variant="caption" muted align="start" className="leading-5">
                  {t(option.bodyKey)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={iconColors.secondary} />
            </Surface>
          </PressableScale>
        ))}
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("common.cancel")}
          onPress={onClose}
          className="mt-2 min-h-[48px] items-center justify-center"
        >
          <Text variant="label" className="text-accent">
            {t("common.cancel")}
          </Text>
        </PressableScale>
      </View>
    </Sheet>
  );
}
