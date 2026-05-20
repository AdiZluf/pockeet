import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Surface, Text } from "@/components/ui";
import type { HomeInsight } from "@/features/home/services/homeInsights";
import { useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

type HomeInsightCardProps = {
  insight: HomeInsight;
};

export function HomeInsightCard({ insight }: HomeInsightCardProps) {
  const iconColors = useIconColors();

  return (
    <Surface
      variant="featured"
      className={cn("min-w-[260px] max-w-[300px] flex-row items-start gap-3 border-s-[3px] border-s-accent p-4")}
    >
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
        <Ionicons name={insight.icon} size={20} color={iconColors.accent} />
      </View>
      <Text variant="bodyLg" align="start" className="flex-1 leading-6">
        {insight.message}
      </Text>
    </Surface>
  );
}
