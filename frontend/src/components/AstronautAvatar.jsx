export default function AstronautAvatar() {
  return (
    <div
      style={{
        position: "fixed",
        left: "24px",
        top: "120px",
        width: "48px",
        zIndex: 10000,
        pointerEvents: "none"
      }}
    >
      <img
        src="/atlas-astronaut.png"
        alt="Astronaut"
        style={{
          width: "100%",
          height: "auto",
          opacity: 0.95
        }}
        draggable="false"
      />
    </div>
  )
}
