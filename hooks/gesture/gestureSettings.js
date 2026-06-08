export const GESTURE_SETTINGS_STORAGE_KEY = "@carambolo/gesture_settings_v2";

export const NATIVE_GESTURE_OVERRIDES = {
  pinchClose: 0.085,
  pinchOpen: 0.13,
  pinchOpenFrames: 4,
  pinchCloseFrames: 3,
  pinchPickHoldMs: 80,
  pinchDragMinMove: 12,
  handStableOnFrames: 3,
  oneEuroPinchMinCutoff: 1.35,
  oneEuroPinchBeta: 0.016,
};

export const DEFAULT_GESTURE_SETTINGS = {
  pinchClose: 0.115,
  pinchOpen: 0.155,
  pinchOpenFrames: 2,
  pinchCloseFrames: 2,
  pinchPickHoldMs: 0,
  oneEuroFreq: 30,
  oneEuroIdleMinCutoff: 2.4,
  oneEuroIdleBeta: 0.07,
  oneEuroPinchMinCutoff: 1.6,
  oneEuroPinchBeta: 0.02,
  scrollMinPx: 2,
  scrollMaxPx: 10,
  edgeThreshold: 100,
  edgeDelayMs: 60,
  handStableOnFrames: 1,
  handStableOffFrames: 15,
  openDetailsWithGesture: false,
  dwellArmingMs: 450,
  dwellOpenMs: 800,
  dwellMaxMovePx: 12,
  dwellCooldownMs: 900,
  pinchDragMinMove: 4,
};

export const GESTURE_PRESETS = {
  suave: {
    ...DEFAULT_GESTURE_SETTINGS,
    pinchOpen: 0.12,
    pinchOpenFrames: 5,
    oneEuroPinchMinCutoff: 0.45,
    scrollMaxPx: 3,
    edgeDelayMs: 280,
    handStableOffFrames: 20,
  },
  normal: { ...DEFAULT_GESTURE_SETTINGS },
  rapido: {
    ...DEFAULT_GESTURE_SETTINGS,
    pinchClose: 0.06,
    pinchOpen: 0.1,
    pinchOpenFrames: 2,
    oneEuroIdleMinCutoff: 1.5,
    oneEuroPinchMinCutoff: 0.75,
    scrollMaxPx: 7,
    edgeDelayMs: 120,
    handStableOffFrames: 12,
  },
};

export function cloneGestureSettings(base = DEFAULT_GESTURE_SETTINGS) {
  return { ...base };
}

export function mergeGestureSettings(partial, base = DEFAULT_GESTURE_SETTINGS) {
  return { ...base, ...partial };
}
