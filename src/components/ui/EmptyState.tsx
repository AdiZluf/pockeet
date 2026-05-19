import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "./Button";
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
  icon = "document-text-outline",
}: EmptyStateProps) {
  return (
    <View className="items-center gap-4 px-5 py-10" accessibilityRole="text">
      <Ionicons name={icon} size={64} color="#78716C" />
      <Text variant="titleMd" className="text-center">
        {title}
      </Text>
      <Text variant="body" muted className="text-center">
        {body}
      </Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} block={false} className="px-8" />
      ) : null}
    </View>
  );
}
