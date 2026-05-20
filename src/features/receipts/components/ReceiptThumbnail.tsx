import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useIconColors } from "@/theme";
import { cn } from "@/utils/cn";

type ReceiptThumbnailProps = {
  uri: string | null;
  className?: string;
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: "h-12 w-10",
  md: "h-[52px] w-11",
};

export function ReceiptThumbnail({ uri, className, size = "md" }: ReceiptThumbnailProps) {
  const iconColors = useIconColors();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={cn(
          "rounded-xl border-2 border-surface bg-surface-muted",
          sizeClasses[size],
          className,
        )}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View
      className={cn(
        "items-center justify-center rounded-xl border-2 border-surface bg-accent-soft",
        sizeClasses[size],
        className,
      )}
    >
      <Ionicons name="receipt-outline" size={20} color={iconColors.accent} />
    </View>
  );
}
