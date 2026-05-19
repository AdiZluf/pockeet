import { useRouter } from "expo-router";

import { useCaptureSessionStore } from "../stores/captureSessionStore";

export function useOpenCapture() {
  const router = useRouter();

  return () => {
    useCaptureSessionStore.getState().reset();
    router.push("/capture");
  };
}
