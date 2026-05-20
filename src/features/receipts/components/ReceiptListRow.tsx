import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ListRow, StatusChip, Text } from "@/components/ui";
import type { ReceiptSummaryRow } from "@/features/home/services/homeSummary";
import { formatMoney } from "@/utils/money";
import { moneyTextProps } from "@/utils/rtl";

import {
  formatReceiptDate,
  isParsedReceipt,
  receiptStatusI18nKey,
  receiptStatusVariant,
} from "../utils/receiptDisplay";
import { ReceiptThumbnail } from "./ReceiptThumbnail";

type ReceiptListRowProps = {
  receipt: ReceiptSummaryRow;
  onPress: () => void;
  showAmount?: boolean;
};

export function ReceiptListRow({ receipt, onPress, showAmount = true }: ReceiptListRowProps) {
  const { t, i18n } = useTranslation();
  const title =
    receipt.merchantName ??
    t("receipts.unnamedReceipt", { count: receipt.imageCount || 1 });
  const parsed = isParsedReceipt(receipt.status, receipt.totalMinor);

  return (
    <ListRow
      leading={<ReceiptThumbnail uri={receipt.thumbUri} />}
      title={<Text variant="bodyLg" className="font-medium">{title}</Text>}
      subtitle={
        <Text variant="caption" muted>
          {formatReceiptDate(receipt.purchasedAt ?? receipt.createdAt, i18n.language)}
        </Text>
      }
      trailing={
        <View className="items-end gap-1">
          {showAmount && parsed && receipt.totalMinor != null ? (
            <Text variant="label" className="tabular-nums" {...moneyTextProps}>
              {formatMoney(receipt.totalMinor, receipt.currencyCode, i18n.language)}
            </Text>
          ) : null}
          <StatusChip
            variant={receiptStatusVariant(receipt.status)}
            label={t(receiptStatusI18nKey(receipt.status))}
          />
        </View>
      }
      onPress={onPress}
      accessibilityLabel={t("receipts.rowA11y", {
        merchant: title,
        status: t(receiptStatusI18nKey(receipt.status)),
      })}
    />
  );
}
