export default function Piano() {
  const notes = [261, 293, 329, 349, 392, 440, 493]

  function play(freq) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    osc.frequency.value = freq
    osc.connect(ctx.destination)
    osc.start()
    setTimeout(() => osc.stop(), 200)
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
      {notes.map((n, i) => (
        <div
          key={i}
          onClick={() => play(n)}
          style={{
            width: 40,
            height: 150,
            background: "white",
            cursor: "pointer"
          }}
        />
      ))}
    </div>
  )
}
