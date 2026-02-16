import React, { useState } from "react"
import VelocityEditor from "./VelocityEditor"

export default function PianoRollComponent({ clip, onChange }) {
  const [notes, setNotes] = useState(clip.notes)

  const addNote = () => {
    const newNote = {
      id: crypto.randomUUID(),
      pitch: 60,
      start: 0,
      duration: 1,
      velocity: 0.8
    }

    const updated = [...notes, newNote]
    setNotes(updated)
    onChange({ ...clip, notes: updated })
  }

  return (
    <div>
      <button onClick={addNote}>Add Note</button>

      <VelocityEditor
        notes={notes}
        onChange={updated => {
          setNotes(updated)
          onChange({ ...clip, notes: updated })
        }}
      />
    </div>
  )
}
