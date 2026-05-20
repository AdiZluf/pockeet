import { Pressable, View, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { motion } from "@/theme";

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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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
