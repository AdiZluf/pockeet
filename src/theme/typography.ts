import type { TextStyle } from "react-native";

export const fontFamily = {
  sans: "PlusJakartaSans_400Regular",
  sansMedium: "PlusJakartaSans_500Medium",
  sansSemiBold: "PlusJakartaSans_600SemiBold",
  sansBold: "PlusJakartaSans_700Bold",
  display: "Outfit_600SemiBold",
  displayBold: "Outfit_700Bold",
} as const;

export const typography = {
  displayHero: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: "700" as const,
    fontFamily: fontFamily.displayBold,
    letterSpacing: -1,
  },
  displayXl: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "600" as const,
    fontFamily: fontFamily.display,
    letterSpacing: -0.8,
  },
  displayLg: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "600" as const,
    fontFamily: fontFamily.display,
    letterSpacing: -0.5,
  },
  titleLg: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700" as const,
    fontFamily: fontFamily.sansBold,
    letterSpacing: -0.3,
  },
  titleMd: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600" as const,
    fontFamily: fontFamily.sansSemiBold,
  },
  bodyLg: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "400" as const,
    fontFamily: fontFamily.sans,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400" as const,
    fontFamily: fontFamily.sans,
  },
  bodySm: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "400" as const,
    fontFamily: fontFamily.sans,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
    fontFamily: fontFamily.sansSemiBold,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500" as const,
    fontFamily: fontFamily.sansMedium,
  },
  micro: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500" as const,
    fontFamily: fontFamily.sansMedium,
    letterSpacing: 0.2,
  },
} as const satisfies Record<string, TextStyle>;

export const tabularNums: TextStyle = {
  fontVariant: ["tabular-nums"],
};
