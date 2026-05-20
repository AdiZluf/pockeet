import { create } from "zustand";

export type PendingAddReceiptAction = "camera" | "gallery" | "pdf";

type AddReceiptSheetState = {
  visible: boolean;
  pendingAction: PendingAddReceiptAction | null;
  open: () => void;
  close: () => void;
  queueAction: (action: PendingAddReceiptAction) => void;
  takePendingAction: () => PendingAddReceiptAction | null;
};

export const useAddReceiptSheetStore = create<AddReceiptSheetState>((set, get) => ({
  visible: false,
  pendingAction: null,
  open: () => set({ visible: true, pendingAction: null }),
  close: () => set({ visible: false }),
  queueAction: (action) => set({ pendingAction: action }),
  takePendingAction: () => {
    const action = get().pendingAction;
    if (action) {
      set({ pendingAction: null });
    }
    return action;
  },
}));
