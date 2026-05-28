import { PINCH_CLOSE_THRESHOLD, PINCH_OPEN_THRESHOLD } from "./gestureContracts";

/**
 * Pinça com histerese assimétrica:
 * - Fecha rápido (1 frame acima do threshold)
 * - Abre devagar (3 frames consecutivos acima do threshold)
 *   → evita largar o card por oscilação ao mover rápido
 */
export class StablePinchGate {
  constructor() {
    this.active = false;
    this.openFrames = 0;
    this.OPEN_FRAMES_NEEDED = 3;
  }

  update(rawDistance) {
    if (!this.active) {
      if (rawDistance < PINCH_CLOSE_THRESHOLD) {
        this.active = true;
        this.openFrames = 0;
      }
    } else {
      if (rawDistance > PINCH_OPEN_THRESHOLD) {
        this.openFrames += 1;
        if (this.openFrames >= this.OPEN_FRAMES_NEEDED) {
          this.active = false;
          this.openFrames = 0;
        }
      } else {
        this.openFrames = 0;
      }
    }
    return this.active;
  }

  reset() {
    this.active = false;
    this.openFrames = 0;
  }
}
