import React, { useState } from "react"
import { loadSample } from "../audio/SimpleSampler"

const samples = {
  Drums: [
    { name: "Kick 808", file: "/samples/kick.wav" },
    { name: "Snare Tight", file: "/samples/snare.wav" },
    { name: "HiHat Trap", file: "/samples/hihat.wav" }
  ],
  Bass: [
    { name: "Sub Bass", file: "/samples/bass.wav" }
  ],
  Melodies: [
    { name: "Pluck Melody", file: "/samples/melody.wav" }
  ],
  Vocals: [],
  FX: []
}

export default function LoopBrowser({ onAssign }) {

  const [selected, setSelected] = useState(null)

  function handleSelect(sample) {
    setSelected(sample.name)
    loadSample(sample.file)
    if (onAssign) onAssign(sample)
  }

  const categoryStyle = {
    marginBottom: 18
  }

  const buttonStyle = (active) => ({
    width: "100%",
    padding: "8px 10px",
    marginTop: 6,
    borderRadius: 10,
    border: "1px solid rgba(0,255,255,0.35)",
    background: active
      ? "rgba(0,255,255,0.25)"
      : "rgba(0,255,255,0.08)",
    color: "#00ffff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "all 0.15s ease"
  })

  return (
    <div style={{ padding: 18 }}>

      <h3 style={{ color: "#00ffff", marginBottom: 14 }}>
        Samples
      </h3>

      {Object.keys(samples).map(category => (
        <div key={category} style={categoryStyle}>

          <div style={{
            color: "#00ffff",
            fontSize: 13,
            fontWeight: 800,
            marginBottom: 6
          }}>
            {category}
          </div>

          {samples[category].map(sample => (
            <button
              key={sample.name}
              style={buttonStyle(selected === sample.name)}
              onClick={() => handleSelect(sample)}
            >
              {sample.name}
            </button>
          ))}

        </div>
      ))}

    </div>
  )
}