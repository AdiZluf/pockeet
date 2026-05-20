import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from "react-native";

import { cn } from "@/utils/cn";

export type TextAlignIntent = "auto" | "start" | "end" | "center";

export type TextProps = RNTextProps & {
  variant?:
    | "body"
    | "bodyLg"
    | "bodySm"
    | "label"
    | "caption"
    | "titleMd"
    | "titleLg"
    | "displayLg"
    | "displayXl"
    | "displayHero"
    | "micro";
  muted?: boolean;
  tabular?: boolean;
  /** Text alignment (LTR). */
  align?: TextAlignIntent;
};

const variantClass: Record<NonNullable<TextProps["variant"]>, string> = {
  displayHero: "text-display-hero font-display-bold text-foreground",
  displayXl: "text-display-xl font-display text-foreground",
  displayLg: "text-display-lg font-display text-foreground",
  titleLg: "text-title-lg font-sans-bold text-foreground",
  titleMd: "text-title-md font-sans-semibold text-foreground",
  bodyLg: "text-body-lg font-sans text-foreground",
  body: "text-body font-sans text-foreground",
  bodySm: "text-body-sm font-sans text-foreground",
  label: "text-label font-sans-semibold text-foreground",
  caption: "text-caption font-sans-medium text-foreground-secondary",
  micro: "text-micro font-sans-medium text-foreground-secondary",
};

function textAlignFor(intent: TextAlignIntent): TextStyle["textAlign"] | undefined {
  switch (intent) {
    case "center":
      return "center";
    case "start":
      return "left";
    case "end":
      return "right";
    case "auto":
      return undefined;
  }
}

export function Text({
  variant = "body",
  muted,
  tabular,
  align = "auto",
  className,
  style,
  ...props
}: TextProps) {
  const alignStyle = align === "auto" ? undefined : { textAlign: textAlignFor(align) };

  return (
    <RNText
      className={cn(
        variantClass[variant],
        muted && "text-foreground-secondary",
        tabular && "tabular-nums",
        (variant.startsWith("display") || variant === "displayHero") && "tracking-tight",
        className,
      )}
      style={[alignStyle, style]}
      {...props}
    />
  );
}
