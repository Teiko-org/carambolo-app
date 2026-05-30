export class CursorMotion {
  constructor(alpha = 0.3) {
    this.alpha = alpha;
    this.deadzonePx = 0;
    this.target = null;
    this.display = { x: 0, y: 0 };
  }

  setAlpha(alpha) {
    this.alpha = alpha;
  }

  setDeadzone(px) {
    this.deadzonePx = px;
  }

  setTarget(x, y) {
    if (this.target) {
      const dx = x - this.target.x;
      const dy = y - this.target.y;
      if (Math.hypot(dx, dy) < this.deadzonePx) {
        return this.display;
      }
    } else {
      this.target = { x, y };
      this.display = { x, y };
      return this.display;
    }
    this.target.x = x;
    this.target.y = y;
    return this.display;
  }

  step() {
    if (!this.target) return this.display;
    const a = this.alpha;
    this.display.x += (this.target.x - this.display.x) * a;
    this.display.y += (this.target.y - this.display.y) * a;
    return this.display;
  }

  reset() {
    this.target = null;
    this.display = { x: 0, y: 0 };
  }
}
