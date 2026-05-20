export type ReviewLineItemDraft = {
  id: string;
  name: string;
  amountInput: string;
};

export type ReviewFormDraft = {
  merchantName: string;
  dateValue: string;
  totalInput: string;
  categoryId: string | null;
  lineItems: ReviewLineItemDraft[];
};

export type ReviewSource = "scan" | "detail" | "queue";
