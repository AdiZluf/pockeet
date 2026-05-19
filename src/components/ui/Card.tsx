import { Pressable, View, type PressableProps, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

export type CardProps = ViewProps & {
  interactive?: boolean;
  onPress?: PressableProps["onPress"];
};

export function Card({
  interactive,
  onPress,
  className,
  children,
  ...props
}: CardProps) {
  const classes = cn(
    "rounded-lg bg-surface p-4",
    interactive && "border border-border",
    className,
  );

  if (interactive && onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className={classes}
        {...(props as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={classes} {...props}>
      {children}
    </View>
  );
}
