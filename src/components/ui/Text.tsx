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
    | "micro";
  muted?: boolean;
  tabular?: boolean;
  /** Text alignment (LTR). */
  align?: TextAlignIntent;
};

const variantClass: Record<NonNullable<TextProps["variant"]>, string> = {
  displayXl: "text-display-xl text-foreground",
  displayLg: "text-display-lg text-foreground",
  titleLg: "text-title-lg text-foreground",
  titleMd: "text-title-md text-foreground",
  bodyLg: "text-body-lg text-foreground",
  body: "text-body text-foreground",
  bodySm: "text-body-sm text-foreground",
  label: "text-label text-foreground",
  caption: "text-caption text-foreground-secondary",
  micro: "text-micro text-foreground-secondary",
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
        variant.startsWith("display") && "tracking-tight",
        className,
      )}
      style={[alignStyle, style]}
      {...props}
    />
  );
}
