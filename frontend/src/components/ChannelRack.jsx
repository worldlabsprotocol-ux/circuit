import { useState, useEffect } from "react"

const sounds = ["Kick", "Snare", "Hat", "Clap"]

export default function ChannelRack({ tempo, playing }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!playing) return

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 16)
    }, (60000 / tempo) / 4)

    return () => clearInterval(interval)
  }, [playing, tempo])

  return (
    <div style={wrap}>
      {sounds.map((sound, i) => (
        <div key={i} style={row}>
          <span style={{ width: 60 }}>{sound}</span>
          <div style={grid}>
            {Array.from({ length: 16 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  ...cell,
                  background: step === idx ? "#00F0FF" : "#222"
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const wrap = {
  flex: 1,
  padding: 20,
  background: "#0F1629"
}

const row = {
  display: "flex",
  alignItems: "center",
  marginBottom: 10
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(16, 1fr)",
  gap: 4,
  flex: 1
}

const cell = {
  height: 25,
  borderRadius: 4
}
