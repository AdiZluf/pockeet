import { create } from "zustand";

type AddReceiptSheetState = {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useAddReceiptSheetStore = create<AddReceiptSheetState>((set) => ({
  visible: false,
  open: () => set({ visible: true }),
  close: () => set({ visible: false }),
}));
