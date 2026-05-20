import { useRouter } from "expo-router";

import type { ReceiptStatus } from "@/db/schema";

export function useReceiptNavigation() {
  const router = useRouter();

  const openReceipt = (id: string, status: ReceiptStatus) => {
    if (status === "processing" || status === "draft") {
      router.push(`/receipt/${id}/processing`);
      return;
    }
    router.push(`/receipt/${id}`);
  };

  return { openReceipt };
}
