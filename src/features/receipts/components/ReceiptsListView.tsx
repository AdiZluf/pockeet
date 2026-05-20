import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  EmptyState,
  LoadingSkeleton,
  LoadingSkeletonGroup,
  Section,
  Surface,
} from "@/components/ui";
import { listAllReceipts } from "@/db/repositories/receiptRepository";
import type { ReceiptSummaryRow } from "@/features/home/services/homeSummary";

import { useReceiptNavigation } from "../hooks/useReceiptNavigation";
import { formatReceiptMonth, monthBucketKey } from "../utils/receiptDisplay";
import { ReceiptListRow } from "./ReceiptListRow";

export function ReceiptsListView() {
  const { t, i18n } = useTranslation();
  const { openReceipt } = useReceiptNavigation();
  const [rows, setRows] = useState<ReceiptSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const receipts = await listAllReceipts();
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
      setLoading(true);
      void load().finally(() => setLoading(false));
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const grouped = useMemo(() => {
    const map = new Map<string, ReceiptSummaryRow[]>();
    for (const row of rows) {
      const key = monthBucketKey(row.purchasedAt ?? row.createdAt);
      const list = map.get(key) ?? [];
      list.push(row);
      map.set(key, list);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [rows]);

  if (loading) {
    return (
      <View className="flex-1 gap-3 px-5 pt-2">
        <LoadingSkeletonGroup busy label={t("common.loading")}>
          <LoadingSkeleton height={88} rounded="xl" />
          <LoadingSkeleton height={88} rounded="xl" />
          <LoadingSkeleton height={88} rounded="xl" />
        </LoadingSkeletonGroup>
      </View>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title={t("receipts.emptyTitle")}
        body={t("receipts.emptyBody")}
        icon="receipt-outline"
      />
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-6 pb-36 pt-2"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
    >
      {grouped.map(([key, monthRows], sectionIndex) => (
        <Section
          key={key}
          title={formatReceiptMonth(monthRows[0]?.purchasedAt ?? monthRows[0]?.createdAt, i18n.language)}
          className="px-5"
          first={sectionIndex === 0}
        >
          <Surface variant="elevated" className="overflow-hidden p-1">
            {monthRows.map((row) => (
              <ReceiptListRow
                key={row.id}
                receipt={row}
                onPress={() => openReceipt(row.id, row.status)}
              />
            ))}
          </Surface>
        </Section>
      ))}
    </ScrollView>
  );
}
