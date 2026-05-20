import { Pressable, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { motion, useReducedMotion } from "@/theme";

type PressableScaleProps = PressableProps & {
  scaleTo?: number;
  children: React.ReactNode;
};

export function PressableScale({
  children,
  scaleTo = motion.scale.pressed,
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...props
}: PressableScaleProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (reduceMotion) {
    return (
      <Pressable disabled={disabled} style={style} {...props}>
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={disabled}
      onPressIn={(event) => {
        if (!disabled) {
          scale.value = withTiming(scaleTo, { duration: motion.duration.fast });
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withTiming(1, { duration: motion.duration.normal });
        onPressOut?.(event);
      }}
      style={style}
      {...props}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
