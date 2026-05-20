import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { LoadingSkeleton, LoadingSkeletonGroup, PressableScale, ScreenHeader } from "@/components/ui";
import { useIconColors } from "@/theme";

import { loadHomeSummary, type HomeSummary } from "../services/homeSummary";
import { CategoryBreakdownSection } from "./CategoryBreakdownSection";
import { DevSeedActions } from "./DevSeedActions";
import { HomeMonthHero } from "./HomeMonthHero";
import { ReceiptQueueSection } from "./ReceiptQueueSection";
import { RecentReceiptsSection } from "./RecentReceiptsSection";

export function HomeScreenContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const iconColors = useIconColors();
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
      <View className="flex-1 gap-8 px-5 pt-2">
        <LoadingSkeletonGroup busy label={t("common.loading")}>
          <LoadingSkeleton height={36} width="50%" rounded="lg" />
          <LoadingSkeleton height={14} width="35%" />
          <LoadingSkeleton height={52} width="75%" />
          <LoadingSkeleton height={120} rounded="xl" />
          <LoadingSkeleton height={88} rounded="xl" />
        </LoadingSkeletonGroup>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-8 pb-36 pt-1"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
    >
      <ScreenHeader
        title={t("home.greeting")}
        subtitle={summary.monthLabel}
        large
        trailing={
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("settings.open")}
            onPress={() => router.push("/settings")}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface-muted"
          >
            <Ionicons name="settings-outline" size={22} color={iconColors.primary} />
          </PressableScale>
        }
      />
      <DevSeedActions onSeeded={() => void load()} />
      <HomeMonthHero
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
      <ReceiptQueueSection
        title={t("home.needsReview")}
        receipts={summary.needsReview}
        highlight
      />
      <ReceiptQueueSection title={t("home.processing")} receipts={summary.processing} />
      <RecentReceiptsSection />
    </ScrollView>
  );
}
