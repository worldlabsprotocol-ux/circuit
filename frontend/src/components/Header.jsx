import { useNavigate } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()

  return (
    <div style={wrap}>
      <div style={logo}>CIRCUIT</div>

      <div style={nav}>
        <NavButton label="Home" onClick={() => navigate("/")} />
        <NavButton label="Studio" onClick={() => navigate("/studio")} />
        <NavButton label="Royalties" onClick={() => navigate("/royalties")} />
      </div>
    </div>
  )
}

function NavButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={btn}>
      {label}
    </button>
  )
}

const wrap = {
  position: "relative",
  zIndex: 2,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 40px",
  borderBottom: "1px solid rgba(255,255,255,0.1)"
}

const logo = {
  fontWeight: 700,
  fontSize: 20,
  letterSpacing: 2
}

const nav = {
  display: "flex",
  gap: 15
}

const btn = {
  padding: "10px 18px",
  background: "white",
  color: "black",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600
}
