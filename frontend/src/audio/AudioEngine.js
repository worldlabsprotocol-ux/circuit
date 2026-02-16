class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()

    this.masterBus = this.ctx.createGain()
    this.musicBus = this.ctx.createGain()
    this.drumsBus = this.ctx.createGain()
    this.fxBus = this.ctx.createGain()

    this.limiter = this.ctx.createDynamicsCompressor()
    this.limiter.threshold.value = -6
    this.limiter.ratio.value = 20

    this.drumsBus.connect(this.masterBus)
    this.musicBus.connect(this.masterBus)
    this.fxBus.connect(this.masterBus)
    this.masterBus.connect(this.limiter)
    this.limiter.connect(this.ctx.destination)

    this.buffers = {}
  }

  async loadSample(name, url) {
    const res = await fetch(url)
    const arrayBuffer = await res.arrayBuffer()
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer)
    this.buffers[name] = audioBuffer
  }

  playSample(name, time, bus = "drums", velocity = 1) {
    if (!this.buffers[name]) return

    const source = this.ctx.createBufferSource()
    const gain = this.ctx.createGain()
    gain.gain.value = velocity

    source.buffer = this.buffers[name]
    source.connect(gain)

    if (bus === "drums") gain.connect(this.drumsBus)
    if (bus === "music") gain.connect(this.musicBus)
    if (bus === "fx") gain.connect(this.fxBus)

    source.start(time)
  }

  get currentTime() {
    return this.ctx.currentTime
  }
}

export const engine = new AudioEngine()
