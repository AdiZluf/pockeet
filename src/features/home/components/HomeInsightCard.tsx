import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Surface, Text } from "@/components/ui";
import type { HomeInsight } from "@/features/home/services/homeInsights";
import { useIconColors } from "@/theme";

type HomeInsightCardProps = {
  insight: HomeInsight;
};

export function HomeInsightCard({ insight }: HomeInsightCardProps) {
  const iconColors = useIconColors();

  return (
    <Surface variant="elevated" className="min-w-[260px] max-w-[300px] flex-row items-start gap-3 p-4">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-accent-soft">
        <Ionicons name={insight.icon} size={18} color={iconColors.accent} />
      </View>
      <Text variant="body" align="start" className="flex-1 leading-6">
        {insight.message}
      </Text>
    </Surface>
  );
}
