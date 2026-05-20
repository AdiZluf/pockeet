import type { ViewStyle } from "react-native";

/** Shared elevation — use via Surface primitive, not in features. */
export const surfaceElevation = {
  card: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  fab: {
    shadowColor: "#1F6F78",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 6,
  },
} as const satisfies Record<string, ViewStyle>;
