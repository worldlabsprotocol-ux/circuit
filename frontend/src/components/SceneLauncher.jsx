export default function SceneLauncher({ scenes, activeScene, setActiveScene }) {
  return (
    <div style={wrap}>
      <h3>Scene Launch</h3>
      {scenes.map((scene, i) => (
        <button
          key={i}
          onClick={() => setActiveScene(scene)}
          style={{
            ...sceneBtn,
            background: activeScene === scene ? "#00F0FF" : "#222"
          }}
        >
          {scene}
        </button>
      ))}
    </div>
  )
}

const wrap = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  margin: "20px 0"
}

const sceneBtn = {
  padding: "12px 20px",
  borderRadius: 8,
  border: "none",
  color: "white",
  fontWeight: 700,
  cursor: "pointer"
}
