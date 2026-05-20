import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  DividerList,
  ElevatedGroup,
  EmptyState,
  LoadingSkeleton,
  LoadingSkeletonGroup,
  ReceiptRow,
  SectionHeader,
} from "@/components/ui";
import { useOpenCapture } from "@/features/capture/hooks/useOpenCapture";
import { listAllReceipts } from "@/db/repositories/receiptRepository";
import type { ReceiptSummaryRow } from "@/features/home/services/homeSummary";
import { useFocusRefresh } from "@/hooks/useFocusRefresh";

import { useReceiptNavigation } from "../hooks/useReceiptNavigation";
import { formatReceiptMonth, monthBucketKey } from "../utils/receiptDisplay";

function mapRows(
  receipts: Awaited<ReturnType<typeof listAllReceipts>>,
): ReceiptSummaryRow[] {
  return receipts.map((r) => ({
    id: r.id,
    status: r.status,
    merchantName: r.merchantName,
    purchasedAt: r.purchasedAt,
    createdAt: r.createdAt,
    totalMinor: r.totalMinor,
    currencyCode: r.currencyCode,
    thumbUri: r.images[0]?.localUri ?? null,
    imageCount: r.images.length,
  }));
}

export function ReceiptsListView() {
  const { t } = useTranslation();
  const { openReceipt } = useReceiptNavigation();
  const openCapture = useOpenCapture();
  const [refreshing, setRefreshing] = useState(false);

  const loader = useCallback(async () => mapRows(await listAllReceipts()), []);
  const { data: rows, isInitialLoad, refresh } = useFocusRefresh(loader);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const grouped = useMemo(() => {
    if (!rows) return [];
    const map = new Map<string, ReceiptSummaryRow[]>();
    for (const row of rows) {
      const key = monthBucketKey(row.purchasedAt ?? row.createdAt);
      const list = map.get(key) ?? [];
      list.push(row);
      map.set(key, list);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [rows]);

  if (isInitialLoad || rows === null) {
    return (
      <View className="flex-1 gap-3 px-5 pt-4">
        <LoadingSkeletonGroup busy label={t("common.loading")}>
          <LoadingSkeleton height={14} width="30%" />
          <LoadingSkeleton height={72} rounded="xl" />
          <LoadingSkeleton height={72} rounded="xl" />
          <LoadingSkeleton height={72} rounded="xl" />
        </LoadingSkeletonGroup>
      </View>
    );
  }

  if (rows.length === 0) {
    return (
      <View className="flex-1 justify-center px-5 pb-24">
        <EmptyState
          title={t("receipts.emptyTitle")}
          body={t("receipts.emptyBody")}
          icon="receipt-outline"
          actionLabel={t("receipts.emptyAction")}
          onAction={openCapture}
        />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-8 pb-36 pt-2"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
    >
      {grouped.map(([key, monthRows]) => (
        <View key={key} className="gap-3">
          <SectionHeader
            title={formatReceiptMonth(monthRows[0]?.purchasedAt ?? monthRows[0]?.createdAt)}
          />
          <ElevatedGroup>
            <DividerList>
              {monthRows.map((row) => (
                <ReceiptRow
                  key={row.id}
                  receipt={row}
                  onPress={() => openReceipt(row.id, row.status)}
                />
              ))}
            </DividerList>
          </ElevatedGroup>
        </View>
      ))}
    </ScrollView>
  );
}
