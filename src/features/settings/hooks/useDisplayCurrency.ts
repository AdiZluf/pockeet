import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  getDefaultCurrency,
  type DisplayCurrency,
} from "@/db/repositories/preferencesRepository";

export function useDisplayCurrency() {
  const [currency, setCurrency] = useState<DisplayCurrency>("ILS");
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const code = await getDefaultCurrency();
    setCurrency(code);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { currency, isLoading, refresh, setCurrency };
}
