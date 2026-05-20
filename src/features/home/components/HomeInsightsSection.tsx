import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

import { SectionHeader } from "@/components/ui";

import { loadHomeInsights, type HomeInsight } from "../services/homeInsights";
import { HomeInsightCard } from "./HomeInsightCard";

type HomeInsightsSectionProps = {
  referenceDate: Date;
};

export function HomeInsightsSection({ referenceDate }: HomeInsightsSectionProps) {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<HomeInsight[]>([]);

  const load = useCallback(async () => {
    const rows = await loadHomeInsights(referenceDate);
    setInsights(rows);
  }, [referenceDate]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (insights.length === 0) return null;

  return (
    <View className="pb-2 pt-5">
      <SectionHeader title={t("home.insights")} className="mb-3" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-5"
      >
        {insights.map((insight) => (
          <HomeInsightCard key={insight.id} insight={insight} />
        ))}
      </ScrollView>
    </View>
  );
}
