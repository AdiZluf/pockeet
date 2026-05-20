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
  className,
  ...props
}: PressableScaleProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (reduceMotion) {
    return (
      <Pressable disabled={disabled} className={className} style={style} {...props}>
        {children}
      </Pressable>
    );
  }

  // PressableProps.style can be a state callback; Animated.View only takes a
  // static style. In practice none of the call-sites pass a function style,
  // but we guard to keep TypeScript happy.
  const staticStyle = typeof style === "function" ? undefined : style;

  // Layout styles go on the Animated.View so children see the correct flex
  // context. The outer Pressable is an unstyled touch target that defaults to
  // flex-col/stretch, which lets the Animated.View fill its full width.
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
      {...props}
    >
      <Animated.View className={className} style={[staticStyle, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
