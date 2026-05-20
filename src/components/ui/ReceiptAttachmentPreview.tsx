import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { isPdfUri, receiptMediaFileName } from "@/utils/receiptMedia";
import { useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

import { ReceiptHeroImage, type ReceiptHeroImageProps } from "./ReceiptHeroImage";
import { Surface } from "./Surface";
import { Text } from "./Text";

export type ReceiptAttachmentPreviewProps = {
  uri: string;
  accessibilityLabel: string;
  variant?: "hero" | "compact" | "processing";
  maxHeight?: number;
  className?: string;
  imageProps?: ReceiptHeroImageProps["imageProps"];
};

export function ReceiptAttachmentPreview({
  uri,
  accessibilityLabel,
  variant = "hero",
  maxHeight = 320,
  className,
  imageProps,
}: ReceiptAttachmentPreviewProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  if (!isPdfUri(uri)) {
    if (variant === "hero") {
      return (
        <ReceiptHeroImage
          uri={uri}
          accessibilityLabel={accessibilityLabel}
          maxHeight={maxHeight}
          className={className}
          imageProps={imageProps}
        />
      );
    }
    return null;
  }

  const fileName = receiptMediaFileName(uri);
  const isCompact = variant === "compact";
  const isProcessing = variant === "processing";

  return (
    <Surface
      variant={isProcessing ? "hero" : "panel"}
      className={cn("overflow-hidden", className)}
    >
      {!isProcessing ? <View className="h-1 bg-accent" accessibilityElementsHidden /> : null}
      <View
        className={cn(
          "items-center justify-center gap-3 bg-accent-soft",
          isCompact ? "px-4 py-5" : isProcessing ? "px-6 py-8" : "px-6 py-10",
        )}
        style={isProcessing ? { minHeight: 196 } : undefined}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
      >
        <View
          className={cn(
            "items-center justify-center rounded-2xl border border-border-subtle bg-surface-elevated",
            isCompact ? "h-14 w-14" : "h-20 w-20",
          )}
        >
          <Ionicons
            name="document-text-outline"
            size={isCompact ? 28 : 40}
            color={iconColors.accent}
          />
        </View>
        <View className="items-center gap-1 px-4">
          <Text variant={isCompact ? "label" : "titleMd"} align="center">
            {t("receiptDetail.pdfAttachment")}
          </Text>
          <Text variant="caption" muted align="center" numberOfLines={2}>
            {fileName}
          </Text>
          {!isCompact && !isProcessing ? (
            <Text variant="caption" muted align="center" className="mt-1 leading-5">
              {t("receiptDetail.pdfAttachmentHint")}
            </Text>
          ) : null}
        </View>
      </View>
    </Surface>
  );
}
