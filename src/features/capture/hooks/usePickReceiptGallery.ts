import { useTranslation } from "react-i18next";

import { pickReceiptGalleryImages } from "../services/pickReceiptGallery";

/** @returns number of images added (0 if canceled or failed) */
export function usePickReceiptGallery() {
  const { t } = useTranslation();

  return async (): Promise<number> => {
    const result = await pickReceiptGalleryImages(t);
    return result.status === "added" ? result.count : 0;
  };
}
