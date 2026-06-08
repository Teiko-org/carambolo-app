import { Platform } from "react-native";
import { useWebGestureCursor } from "./useWebGestureCursor";
import { useNativeGestureCursor } from "./useNativeGestureCursor";

export const isGesturePlatformSupported = true;

export function useGestureCursor(enabled, settingsRef, nativeCursorRef, gestureDragActiveRef) {
  const webEnabled = Platform.OS === "web" && enabled;
  const nativeEnabled = Platform.OS !== "web" && enabled;

  const web = useWebGestureCursor(webEnabled, settingsRef);
  const native = useNativeGestureCursor(
    nativeEnabled,
    settingsRef,
    nativeCursorRef,
    gestureDragActiveRef
  );

  if (Platform.OS === "web") {
    return web;
  }

  return { ...native, platformSupported: true };
}
