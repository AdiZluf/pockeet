import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { CanvasBackground, ScreenHeader } from "@/components/ui";
import {
  DEFAULT_RECEIPT_FILTERS,
  type ReceiptFilters,
} from "@/db/receiptFilters";
import { AddReceiptFAB } from "@/features/capture/components/AddReceiptFAB";
import { ReceiptFilterBar } from "@/features/receipts/components/ReceiptFilterBar";
import { ReceiptFiltersSheet } from "@/features/receipts/components/ReceiptFiltersSheet";
import { ReceiptsListView } from "@/features/receipts/components/ReceiptsListView";
import {
  filtersFromSearchParams,
  filtersToSearchParams,
} from "@/features/receipts/utils/filterParams";
import { filtersSubtitle } from "@/features/receipts/utils/filterLabels";

/**
 * Receipts tab — filterable receipt management.
 * @see docs/ux/screens/receipts-list.md
 */
export default function ReceiptsTabScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [filters, setFilters] = useState<ReceiptFilters>(() =>
    filtersFromSearchParams(params),
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setFilters(filtersFromSearchParams(params));
  }, [params.month, params.status, params.categories, params.from, params.to]);

  const applyFilters = useCallback(
    (next: ReceiptFilters) => {
      setFilters(next);
      router.setParams(filtersToSearchParams(next));
    },
    [router],
  );

  const subtitle = filtersSubtitle(filters, t);

  return (
    <CanvasBackground style={{ paddingTop: insets.top }}>
      <ScreenHeader title={t("tabs.receipts")} subtitle={subtitle} large />
      <ReceiptFilterBar
        filters={filters}
        onOpenFilters={() => setSheetOpen(true)}
        onChangeFilters={applyFilters}
        onClearAll={() => applyFilters(DEFAULT_RECEIPT_FILTERS)}
      />
      <ReceiptsListView
        filters={filters}
        onClearFilters={() => applyFilters(DEFAULT_RECEIPT_FILTERS)}
      />
      <ReceiptFiltersSheet
        visible={sheetOpen}
        initial={filters}
        onClose={() => setSheetOpen(false)}
        onApply={applyFilters}
      />
      <AddReceiptFAB />
    </CanvasBackground>
  );
}
