/**
 * Format minor units (agorot/cents) for display. Always LTR in UI.
 */
export function formatMoney(
  amountMinor: number,
  currencyCode: string,
  locale: string,
): string {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

export function parseMoneyInput(value: string): number | null {
  const normalized = value.replace(/[^\d.,]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed)) return null;
  return Math.round(parsed * 100);
}
