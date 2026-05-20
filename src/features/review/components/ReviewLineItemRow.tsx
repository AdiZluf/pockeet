import { Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Text } from "@/components/ui";
import { useIconColors, useTheme } from "@/theme";
import { moneyWritingProps, textInputAlignStyle } from "@/utils/money";

type ReviewLineItemRowProps = {
  name: string;
  amountInput: string;
  onChangeName: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  error?: string;
};

export function ReviewLineItemRow({
  name,
  amountInput,
  onChangeName,
  onChangeAmount,
  onRemove,
  canRemove,
  error,
}: ReviewLineItemRowProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const { colors } = useTheme();
  const placeholderColor = colors.textTertiary;

  return (
    <View className="gap-2 px-4 py-3.5">
      <View className="flex-row items-start gap-2">
        <View className="min-w-0 flex-1 gap-2">
          <TextInput
            className="min-h-[40px] p-0 text-body text-foreground"
            style={textInputAlignStyle}
            placeholder={t("review.lineItemNamePlaceholder")}
            placeholderTextColor={placeholderColor}
            value={name}
            onChangeText={onChangeName}
            accessibilityLabel={t("review.lineItemNameLabel")}
          />
          <TextInput
            className="min-h-[40px] p-0 text-label text-foreground"
            style={[textInputAlignStyle, moneyWritingProps.style]}
            placeholder={t("review.lineItemAmountPlaceholder")}
            placeholderTextColor={placeholderColor}
            value={amountInput}
            onChangeText={onChangeAmount}
            keyboardType="decimal-pad"
            accessibilityLabel={t("review.lineItemAmountLabel")}
          />
        </View>
        {canRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("review.removeLineItem")}
            onPress={onRemove}
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface-muted"
          >
            <Ionicons name="trash-outline" size={20} color={iconColors.tertiary} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" align="start" className="text-status-failed">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
