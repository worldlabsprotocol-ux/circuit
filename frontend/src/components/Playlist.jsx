export default function Playlist() {
  return (
    <div style={wrap}>
      <h3>Playlist</h3>
      <div style={timeline}></div>
    </div>
  )
}

const wrap = {
  height: 200,
  background: "#0A0F1E",
  borderTop: "1px solid #222",
  padding: 10
}

const timeline = {
  height: 100,
  background: "#11172B",
  borderRadius: 6
}
