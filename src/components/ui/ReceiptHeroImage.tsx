import { Image, View, type ImageProps } from "react-native";

import { surfaceElevation } from "@/theme/surfaces";
import { cn } from "@/utils/cn";

import { Surface } from "./Surface";

export type ReceiptHeroImageProps = {
  uri: string;
  accessibilityLabel: string;
  /** max height in pt; width follows aspect ratio */
  maxHeight?: number;
  aspectRatio?: number;
  className?: string;
  imageProps?: Omit<ImageProps, "source" | "accessibilityLabel">;
};

export function ReceiptHeroImage({
  uri,
  accessibilityLabel,
  maxHeight = 340,
  aspectRatio = 3 / 4,
  className,
  imageProps,
}: ReceiptHeroImageProps) {
  return (
    <Surface variant="hero" className={cn("overflow-hidden p-0", className)}>
      <View className="h-1 bg-accent" accessibilityElementsHidden />
      <View className="bg-surface-muted p-3">
        <View
          className="overflow-hidden rounded-xl bg-surface"
          style={[surfaceElevation.card, { maxHeight }]}
        >
          <Image
            source={{ uri }}
            className="w-full bg-surface-muted"
            style={{ aspectRatio }}
            resizeMode="cover"
            accessibilityLabel={accessibilityLabel}
            {...imageProps}
          />
        </View>
      </View>
    </Surface>
  );
}
