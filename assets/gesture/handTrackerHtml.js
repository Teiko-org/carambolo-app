/** HTML embutido no WebView nativo — MediaPipe Hand Landmarker + postMessage para RN. */
export const HAND_TRACKER_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=240,initial-scale=1" />
<style>html,body{margin:0;padding:0;background:#000;overflow:hidden;width:240px;height:180px}</style>
</head>
<body>
<video id="v" playsinline muted autoplay style="position:fixed;width:1px;height:1px;opacity:0"></video>
<script type="module">
import { FilesetResolver, HandLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/+esm";
const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const CUR = 8, TH = 4;
const DETECT_MS = 72;
const post = (obj) => {
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(obj));
};
const dist = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);
const outW = () => window.__OUT_W || window.innerWidth || 360;
const outH = () => window.__OUT_H || window.innerHeight || 640;
const createLandmarker = async (vision) => {
  try {
    return await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL, delegate: "GPU" },
      runningMode: "VIDEO",
      numHands: 1,
    });
  } catch (_) {
    return await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL, delegate: "CPU" },
      runningMode: "VIDEO",
      numHands: 1,
    });
  }
};
(async () => {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      post({ type: "error", message: "Câmera indisponível no WebView." });
      return;
    }
    const vision = await FilesetResolver.forVisionTasks(WASM);
    const landmarker = await createLandmarker(vision);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 320, max: 320 },
        height: { ideal: 240, max: 240 },
        frameRate: { ideal: 15, max: 20 },
      },
      audio: false,
    });
    const video = document.getElementById("v");
    video.srcObject = stream;
    await video.play();
    post({ type: "ready" });
    let lastT = -1, lastDetect = 0;
    const loop = (now) => {
      const w = outW(), h = outH();
      if (video.readyState >= 2 && video.currentTime !== lastT && now - lastDetect >= DETECT_MS) {
        lastT = video.currentTime;
        lastDetect = now;
        const result = landmarker.detectForVideo(video, now);
        const hand = result?.landmarks?.[0];
        if (hand?.[CUR] && hand?.[TH]) {
          const d = dist(hand[CUR], hand[TH]);
          const x = (1 - hand[CUR].x) * w;
          const y = hand[CUR].y * h;
          post({ type: "frame", x, y, d, handVisible: true, width: w, height: h });
        } else {
          post({ type: "frame", handVisible: false, width: w, height: h });
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  } catch (e) {
    post({ type: "error", message: e?.message || String(e) });
  }
})();
</script>
</body>
</html>`;

export const TRACKER_VIEW_WIDTH = 240;
export const TRACKER_VIEW_HEIGHT = 180;
