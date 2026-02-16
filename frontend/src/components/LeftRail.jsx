import Astronaut from "./Astronaut"

export default function LeftRail({ children, astronautThought }) {
  return (
    <div
      style={{
        position: "fixed",
        left: "16px",
        top: "96px",
        width: "220px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 20
      }}
    >
      <Astronaut thought={astronautThought} />
      {children}
    </div>
  )
}
