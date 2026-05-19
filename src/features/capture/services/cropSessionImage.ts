import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import type { CropRect } from "../utils/computeCropRect";

export async function cropSessionImage(uri: string, crop: CropRect) {
  return manipulateAsync(uri, [{ crop }], {
    compress: 0.85,
    format: SaveFormat.JPEG,
  });
}
