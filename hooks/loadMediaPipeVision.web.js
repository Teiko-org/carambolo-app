/** Carrega MediaPipe na web via CDN — evita Metro bundlar vision_bundle.mjs (erro 500). */
const MEDIAPIPE_VISION_ESM =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/+esm";

let cached = null;

export async function loadMediaPipeVision() {
  if (cached) return cached;
  cached = await import(/* @metro-ignore */ MEDIAPIPE_VISION_ESM);
  return cached;
}
