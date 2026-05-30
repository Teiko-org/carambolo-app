export class StablePinchGate {
  constructor() {
    this.active = false;
    this.openFrames = 0;
  }

  update(rawDistance, closeThreshold, openThreshold, openFramesNeeded = 3) {
    if (!this.active) {
      if (rawDistance < closeThreshold) {
        this.active = true;
        this.openFrames = 0;
      }
    } else if (rawDistance > openThreshold) {
      this.openFrames += 1;
      if (this.openFrames >= openFramesNeeded) {
        this.active = false;
        this.openFrames = 0;
      }
    } else {
      this.openFrames = 0;
    }
    return this.active;
  }

  reset() {
    this.active = false;
    this.openFrames = 0;
  }
}
