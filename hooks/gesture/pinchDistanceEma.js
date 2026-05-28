/** Suaviza distância polegar–indicador para pinça não “piscar”. */
export class PinchDistanceEma {
  constructor(alpha = 0.38) {
    this.alpha = alpha;
    this.value = null;
  }

  push(next) {
    if (this.value == null) {
      this.value = next;
      return this.value;
    }
    this.value += (next - this.value) * this.alpha;
    return this.value;
  }

  reset() {
    this.value = null;
  }
}
