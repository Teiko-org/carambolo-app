/** Filtro 1€ — suaviza sem atraso excessivo (Casiez et al.). */

class LowPass {
  constructor() {
    this.y = null;
  }

  filter(value, alpha) {
    if (this.y === null) {
      this.y = value;
      return value;
    }
    this.y = alpha * value + (1 - alpha) * this.y;
    return this.y;
  }

  reset() {
    this.y = null;
  }
}

class OneEuro1D {
  constructor({ minCutoff, beta, dCutoff, freq }) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.freq = freq;
    this.x = new LowPass();
    this.dx = new LowPass();
    this.lastTime = null;
  }

  alpha(cutoff) {
    const te = 1 / this.freq;
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / te);
  }

  filter(value, timestamp) {
    if (this.lastTime === null) {
      this.lastTime = timestamp;
      this.x.filter(value, 1);
      return value;
    }

    const dt = Math.max(1 / 120, timestamp - this.lastTime);
    this.lastTime = timestamp;

    const prev = this.x.y ?? value;
    const edx = (value - prev) / dt;
    const edxHat = this.dx.filter(edx, this.alpha(this.dCutoff));
    const cutoff = this.minCutoff + this.beta * Math.abs(edxHat);
    return this.x.filter(value, this.alpha(cutoff));
  }

  reset() {
    this.x.reset();
    this.dx.reset();
    this.lastTime = null;
  }
}

export class OneEuroPointer {
  constructor(idleOpts, pinchOpts) {
    this.idleOpts = idleOpts;
    this.pinchOpts = pinchOpts;
    this.fx = new OneEuro1D(idleOpts);
    this.fy = new OneEuro1D(idleOpts);
    this.pinchFx = new OneEuro1D(pinchOpts);
    this.pinchFy = new OneEuro1D(pinchOpts);
    this.pinching = false;
  }

  setPinching(next, seedX, seedY, timestamp) {
    if (this.pinching === next) return;
    this.pinching = next;
    const pair = next
      ? [this.pinchFx, this.pinchFy]
      : [this.fx, this.fy];
    pair[0].reset();
    pair[1].reset();
    if (seedX != null && seedY != null && timestamp != null) {
      pair[0].filter(seedX, timestamp);
      pair[1].filter(seedY, timestamp);
    }
  }

  filter(x, y, timestamp) {
    if (this.pinching) {
      return {
        x: this.pinchFx.filter(x, timestamp),
        y: this.pinchFy.filter(y, timestamp),
      };
    }
    return {
      x: this.fx.filter(x, timestamp),
      y: this.fy.filter(y, timestamp),
    };
  }

  reset() {
    this.fx.reset();
    this.fy.reset();
    this.pinchFx.reset();
    this.pinchFy.reset();
    this.pinching = false;
  }
}
