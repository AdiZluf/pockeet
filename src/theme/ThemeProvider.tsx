import React, { createContext, useContext, useMemo } from "react";

import { semanticDark } from "./semantic.dark";
import { semanticLight } from "./semantic.light";

export type ThemeMode = "light" | "dark";
export type SemanticColors = typeof semanticLight | typeof semanticDark;

type ThemeContextValue = {
  mode: ThemeMode;
  colors: SemanticColors;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  colors: semanticLight,
});

export function ThemeProvider({
  mode = "light",
  children,
}: {
  mode?: ThemeMode;
  children: React.ReactNode;
}) {
  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: mode === "dark" ? semanticDark : semanticLight,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
