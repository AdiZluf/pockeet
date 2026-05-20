import { TextInput, View, type TextInputProps } from "react-native";

import { Text } from "@/components/ui";
import { useTheme } from "@/theme";
import { cn } from "@/utils/cn";
import { moneyTextProps } from "@/utils/rtl";

export type ReviewFieldRowProps = TextInputProps & {
  label: string;
  error?: string;
  money?: boolean;
  hint?: string;
};

export function ReviewFieldRow({
  label,
  error,
  money,
  hint,
  className,
  ...props
}: ReviewFieldRowProps) {
  const { colors } = useTheme();

  return (
    <View className="gap-1.5 px-4 py-3.5">
      <Text variant="caption" muted>
        {label}
      </Text>
      <TextInput
        className={cn(
          "min-h-[44px] p-0 text-body-lg text-foreground",
          error && "text-status-failed",
          className,
        )}
        placeholderTextColor={colors.textTertiary}
        {...(money ? moneyTextProps : {})}
        {...props}
      />
      {hint ? (
        <Text variant="caption" muted>
          {hint}
        </Text>
      ) : null}
      {error ? (
        <Text variant="caption" className="text-status-failed" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
