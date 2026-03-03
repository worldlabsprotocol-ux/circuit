import { useState } from "react"
import { initAudio, getInstruments } from "../audio/ToneIntegration"

export default function Mix() {
  const [ready, setReady] = useState(false)

  const handlePlay = async () => {
    await initAudio()
    const instruments = getInstruments()
    if (!instruments) return

    const { kick, snare, hat } = instruments

    kick.triggerAttackRelease("C1", "8n")
    snare.triggerAttackRelease("16n")
    hat.triggerAttackRelease("16n")

    setReady(true)
  }

  return (
    <div className="text-cyan-400 p-8">
      <h1 className="text-2xl font-bold">Mix</h1>
      <button
        onClick={handlePlay}
        className="mt-6 px-6 py-3 bg-cyan-500 text-black rounded-lg"
      >
        {ready ? "Play Again" : "Start Audio"}
      </button>
    </div>
  )
}
