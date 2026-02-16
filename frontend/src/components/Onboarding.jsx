import { useState } from "react"

export default function Onboarding() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 20
    }}>
      <div style={{ textAlign: "center" }}>
        <h2>Welcome to CIRCUIT</h2>
        <p>1. Click notes to create a pattern</p>
        <p>2. Press Play</p>
        <p>3. Export when ready</p>
        <button
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#00F0FF",
            border: "none",
            color: "#000",
            borderRadius: 20
          }}
          onClick={() => setVisible(false)}
        >
          Start Creating
        </button>
      </div>
    </div>
  )
}
