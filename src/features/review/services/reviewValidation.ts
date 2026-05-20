import { parseMoneyInput } from "@/utils/money";

export type ReviewValidationResult = {
  ok: boolean;
  errors: {
    merchant?: string;
    date?: string;
    total?: string;
    lineItems?: string;
  };
  lineItemsMismatch?: boolean;
  parsedTotalMinor: number | null;
};

export function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return iso.slice(0, 10);
}

export function parseDateInput(value: string): string | null {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const parsed = new Date(`${trimmed}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export function validateReviewForm(
  merchantName: string,
  dateValue: string,
  totalInput: string,
  lineItems: { name: string; amountInput: string }[],
): ReviewValidationResult {
  const errors: ReviewValidationResult["errors"] = {};
  let lineItemsMismatch = false;

  const merchant = merchantName.trim();
  if (!merchant) errors.merchant = "required";

  const purchasedAt = parseDateInput(dateValue);
  if (!purchasedAt) errors.date = "invalid";

  const parsedTotalMinor = parseMoneyInput(totalInput);
  if (parsedTotalMinor == null || parsedTotalMinor <= 0) errors.total = "invalid";

  const filledItems = lineItems
    .map((item) => ({
      name: item.name.trim(),
      totalMinor: parseMoneyInput(item.amountInput),
    }))
    .filter((item) => item.name.length > 0 && item.totalMinor != null && item.totalMinor > 0);

  for (const item of lineItems) {
    const hasName = item.name.trim().length > 0;
    const parsedItem = parseMoneyInput(item.amountInput);
    const hasAmount = parsedItem != null && parsedItem > 0;
    if (hasName !== hasAmount) {
      errors.lineItems = "incomplete";
      break;
    }
  }

  if (
    parsedTotalMinor != null &&
    parsedTotalMinor > 0 &&
    filledItems.length > 0 &&
    !errors.lineItems
  ) {
    const lineSum = filledItems.reduce((sum, item) => sum + (item.totalMinor ?? 0), 0);
    const tolerance = Math.max(500, Math.round(parsedTotalMinor * 0.05));
    if (Math.abs(lineSum - parsedTotalMinor) > tolerance) {
      lineItemsMismatch = true;
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    lineItemsMismatch,
    parsedTotalMinor,
  };
}
