import { useState } from "react"

export default function LaunchGrid({ scenes, setActiveScene }) {
  const [triggered, setTriggered] = useState(null)

  function trigger(scene) {
    setTriggered(scene)
    setActiveScene(scene)

    setTimeout(() => {
      setTriggered(null)
    }, 300)
  }

  return (
    <div style={wrap}>
      {scenes.map((scene, i) => (
        <div
          key={i}
          onClick={() => trigger(scene)}
          style={{
            ...pad,
            background:
              triggered === scene
                ? "#ffffff"
                : "#8A2BE2"
          }}
        >
          {scene}
        </div>
      ))}
    </div>
  )
}

const wrap = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20,
  margin: "20px 0"
}

const pad = {
  height: 80,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  cursor: "pointer",
  color: "white",
  transition: "0.2s"
}
