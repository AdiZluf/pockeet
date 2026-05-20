import { View, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { cn } from "@/utils/cn";

/** Warm sand canvas gradient for tab screens. */
export function CanvasBackground({ className, children, style, ...props }: ViewProps) {
  return (
    <View className={cn("flex-1", className)} style={style} {...props}>
      <LinearGradient
        colors={["#F7F2EB", "#F3EFE8", "#EBE4DA"]}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
        pointerEvents="none"
      />
      {children}
    </View>
  );
}
