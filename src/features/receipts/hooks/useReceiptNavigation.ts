import { useRouter } from "expo-router";

import type { ReceiptStatus } from "@/db/schema";
import type { ReviewSource } from "@/features/review/types";

export function useReceiptNavigation() {
  const router = useRouter();

  const openReview = (id: string, source: ReviewSource = "queue") => {
    router.push({
      pathname: "/receipt/[id]/review",
      params: { id, source },
    });
  };

  const openReceipt = (id: string, status: ReceiptStatus) => {
    if (status === "needs_review") {
      openReview(id, "queue");
      return;
    }
    if (status === "processing" || status === "draft") {
      router.push(`/receipt/${id}/processing`);
      return;
    }
    router.push(`/receipt/${id}`);
  };

  return { openReceipt, openReview };
}
