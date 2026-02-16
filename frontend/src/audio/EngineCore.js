class EngineCore {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
  }

  playOsc(freq, velocity, mixerLevel) {
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = "sawtooth"

    const now = this.ctx.currentTime

    // ADSR
    const attack = 0.01
    const decay = 0.1
    const sustain = 0.6
    const release = 0.2

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(velocity * mixerLevel, now + attack)
    gain.gain.linearRampToValueAtTime(sustain * velocity, now + attack + decay)
    gain.gain.linearRampToValueAtTime(0, now + attack + decay + release)

    osc.frequency.setValueAtTime(freq, now)

    // Portamento glide
    osc.frequency.linearRampToValueAtTime(freq * 1.01, now + 0.08)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.4)
  }
}

export const engineCore = new EngineCore()
