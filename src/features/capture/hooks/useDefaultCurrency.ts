import { useDisplayCurrency } from "@/features/settings/hooks/useDisplayCurrency";

/** Default display currency from app preferences (ILS / USD / EUR). */
export function useDefaultCurrency() {
  const { currency } = useDisplayCurrency();
  return currency;
}
