export class InstrumentEngine {
  constructor(audioContext, masterGain) {
    this.context = audioContext
    this.masterGain = masterGain
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12)
  }

  triggerNote(pitch, velocity, startTime, duration) {
    const osc = this.context.createOscillator()
    const gain = this.context.createGain()

    osc.type = "sawtooth"
    osc.frequency.value = this.midiToFreq(pitch)

    const attack = 0.01
    const decay = 0.1
    const sustain = 0.7
    const release = 0.2

    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(velocity, startTime + attack)
    gain.gain.linearRampToValueAtTime(velocity * sustain, startTime + attack + decay)
    gain.gain.setValueAtTime(velocity * sustain, startTime + duration)
    gain.gain.linearRampToValueAtTime(0, startTime + duration + release)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(startTime)
    osc.stop(startTime + duration + release)
  }
}
