import { useLocalSearchParams } from "expo-router";

import { ReceiptReviewView } from "@/features/review/components/ReceiptReviewView";
import type { ReviewSource } from "@/features/review/types";

export default function ReceiptReviewScreen() {
  const { id, source } = useLocalSearchParams<{ id: string; source?: string }>();
  const reviewSource: ReviewSource =
    source === "detail" || source === "scan" || source === "queue" ? source : "queue";

  return <ReceiptReviewView receiptId={id ?? ""} source={reviewSource} />;
}
