import { View, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { brandGradients } from "@/theme/gradients";
import { surfaceElevation } from "@/theme/surfaces";
import { cn } from "@/utils/cn";

export type HeroSurfaceProps = ViewProps & {
  children: React.ReactNode;
  showOrb?: boolean;
};

export function HeroSurface({ children, showOrb = true, className, style, ...props }: HeroSurfaceProps) {
  return (
    <View
      className={cn("overflow-hidden rounded-2xl", className)}
      style={[surfaceElevation.raised, style]}
      {...props}
    >
      <LinearGradient
        colors={[...brandGradients.hero]}
        start={brandGradients.heroAngle.start}
        end={brandGradients.heroAngle.end}
        style={{ position: "relative" }}
      >
        {showOrb ? (
          <View
            style={{
              position: "absolute",
              top: -32,
              right: -32,
              width: 128,
              height: 128,
              borderRadius: 64,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
            accessibilityElementsHidden
          />
        ) : null}
        {children}
      </LinearGradient>
    </View>
  );
}
