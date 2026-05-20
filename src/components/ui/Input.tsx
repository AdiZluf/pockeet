import { useState } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { useTheme } from "@/theme";
import { cn } from "@/utils/cn";
import { moneyWritingProps, textInputAlignStyle } from "@/utils/money";

import { Text } from "./Text";

export type InputProps = TextInputProps & {
  label: string;
  error?: string;
  money?: boolean;
};

export function Input({
  label,
  error,
  money,
  className,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1">
      <Text variant="label" align="start">
        {label}
      </Text>
      <TextInput
        className={cn(
          "min-h-[48px] rounded-sm bg-surface-muted px-3 text-body text-foreground",
          focused && "border-2 border-border-focus",
          !focused && "border border-border",
          error && "border-status-failed",
          className,
        )}
        placeholderTextColor={colors.textTertiary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[textInputAlignStyle, money ? moneyWritingProps.style : undefined, style]}
        {...(money ? { writingDirection: moneyWritingProps.writingDirection } : {})}
        {...props}
      />
      {error ? (
        <Text
          variant="caption"
          align="start"
          className="text-status-failed"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
