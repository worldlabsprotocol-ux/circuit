import { useState } from "react"

export default function PublishFlow() {
  const [stage, setStage] = useState("create")

  return (
    <div>
      <h3>Publish Pipeline</h3>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setStage("create")}>Create</button>
        <button onClick={() => setStage("review")}>Review</button>
        <button onClick={() => setStage("distribute")}>Distribute</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {stage === "create" && <p>Finalize track details</p>}
        {stage === "review" && <p>Confirm splits & ownership</p>}
        {stage === "distribute" && <p>Send to platforms</p>}
      </div>
    </div>
  )
}
