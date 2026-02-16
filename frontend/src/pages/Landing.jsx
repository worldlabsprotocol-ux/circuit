import Starfield from "../components/Starfield"
import CircuitTrack from "../components/CircuitTrack"
import TopWallet from "../components/TopWallet"
import { useNavigate } from "react-router-dom"

export default function Landing(){
  const navigate = useNavigate()

  return(
    <>
      <Starfield/>
      <TopWallet/>

      <div style={wrap}>

        <div onClick={()=>navigate("/")} style={{cursor:"pointer"}}>
          <CircuitTrack/>
          <h1 style={title}>CIRCUIT</h1>
        </div>

        <p style={motto}>
          Create music. Own everything. Scale globally.
        </p>

        <button
          style={enterBtn}
          onClick={()=>navigate("/create")}
        >
          Enter Studio
        </button>

      </div>
    </>
  )
}

const wrap={
  position:"relative",
  zIndex:2,
  height:"100vh",
  display:"flex",
  flexDirection:"column",
  justifyContent:"center",
  alignItems:"center",
  color:"white",
  textAlign:"center",
  padding:40
}

const title={
  fontSize:54,
  color:"#00F0FF"
}

const motto={
  marginTop:30,
  fontSize:22,
  maxWidth:700,
  opacity:0.9
}

const enterBtn={
  marginTop:40,
  padding:"14px 40px",
  borderRadius:40,
  background:"#00F0FF",
  border:"none",
  color:"#000",
  fontWeight:700,
  boxShadow:"0 0 20px #00F0FF"
}
