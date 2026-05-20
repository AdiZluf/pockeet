import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

import { Surface } from "./Surface";

export type ElevatedGroupProps = ViewProps & {
  /** Accent leading stripe for attention sections (e.g. needs review). */
  accentEdge?: boolean;
  children: React.ReactNode;
};

/** Premium elevated card group — soft shadow, rounded panel. */
export function ElevatedGroup({
  accentEdge,
  className,
  children,
  ...props
}: ElevatedGroupProps) {
  return (
    <Surface
      variant="panel"
      className={cn(
        "mx-5 overflow-hidden",
        accentEdge && "border-s-[3px] border-s-accent",
        className,
      )}
      {...props}
    >
      {children}
    </Surface>
  );
}
