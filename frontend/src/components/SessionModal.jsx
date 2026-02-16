export default function SessionModal({ onClose }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Session Saved</h3>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

const modal = {
  background: "#111",
  padding: 40,
  borderRadius: 10,
  color: "white"
}
