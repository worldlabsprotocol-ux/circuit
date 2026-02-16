export default function AudioGraph() {
  return (
    <div style={{ marginTop: 40 }}>
      <h3>Audio Graph</h3>
      <div style={{ display: "flex", gap: 40 }}>
        <div>Kick → Gain → Master</div>
        <div>Snare → Gain → Master</div>
        <div>Hat → Gain → Master</div>
      </div>
    </div>
  )
}
