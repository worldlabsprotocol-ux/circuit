export class GridController {
  constructor() {
    this.resolution = 16
    this.snap = true
  }

  setResolution(value) {
    this.resolution = value
  }

  toggleSnap() {
    this.snap = !this.snap
  }

  quantize(value) {
    if (!this.snap) return value
    const step = 1 / this.resolution
    return Math.round(value / step) * step
  }
}
