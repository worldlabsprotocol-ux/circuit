import { useState, useEffect } from "react"

const kick = new Audio("https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/kick.wav")
const snare = new Audio("https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/snare.wav")
const hat = new Audio("https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/hihat.wav")

export default function Studio() {
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!playing) return

    const interval = setInterval(() => {
      if (step % 4 === 0) kick.cloneNode().play()
      if (step % 4 === 2) snare.cloneNode().play()
      hat.cloneNode().play()

      setStep(s => (s + 1) % 16)
    }, 180)

    return () => clearInterval(interval)
  }, [playing, step])

  return (
    <div style={studioWrap}>
      <h1 style={title}>CIRCUIT STUDIO</h1>

      <button style={bigBtn} onClick={() => setPlaying(!playing)}>
        {playing ? "STOP PERFORMANCE" : "START PERFORMANCE"}
      </button>

      <Guitar />
    </div>
  )
}

function Guitar() {
  const notes = [
    "https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/kick.wav",
    "https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/snare.wav",
    "https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/hihat.wav"
  ]

  return (
    <div style={{ marginTop: 50 }}>
      <h2>Guitar Mode</h2>
      <div style={{ display: "flex", gap: 20 }}>
        {notes.map((note, i) => (
          <button
            key={i}
            style={stringBtn}
            onClick={() => new Audio(note).play()}
          >
            String {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

const studioWrap = {
  textAlign: "center"
}

const title = {
  fontSize: 36,
  marginBottom: 30
}

const bigBtn = {
  padding: "20px 40px",
  fontSize: 18,
  borderRadius: 40,
  background: "white",
  color: "black",
  border: "none",
  fontWeight: 700
}

const stringBtn = {
  padding: "12px 20px",
  borderRadius: 20,
  border: "none",
  background: "#222",
  color: "white"
}
