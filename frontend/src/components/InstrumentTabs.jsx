export default function InstrumentTabs({ instruments, active, setActive }) {
  return (
    <div style={{
      display: "flex",
      gap: 10,
      marginBottom: 20
    }}>
      {instruments.map(inst => (
        <button
          key={inst}
          onClick={() => setActive(inst)}
          style={{
            padding: "8px 18px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background: active === inst ? "#00F0FF" : "#11172B",
            color: active === inst ? "#000" : "#fff"
          }}
        >
          {inst}
        </button>
      ))}
    </div>
  )
}
