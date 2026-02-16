export default function PerformancePads() {
  const sounds = [
    "kick",
    "snare",
    "hat"
  ]

  function play(type) {
    const audio = new Audio(`https://cdn.jsdelivr.net/gh/joshwcomeau/beat-sounds/${type}.wav`)
    audio.play()
  }

  return (
    <div style={wrap}>
      {sounds.map((s, i) => (
        <div
          key={i}
          onClick={() => play(s)}
          style={pad}
        >
          {s.toUpperCase()}
        </div>
      ))}
    </div>
  )
}

const wrap = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 20,
  marginTop: 30
}

const pad = {
  height: 100,
  background: "#8A2BE2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
  color: "white",
  fontWeight: 700,
  cursor: "pointer"
}
