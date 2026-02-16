export default function TransportBar({
  tempo,
  setTempo,
  playing,
  setPlaying
}) {
  return (
    <div style={wrap}>
      <button onClick={() => setPlaying(!playing)}>
        {playing ? "Stop" : "Play"}
      </button>

      <input
        type="number"
        value={tempo}
        onChange={(e) => setTempo(parseInt(e.target.value))}
        style={{ width: 80 }}
      />

      <span>BPM</span>
    </div>
  )
}

const wrap = {
  height: 60,
  display: "flex",
  alignItems: "center",
  gap: 15,
  padding: "0 20px",
  background: "#11172B",
  borderBottom: "1px solid #222"
}
