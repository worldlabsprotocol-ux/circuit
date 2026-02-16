import { useState } from "react"

export default function AutomationLane() {
  const [points, setPoints] = useState([30, 60, 40, 80, 50])

  function adjust(index, value) {
    const copy = [...points]
    copy[index] = value
    setPoints(copy)
  }

  return (
    <div style={wrap}>
      <h3>Automation</h3>
      <div style={graph}>
        {points.map((p, i) => (
          <input
            key={i}
            type="range"
            min="0"
            max="100"
            value={p}
            onChange={(e) => adjust(i, parseInt(e.target.value))}
            style={{ transform: "rotate(-90deg)" }}
          />
        ))}
      </div>
    </div>
  )
}

const wrap = {
  margin: "30px 0"
}

const graph = {
  display: "flex",
  justifyContent: "space-between",
  height: 150
}
