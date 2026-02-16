import { useState } from "react"

export default function TimelineEditor({ chain, setChain }) {
  const [dragIndex, setDragIndex] = useState(null)

  function handleDragStart(index) {
    setDragIndex(index)
  }

  function handleDrop(index) {
    if (dragIndex === null) return

    const updated = [...chain]
    const moved = updated.splice(dragIndex, 1)[0]
    updated.splice(index, 0, moved)

    setChain(updated)
    setDragIndex(null)
  }

  return (
    <div style={wrap}>
      {chain.map((pattern, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(i)}
          style={block}
        >
          {pattern}
        </div>
      ))}
    </div>
  )
}

const wrap = {
  display: "flex",
  gap: 10,
  margin: "20px 0"
}

const block = {
  minWidth: 80,
  height: 40,
  background: "#00F0FF",
  color: "black",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  fontWeight: 700,
  cursor: "grab"
}
