import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FAB } from "@/components/ui";

import { useAddReceipt } from "../hooks/useAddReceipt";
import { useAddReceiptSheetStore } from "../stores/addReceiptSheetStore";
import { AddReceiptSheet } from "./AddReceiptSheet";

export function AddReceiptFAB() {
  const { t } = useTranslation();
  const sheetOpen = useAddReceiptSheetStore((s) => s.visible);
  const openSheet = useAddReceiptSheetStore((s) => s.open);
  const closeSheet = useAddReceiptSheetStore((s) => s.close);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { openCamera, openGallery, openPdf } = useAddReceipt();

  const handlePdf = async () => {
    setPdfLoading(true);
    try {
      await openPdf();
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <>
      <FAB
        icon="add"
        accessibilityLabel={t("fab.addReceipt")}
        onPress={openSheet}
      />
      <AddReceiptSheet
        visible={sheetOpen}
        onClose={closeSheet}
        onTakePhoto={openCamera}
        onChooseGallery={() => void openGallery()}
        onUploadPdf={() => void handlePdf()}
        pdfLoading={pdfLoading}
      />
    </>
  );
}
