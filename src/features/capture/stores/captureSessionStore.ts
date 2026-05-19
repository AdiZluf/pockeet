import { create } from "zustand";

import { MAX_RECEIPT_PAGES } from "../constants";
import type { CaptureSessionImage } from "../types";

type CaptureSessionState = {
  images: CaptureSessionImage[];
  selectedIndex: number;
  reset: () => void;
  addImage: (image: CaptureSessionImage) => boolean;
  addImages: (images: CaptureSessionImage[]) => number;
  removeImage: (id: string) => void;
  updateImage: (id: string, patch: Partial<CaptureSessionImage>) => void;
  selectImage: (index: number) => void;
  canAddMore: () => boolean;
};

const initialState = {
  images: [] as CaptureSessionImage[],
  selectedIndex: 0,
};

export const useCaptureSessionStore = create<CaptureSessionState>((set, get) => ({
  ...initialState,
  reset: () => set({ ...initialState }),
  canAddMore: () => get().images.length < MAX_RECEIPT_PAGES,
  addImage: (image) => {
    if (!get().canAddMore()) return false;
    set((state) => ({
      images: [...state.images, image],
      selectedIndex: state.images.length,
    }));
    return true;
  },
  addImages: (incoming) => {
    let added = 0;
    for (const image of incoming) {
      if (!get().canAddMore()) break;
      const didAdd = get().addImage(image);
      if (didAdd) added += 1;
    }
    return added;
  },
  removeImage: (id) => {
    set((state) => {
      const images = state.images.filter((img) => img.id !== id);
      const selectedIndex = Math.min(state.selectedIndex, Math.max(images.length - 1, 0));
      return { images, selectedIndex };
    });
  },
  updateImage: (id, patch) => {
    set((state) => ({
      images: state.images.map((img) => (img.id === id ? { ...img, ...patch } : img)),
    }));
  },
  selectImage: (index) => {
    set((state) => {
      if (index < 0 || index >= state.images.length) return state;
      return { selectedIndex: index };
    });
  },
}));
