import type { TextStyle } from "react-native";

export const fontFamily = {
  sans: "System",
  sansHe: "Heebo",
  display: "System",
} as const;

export const typography = {
  displayXl: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "500",
    letterSpacing: -0.5,
  },
  displayLg: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "500",
    letterSpacing: -0.3,
  },
  titleLg: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600",
  },
  titleMd: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600",
  },
  bodyLg: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "400",
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  bodySm: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "400",
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  micro: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
} as const satisfies Record<string, TextStyle>;

export const tabularNums: TextStyle = {
  fontVariant: ["tabular-nums"],
};
