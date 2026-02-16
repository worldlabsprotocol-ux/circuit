export default function SaveIndicator({ saved }) {
  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      padding: "6px 12px",
      borderRadius: 20,
      background: saved ? "#00F0FF" : "#444",
      color: saved ? "#000" : "#fff",
      fontSize: 12,
      boxShadow: saved ? "0 0 10px #00F0FF" : "none"
    }}>
      {saved ? "Saved" : "Unsaved"}
    </div>
  )
}
