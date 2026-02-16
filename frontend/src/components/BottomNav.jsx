import { useNavigate, useLocation } from "react-router-dom"

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={wrap}>
      <NavButton active={location.pathname === "/"} label="CIRCUIT" onClick={() => navigate("/")} />
      <NavButton active={location.pathname === "/royalties"} label="ROYALTIES" onClick={() => navigate("/royalties")} />
    </div>
  )
}

function NavButton({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...btn,
        background: active ? "#00F0FF" : "white",
        color: active ? "black" : "black"
      }}
    >
      {label}
    </button>
  )
}

const wrap = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "space-around",
  padding: "15px 0",
  background: "rgba(0,0,0,0.8)",
  backdropFilter: "blur(8px)",
  zIndex: 3
}

const btn = {
  padding: "12px 24px",
  borderRadius: 30,
  border: "none",
  fontWeight: 700
}
