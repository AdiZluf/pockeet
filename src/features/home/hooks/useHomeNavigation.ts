import { useRouter } from "expo-router";

import type { ReceiptStatusFilter } from "@/db/receiptFilters";
import { filtersToSearchParams } from "@/features/receipts/utils/filterParams";

export function useHomeNavigation() {
  const router = useRouter();

  const openReceiptsFiltered = (filters: {
    month?: string;
    categories?: string[];
    status?: ReceiptStatusFilter;
  }) => {
    const params = filtersToSearchParams({
      month: filters.month,
      categories: filters.categories ?? [],
      status: filters.status ?? "all",
    });
    router.push({
      pathname: "/(tabs)/receipts",
      params,
    });
  };

  const openAllReceipts = () => {
    router.push("/(tabs)/receipts");
  };

  return { openReceiptsFiltered, openAllReceipts };
}
