export class Scheduler {
  constructor(engine, tempo) {
    this.engine = engine
    this.tempo = tempo
    this.lookahead = 0.1
    this.scheduleAheadTime = 0.1
    this.nextNoteTime = 0
    this.currentStep = 0
    this.interval = null
  }

  start(callback) {
    this.nextNoteTime = this.engine.currentTime
    this.interval = setInterval(() => {
      while (this.nextNoteTime < this.engine.currentTime + this.scheduleAheadTime) {
        callback(this.currentStep, this.nextNoteTime)
        this.advance()
      }
    }, this.lookahead * 1000)
  }

  stop() {
    clearInterval(this.interval)
  }

  advance() {
    const secondsPerBeat = 60.0 / this.tempo
    this.nextNoteTime += secondsPerBeat / 4
    this.currentStep = (this.currentStep + 1) % 16
  }
}
