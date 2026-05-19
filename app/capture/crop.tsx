import { useLocalSearchParams } from "expo-router";

import { CaptureCropView } from "@/features/capture/components/CaptureCropView";

export default function CaptureCropScreen() {
  const { imageId } = useLocalSearchParams<{ imageId: string }>();
  return <CaptureCropView imageId={imageId ?? ""} />;
}
