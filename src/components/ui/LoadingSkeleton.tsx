import { useEffect } from "react";
import { View, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { motion, useReducedMotion } from "@/theme";
import { cn } from "@/utils/cn";

export type LoadingSkeletonProps = ViewProps & {
  height?: number;
  width?: number | `${number}%`;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
};

const roundedClass = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export function LoadingSkeleton({
  height = 16,
  width = "100%",
  rounded = "md",
  className,
  ...props
}: LoadingSkeletonProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 0.72;
      return;
    }
    opacity.value = withRepeat(
      withTiming(1, { duration: motion.duration.slow * 3 }),
      -1,
      true,
    );
  }, [opacity, reduceMotion]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const SkeletonView = reduceMotion ? View : Animated.View;

  return (
    <SkeletonView
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={reduceMotion ? { height, width, opacity: 0.72 } : [pulseStyle, { height, width }]}
      className={cn("bg-surface-muted", roundedClass[rounded], className)}
      {...props}
    />
  );
}

export type LoadingSkeletonGroupProps = ViewProps & {
  busy?: boolean;
  label?: string;
};

export function LoadingSkeletonGroup({
  busy,
  label,
  children,
  className,
  ...props
}: LoadingSkeletonGroupProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityState={{ busy: !!busy }}
      accessibilityLabel={label}
      className={cn("gap-3", className)}
      {...props}
    >
      {children}
    </View>
  );
}
