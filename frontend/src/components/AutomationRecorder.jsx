import { useState } from "react"

export default function AutomationRecorder({ automation, setAutomation }) {

  function record(value) {
    setAutomation([...automation, value])
  }

  return (
    <div style={wrap}>
      <h3>Automation Recording</h3>
      <input
        type="range"
        min="0"
        max="100"
        onChange={(e) => record(parseInt(e.target.value))}
      />
    </div>
  )
}

const wrap = {
  margin: "20px 0"
}
