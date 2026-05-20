import { View } from "react-native";

import { Section, Surface } from "@/components/ui";
import type { ReceiptSummaryRow } from "@/features/home/services/homeSummary";
import { ReceiptListRow } from "@/features/receipts/components/ReceiptListRow";
import { useReceiptNavigation } from "@/features/receipts/hooks/useReceiptNavigation";
import { cn } from "@/utils/cn";

type ReceiptQueueSectionProps = {
  title: string;
  receipts: ReceiptSummaryRow[];
  highlight?: boolean;
};

export function ReceiptQueueSection({ title, receipts, highlight }: ReceiptQueueSectionProps) {
  const { openReceipt } = useReceiptNavigation();

  if (receipts.length === 0) return null;

  return (
    <Section title={title} className="px-5">
      <Surface
        variant="elevated"
        className={cn("overflow-hidden p-1", highlight && "border-s-[3px] border-s-accent")}
      >
        {receipts.map((row) => (
          <ReceiptListRow
            key={row.id}
            receipt={row}
            onPress={() => openReceipt(row.id, row.status)}
            showAmount
          />
        ))}
      </Surface>
    </Section>
  );
}
