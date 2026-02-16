export default function WorkflowBar({ mode, setMode }) {
  const steps = ["Create", "Arrange", "Export"]

  return (
    <div style={wrap}>
      {steps.map(step => (
        <button
          key={step}
          onClick={() => setMode(step)}
          style={{
            ...btn,
            background: mode === step ? "#00F0FF" : "#11172B"
          }}
        >
          {step}
        </button>
      ))}
    </div>
  )
}

const wrap = {
  display: "flex",
  gap: 20,
  marginBottom: 20
}

const btn = {
  padding: "8px 20px",
  borderRadius: 20,
  border: "none",
  color: "white",
  cursor: "pointer"
}
