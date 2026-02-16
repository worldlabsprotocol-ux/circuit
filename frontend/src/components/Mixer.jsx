export default function Mixer() {
  const channels = ["Kick", "Snare", "Hat", "Master"]

  return (
    <div style={wrap}>
      {channels.map((ch, i) => (
        <div key={i} style={channel}>
          <span>{ch}</span>
          <div style={fader}></div>
        </div>
      ))}
    </div>
  )
}

const wrap = {
  width: 200,
  background: "#11172B",
  borderLeft: "1px solid #222",
  padding: 10
}

const channel = {
  marginBottom: 20
}

const fader = {
  height: 80,
  background: "#222",
  borderRadius: 4
}
