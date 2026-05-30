export const GESTURE_SETTINGS_STORAGE_KEY = "@carambolo/gesture_settings_v2";

export const DEFAULT_GESTURE_SETTINGS = {
  pinchClose: 0.115,
  pinchOpen: 0.155,
  pinchOpenFrames: 2,
  oneEuroFreq: 30,
  oneEuroIdleMinCutoff: 1.2,
  oneEuroIdleBeta: 0.04,
  oneEuroPinchMinCutoff: 0.9,
  oneEuroPinchBeta: 0.012,
  scrollMinPx: 1.5,
  scrollMaxPx: 5,
  edgeThreshold: 120,
  edgeDelayMs: 200,
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
