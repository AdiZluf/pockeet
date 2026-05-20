import { useRef, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { randomUUID } from "expo-crypto";

import { Text } from "@/components/ui";
import { a11y, useIconColors } from "@/theme";

import { MAX_RECEIPT_PAGES } from "../constants";
import { useCaptureSessionStore } from "../stores/captureSessionStore";
import { ThumbnailStrip } from "./ThumbnailStrip";
import { CapturePermissionView } from "./CapturePermissionView";

export function CaptureCameraView() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);

  const images = useCaptureSessionStore((s) => s.images);
  const selectedIndex = useCaptureSessionStore((s) => s.selectedIndex);
  const addImage = useCaptureSessionStore((s) => s.addImage);
  const addImages = useCaptureSessionStore((s) => s.addImages);
  const selectImage = useCaptureSessionStore((s) => s.selectImage);
  const canAddMore = useCaptureSessionStore((s) => s.canAddMore);
  const reset = useCaptureSessionStore((s) => s.reset);

  const handleClose = () => {
    if (images.length === 0) {
      reset();
      router.back();
      return;
    }
    Alert.alert(t("capture.discardTitle"), t("capture.discardBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("capture.discardConfirm"),
        style: "destructive",
        onPress: () => {
          reset();
          router.back();
        },
      },
    ]);
  };

  const goToPreview = () => {
    if (images.length === 0) return;
    router.push("/capture/preview");
  };

  const handleTakePhoto = async () => {
    if (!canAddMore() || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });
      if (!photo?.uri) return;

      const added = addImage({
        id: randomUUID(),
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
      });
      if (added) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Alert.alert(t("capture.maxPagesTitle"), t("capture.maxPagesBody", { max: MAX_RECEIPT_PAGES }));
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePickGallery = async () => {
    if (!canAddMore()) {
      Alert.alert(t("capture.maxPagesTitle"), t("capture.maxPagesBody", { max: MAX_RECEIPT_PAGES }));
      return;
    }

    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!libraryPermission.granted) {
      return;
    }

    const remaining = MAX_RECEIPT_PAGES - images.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.85,
    });

    if (result.canceled) return;

    const incoming = result.assets.map((asset) => ({
      id: randomUUID(),
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    }));

    const added = addImages(incoming);
    if (added > 0) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (added < incoming.length) {
      Alert.alert(t("capture.maxPagesTitle"), t("capture.maxPagesBody", { max: MAX_RECEIPT_PAGES }));
    }
  };

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <CapturePermissionView
          showRequest={permission.canAskAgain}
          onRequest={() => void requestPermission()}
          onClose={handleClose}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

      <View className="absolute inset-0" pointerEvents="box-none">
        <View
          className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-5"
          style={{ paddingTop: insets.top + 8 }}
          pointerEvents="box-none"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("common.cancel")}
            onPress={handleClose}
            hitSlop={12}
            className="h-11 w-11 items-center justify-center rounded-full bg-overlay"
          >
            <Ionicons name="close" size={24} color={iconColors.inverse} />
          </Pressable>
          {images.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("capture.continue")}
              onPress={goToPreview}
              className="rounded-full bg-accent px-4 py-2"
            >
              <Text variant="label" className="text-foreground-inverse">
                {t("capture.continue")} ({images.length})
              </Text>
            </Pressable>
          ) : (
            <View className="w-20" />
          )}
        </View>

        {images.length > 0 ? (
          <View className="absolute bottom-36 left-0 right-0" pointerEvents="box-none">
            <ThumbnailStrip
              images={images}
              selectedIndex={selectedIndex}
              onSelect={selectImage}
            />
          </View>
        ) : null}

        <View
          className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between px-10"
          style={{ paddingBottom: insets.bottom + 24 }}
          pointerEvents="box-none"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("capture.gallery")}
            onPress={() => void handlePickGallery()}
            className="h-12 w-12 items-center justify-center rounded-full bg-overlay"
          >
            <Ionicons name="images-outline" size={26} color={iconColors.inverse} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("capture.shutter")}
            onPress={() => void handleTakePhoto()}
            disabled={isCapturing || !canAddMore()}
            className="items-center justify-center rounded-full border-4 border-foreground-inverse p-1"
            style={{ width: a11y.fabSize + 8, height: a11y.fabSize + 8, opacity: canAddMore() ? 1 : 0.5 }}
          >
            <View className="h-full w-full rounded-full bg-foreground-inverse" />
          </Pressable>

          <View className="h-12 w-12" />
        </View>
      </View>
    </View>
  );
}
