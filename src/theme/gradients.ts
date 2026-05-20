import { semanticLight } from "./semantic.light";

/** Programmatic gradient stops for expo-linear-gradient in primitives only. */
export const brandGradients = {
  hero: [semanticLight.accentGradientStart, semanticLight.accentGradientEnd] as const,
  heroAngle: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  iconWell: ["#1F6F78", "#3D9AA6"] as const,
  button: ["#185A61", "#2A8A94"] as const,
  userBubble: ["#1F6F78", "#2A8A94"] as const,
  featuredBorder: ["#3D9AA6", "#C4A574", "#1F6F78"] as const,
  onboardingScan: ["#185A61", "#3D9AA6"] as const,
  onboardingOrganize: ["#3D5A7A", "#7B9CB8"] as const,
  onboardingClarity: ["#8B7355", "#C4A574"] as const,
} as const;

export type OnboardingSlideKey = "scan" | "organize" | "clarity";

export function onboardingSlideGradient(key: OnboardingSlideKey): readonly [string, string] {
  switch (key) {
    case "scan":
      return brandGradients.onboardingScan;
    case "organize":
      return brandGradients.onboardingOrganize;
    case "clarity":
      return brandGradients.onboardingClarity;
  }
}
