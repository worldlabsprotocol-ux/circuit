export class LookaheadScheduler {
  constructor() {
    this.intervalId = null
    this.lookahead = 100
    this.scheduleAheadTime = 0.1
  }

  start(callback) {
    if (this.intervalId) return
    this.intervalId = setInterval(callback, this.lookahead)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  getScheduleAheadTime() {
    return this.scheduleAheadTime
  }
}
