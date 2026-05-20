import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import type { ReceiptStatusFilter } from "@/db/receiptFilters";
import { EmptyState, LoadingSkeleton, LoadingSkeletonGroup } from "@/components/ui";
import { AskPockeetCard } from "@/features/ask/components/AskPockeetCard";
import { useAddReceiptSheetStore } from "@/features/capture/stores/addReceiptSheetStore";
import { useFocusRefresh } from "@/hooks/useFocusRefresh";

import { useHomeNavigation } from "../hooks/useHomeNavigation";
import { loadHomeSummary } from "../services/homeSummary";
import { CategoryBreakdownSection } from "./CategoryBreakdownSection";
import { HomeMonthHero } from "./HomeMonthHero";
import { HomeMonthSelector } from "./HomeMonthSelector";
import { HomeStatusOverview } from "./HomeStatusOverview";
import { HomeTopBar } from "./HomeTopBar";
import { ReceiptQueueSection } from "./ReceiptQueueSection";
import { HomeInsightsSection } from "./HomeInsightsSection";
import { RecentReceiptsSection } from "./RecentReceiptsSection";

export function HomeScreenContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const openAddReceipt = useAddReceiptSheetStore((s) => s.open);
  const { openReceiptsFiltered, openAllReceipts } = useHomeNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date());

  const loader = useCallback(() => loadHomeSummary(selectedMonth), [selectedMonth]);
  const { data: summary, isInitialLoad, refresh } = useFocusRefresh(loader);

  const canGoNext = useMemo(() => {
    const now = new Date();
    return (
      selectedMonth.getFullYear() < now.getFullYear() ||
      (selectedMonth.getFullYear() === now.getFullYear() &&
        selectedMonth.getMonth() < now.getMonth())
    );
  }, [selectedMonth]);

  const goPreviousMonth = useCallback(() => {
    setSelectedMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const goNextMonth = useCallback(() => {
    if (!canGoNext) return;
    setSelectedMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, [canGoNext]);

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
          <LoadingSkeleton height={48} width="60%" rounded="md" className="mt-4" />
          <View className="mt-10 gap-4">
            <LoadingSkeleton height={14} width="35%" />
            <LoadingSkeleton height={72} rounded="xl" />
            <LoadingSkeleton height={72} rounded="xl" />
          </View>
        </LoadingSkeletonGroup>
      </View>
    );
  }

  const openFiltered = (params: {
    categories?: string[];
    status?: ReceiptStatusFilter;
  }) => {
    openReceiptsFiltered({
      month: summary.monthKey,
      categories: params.categories,
      status: params.status,
    });
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-36"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
      showsVerticalScrollIndicator={false}
    >
      <HomeTopBar />
      <HomeMonthSelector
        monthLabel={summary.monthLabel}
        onPrevious={goPreviousMonth}
        onNext={goNextMonth}
        canGoNext={canGoNext}
      />
      <HomeMonthHero
        monthLabel={summary.monthLabel}
        totalMinor={summary.totalMinor}
        currencyCode={summary.currencyCode}
        hasParsedTotals={summary.hasParsedTotals}
        deltaMinor={summary.deltaMinor}
        otherCurrencyCount={summary.otherCurrencyCount}
      />

      {summary.isEmpty ? (
        <View className="px-5 pb-6 pt-4">
          <EmptyState
            title={t("home.emptyTitle")}
            body={t("home.emptyBody")}
            icon="scan-outline"
            actionLabel={t("home.emptyAction")}
            onAction={openAddReceipt}
          />
        </View>
      ) : (
        <>
          <HomeInsightsSection referenceDate={selectedMonth} />
          <CategoryBreakdownSection
            categories={summary.categories}
            currencyCode={summary.currencyCode}
            onCategoryPress={(categoryId) => openFiltered({ categories: [categoryId] })}
          />
          <HomeStatusOverview
            counts={summary.statusCounts}
            onStatusPress={(status) => openFiltered({ status })}
          />
          {summary.needsReview.length > 0 ? (
            <ReceiptQueueSection
              title={t("home.needsReview")}
              receipts={summary.needsReview}
              accentEdge
            />
          ) : null}
          {summary.processing.length > 0 ? (
            <ReceiptQueueSection title={t("home.processing")} receipts={summary.processing} />
          ) : null}
          <RecentReceiptsSection onSeeAll={openAllReceipts} />
        </>
      )}

      <View className="px-5 pt-4">
        <AskPockeetCard
          onOpen={(prefill) =>
            router.push(prefill ? { pathname: "/ask", params: { prefill } } : "/ask")
          }
        />
      </View>
    </ScrollView>
  );
}
