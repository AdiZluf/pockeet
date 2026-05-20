import { useLocalSearchParams } from "expo-router";

import { ReceiptDetailView } from "@/features/receipts/components/ReceiptDetailView";

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ReceiptDetailView receiptId={id ?? ""} />;
}
