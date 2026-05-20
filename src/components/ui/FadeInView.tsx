import { useEffect } from "react";
import { type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { motion, useReducedMotion } from "@/theme";

export type FadeInViewProps = ViewProps & {
  /** ms before animation starts */
  delay?: number;
  /** vertical offset at start (pt) */
  offsetY?: number;
};

export function FadeInView({
  delay = 0,
  offsetY = 10,
  children,
  style,
  ...props
}: FadeInViewProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : offsetY);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    opacity.value = withDelay(delay, withTiming(1, { duration: motion.duration.slow }));
    translateY.value = withDelay(delay, withTiming(0, { duration: motion.duration.slow }));
  }, [delay, offsetY, opacity, reduceMotion, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (reduceMotion) {
    return (
      <Animated.View style={style} {...props}>
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}
