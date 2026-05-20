import type { ComponentProps } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { GradientIconWell, Surface, Text } from "@/components/ui";
import type { OnboardingSlideKey } from "@/theme/gradients";
import { onboardingSlideGradient } from "@/theme/gradients";
import { cn } from "@/utils/cn";

type IconName = ComponentProps<typeof Ionicons>["name"];

type SlideArtConfig = {
  primary: IconName;
  primarySize: number;
  satellites: { name: IconName; size: number; className: string }[];
};

const SLIDE_ART: Record<OnboardingSlideKey, SlideArtConfig> = {
  scan: {
    primary: "camera",
    primarySize: 128,
    satellites: [
      { name: "scan-outline", size: 44, className: "absolute start-4 top-6" },
      { name: "flash-outline", size: 40, className: "absolute end-6 top-10" },
      { name: "receipt-outline", size: 36, className: "absolute bottom-8 end-10" },
    ],
  },
  organize: {
    primary: "sparkles",
    primarySize: 120,
    satellites: [
      { name: "list-outline", size: 42, className: "absolute start-2 top-12" },
      { name: "pricetag-outline", size: 40, className: "absolute end-4 top-8" },
      { name: "calendar-outline", size: 38, className: "absolute bottom-10 start-8" },
    ],
  },
  clarity: {
    primary: "pie-chart",
    primarySize: 120,
    satellites: [
      { name: "wallet-outline", size: 42, className: "absolute start-4 top-10" },
      { name: "trending-up-outline", size: 40, className: "absolute end-6 top-14" },
      { name: "bar-chart-outline", size: 38, className: "absolute bottom-12 end-8" },
    ],
  },
};

type OnboardingSlideArtProps = {
  stepKey: OnboardingSlideKey;
};

function ScanReceiptMock() {
  return (
    <View
      className="absolute bottom-4 start-6 w-[132px] rotate-[-6deg]"
      accessibilityElementsHidden
    >
      <Surface variant="elevated" className="gap-2 border-0 p-3 shadow-raised">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-accent-soft">
            <Ionicons name="storefront-outline" size={16} color="#1F6F78" />
          </View>
          <View className="h-2 flex-1 rounded-full bg-surface-muted" />
        </View>
        <View className="h-2 rounded-full bg-surface-muted" style={{ width: "75%" }} />
        <View className="h-2 rounded-full bg-surface-muted" style={{ width: "50%" }} />
        <Text variant="label" className="text-accent">
          Total
        </Text>
      </Surface>
    </View>
  );
}

function OrganizeFieldPills() {
  const fields = [
    { icon: "business-outline" as const, label: "Merchant" },
    { icon: "cash-outline" as const, label: "Total" },
    { icon: "calendar-outline" as const, label: "Date" },
  ];

  return (
    <View className="absolute bottom-6 inset-x-6 flex-row flex-wrap justify-center gap-2">
      {fields.map((field) => (
        <View
          key={field.label}
          className="flex-row items-center gap-1.5 rounded-full border border-border-subtle bg-surface-elevated px-3 py-2 shadow-card"
          accessibilityElementsHidden
        >
          <Ionicons name={field.icon} size={14} color="#1F6F78" />
          <Text variant="micro" className="text-foreground-secondary">
            {field.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ClarityBarChart() {
  const heights = [28, 44, 36, 52, 40];
  const colors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];

  return (
    <View
      className="absolute bottom-6 inset-x-8 flex-row items-end justify-center gap-2"
      accessibilityElementsHidden
    >
      {heights.map((h, i) => (
        <View
          key={i}
          className={cn("w-5 rounded-t-md opacity-90", colors[i])}
          style={{ height: h }}
        />
      ))}
    </View>
  );
}

function ScanFrameCorners() {
  const corner = "absolute h-5 w-5 border-white/50";
  return (
    <>
      <View className={cn(corner, "start-8 top-4 border-s-2 border-t-2 rounded-tl-md")} />
      <View className={cn(corner, "end-8 top-4 border-e-2 border-t-2 rounded-tr-md")} />
      <View className={cn(corner, "bottom-16 start-8 border-b-2 border-s-2 rounded-bl-md")} />
      <View className={cn(corner, "bottom-16 end-8 border-b-2 border-e-2 rounded-br-md")} />
    </>
  );
}

export function OnboardingSlideArt({ stepKey }: OnboardingSlideArtProps) {
  const art = SLIDE_ART[stepKey];
  const gradient = onboardingSlideGradient(stepKey);

  return (
    <View className="relative min-h-[300px] w-full items-center justify-center px-4 pt-4">
      <LinearGradient
        colors={[...gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0 rounded-3xl opacity-30"
      />
      <View
        className="absolute start-10 top-8 h-20 w-20 rounded-full bg-accent/10"
        accessibilityElementsHidden
      />
      <View
        className="absolute end-6 bottom-20 h-28 w-28 rounded-full bg-warm-highlight/15"
        accessibilityElementsHidden
      />

      {stepKey === "scan" ? <ScanFrameCorners /> : null}

      {art.satellites.map((sat) => (
        <View key={sat.name} className={sat.className}>
          <GradientIconWell name={sat.name} size={sat.size} iconSize={sat.size * 0.42} />
        </View>
      ))}

      <GradientIconWell
        name={art.primary}
        size={art.primarySize}
        iconSize={art.primarySize * 0.44}
        className="shadow-raised"
      />

      {stepKey === "scan" ? <ScanReceiptMock /> : null}
      {stepKey === "organize" ? <OrganizeFieldPills /> : null}
      {stepKey === "clarity" ? <ClarityBarChart /> : null}
    </View>
  );
}
