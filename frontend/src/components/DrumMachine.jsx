import { useEffect } from "react"
import { engine } from "../audio/AudioEngine"

const soundFiles = {
  kick: "https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/kick.wav",
  snare: "https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/snare.wav",
  hat: "https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/hihat.wav"
}

export default function DrumMachine({ tempo, arrangement, playhead }) {

  useEffect(() => {
    async function load() {
      await engine.loadSample("kick", soundFiles.kick)
      await engine.loadSample("snare", soundFiles.snare)
      await engine.loadSample("hat", soundFiles.hat)
    }
    load()
  }, [])

  useEffect(() => {
    if (!arrangement.length) return

    const nextTime = engine.currentTime + 0.05
    const stretchFactor = 1

    Object.keys(soundFiles).forEach((key) => {
      const source = engine.ctx.createBufferSource()
      source.buffer = engine.buffers[key]

      source.playbackRate.value = stretchFactor

      const gain = engine.ctx.createGain()
      gain.gain.value = 1

      source.connect(gain)
      gain.connect(engine.drumsBus)

      source.start(nextTime)
    })

  }, [playhead])

  return null
}
