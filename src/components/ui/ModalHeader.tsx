import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { brandGradients } from "@/theme/gradients";
import { useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

export type ModalHeaderProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
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
      <LinearGradient
        colors={[...brandGradients.hero]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="mx-5 mb-4 overflow-hidden rounded-2xl"
      >
        <View className={cn("flex-row items-center gap-2 px-4 py-4", className)}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("common.back")}
            onPress={onClose}
            className="h-11 w-11 items-center justify-center rounded-full bg-white/20"
          >
            <Ionicons name={closeIcon} size={24} color={iconColors.inverse} />
          </PressableScale>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text variant="titleLg" align="start" className="text-foreground-onAccent">
              {title}
            </Text>
            {subtitle ? (
              <Text variant="caption" align="start" className="text-foreground-onAccent/80">
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </LinearGradient>
    </>
  );
}
