import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import { EmptyState, LoadingSkeleton, LoadingSkeletonGroup } from "@/components/ui";
import { useOpenCapture } from "@/features/capture/hooks/useOpenCapture";
import { useFocusRefresh } from "@/hooks/useFocusRefresh";

import { loadHomeSummary } from "../services/homeSummary";
import { CategoryBreakdownSection } from "./CategoryBreakdownSection";
import { HomeMonthHero } from "./HomeMonthHero";
import { HomeTopBar } from "./HomeTopBar";
import { ReceiptQueueSection } from "./ReceiptQueueSection";
import { RecentReceiptsSection } from "./RecentReceiptsSection";

export function HomeScreenContent() {
  const { t } = useTranslation();
  const openCapture = useOpenCapture();
  const [refreshing, setRefreshing] = useState(false);

  const loader = useCallback(() => loadHomeSummary(), []);
  const { data: summary, isInitialLoad, refresh } = useFocusRefresh(loader);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  if (isInitialLoad || !summary) {
    return (
      <View className="flex-1 px-5 pt-4">
        <LoadingSkeletonGroup busy label={t("common.loading")}>
          <LoadingSkeleton height={28} width="40%" rounded="md" />
          <LoadingSkeleton height={120} rounded="xl" className="mt-6" />
          <View className="mt-10 gap-4">
            <LoadingSkeleton height={14} width="35%" />
            <LoadingSkeleton height={72} rounded="xl" />
            <LoadingSkeleton height={72} rounded="xl" />
          </View>
        </LoadingSkeletonGroup>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-36"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
      showsVerticalScrollIndicator={false}
    >
      <HomeTopBar />
      <HomeMonthHero
        monthLabel={summary.monthLabel}
        totalMinor={summary.totalMinor}
        currencyCode={summary.currencyCode}
        hasParsedTotals={summary.hasParsedTotals}
      />

      {summary.isEmpty ? (
        <View className="px-5 pb-6 pt-4">
          <EmptyState
            title={t("home.emptyTitle")}
            body={t("home.emptyBody")}
            icon="scan-outline"
            actionLabel={t("home.emptyAction")}
            onAction={openCapture}
          />
        </View>
      ) : (
        <>
          <CategoryBreakdownSection
            categories={summary.categories}
            currencyCode={summary.currencyCode}
          />
          {summary.needsReview.length > 0 ? (
            <ReceiptQueueSection
              title={t("home.needsReview")}
              receipts={summary.needsReview}
              accentEdge
            />
          ) : null}
          <ReceiptQueueSection title={t("home.processing")} receipts={summary.processing} />
          <RecentReceiptsSection />
        </>
      )}
    </ScrollView>
  );
}
