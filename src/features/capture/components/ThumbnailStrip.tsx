import { Image, Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Text } from "@/components/ui";
import { useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

import type { CaptureSessionImage } from "../types";

type ThumbnailStripProps = {
  images: CaptureSessionImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onEdit?: (index: number) => void;
  label?: string;
};

export function ThumbnailStrip({
  images,
  selectedIndex,
  onSelect,
  onEdit,
  label,
}: ThumbnailStripProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  if (images.length === 0) return null;

  return (
    <View className="gap-2 pt-1">
      {label ? (
        <Text variant="caption" muted className="px-5">
          {label}
        </Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-5"
      >
        {images.map((image, index) => {
          const isSelected = selectedIndex === index;
          return (
            <Pressable
              key={image.id}
              accessibilityRole="button"
              accessibilityLabel={t("capture.pageThumbA11y", {
                page: index + 1,
                total: images.length,
              })}
              accessibilityHint={onEdit ? t("capture.editPageHint") : undefined}
              onPress={() => onSelect(index)}
              onLongPress={onEdit ? () => onEdit(index) : undefined}
              className={cn(
                "overflow-hidden rounded-md border-2 bg-surface-elevated",
                isSelected ? "border-accent" : "border-border",
              )}
            >
              <Image source={{ uri: image.uri }} className="h-16 w-12" resizeMode="cover" />
              {onEdit && isSelected ? (
                <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-center gap-0.5 bg-overlay py-0.5">
                  <Ionicons name="crop-outline" size={10} color={iconColors.inverse} />
                  <Text variant="micro" className="text-foreground-inverse">
                    {t("capture.cropShort")}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
