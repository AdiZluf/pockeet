import { View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  SUPPORTED_DISPLAY_CURRENCIES,
  setDefaultCurrency,
  type DisplayCurrency,
} from "@/db/repositories/preferencesRepository";
import { ElevatedGroup, FilterChip, Section, Text } from "@/components/ui";

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
    <Section title={t("settings.currencySection")} first>
      <ElevatedGroup className="mx-0 gap-4 p-4">
        <View className="flex-row flex-wrap gap-2">
          {SUPPORTED_DISPLAY_CURRENCIES.map((code) => (
            <FilterChip
              key={code}
              label={code}
              selected={value === code}
              accessibilityLabel={t("settings.currencyOption", { code })}
              onPress={() => void select(code)}
            />
          ))}
        </View>
        <Text variant="caption" muted align="start" className="leading-5">
          {t("settings.currencyHint")}
        </Text>
      </ElevatedGroup>
    </Section>
  );
}
