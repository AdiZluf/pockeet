import { Image, Pressable, ScrollView, View } from "react-native";

import { Text } from "@/components/ui";
import { cn } from "@/utils/cn";

import type { CaptureSessionImage } from "../types";

type ThumbnailStripProps = {
  images: CaptureSessionImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label?: string;
};

export function ThumbnailStrip({
  images,
  selectedIndex,
  onSelect,
  label,
}: ThumbnailStripProps) {
  if (images.length === 0) return null;

  return (
    <View className="gap-2">
      {label ? (
        <Text variant="caption" muted className="px-5">
          {label}
        </Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-5"
      >
        {images.map((image, index) => (
          <Pressable
            key={image.id}
            accessibilityRole="button"
            accessibilityLabel={`Page ${index + 1} of ${images.length}`}
            onPress={() => onSelect(index)}
            className={cn(
              "overflow-hidden rounded-md border-2",
              selectedIndex === index ? "border-accent" : "border-transparent",
            )}
          >
            <Image source={{ uri: image.uri }} className="h-16 w-12" resizeMode="cover" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
