import { useTheme } from "./ThemeProvider";

/** Semantic icon / spinner colors — use instead of raw hex in UI and features */
export function useIconColors() {
  const { colors } = useTheme();

  return {
    accent: colors.accent,
    inverse: colors.textInverse,
    primary: colors.textPrimary,
    tertiary: colors.textTertiary,
    secondary: colors.textSecondary,
  } as const;
}
