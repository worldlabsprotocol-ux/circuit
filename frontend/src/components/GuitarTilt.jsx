import { useEffect } from "react"

export default function GuitarTilt() {
  const frets = Array(6).fill(0)

  function play(freq) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    osc.type = "sawtooth"
    osc.frequency.value = freq
    osc.connect(ctx.destination)
    osc.start()
    setTimeout(() => osc.stop(), 200)
  }

  return (
    <div style={wrap}>
      <h3>Guitar Mode</h3>
      <div style={fretboard}>
        {frets.map((_, i) => (
          <div
            key={i}
            onClick={() => play(110 + i * 40)}
            style={string}
          />
        ))}
      </div>
    </div>
  )
}

const wrap = {
  marginTop: 40,
  textAlign: "center"
}

const fretboard = {
  display: "flex",
  justifyContent: "center",
  gap: 15
}

const string = {
  width: 6,
  height: 200,
  background: "#00F0FF",
  borderRadius: 4,
  cursor: "pointer",
  boxShadow: "0 0 10px #00F0FF"
}
