import { useState } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { cn } from "@/utils/cn";
import { moneyTextProps } from "@/utils/rtl";

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
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1">
      <Text variant="label">{label}</Text>
      <TextInput
        className={cn(
          "min-h-[48px] rounded-sm bg-surface-muted px-3 text-body text-foreground",
          focused && "border-2 border-border-focus",
          !focused && "border border-border",
          error && "border-status-failed",
          className,
        )}
        placeholderTextColor="#78716C"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...(money ? moneyTextProps : {})}
        {...props}
      />
      {error ? (
        <Text
          variant="caption"
          className="text-status-failed"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
