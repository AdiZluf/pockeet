import { View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  SUPPORTED_DISPLAY_CURRENCIES,
  setDefaultCurrency,
  type DisplayCurrency,
} from "@/db/repositories/preferencesRepository";
import { ListRow, PressableScale, Text } from "@/components/ui";
import { cn } from "@/utils/cn";

type CurrencySettingRowProps = {
  value: DisplayCurrency;
  onChange: (code: DisplayCurrency) => void;
};

export function CurrencySettingRow({ value, onChange }: CurrencySettingRowProps) {
  const { t } = useTranslation();

  const select = async (code: DisplayCurrency) => {
    await setDefaultCurrency(code);
    onChange(code);
  };

  return (
    <View className="gap-3">
      <Text variant="micro" muted align="start" className="uppercase tracking-wide">
        {t("settings.currencySection")}
      </Text>
      <View className="flex-row justify-center align-middle flex-wrap gap-2">
        {SUPPORTED_DISPLAY_CURRENCIES.map((code) => (
          <PressableScale
            key={code}
            accessibilityRole="button"
            accessibilityLabel={t("settings.currencyOption", { code })}
            onPress={() => void select(code)}
            className={cn(
              "min-h-[44px] rounded-full px-4 py-2",
              value === code ? "bg-accent" : "bg-surface-muted",
            )}
          >
            <Text
              variant="label"
              className={value === code ? "font-semibold text-foreground-inverse" : undefined}
            >
              {code}
            </Text>
          </PressableScale>
        ))}
      </View>
      <ListRow
        title={
          <Text variant="caption" muted align="start" className="leading-5">
            {t("settings.currencyHint")}
          </Text>
        }
      />
    </View>
  );
}
