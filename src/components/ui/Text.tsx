import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { cn } from "@/utils/cn";

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

export function Text({
  variant = "body",
  muted,
  tabular,
  className,
  ...props
}: TextProps) {
  return (
    <RNText
      className={cn(
        variantClass[variant],
        muted && "text-foreground-secondary",
        tabular && "tabular-nums",
        variant.startsWith("display") && "tracking-tight",
        className,
      )}
      {...props}
    />
  );
}
