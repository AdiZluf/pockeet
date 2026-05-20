import { I18nManager, type TextStyle } from "react-native";
import type { Ionicons } from "@expo/vector-icons";

export type TextAlignIntent = "auto" | "start" | "end" | "center";

/** Whether native layout is RTL (after locale reload). */
export function isRTL(): boolean {
  return I18nManager.isRTL;
}

/** Back navigation chevron — points toward screen start. */
export function getBackChevronIcon(): keyof typeof Ionicons.glyphMap {
  return isRTL() ? "chevron-forward" : "chevron-back";
}

/** List/detail disclosure chevron — points toward screen end. */
export function getDisclosureChevronIcon(): keyof typeof Ionicons.glyphMap {
  return isRTL() ? "chevron-back" : "chevron-forward";
}

/** Cross-axis alignment for trailing slot content (amount + status). */
export function trailingColumnClass() {
  return isRTL() ? "items-start" : "items-end";
}

/**
 * React Native textAlign from logical intent.
 * NativeWind `text-start` / `text-end` are not supported by css-interop.
 */
export function textAlignFor(intent: TextAlignIntent): TextStyle["textAlign"] {
  switch (intent) {
    case "center":
      return "center";
    case "auto":
      return "auto";
    case "start":
      return isRTL() ? "right" : "left";
    case "end":
      return isRTL() ? "left" : "right";
  }
}

/** @deprecated Use textAlignFor("start") */
export function textAlignStart(): "right" | "left" {
  return textAlignFor("start") as "right" | "left";
}

/** Style fragment for logical start alignment (Text / TextInput). */
export function textAlignStyle(intent: TextAlignIntent): TextStyle {
  return { textAlign: textAlignFor(intent) };
}

/** LTR writing direction for money and numeric fields — no physical textAlign. */
export const moneyWritingProps = {
  writingDirection: "ltr" as const,
  style: { writingDirection: "ltr" as const },
};

/**
 * Money in Text: LTR digits + align to trailing slot edge in rows.
 * Hero/display amounts: pass align="start" on Text instead if needed.
 */
export const moneyTextProps = {
  ...moneyWritingProps,
  style: {
    ...moneyWritingProps.style,
    textAlign: textAlignFor("end"),
  },
};

/** TextInput default alignment (logical start). */
export const textInputAlignStartStyle: TextStyle = textAlignStyle("start");
