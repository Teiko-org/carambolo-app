/** Limites de gesto. */

/** Threshold mais folgado para facilitar a detecção. */
export const PINCH_CLOSE_THRESHOLD = 0.07;
export const PINCH_OPEN_THRESHOLD = 0.11;

export const MIN_HAND_SCORE = 0;
export const MIN_HAND_DETECTION_CONFIDENCE = 0.5;
export const MIN_HAND_PRESENCE_CONFIDENCE = 0.5;
export const MIN_HAND_TRACKING_CONFIDENCE = 0.5;

/** Câmera pode perder a mão por até ~500ms sem cancelar o drag. */
export const HAND_STABLE_ON_FRAMES = 1;
export const HAND_STABLE_OFF_FRAMES = 15;

/** One Euro — idle: responsivo; pinch: mais estável. */
export const ONE_EURO_IDLE  = { freq: 30, minCutoff: 1.2, beta: 0.04, dCutoff: 1 };
export const ONE_EURO_PINCH = { freq: 30, minCutoff: 0.6, beta: 0.008, dCutoff: 1 };
