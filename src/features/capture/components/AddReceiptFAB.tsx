import { useCallback, useEffect, useState } from "react";
import { InteractionManager, Platform } from "react-native";
import { useTranslation } from "react-i18next";

import { FAB } from "@/components/ui";

import { useAddReceipt } from "../hooks/useAddReceipt";
import {
  type PendingAddReceiptAction,
  useAddReceiptSheetStore,
} from "../stores/addReceiptSheetStore";
import { AddReceiptSheet } from "./AddReceiptSheet";

export function AddReceiptFAB() {
  const { t } = useTranslation();
  const sheetOpen = useAddReceiptSheetStore((s) => s.visible);
  const openSheet = useAddReceiptSheetStore((s) => s.open);
  const closeSheet = useAddReceiptSheetStore((s) => s.close);
  const queueAction = useAddReceiptSheetStore((s) => s.queueAction);
  const takePendingAction = useAddReceiptSheetStore((s) => s.takePendingAction);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { openCamera, openGallery, openPdf } = useAddReceipt();

  const runPendingAction = useCallback(
    (action: PendingAddReceiptAction) => {
      switch (action) {
        case "camera":
          void openCamera();
          break;
        case "gallery":
          void openGallery();
          break;
        case "pdf":
          setPdfLoading(true);
          void openPdf().finally(() => setPdfLoading(false));
          break;
      }
    },
    [openCamera, openGallery, openPdf],
  );

  const flushPendingAfterDismiss = useCallback(() => {
    const action = takePendingAction();
    if (!action) return;
    runPendingAction(action);
  }, [runPendingAction, takePendingAction]);

  useEffect(() => {
    if (sheetOpen || Platform.OS !== "android") return;
    if (!useAddReceiptSheetStore.getState().pendingAction) return;

    const task = InteractionManager.runAfterInteractions(() => {
      flushPendingAfterDismiss();
    });
    return () => task.cancel();
  }, [sheetOpen, flushPendingAfterDismiss]);

  const queueAndClose = useCallback(
    (option: PendingAddReceiptAction) => {
      queueAction(option);
      closeSheet();
    },
    [closeSheet, queueAction],
  );

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
        onDismissed={flushPendingAfterDismiss}
        onTakePhoto={() => queueAndClose("camera")}
        onChooseGallery={() => queueAndClose("gallery")}
        onUploadPdf={() => queueAndClose("pdf")}
        pdfLoading={pdfLoading}
      />
    </>
  );
}
