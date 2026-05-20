import type { ComponentProps } from "react";
import { View, type PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { PressableScale, Text } from "@/components/ui";
import { a11y, motion, useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type AuthProviderButtonProps = PressableProps & {
  icon: IconName;
  label: string;
  comingSoon?: boolean;
};

export function AuthProviderButton({
  icon,
  label,
  comingSoon = false,
  className,
  ...props
}: AuthProviderButtonProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={
        comingSoon ? `${label}, ${t("onboarding.comingSoonBadge")}` : label
      }
      accessibilityState={{ disabled: comingSoon }}
      disabled={comingSoon}
      scaleTo={comingSoon ? 1 : motion.scale.pressed}
      className={cn(
        "min-h-[52px] w-full flex-row items-center justify-center gap-3 rounded-xl border border-border bg-surface-elevated px-5",
        comingSoon && "opacity-80",
        className,
      )}
      style={{ minHeight: a11y.primaryButtonHeight }}
      {...props}
    >
      <Ionicons name={icon} size={22} color={iconColors.tertiary} />
      <Text variant="label" align="center" className="flex-1 text-foreground-secondary">
        {label}
      </Text>
      {comingSoon ? (
        <View className="rounded-full bg-surface-muted px-2 py-0.5">
          <Text variant="micro" muted>
            {t("onboarding.comingSoonBadge")}
          </Text>
        </View>
      ) : (
        <View className="w-[52px]" accessibilityElementsHidden />
      )}
    </PressableScale>
  );
}
