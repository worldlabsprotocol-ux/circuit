import { useEffect } from "react"

export default function Metronome({ enabled, tempo, step }) {

  useEffect(() => {
    if (!enabled) return
    if (step % 4 !== 0) return

    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    osc.frequency.value = 1000
    osc.connect(ctx.destination)
    osc.start()
    setTimeout(() => osc.stop(), 50)
  }, [step])

  return null
}
