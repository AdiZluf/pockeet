import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, PressableScale, Text } from "@/components/ui";
import { respondToAskQuestion } from "@/features/ask/services/askResponder";
import { useIconColors, useTheme } from "@/theme";

const SUGGESTED_KEYS = [
  "ask.suggested.restaurants",
  "ask.suggested.categoryIncrease",
  "ask.suggested.shufersal",
  "ask.suggested.monthTotal",
] as const;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export function AskPockeetScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const { colors } = useTheme();
  const { prefill } = useLocalSearchParams<{ prefill?: string }>();

  const [input, setInput] = useState(prefill ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const sendQuestion = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsThinking(true);

      await new Promise((r) => setTimeout(r, 500 + Math.random() * 300));
      const answer = await respondToAskQuestion(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: answer },
      ]);
      setIsThinking(false);
    },
    [isThinking],
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center gap-2 px-5 pb-3 pt-2">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-surface-elevated"
          style={{ borderWidth: 0.5, borderColor: colors.borderSubtle }}
        >
          <Ionicons name="chevron-down" size={24} color={iconColors.primary} />
        </PressableScale>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text variant="titleLg" align="start">
            {t("ask.title")}
          </Text>
          <Text variant="caption" muted align="start">
            {t("ask.sheetSubtitle")}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerClassName="gap-3 pb-4"
        keyboardShouldPersistTaps="handled"
      >
        {messages.length === 0 ? (
          <Text variant="body" muted align="start" className="py-2">
            {t("ask.emptyHint")}
          </Text>
        ) : null}
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={
              msg.role === "user"
                ? "self-end max-w-[88%] rounded-2xl rounded-br-md bg-accent px-4 py-3"
                : "self-start max-w-[88%] rounded-2xl rounded-bl-md bg-surface-elevated px-4 py-3"
            }
          >
            <Text
              variant="body"
              align="start"
              className={msg.role === "user" ? "text-foreground-inverse" : undefined}
            >
              {msg.text}
            </Text>
          </View>
        ))}
        {isThinking ? (
          <View className="flex-row items-center gap-2 self-start px-1 py-2">
            <ActivityIndicator size="small" color={iconColors.secondary} />
            <Text variant="caption" muted>
              {t("ask.thinking")}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View className="gap-3 border-t border-border-subtle px-5 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-grow-0">
          <View className="flex-row gap-2">
            {SUGGESTED_KEYS.map((key) => (
              <PressableScale
                key={key}
                accessibilityRole="button"
                accessibilityLabel={t(key)}
                onPress={() => void sendQuestion(t(key))}
                className="rounded-full bg-surface-muted px-3 py-2"
              >
                <Text variant="caption" className="leading-5">
                  {t(key)}
                </Text>
              </PressableScale>
            ))}
          </View>
        </ScrollView>
        <View className="flex-row items-end gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t("ask.inputPlaceholder")}
            placeholderTextColor={colors.textSecondary}
            multiline
            className="min-h-[44px] max-h-28 flex-1 rounded-2xl border border-border-subtle bg-surface px-4 py-3 text-base text-foreground"
            style={{ color: colors.textPrimary }}
            accessibilityLabel={t("ask.inputA11y")}
          />
          <Button
            label={t("ask.send")}
            onPress={() => void sendQuestion(input)}
            disabled={!input.trim() || isThinking}
            block={false}
            className="min-w-[72px] px-4"
          />
        </View>
        <Text variant="micro" muted align="start" className="leading-4">
          {t("ask.disclaimer")}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
