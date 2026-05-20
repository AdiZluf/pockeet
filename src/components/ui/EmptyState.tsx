import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useIconColors } from "@/theme";

import { Button } from "./Button";
import { Surface } from "./Surface";
import { Text } from "./Text";

export type EmptyStateProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  icon = "sparkles-outline",
}: EmptyStateProps) {
  const iconColors = useIconColors();

  return (
    <View
      className="items-center gap-5 px-6 py-12"
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${body}`}
    >
      <Surface
        variant="inset"
        className="h-20 w-20 items-center justify-center rounded-2xl bg-accent-soft"
      >
        <Ionicons name={icon} size={36} color={iconColors.accent} />
      </Surface>
      <View className="max-w-[280px] items-center gap-2">
        <Text variant="titleMd" align="center">
          {title}
        </Text>
        <Text variant="body" muted align="center" className="leading-6">
          {body}
        </Text>
      </View>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} block={false} className="min-w-[200px]" />
      ) : null}
    </View>
  );
}
