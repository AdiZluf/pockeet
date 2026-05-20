import type { ViewStyle } from "react-native";

/** Shared elevation — use via Surface / HeroSurface primitives, not in features. */
export const surfaceElevation = {
  ambient: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  card: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  raised: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 5,
  },
  floating: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 32,
    elevation: 8,
  },
  fab: {
    shadowColor: "#1F6F78",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 24,
    elevation: 8,
  },
} as const satisfies Record<string, ViewStyle>;
