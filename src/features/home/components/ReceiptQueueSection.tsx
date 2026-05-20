import { Section, GroupedList } from "@/components/ui";
import type { ReceiptSummaryRow } from "@/features/home/services/homeSummary";
import { ReceiptListRow } from "@/features/receipts/components/ReceiptListRow";
import { useReceiptNavigation } from "@/features/receipts/hooks/useReceiptNavigation";

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
      <GroupedList highlight={highlight}>
        {receipts.map((row) => (
          <ReceiptListRow
            key={row.id}
            receipt={row}
            onPress={() => openReceipt(row.id, row.status)}
            showAmount
          />
        ))}
      </GroupedList>
    </Section>
  );
}
