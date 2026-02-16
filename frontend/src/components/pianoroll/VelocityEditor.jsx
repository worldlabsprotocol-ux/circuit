import React from "react"

export default function VelocityEditor({ notes, onChange }) {
  const updateVelocity = (id, velocity) => {
    const updated = notes.map(n =>
      n.id === id ? { ...n, velocity } : n
    )
    onChange(updated)
  }

  return (
    <div style={{ height: 80 }}>
      {notes.map(note => (
        <input
          key={note.id}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={note.velocity}
          onChange={e =>
            updateVelocity(
              note.id,
              parseFloat(e.target.value)
            )
          }
        />
      ))}
    </div>
  )
}
