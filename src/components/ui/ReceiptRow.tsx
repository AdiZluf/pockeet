import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type { ReceiptSummaryRow } from "@/features/home/services/homeSummary";
import { useIconColors } from "@/theme";
import { formatMoney } from "@/utils/money";
import {
  getDisclosureChevronIcon,
  moneyTextProps,
  trailingColumnClass,
} from "@/utils/rtl";
import { cn } from "@/utils/cn";

import {
  formatReceiptDate,
  isParsedReceipt,
  receiptStatusI18nKey,
  receiptStatusVariant,
} from "@/features/receipts/utils/receiptDisplay";
import { ReceiptThumbnail } from "@/features/receipts/components/ReceiptThumbnail";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

const statusDotClass: Record<ReturnType<typeof receiptStatusVariant>, string> = {
  processing: "bg-status-processing",
  review: "bg-status-review",
  ready: "bg-status-ready",
  failed: "bg-status-failed",
};

const statusTextClass: Record<ReturnType<typeof receiptStatusVariant>, string> = {
  processing: "text-status-processing",
  review: "text-status-review",
  ready: "text-status-ready",
  failed: "text-status-failed",
};

export type ReceiptRowProps = {
  receipt: ReceiptSummaryRow;
  onPress: () => void;
  showAmount?: boolean;
  compact?: boolean;
};

export function ReceiptRow({ receipt, onPress, showAmount = true, compact }: ReceiptRowProps) {
  const { t, i18n } = useTranslation();
  const iconColors = useIconColors();
  const title =
    receipt.merchantName ??
    t("receipts.unnamedReceipt", { count: receipt.imageCount || 1 });
  const parsed = isParsedReceipt(receipt.status, receipt.totalMinor);
  const statusVariant = receiptStatusVariant(receipt.status);
  const statusLabel = t(receiptStatusI18nKey(receipt.status));

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t("receipts.rowA11y", { merchant: title, status: statusLabel })}
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-3 px-4",
        compact ? "min-h-[60px] py-3" : "min-h-[68px] py-3.5",
      )}
    >
      <ReceiptThumbnail uri={receipt.thumbUri} size="md" />
      <View className="min-w-0 flex-1 gap-0.5">
        <Text variant="bodyLg" align="start" className="font-semibold leading-snug" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" muted align="start">
          {formatReceiptDate(receipt.purchasedAt ?? receipt.createdAt, i18n.language)}
        </Text>
      </View>
      <View className={cn("gap-1 pe-1", trailingColumnClass())}>
        {showAmount && parsed && receipt.totalMinor != null ? (
          <Text variant="body" className="font-semibold tabular-nums" {...moneyTextProps}>
            {formatMoney(receipt.totalMinor, receipt.currencyCode, i18n.language)}
          </Text>
        ) : null}
        <View className="flex-row items-center gap-1.5">
          <View
            className={cn("h-1.5 w-1.5 rounded-full", statusDotClass[statusVariant])}
            accessibilityElementsHidden
          />
          <Text variant="caption" className={statusTextClass[statusVariant]}>
            {statusLabel}
          </Text>
        </View>
      </View>
      <Ionicons name={getDisclosureChevronIcon()} size={18} color={iconColors.tertiary} />
    </PressableScale>
  );
}
