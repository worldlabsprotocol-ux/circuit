import { useState, useEffect } from "react"
import Starfield from "../components/Starfield"
import CircuitTrack from "../components/CircuitTrack"
import TopWallet from "../components/TopWallet"
import { unlockAudio, playKick, playSnare, playHat } from "../audio/AudioEngine"

export default function Circuit() {

  const [tempo, setTempo] = useState(120)
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(0)

  const [pattern, setPattern] = useState(
    Array(3).fill(null).map(() => Array(16).fill(false))
  )

  useEffect(() => {
    if (!playing) return

    const interval = setInterval(() => {
      setStep(prev => {
        const next = (prev + 1) % 16

        pattern.forEach((row, index) => {
          if (row[next]) {
            if (index === 0) playKick()
            if (index === 1) playSnare()
            if (index === 2) playHat()
          }
        })

        return next
      })
    }, (60000 / tempo) / 4)

    return () => clearInterval(interval)
  }, [playing, tempo, pattern])

  function toggleCell(r, c) {
    const copy = pattern.map(row => [...row])
    copy[r][c] = !copy[r][c]
    setPattern(copy)
  }

  return (
    <>
      <Starfield />
      <TopWallet />

      <div style={{ padding: 60, color: "white", position: "relative", zIndex: 2 }}>
        <CircuitTrack />
        <h1 style={{ fontSize: 48, color: "#00F0FF" }}>CIRCUIT</h1>

        <div style={{ marginBottom: 40 }}>
          <button
            onClick={async () => {
              await unlockAudio()
              setPlaying(!playing)
            }}
          >
            {playing ? "Stop" : "Play"}
          </button>

          <input
            type="range"
            min="80"
            max="160"
            value={tempo}
            onChange={e => setTempo(parseInt(e.target.value))}
          />
        </div>

        {pattern.map((row, r) => (
          <div key={r} style={{ display: "flex", marginBottom: 30 }}>
            <span style={{ width: 120 }}>
              {r === 0 ? "Kick" : r === 1 ? "Snare" : "Hat"}
            </span>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(16,1fr)",
              gap: 12,
              flex: 1
            }}>
              {row.map((active, c) => (
                <div
                  key={c}
                  onClick={() => toggleCell(r, c)}
                  style={{
                    height: 90,
                    borderRadius: 18,
                    cursor: "pointer",
                    background:
                      step === c
                        ? "#ffffff"
                        : active
                          ? "#00F0FF"
                          : "#1b1f2b"
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
