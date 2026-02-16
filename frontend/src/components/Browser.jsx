export default function Browser() {
  const categories = [
    "Drum Kits",
    "Synths",
    "Bass",
    "Guitar",
    "Pads",
    "FX",
    "Vocals"
  ]

  return (
    <div style={wrap}>
      {categories.map((cat, i) => (
        <div key={i} style={item}>
          {cat}
        </div>
      ))}
    </div>
  )
}

const wrap = {
  width: 200,
  background: "#11172B",
  padding: 10,
  borderRight: "1px solid #222"
}

const item = {
  padding: 10,
  cursor: "pointer"
}
