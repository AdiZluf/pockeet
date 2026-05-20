import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Surface, Text } from "@/components/ui";
import type { AskResponse } from "@/features/ask/types";
import { useIconColors } from "@/theme";

type AskMessageBubbleProps =
  | { role: "user"; text: string }
  | { role: "assistant"; response: AskResponse };

export function AskMessageBubble(props: AskMessageBubbleProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  if (props.role === "user") {
    return (
      <View className="self-end max-w-[90%]">
        <View className="rounded-2xl rounded-br-sm bg-accent px-4 py-3">
          <Text variant="body" align="start" className="text-foreground-inverse leading-6">
            {props.text}
          </Text>
        </View>
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
    <View className="self-start max-w-[92%] gap-2">
      <Surface variant="elevated" className="gap-3 p-4">
        <View className="flex-row items-start gap-2.5">
          <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-lg bg-accent-soft">
            <Ionicons name="sparkles" size={16} color={iconColors.accent} />
          </View>
          <Text variant="body" align="start" className="flex-1 leading-6">
            {response.text}
          </Text>
        </View>
        <View className="border-t border-border-subtle pt-2">
          <Text variant="micro" muted align="start" className="leading-4">
            {footer}
          </Text>
        </View>
      </Surface>
    </View>
  );
}
