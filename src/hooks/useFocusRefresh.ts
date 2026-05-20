import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

/**
 * Loads on tab focus without flashing skeleton on every revisit.
 * Skeleton shows only until the first successful load.
 */
export function useFocusRefresh<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasLoaded = useRef(false);

  const refresh = useCallback(async () => {
    if (!hasLoaded.current) setIsRefreshing(true);
    try {
      const next = await loader();
      setData(next);
      hasLoaded.current = true;
      return next;
    } finally {
      setIsRefreshing(false);
    }
  }, [loader]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return {
    data,
    isInitialLoad: !hasLoaded.current && isRefreshing,
    isRefreshing: hasLoaded.current && isRefreshing,
    refresh,
    setData,
  };
}
