export class HandStabilityGate {
  constructor(onFrames = 1, offFrames = 15) {
    this.onFrames = onFrames;
    this.offFrames = offFrames;
    this.onCount = 0;
    this.offCount = 0;
    this.stable = false;
  }

  setThresholds(onFrames, offFrames) {
    if (onFrames != null) this.onFrames = onFrames;
    if (offFrames != null) this.offFrames = offFrames;
  }

  update(detected) {
    if (detected) {
      this.onCount += 1;
      this.offCount = 0;
      if (this.onCount >= this.onFrames) this.stable = true;
    } else {
      this.offCount += 1;
      this.onCount = 0;
      if (this.offCount >= this.offFrames) this.stable = false;
    }
    return this.stable;
  }

  reset() {
    this.onCount = 0;
    this.offCount = 0;
    this.stable = false;
  }
}
