import { useLocalSearchParams } from "expo-router";

import { ReceiptProcessingView } from "@/features/parse/components/ReceiptProcessingView";

export default function ReceiptProcessingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <ReceiptProcessingView receiptId={id} />;
}
