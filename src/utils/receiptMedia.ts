/** Detect receipt attachment type from a local file URI or path. */
export function isPdfUri(uri: string): boolean {
  const path = uri.split("?")[0]?.toLowerCase() ?? "";
  return path.endsWith(".pdf");
}

export function receiptMediaFileName(uri: string): string {
  const segment = uri.split("/").pop()?.split("?")[0];
  return segment && segment.length > 0 ? segment : "receipt.pdf";
}
