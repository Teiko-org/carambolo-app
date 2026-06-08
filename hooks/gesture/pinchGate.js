import { PINCH_CLOSE_THRESHOLD, PINCH_OPEN_THRESHOLD } from "./gestureContracts";

export class PinchGate {
  constructor() {
    this.active = false;
  }

  update(distance) {
    if (this.active) {
      if (distance > PINCH_OPEN_THRESHOLD) this.active = false;
    } else if (distance < PINCH_CLOSE_THRESHOLD) {
      this.active = true;
    }
    return this.active;
  }

  reset() {
    this.active = false;
  }
}
