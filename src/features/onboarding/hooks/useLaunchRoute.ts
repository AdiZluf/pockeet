import { useEffect, useState } from "react";
import type { Href } from "expo-router";

import { resolveLaunchRoute } from "../services/onboardingGate";

export function useLaunchRoute() {
  const [href, setHref] = useState<Href | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const route = await resolveLaunchRoute();
        if (!cancelled) setHref(route);
      } catch {
        if (!cancelled) setHref("/(tabs)");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { href, loading: href === null };
}
