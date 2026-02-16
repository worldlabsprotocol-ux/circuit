export default function Aster() {
  return (
    <div style={wrap}>
      <h1>ASTER RANK</h1>

      <div style={planetGrid}>
        <Planet name="Mercury" rank="Bronze" />
        <Planet name="Venus" rank="Silver" />
        <Planet name="Earth" rank="Gold" />
        <Planet name="Mars" rank="Platinum" />
      </div>
    </div>
  )
}

function Planet({ name, rank }) {
  return (
    <div style={planet}>
      <div style={circle}></div>
      <h3>{name}</h3>
      <p>{rank}</p>
    </div>
  )
}

const wrap = {
  textAlign: "center"
}

const planetGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 40,
  marginTop: 40
}

const planet = {
  background: "rgba(255,255,255,0.05)",
  padding: 20,
  borderRadius: 20
}

const circle = {
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: "white",
  margin: "0 auto 15px auto"
}
