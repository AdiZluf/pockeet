import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

import { LoadingSkeleton, LoadingSkeletonGroup } from "@/components/ui";

import { loadHomeSummary, type HomeSummary } from "../services/homeSummary";
import { CategoryBreakdownSection } from "./CategoryBreakdownSection";
import { DevSeedActions } from "./DevSeedActions";
import { HomeMonthHero } from "./HomeMonthHero";
import { HomeTopBar } from "./HomeTopBar";
import { ReceiptQueueSection } from "./ReceiptQueueSection";
import { RecentReceiptsSection } from "./RecentReceiptsSection";

export function HomeScreenContent() {
  const { t, i18n } = useTranslation();
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await loadHomeSummary(i18n.language);
    setSummary(data);
  }, [i18n.language]);

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

  if (loading || !summary) {
    return (
      <View className="flex-1 px-5 pt-2">
        <LoadingSkeletonGroup busy label={t("common.loading")}>
          <LoadingSkeleton height={20} width="30%" rounded="md" />
          <LoadingSkeleton height={14} width="25%" className="mt-6" />
          <LoadingSkeleton height={48} width="80%" className="mt-2" />
          <LoadingSkeleton height={12} width="40%" className="mt-3" />
          <View className="mt-10 gap-4">
            <LoadingSkeleton height={14} width="35%" />
            <LoadingSkeleton height={8} width="100%" rounded="full" />
            <LoadingSkeleton height={8} width="90%" rounded="full" />
            <LoadingSkeleton height={8} width="70%" rounded="full" />
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
      <DevSeedActions onSeeded={() => void load()} />
      <HomeMonthHero
        monthLabel={summary.monthLabel}
        totalMinor={summary.totalMinor}
        currencyCode={summary.currencyCode}
        hasParsedTotals={summary.hasParsedTotals}
        usesMockCategories={summary.usesMockCategories}
      />
      <CategoryBreakdownSection
        categories={summary.categories}
        currencyCode={summary.currencyCode}
        usesMockCategories={summary.usesMockCategories}
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
    </ScrollView>
  );
}
