import { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, ModalHeader, Text } from "@/components/ui";
import { respondToAskQuestion } from "@/features/ask/services/askResponder";
import type { AskResponse } from "@/features/ask/types";
import { useTheme } from "@/theme";

import { AskEmptyState } from "./AskEmptyState";
import { AskMessageBubble } from "./AskMessageBubble";
import { AskThinkingBubble } from "./AskThinkingBubble";

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; response: AskResponse };

export function AskPockeetScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { prefill } = useLocalSearchParams<{ prefill?: string }>();
  const scrollRef = useRef<ScrollView>(null);

  const [input, setInput] = useState(prefill ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

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
      scrollToEnd();

      await new Promise((r) => setTimeout(r, 500 + Math.random() * 300));
      const answer = await respondToAskQuestion(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", response: answer },
      ]);
      setIsThinking(false);
      scrollToEnd();
    },
    [isThinking, scrollToEnd],
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ paddingTop: insets.top }}
    >
      <ModalHeader
        title={t("ask.title")}
        subtitle={t("ask.sheetSubtitle")}
        onClose={() => router.back()}
        closeIcon="chevron-down"
        className="pb-3"
      />

      <ScrollView
        ref={scrollRef}
        className="flex-1 px-5"
        contentContainerClassName="gap-4 pb-4"
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToEnd}
      >
        {messages.length === 0 && !isThinking ? (
          <AskEmptyState onSuggestionPress={(q) => void sendQuestion(q)} />
        ) : null}
        {messages.map((msg) =>
          msg.role === "user" ? (
            <AskMessageBubble key={msg.id} role="user" text={msg.text} />
          ) : (
            <AskMessageBubble key={msg.id} role="assistant" response={msg.response} />
          ),
        )}
        {isThinking ? <AskThinkingBubble /> : null}
      </ScrollView>

      <View
        className="gap-3 border-t border-border-subtle bg-background px-5 pt-3"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <View className="flex-row items-end gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t("ask.inputPlaceholder")}
            placeholderTextColor={colors.textSecondary}
            multiline
            className="min-h-[48px] max-h-28 flex-1 rounded-2xl border border-border-subtle bg-surface px-4 py-3 text-base"
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
