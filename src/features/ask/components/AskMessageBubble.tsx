import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { GradientIconWell, Surface, Text } from "@/components/ui";
import type { AskResponse } from "@/features/ask/types";
import { brandGradients } from "@/theme/gradients";

type AskMessageBubbleProps =
  | { role: "user"; text: string }
  | { role: "assistant"; response: AskResponse };

export function AskMessageBubble(props: AskMessageBubbleProps) {
  const { t } = useTranslation();

  if (props.role === "user") {
    return (
      <View className="max-w-[90%] self-end">
        <LinearGradient
          colors={[...brandGradients.userBubble]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl rounded-br-sm px-4 py-3 shadow-card"
        >
          <Text variant="bodyLg" align="start" className="text-foreground-onAccent leading-6">
            {props.text}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  const { response } = props;
  const footer =
    response.receiptsUsed > 0
      ? t("ask.basedOnReceipts", {
          count: response.receiptsUsed,
          scope: t(`ask.source.${response.sourceLabel}`),
        })
      : t("ask.basedOnSaved");

  return (
    <View className="max-w-[92%] gap-2 self-start">
      <Surface variant="featured" className="gap-3 p-4">
        <View className="flex-row items-start gap-3">
          <GradientIconWell name="sparkles" size={40} iconSize={18} />
          <Text variant="bodyLg" align="start" className="min-w-0 flex-1 leading-6">
            {response.text}
          </Text>
        </View>
        <View className="border-t border-border-subtle pt-2">
          <Text variant="caption" muted align="start" className="leading-4">
            {footer}
          </Text>
        </View>
      </Surface>
    </View>
  );
}
