import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { loadMediaPipeVision } from "./loadMediaPipeVision";
import { HandStabilityGate } from "./gesture/handStability";
import { StablePinchGate } from "./gesture/stablePinchGate";
import { OneEuroPointer } from "./gesture/oneEuroFilter";
import { DEFAULT_GESTURE_SETTINGS } from "./gesture/gestureSettings";
import {
  MIN_HAND_DETECTION_CONFIDENCE,
  MIN_HAND_PRESENCE_CONFIDENCE,
  MIN_HAND_SCORE,
  MIN_HAND_TRACKING_CONFIDENCE,
} from "./gesture/gestureContracts";

const CURSOR_LANDMARK_INDEX = 8;
const THUMB_LANDMARK_INDEX = 4;
const MEDIAPIPE_WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const HAND_LANDMARKER_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const DETECT_INTERVAL_MS = 33;

function distance(a, b) {
  if (!a || !b) return 1;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function handDetectionScore(result) {
  const handedness = result?.handedness?.[0]?.[0]?.score;
  if (typeof handedness === "number") return handedness;
  return result?.landmarks?.[0] ? 1 : 0;
}

function buildOneEuroOpts(settings, pinch) {
  return {
    freq: settings.oneEuroFreq,
    minCutoff: pinch ? settings.oneEuroPinchMinCutoff : settings.oneEuroIdleMinCutoff,
    beta: pinch ? settings.oneEuroPinchBeta : settings.oneEuroIdleBeta,
    dCutoff: 1,
  };
}

export function useWebGestureCursor(enabled, settingsRef) {
  const [supported, setSupported] = useState(Platform.OS === "web");
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);

  const cursorRef = useRef({ x: 0, y: 0 });
  const pinchingRef = useRef(false);
  const handVisibleRef = useRef(false);
  const fallbackSettingsRef = useRef(DEFAULT_GESTURE_SETTINGS);
  const activeSettingsRef = settingsRef ?? fallbackSettingsRef;

  useEffect(() => {
    if (!enabled || Platform.OS !== "web") return undefined;

    let cancelled = false;
    let rafId = 0;
    let stream = null;
    let video = null;
    let landmarker = null;
    let lastVideoTime = -1;
    let lastDetectMs = 0;
    let rawTarget = null;

    const s0 = activeSettingsRef.current;
    const pointerFilter = new OneEuroPointer(
      buildOneEuroOpts(s0, false),
      buildOneEuroOpts(s0, true)
    );
    const pinchGate = new StablePinchGate();
    const handStable = new HandStabilityGate(
      s0.handStableOnFrames,
      s0.handStableOffFrames
    );

    const stop = () => {
      cancelAnimationFrame(rafId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (video) {
        video.srcObject = null;
        video.remove();
      }
    };

    const load = async () => {
      try {
        const { FilesetResolver, HandLandmarker } = await loadMediaPipeVision();
        if (cancelled) return;

        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_BASE);
        if (cancelled) return;

        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: HAND_LANDMARKER_MODEL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: MIN_HAND_DETECTION_CONFIDENCE,
          minHandPresenceConfidence: MIN_HAND_PRESENCE_CONFIDENCE,
          minTrackingConfidence: MIN_HAND_TRACKING_CONFIDENCE,
        });

        if (!navigator?.mediaDevices?.getUserMedia) {
          setSupported(false);
          throw new Error("Navegador sem suporte a getUserMedia.");
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 480 },
            height: { ideal: 360 },
            frameRate: { ideal: 30, max: 30 },
          },
          audio: false,
        });
        if (cancelled) return;

        video = document.createElement("video");
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.style.cssText =
          "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;bottom:0;right:0;";
        video.srcObject = stream;
        document.body.appendChild(video);
        await video.play();
        if (cancelled) return;

        setTracking(true);
        setError(null);

        const tick = (now) => {
          const ts = now ?? performance.now();
          const cfg = activeSettingsRef.current;

          pointerFilter.applySettings(
            buildOneEuroOpts(cfg, false),
            buildOneEuroOpts(cfg, true)
          );
          handStable.setThresholds(cfg.handStableOnFrames, cfg.handStableOffFrames);

          if (
            video &&
            landmarker &&
            video.readyState >= 2 &&
            !video.paused &&
            video.currentTime !== lastVideoTime &&
            ts - lastDetectMs >= DETECT_INTERVAL_MS
          ) {
            lastVideoTime = video.currentTime;
            lastDetectMs = ts;
            const result = landmarker.detectForVideo(video, ts);
            const hand = result?.landmarks?.[0];
            const score = handDetectionScore(result);
            const hasLandmarks = Boolean(
              hand?.[CURSOR_LANDMARK_INDEX] && hand?.[THUMB_LANDMARK_INDEX]
            );
            const rawDetected = hasLandmarks && score >= MIN_HAND_SCORE;
            handVisibleRef.current = handStable.update(rawDetected);

            if (rawDetected && hand) {
              const tip = hand[CURSOR_LANDMARK_INDEX];
              const x = (1 - tip.x) * window.innerWidth;
              const y = tip.y * window.innerHeight;
              rawTarget = { x, y };

              const pinching = pinchGate.update(
                distance(hand[CURSOR_LANDMARK_INDEX], hand[THUMB_LANDMARK_INDEX]),
                cfg.pinchClose,
                cfg.pinchOpen,
                cfg.pinchOpenFrames
              );
              pinchingRef.current = pinching;
              pointerFilter.setPinching(pinching, x, y, ts);
            } else if (!rawDetected) {
              if (!handVisibleRef.current) {
                rawTarget = null;
                pinchGate.reset();
                pinchingRef.current = false;
                pointerFilter.setPinching(false, null, null, null);
              }
            }
          }

          if (handVisibleRef.current && rawTarget) {
            const smoothed = pointerFilter.filter(
              rawTarget.x,
              rawTarget.y,
              performance.now()
            );
            cursorRef.current.x = smoothed.x;
            cursorRef.current.y = smoothed.y;
          }

          if (!cancelled) rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
      } catch (e) {
        setSupported(Platform.OS === "web");
        setTracking(false);
        setError(e?.message || "Falha ao iniciar rastreamento de gestos.");
      }
    };

    load();

    return () => {
      cancelled = true;
      setTracking(false);
      pinchingRef.current = false;
      handVisibleRef.current = false;
      rawTarget = null;
      pointerFilter.reset();
      pinchGate.reset();
      handStable.reset();
      cursorRef.current = { x: 0, y: 0 };
      stop();
    };
  }, [enabled, activeSettingsRef]);

  return {
    supported,
    tracking,
    error,
    pinchingRef,
    cursorRef,
    handVisibleRef,
  };
}
