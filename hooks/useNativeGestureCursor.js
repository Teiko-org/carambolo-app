import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Dimensions, Modal, Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { useCameraPermissions } from "expo-camera";
import {
  HAND_TRACKER_HTML,
  TRACKER_VIEW_WIDTH,
  TRACKER_VIEW_HEIGHT,
} from "../assets/gesture/handTrackerHtml";
import { HandStabilityGate } from "./gesture/handStability";
import { StablePinchGate } from "./gesture/stablePinchGate";
import { OneEuroPointer } from "./gesture/oneEuroFilter";
import { DEFAULT_GESTURE_SETTINGS, NATIVE_GESTURE_OVERRIDES } from "./gesture/gestureSettings";

function buildOneEuroOpts(settings, pinch) {
  return {
    freq: settings.oneEuroFreq,
    minCutoff: pinch ? settings.oneEuroPinchMinCutoff : settings.oneEuroIdleMinCutoff,
    beta: pinch ? settings.oneEuroPinchBeta : settings.oneEuroIdleBeta,
    dCutoff: 1,
  };
}

function distanceFromMessage(msg) {
  if (typeof msg?.d === "number") return msg.d;
  return 1;
}

const noopTracker = () => null;

export function useNativeGestureCursor(enabled, settingsRef, nativeCursorRef, gestureDragActiveRef) {
  const isNative = Platform.OS !== "web";
  const [permission, requestPermission] = useCameraPermissions();
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [screenSize, setScreenSize] = useState(() => Dimensions.get("window"));

  const cursorRef = useRef({ x: 0, y: 0 });
  const pinchingRef = useRef(false);
  const handVisibleRef = useRef(false);
  const fallbackSettingsRef = useRef(DEFAULT_GESTURE_SETTINGS);
  const activeSettingsRef = settingsRef ?? fallbackSettingsRef;
  const webViewRef = useRef(null);
  const rafIdRef = useRef(0);
  const latestFrameRef = useRef(null);
  const filtersRef = useRef(null);

  const permissionGranted = Boolean(isNative && enabled && permission?.granted);
  const permissionBlocked = Boolean(
    permission && !permission.granted && permission.canAskAgain === false
  );
  const showPermissionPrompt = Boolean(
    isNative &&
      enabled &&
      !dismissed &&
      permission &&
      !permission.granted &&
      permission.canAskAgain !== false
  );

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreenSize(window);
    });
    return () => sub?.remove?.();
  }, []);

  useEffect(() => {
    if (!enabled) {
      setDismissed(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!isNative || !enabled) {
      setError(null);
      return;
    }
    if (permissionBlocked) {
      setError(
        "Permissão de câmera bloqueada. Abra as Configurações do celular e libere a câmera para o app."
      );
    } else if (permission?.granted) {
      setError(null);
    }
  }, [isNative, enabled, permissionBlocked, permission?.granted]);

  const requestCameraPermission = useCallback(async () => {
    if (typeof requestPermission !== "function") {
      setError("Câmera indisponível neste ambiente. Use o modo Toque.");
      return false;
    }

    setPermissionLoading(true);
    setError(null);

    try {
      const response = await requestPermission();
      if (response?.granted) {
        return true;
      }
      setError(
        response?.canAskAgain === false
          ? "Permissão de câmera bloqueada. Libere nas configurações do celular."
          : "Permissão de câmera negada. Você pode continuar no modo Toque."
      );
      return false;
    } catch (e) {
      setError(e?.message || "Falha ao solicitar permissão da câmera.");
      return false;
    } finally {
      setPermissionLoading(false);
    }
  }, [requestPermission]);

  const dismissPermissionPrompt = useCallback(() => {
    setDismissed(true);
    setError("Modo gestos requer câmera. Toque continua disponível.");
  }, []);

  useEffect(() => {
    if (!isNative || !enabled || !permissionGranted) {
      setTracking(false);
      handVisibleRef.current = false;
      pinchingRef.current = false;
      cursorRef.current = { x: 0, y: 0 };
      latestFrameRef.current = null;
      filtersRef.current?.reset?.();
      cancelAnimationFrame(rafIdRef.current);
      return undefined;
    }

    const s0 = {
      ...NATIVE_GESTURE_OVERRIDES,
      ...(activeSettingsRef.current ?? DEFAULT_GESTURE_SETTINGS),
    };
    const pointerFilter = new OneEuroPointer(
      buildOneEuroOpts(s0, false),
      buildOneEuroOpts(s0, true)
    );
    const pinchGate = new StablePinchGate();
    const handStable = new HandStabilityGate(
      s0.handStableOnFrames,
      s0.handStableOffFrames
    );
    filtersRef.current = {
      pointerFilter,
      pinchGate,
      handStable,
      reset() {
        pointerFilter.reset();
        pinchGate.reset();
        handStable.reset();
      },
    };

    let rawTarget = null;
    let cancelled = false;
    let lastTickMs = 0;
    let dragHandLostFrames = 0;

    const tick = (now) => {
      const ts = now ?? Date.now();
      if (ts - lastTickMs < 33) {
        if (!cancelled) rafIdRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTickMs = ts;

      const frame = latestFrameRef.current;
      const dragging = Boolean(gestureDragActiveRef?.current);

      if (frame?.handVisible && typeof frame.x === "number" && typeof frame.y === "number") {
        dragHandLostFrames = 0;
        const scaleX = screenSize.width / (frame.width || screenSize.width);
        const scaleY = screenSize.height / (frame.height || screenSize.height);
        const x = frame.x * scaleX;
        const y = frame.y * scaleY;
        rawTarget = { x, y };

        const baseCfg = activeSettingsRef.current ?? DEFAULT_GESTURE_SETTINGS;
        const cfg = { ...NATIVE_GESTURE_OVERRIDES, ...baseCfg };
        const pinching = pinchGate.update(
          distanceFromMessage(frame),
          cfg.pinchClose,
          cfg.pinchOpen,
          cfg.pinchOpenFrames,
          cfg.pinchCloseFrames
        );
        pinchingRef.current = pinching;
        const filterPinching = pinching || dragging;
        pointerFilter.setPinching(filterPinching, x, y, ts);
        handVisibleRef.current = handStable.update(true);
      } else {
        handVisibleRef.current = handStable.update(false);
        rawTarget = null;
        if (dragging) {
          dragHandLostFrames += 1;
          if (dragHandLostFrames >= 3) {
            pinchingRef.current = false;
          }
        } else if (!handVisibleRef.current) {
          pinchGate.reset();
          pinchingRef.current = false;
          pointerFilter.setPinching(false, null, null, null);
        }
      }

      if (handVisibleRef.current && rawTarget) {
        const smoothed = pointerFilter.filter(rawTarget.x, rawTarget.y, ts);
        cursorRef.current.x = smoothed.x;
        cursorRef.current.y = smoothed.y;
      }

      if (!cancelled) {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafIdRef.current);
      setTracking(false);
      pinchingRef.current = false;
      handVisibleRef.current = false;
      latestFrameRef.current = null;
      filtersRef.current?.reset?.();
      cursorRef.current = { x: 0, y: 0 };
    };
  }, [
    enabled,
    isNative,
    permissionGranted,
    screenSize.width,
    screenSize.height,
    activeSettingsRef,
    gestureDragActiveRef,
  ]);

  const handleWebViewMessage = useCallback((event) => {
    const raw = event?.nativeEvent?.data;
    if (!raw) return;

    try {
      const msg = JSON.parse(raw);
      if (msg?.type === "ready") {
        setTracking(true);
        setError(null);
        return;
      }
      if (msg?.type === "error") {
        setTracking(false);
        setError(msg.message || "Falha no rastreamento de gestos.");
        return;
      }
      if (msg?.type === "frame") {
        latestFrameRef.current = msg;
      }
    } catch {
      /* ignore malformed messages */
    }
  }, []);

  const trackerInjectScript = useMemo(
    () =>
      `window.__OUT_W=${Math.round(screenSize.width)};window.__OUT_H=${Math.round(screenSize.height)};true;`,
    [screenSize.width, screenSize.height]
  );

  const GestureTracker = useMemo(() => {
    if (!isNative || !enabled || !permissionGranted) {
      return noopTracker;
    }

    return function NativeGestureTracker() {
      return (
        <Modal
          visible
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={() => {}}
        >
          <View pointerEvents="none" style={styles.trackerModalRoot} collapsable={false}>
            <View pointerEvents="none" style={styles.trackerHost} collapsable={false}>
              <WebView
                ref={webViewRef}
                pointerEvents="none"
                focusable={false}
                originWhitelist={["*"]}
                source={{ html: HAND_TRACKER_HTML, baseUrl: "https://localhost/" }}
                injectedJavaScriptBeforeContentLoaded={trackerInjectScript}
                javaScriptEnabled
                domStorageEnabled
                mediaPlaybackRequiresUserAction={false}
                allowsInlineMediaPlayback
                androidLayerType="software"
                mediaCapturePermissionGrantType="grant"
                scrollEnabled={false}
                overScrollMode="never"
                cacheEnabled={false}
                onMessage={handleWebViewMessage}
                style={styles.webView}
              />
            </View>
            <View
              ref={nativeCursorRef}
              pointerEvents="none"
              style={styles.cursorDot}
              collapsable={false}
            />
          </View>
        </Modal>
      );
    };
  }, [
    isNative,
    enabled,
    permissionGranted,
    trackerInjectScript,
    handleWebViewMessage,
    nativeCursorRef,
  ]);

  if (!isNative) {
    return {
      supported: false,
      platformSupported: false,
      tracking: false,
      error: null,
      showPermissionPrompt: false,
      permissionLoading: false,
      requestCameraPermission: async () => false,
      dismissPermissionPrompt: () => {},
      pinchingRef,
      cursorRef,
      handVisibleRef,
      GestureTracker: noopTracker,
    };
  }

  return {
    supported: true,
    platformSupported: true,
    tracking,
    error,
    showPermissionPrompt,
    permissionLoading,
    requestCameraPermission,
    dismissPermissionPrompt,
    pinchingRef,
    cursorRef,
    handVisibleRef,
    GestureTracker,
  };
}

const styles = StyleSheet.create({
  trackerModalRoot: {
    flex: 1,
  },
  trackerHost: {
    position: "absolute",
    left: 0,
    top: -420,
    width: TRACKER_VIEW_WIDTH,
    height: TRACKER_VIEW_HEIGHT,
    opacity: 0.01,
    overflow: "hidden",
  },
  webView: {
    width: TRACKER_VIEW_WIDTH,
    height: TRACKER_VIEW_HEIGHT,
    backgroundColor: "transparent",
  },
  cursorDot: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(164, 112, 50, 0.85)",
    opacity: 0,
  },
});
