export type CropRect = {
  originX: number;
  originY: number;
  width: number;
  height: number;
};

/**
 * Maps on-screen pan/zoom inside a fixed crop window to pixel coordinates on the source image.
 */
export function computeCropRect(params: {
  imageWidth: number;
  imageHeight: number;
  cropWindowWidth: number;
  cropWindowHeight: number;
  scale: number;
  translateX: number;
  translateY: number;
}): CropRect {
  const { imageWidth, imageHeight, cropWindowWidth, cropWindowHeight, scale, translateX, translateY } =
    params;

  const originX = clamp(Math.round(-translateX / scale), 0, imageWidth - 1);
  const originY = clamp(Math.round(-translateY / scale), 0, imageHeight - 1);
  const width = clamp(Math.round(cropWindowWidth / scale), 1, imageWidth - originX);
  const height = clamp(Math.round(cropWindowHeight / scale), 1, imageHeight - originY);

  return { originX, originY, width, height };
}

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

export function minCoverScale(
  imageWidth: number,
  imageHeight: number,
  cropWindowWidth: number,
  cropWindowHeight: number,
) {
  return Math.max(cropWindowWidth / imageWidth, cropWindowHeight / imageHeight);
}

export function centerTranslation(
  imageWidth: number,
  imageHeight: number,
  scale: number,
  cropWindowWidth: number,
  cropWindowHeight: number,
) {
  const displayW = imageWidth * scale;
  const displayH = imageHeight * scale;
  return {
    x: (cropWindowWidth - displayW) / 2,
    y: (cropWindowHeight - displayH) / 2,
  };
}

export function clampTranslation(
  translateX: number,
  translateY: number,
  imageWidth: number,
  imageHeight: number,
  scale: number,
  cropWindowWidth: number,
  cropWindowHeight: number,
) {
  "worklet";
  const displayW = imageWidth * scale;
  const displayH = imageHeight * scale;
  const minX = cropWindowWidth - displayW;
  const minY = cropWindowHeight - displayH;
  return {
    x: clamp(translateX, minX, 0),
    y: clamp(translateY, minY, 0),
  };
}
