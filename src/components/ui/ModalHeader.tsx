import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";
import { useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

export type ModalHeaderProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  /** Sheet-style modals use chevron-down; default for dismiss affordance. */
  closeIcon?: "chevron-down" | "chevron-back";
  className?: string;
};

export function ModalHeader({
  title,
  subtitle,
  onClose,
  closeIcon = "chevron-down",
  className,
}: ModalHeaderProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <>
      <View className="items-center pb-1 pt-2">
        <View className="h-1 w-10 rounded-full bg-border" accessibilityElementsHidden />
      </View>
      <View className={cn("flex-row items-center gap-2 px-5 pb-4", className)}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          onPress={onClose}
          className="h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-elevated"
        >
          <Ionicons name={closeIcon} size={24} color={iconColors.primary} />
        </PressableScale>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text variant="titleLg" align="start">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" muted align="start">
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </>
  );
}
