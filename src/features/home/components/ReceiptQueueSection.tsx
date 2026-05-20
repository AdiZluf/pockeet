import { View } from "react-native";

import { DividerList, ElevatedGroup, ReceiptRow, SectionHeader } from "@/components/ui";
import type { ReceiptSummaryRow } from "@/features/home/services/homeSummary";
import { useReceiptNavigation } from "@/features/receipts/hooks/useReceiptNavigation";

type ReceiptQueueSectionProps = {
  title: string;
  receipts: ReceiptSummaryRow[];
  accentEdge?: boolean;
};

export function ReceiptQueueSection({ title, receipts, accentEdge }: ReceiptQueueSectionProps) {
  const { openReceipt } = useReceiptNavigation();

  if (receipts.length === 0) return null;

  return (
    <View className="pb-4 pt-6">
      <SectionHeader title={title} className="mb-3" />
      <ElevatedGroup accentEdge={accentEdge}>
        <DividerList>
          {receipts.map((row) => (
            <ReceiptRow
              key={row.id}
              receipt={row}
              onPress={() => openReceipt(row.id, row.status)}
              showAmount
            />
          ))}
        </DividerList>
      </ElevatedGroup>
    </View>
  );
}
