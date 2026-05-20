import { useCallback, useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

import { DividerList, ElevatedGroup, ReceiptRow, SectionHeader } from "@/components/ui";
import { listRecentReceipts } from "@/db/repositories/receiptRepository";
import type { ReceiptSummaryRow } from "@/features/home/services/homeSummary";
import { useReceiptNavigation } from "@/features/receipts/hooks/useReceiptNavigation";

export function RecentReceiptsSection() {
  const { t } = useTranslation();
  const { openReceipt } = useReceiptNavigation();
  const [rows, setRows] = useState<ReceiptSummaryRow[]>([]);

  const load = useCallback(async () => {
    const receipts = await listRecentReceipts(5);
    setRows(
      receipts.map((r) => ({
        id: r.id,
        status: r.status,
        merchantName: r.merchantName,
        purchasedAt: r.purchasedAt,
        createdAt: r.createdAt,
        totalMinor: r.totalMinor,
        currencyCode: r.currencyCode,
        thumbUri: r.images[0]?.localUri ?? null,
        imageCount: r.images.length,
      })),
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (rows.length === 0) return null;

  return (
    <View className="pb-4 pt-6">
      <SectionHeader title={t("home.recentReceipts")} className="mb-3" />
      <ElevatedGroup>
        <DividerList>
          {rows.map((row) => (
            <ReceiptRow
              key={row.id}
              receipt={row}
              onPress={() => openReceipt(row.id, row.status)}
            />
          ))}
        </DividerList>
      </ElevatedGroup>
    </View>
  );
}
