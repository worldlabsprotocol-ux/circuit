import { useState } from "react"

export default function Arrangement({ sections, setSections }) {
  const [newSection, setNewSection] = useState("")

  function addSection() {
    if (!newSection) return
    setSections([...sections, newSection])
    setNewSection("")
  }

  function duplicate(index) {
    const copy = [...sections]
    copy.splice(index + 1, 0, sections[index] + " Copy")
    setSections(copy)
  }

  return (
    <div style={wrap}>
      <h3>Arrangement</h3>

      <div style={timeline}>
        {sections.map((s, i) => (
          <div key={i} style={block}>
            <span>{s}</span>
            <button onClick={() => duplicate(i)}>Duplicate</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          placeholder="Add Section"
          style={{ padding: 6 }}
        />
        <button onClick={addSection}>Add</button>
      </div>
    </div>
  )
}

const wrap = {
  margin: "30px 0"
}

const timeline = {
  display: "flex",
  gap: 10,
  overflowX: "auto"
}

const block = {
  minWidth: 120,
  background: "#00F0FF",
  padding: 10,
  borderRadius: 8,
  color: "black",
  fontWeight: 700
}
