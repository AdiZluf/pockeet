import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Image as RNImage,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

import { Button, Text } from "@/components/ui";

import { CaptureActionButton, CaptureActionsPanel } from "./CaptureActionButton";

import { cropSessionImage } from "../services/cropSessionImage";
import { useCaptureSessionStore } from "../stores/captureSessionStore";
import {
  centerTranslation,
  clampTranslation,
  computeCropRect,
  minCoverScale,
} from "../utils/computeCropRect";

const CROP_PADDING = 20;
const HEADER_HEIGHT = 52;
const FOOTER_BASE_HEIGHT = 148;

type CaptureCropViewProps = {
  imageId: string;
};

function loadImageSize(uri: string, fallback?: { width?: number; height?: number }) {
  if (fallback?.width && fallback?.height) {
    return Promise.resolve({ width: fallback.width, height: fallback.height });
  }
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    RNImage.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}

export function CaptureCropView({ imageId }: CaptureCropViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [isApplying, setIsApplying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const image = useCaptureSessionStore((s) => s.images.find((img) => img.id === imageId));
  const updateImage = useCaptureSessionStore((s) => s.updateImage);

  const cropWindow = useMemo(() => {
    const cropWidth = screenWidth - CROP_PADDING * 2;
    const workspaceTop = insets.top + 8 + HEADER_HEIGHT + 12;
    const workspaceBottom = screenHeight - (FOOTER_BASE_HEIGHT + insets.bottom);
    const workspaceHeight = Math.max(200, workspaceBottom - workspaceTop);
    const cropHeight = Math.min(cropWidth * 1.35, workspaceHeight * 0.82);
    const cropTop = workspaceTop + Math.max(8, (workspaceHeight - cropHeight) * 0.06);
    const cropLeft = CROP_PADDING;
    return { cropWidth, cropHeight, cropTop, cropLeft };
  }, [screenWidth, screenHeight, insets.bottom, insets.top]);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const minScale = useSharedValue(1);
  const imageWidth = useSharedValue(1);
  const imageHeight = useSharedValue(1);
  const cropWindowWidth = useSharedValue(cropWindow.cropWidth);
  const cropWindowHeight = useSharedValue(cropWindow.cropHeight);
  const initialScale = useSharedValue(1);
  const initialTranslateX = useSharedValue(0);
  const initialTranslateY = useSharedValue(0);

  useEffect(() => {
    cropWindowWidth.value = cropWindow.cropWidth;
    cropWindowHeight.value = cropWindow.cropHeight;
  }, [cropWindow.cropHeight, cropWindow.cropWidth, cropWindowHeight, cropWindowWidth]);

  useEffect(() => {
    if (!image) return;

    let cancelled = false;

    void (async () => {
      try {
        const size = await loadImageSize(image.uri, image);
        if (cancelled) return;

        const coverScale = minCoverScale(
          size.width,
          size.height,
          cropWindow.cropWidth,
          cropWindow.cropHeight,
        );
        const centered = centerTranslation(
          size.width,
          size.height,
          coverScale,
          cropWindow.cropWidth,
          cropWindow.cropHeight,
        );

        imageWidth.value = size.width;
        imageHeight.value = size.height;
        minScale.value = coverScale;
        scale.value = coverScale;
        savedScale.value = coverScale;
        initialScale.value = coverScale;
        translateX.value = centered.x;
        translateY.value = centered.y;
        savedTranslateX.value = centered.x;
        savedTranslateY.value = centered.y;
        initialTranslateX.value = centered.x;
        initialTranslateY.value = centered.y;
        setIsReady(true);
      } catch {
        if (!cancelled) {
          Alert.alert(t("capture.cropFailedTitle"), t("capture.cropFailedBody"));
          router.back();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    cropWindow.cropHeight,
    cropWindow.cropWidth,
    image,
    imageHeight,
    imageWidth,
    minScale,
    router,
    savedScale,
    savedTranslateX,
    savedTranslateY,
    scale,
    t,
    translateX,
    translateY,
  ]);

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      const nextScale = Math.max(minScale.value, savedScale.value * event.scale);
      const ratio = nextScale / savedScale.value;
      const focalX = cropWindowWidth.value / 2;
      const focalY = cropWindowHeight.value / 2;
      const imageX = focalX - savedTranslateX.value;
      const imageY = focalY - savedTranslateY.value;

      scale.value = nextScale;
      translateX.value = focalX - imageX * ratio;
      translateY.value = focalY - imageY * ratio;

      const clamped = clampTranslation(
        translateX.value,
        translateY.value,
        imageWidth.value,
        imageHeight.value,
        scale.value,
        cropWindowWidth.value,
        cropWindowHeight.value,
      );
      translateX.value = clamped.x;
      translateY.value = clamped.y;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      const clamped = clampTranslation(
        savedTranslateX.value + event.translationX,
        savedTranslateY.value + event.translationY,
        imageWidth.value,
        imageHeight.value,
        scale.value,
        cropWindowWidth.value,
        cropWindowHeight.value,
      );
      translateX.value = clamped.x;
      translateY.value = clamped.y;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const imageStyle = useAnimatedStyle(() => ({
    width: imageWidth.value * scale.value,
    height: imageHeight.value * scale.value,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const handleCancel = () => {
    router.back();
  };

  const handleResetCrop = () => {
    scale.value = initialScale.value;
    savedScale.value = initialScale.value;
    translateX.value = initialTranslateX.value;
    translateY.value = initialTranslateY.value;
    savedTranslateX.value = initialTranslateX.value;
    savedTranslateY.value = initialTranslateY.value;
  };

  const handleApply = async () => {
    if (!image || isApplying) return;

    try {
      setIsApplying(true);
      const crop = computeCropRect({
        imageWidth: imageWidth.value,
        imageHeight: imageHeight.value,
        cropWindowWidth: cropWindowWidth.value,
        cropWindowHeight: cropWindowHeight.value,
        scale: scale.value,
        translateX: translateX.value,
        translateY: translateY.value,
      });

      if (crop.width < 1 || crop.height < 1) {
        throw new Error("Invalid crop dimensions");
      }

      const result = await cropSessionImage(image.uri, crop);
      updateImage(image.id, {
        uri: result.uri,
        width: result.width,
        height: result.height,
      });
      router.back();
    } catch {
      Alert.alert(t("capture.cropFailedTitle"), t("capture.cropFailedBody"));
    } finally {
      setIsApplying(false);
    }
  };

  if (!image) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-5">
        <Text variant="body" muted>
          {t("capture.cropMissingImage")}
        </Text>
        <Button className="mt-4" label={t("capture.back")} onPress={() => router.back()} />
      </View>
    );
  }

  const { cropWidth, cropHeight, cropTop, cropLeft } = cropWindow;

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between px-5 py-3"
        style={{ paddingTop: insets.top + 8, minHeight: insets.top + 8 + HEADER_HEIGHT }}
      >
        <CaptureActionButton
          variant="default"
          label={t("common.cancel")}
          onPress={handleCancel}
          block={false}
          className="min-w-[100px] px-3"
        />
        <Text variant="label">{t("capture.cropTitle")}</Text>
        <View className="min-w-[100px]" />
      </View>

      <View className="relative min-h-0 flex-1">
        {!isReady ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator accessibilityLabel={t("common.loading")} />
          </View>
        ) : (
          <>
            <View
              pointerEvents="none"
              className="absolute left-0 right-0 bg-overlay"
              style={{ top: 0, height: cropTop }}
            />
            <View
              pointerEvents="none"
              className="absolute left-0 right-0 bg-overlay"
              style={{ top: cropTop + cropHeight, bottom: 0 }}
            />
            <View
              pointerEvents="none"
              className="absolute bg-overlay"
              style={{ top: cropTop, left: 0, width: cropLeft, height: cropHeight }}
            />
            <View
              pointerEvents="none"
              className="absolute bg-overlay"
              style={{
                top: cropTop,
                left: cropLeft + cropWidth,
                right: 0,
                height: cropHeight,
              }}
            />

            <View
              className="absolute overflow-hidden rounded-xl border-2 border-foreground-inverse"
              style={{
                top: cropTop,
                left: cropLeft,
                width: cropWidth,
                height: cropHeight,
              }}
              accessibilityLabel={t("capture.cropFrameLabel")}
            >
              <GestureDetector gesture={composedGesture}>
                <Animated.View style={{ flex: 1 }}>
                  <AnimatedImage
                    source={{ uri: image.uri }}
                    style={imageStyle}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                  />
                </Animated.View>
              </GestureDetector>
            </View>

            <View
              pointerEvents="none"
              className="absolute rounded-xl border-2 border-accent"
              style={{
                top: cropTop,
                left: cropLeft,
                width: cropWidth,
                height: cropHeight,
              }}
            />
          </>
        )}
      </View>

      <View
        className="shrink-0 border-t border-border-subtle bg-background px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <CaptureActionsPanel>
          <Text variant="body" muted align="center" className="leading-5">
            {t("capture.cropHint")}
          </Text>
          <CaptureActionButton
            variant="default"
            icon="refresh-outline"
            label={t("capture.cropReset")}
            onPress={handleResetCrop}
            disabled={!isReady || isApplying}
          />
          <View className="flex-row gap-3">
            <CaptureActionButton
              variant="default"
              label={t("common.cancel")}
              onPress={handleCancel}
              block={false}
              className="flex-1"
              disabled={isApplying}
            />
            <Button
              label={isApplying ? t("capture.cropApplying") : t("capture.cropApply")}
              onPress={() => void handleApply()}
              block={false}
              className="flex-1"
              loading={isApplying}
              disabled={!isReady || isApplying}
            />
          </View>
        </CaptureActionsPanel>
      </View>
    </View>
  );
}
