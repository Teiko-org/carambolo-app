/** Evita falsos positivos quando a câmera treme ou o modelo “vê” mão fantasma. */
export class HandStabilityGate {
  constructor(onFrames, offFrames) {
    this.onFrames = onFrames;
    this.offFrames = offFrames;
    this.onCount = 0;
    this.offCount = 0;
    this.stable = false;
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
