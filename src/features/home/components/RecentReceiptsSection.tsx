import { useCallback, useState } from "react";
import { View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Card, ListRow, StatusChip, Text } from "@/components/ui";
import { listRecentReceipts } from "@/db/repositories/receiptRepository";
import type { ReceiptStatus } from "@/db/schema";

type RecentRow = {
  id: string;
  status: ReceiptStatus;
  createdAt: string;
  imageCount: number;
};

function statusVariant(status: ReceiptStatus): "processing" | "review" | "ready" | "failed" {
  if (status === "needs_review") return "review";
  if (status === "ready") return "ready";
  if (status === "failed") return "failed";
  return "processing";
}

export function RecentReceiptsSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const [rows, setRows] = useState<RecentRow[]>([]);

  const load = useCallback(async () => {
    const receipts = await listRecentReceipts(5);
    setRows(
      receipts.map((r) => ({
        id: r.id,
        status: r.status,
        createdAt: r.createdAt,
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
    <View className="px-5">
      <Text variant="titleMd" className="mb-3">
        {t("home.recentReceipts")}
      </Text>
      <Card className="p-0 overflow-hidden">
        {rows.map((row, index) => (
          <View key={row.id}>
            <ListRow
              title={<Text variant="label">{t("home.receiptPlaceholder", { n: row.imageCount })}</Text>}
              subtitle={
                <Text variant="caption" muted>
                  {new Date(row.createdAt).toLocaleString()}
                </Text>
              }
              trailing={
                <StatusChip variant={statusVariant(row.status)} label={t(`status.${row.status === "needs_review" ? "needs_review" : row.status}`)} />
              }
              onPress={() => {
                if (row.status === "processing") {
                  router.push(`/receipt/${row.id}/processing`);
                }
              }}
              accessibilityLabel={t("home.receiptRowA11y", {
                status: t(`status.${row.status === "needs_review" ? "needs_review" : row.status}`),
              })}
            />
            {index < rows.length - 1 ? <View className="ms-5 h-px bg-border" /> : null}
          </View>
        ))}
      </Card>
    </View>
  );
}
